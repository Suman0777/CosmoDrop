"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Copy, Check, FolderOpen, FileUp, Info, AlertTriangle, Hash, Wifi, WifiOff } from "lucide-react";
import { useSocket } from "@/lib/use-socket";

const steps = [
  { n: "1", text: 'Click "Create Room" to generate your 5-digit room code.' },
  { n: "2", text: "Share the code with your recipient so they can join." },
  { n: "3", text: "Upload a file — transfer starts once they connect." },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export default function SendPage() {
  const { socket, connected } = useSocket();
  const [roomCode, setRoomCode] = useState<string[]>(["—", "—", "—", "—", "—"]);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [receiverJoined, setReceiverJoined] = useState(false);
  const [copied, setCopied] = useState(false);
  const [transferStatus, setTransferStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!socket) return;
    const onUserJoined = () => setReceiverJoined(true);
    const onUserLeft = () => setReceiverJoined(false);
    socket.on("user-joined", onUserJoined);
    socket.on("user-left", onUserLeft);
    return () => {
      socket.off("user-joined", onUserJoined);
      socket.off("user-left", onUserLeft);
    };
  }, [socket]);

  const handleCreateRoom = async () => {
    if (!socket) return;
    try {
      const res = await fetch("/api", { method: "POST" });
      if (!res.ok) throw new Error("Failed to create room");
      const data = await res.json();
      const code: string = data.code;
      setRoomCode(code.split(""));
      setCurrentRoom(code);
      setReceiverJoined(false);
      setTransferStatus(null);
      socket.emit("join-room", code);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopy = () => {
    if (!currentRoom) return;
    navigator.clipboard.writeText(currentRoom);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFile = (file: File) => {
    if (!currentRoom || !socket) return;

    const CHUNK = 64 * 1024; // 64 KB
    socket.emit("file-meta", { roomId: currentRoom, name: file.name, size: file.size, type: file.type });


    const reader = new FileReader();
    let offset = 0;

    setTransferStatus("Sending…");

    const readChunk = () => {
      const slice = file.slice(offset, offset + CHUNK);
      reader.readAsArrayBuffer(slice);
    };

    reader.onload = (e) => {
      if (!e.target?.result) return;
      socket.emit("file-chunk", { roomId: currentRoom, chunk: e.target.result });
      offset += CHUNK;
      if (offset < file.size) {
        setTimeout(readChunk, 0); // yield to event loop between chunks
      } else {
        socket.emit("transfer-complete", currentRoom);
        setTransferStatus("✓ Transfer complete!");
      }
    };

    readChunk();
  };

  const codeReady = !roomCode.includes("—");

  return (
    <div className="relative flex flex-col flex-1 items-center px-4 sm:px-6 pt-24 pb-16">
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[min(700px,100vw)] h-[400px] rounded-full bg-[radial-gradient(ellipse_at_top,rgba(59,130,100,0.15)_0%,transparent_70%)] blur-3xl" />

      <div className="relative w-full max-w-xl flex flex-col gap-4 sm:gap-5">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="text-center space-y-2"
        >
          <span className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-semibold tracking-widest uppercase text-[#6ee7b7] border border-[rgba(59,130,100,0.35)] rounded-full px-3 py-1.5 bg-[rgba(59,130,100,0.08)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6ee7b7] animate-pulse" />
            File Transfer
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Send <span className="text-[#6ee7b7]">Files</span>
          </h1>
          <p className="text-xs sm:text-sm text-white/40 max-w-sm mx-auto leading-relaxed">
            Create a room and share the 5-digit code with your recipient to
            start transferring files securely between devices.
          </p>
        </motion.div>

        {/* Connection status */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium ${
            connected
              ? "border-[rgba(59,130,100,0.3)] bg-[rgba(59,130,100,0.07)] text-[#6ee7b7]"
              : "border-white/10 bg-white/[0.03] text-white/30"
          }`}
        >
          {connected ? <Wifi size={13} /> : <WifiOff size={13} />}
          {connected ? (
            receiverJoined ? "Receiver connected — ready to transfer" : "Connected · Waiting for receiver…"
          ) : "Connecting to socket server…"}
        </motion.div>

        {/* Room ID card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.5, ease: EASE }}
          className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5 flex flex-col gap-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white/40 text-xs font-semibold tracking-widest uppercase">
              <Hash size={12} className="text-[#6ee7b7]" />
              Room ID
            </div>
            {codeReady && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                className="text-[10px] text-[#6ee7b7] font-medium tracking-wide"
              >
                {receiverJoined ? "🟢 Receiver in room" : "Share this code"}
              </motion.span>
            )}
          </div>

          {/* digit display boxes */}
          <div className="flex gap-1.5 sm:gap-2">
            {roomCode.map((ch, i) => (
              <div
                key={i}
                className={`flex-1 h-10 sm:h-12 flex items-center justify-center rounded-xl border text-base sm:text-lg font-bold transition-all duration-300 ${
                  ch !== "—"
                    ? "border-[rgba(59,130,100,0.5)] bg-[rgba(59,130,100,0.08)] text-[#6ee7b7] shadow-[0_0_10px_rgba(59,130,100,0.15)]"
                    : "border-white/10 bg-white/[0.04] text-white/20"
                }`}
              >
                {ch}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              disabled={!codeReady}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-medium transition-all active:scale-95 ${
                codeReady
                  ? "border-[rgba(59,130,100,0.4)] bg-[rgba(59,130,100,0.08)] text-white hover:bg-[rgba(59,130,100,0.15)]"
                  : "border-white/10 bg-white/[0.04] text-white/20 cursor-not-allowed"
              }`}
            >
              {copied ? <Check size={13} className="text-[#6ee7b7]" /> : <Copy size={13} />}
              {copied ? "Copied!" : "Copy"}
            </button>

            <button
              onClick={handleCreateRoom}
              className="flex-1 py-2.5 rounded-xl bg-[rgba(59,130,100,0.8)] hover:bg-[rgba(59,130,100,1)] border border-[rgba(59,130,100,0.5)] text-white font-semibold text-sm transition-colors shadow-lg shadow-[rgba(59,130,100,0.2)] active:scale-[0.98]"
            >
              {currentRoom ? "New Room" : "Create Room"}
            </button>
          </div>
        </motion.div>

        {/* File upload dropzone */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.5, ease: EASE }}
          className="rounded-2xl border-2 border-dashed border-white/10 bg-white/[0.02] hover:border-[rgba(59,130,100,0.4)] hover:bg-[rgba(59,130,100,0.03)] transition-all duration-300 group p-6 sm:p-8 flex flex-col items-center gap-4 text-center"
        >
          <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border flex items-center justify-center transition-all duration-300 ${
            currentRoom
              ? "border-[rgba(59,130,100,0.4)] bg-[rgba(59,130,100,0.08)] group-hover:border-[rgba(59,130,100,0.6)]"
              : "border-white/10 bg-white/[0.04]"
          }`}>
            <FileUp size={20} className={`transition-colors duration-300 ${currentRoom ? "text-[#6ee7b7]" : "text-white/20"}`} />
          </div>

          <div className="space-y-1">
            <p className={`font-semibold text-sm ${currentRoom ? "text-white/70" : "text-white/25"}`}>
              {transferStatus ?? (currentRoom ? "Upload File" : "Create a room first")}
            </p>
            <p className="text-white/25 text-xs">Drag & drop or tap to browse</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <label className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border text-xs font-semibold transition-colors active:scale-95 ${
              currentRoom
                ? "bg-[rgba(59,130,100,0.7)] hover:bg-[rgba(59,130,100,1)] border-[rgba(59,130,100,0.4)] text-white cursor-pointer"
                : "bg-white/[0.04] border-white/10 text-white/20 cursor-not-allowed"
            }`}>
              <FileUp size={13} />
              Select Files
              <input
                type="file"
                className="hidden"
                disabled={!currentRoom}
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
              />
            </label>

            <label className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border text-xs font-semibold transition-colors active:scale-95 ${
              currentRoom
                ? "bg-white/[0.05] hover:bg-white/[0.1] border-white/10 text-white/60 hover:text-white cursor-pointer"
                : "bg-white/[0.04] border-white/10 text-white/20 cursor-not-allowed"
            }`}>
              <FolderOpen size={13} />
              Select Folder
              <input
                type="file"
                className="hidden"
                disabled={!currentRoom}
                // @ts-ignore
                webkitdirectory=""
                multiple
                onChange={(e) => {
                  const files = e.target.files;
                  if (files?.[0]) handleFile(files[0]);
                }}
              />
            </label>
          </div>
        </motion.div>

        {/* How to use */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.5, ease: EASE }}
          className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5 flex flex-col gap-3"
        >
          <div className="flex items-center gap-2 text-white/40 text-xs font-semibold tracking-widest uppercase">
            <Info size={12} className="text-[#6ee7b7]" />
            How to Use
          </div>
          <div className="flex flex-col gap-2.5">
            {steps.map(({ n, text }, i) => (
              <motion.div
                key={n}
                initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.38 + i * 0.08, duration: 0.4, ease: EASE }}
                className="flex items-start gap-3"
              >
                <span className="shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[rgba(59,130,100,0.15)] border border-[rgba(59,130,100,0.3)] flex items-center justify-center text-[9px] sm:text-[10px] font-bold text-[#6ee7b7]">
                  {n}
                </span>
                <p className="text-xs sm:text-sm text-white/45 leading-relaxed pt-0.5">{text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Warning */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42, duration: 0.5, ease: EASE }}
          className="rounded-2xl border border-amber-500/15 bg-amber-500/[0.04] p-4 flex items-start gap-3"
        >
          <div className="shrink-0 w-7 h-7 rounded-xl border border-amber-500/20 bg-amber-500/[0.08] flex items-center justify-center mt-0.5">
            <AlertTriangle size={13} className="text-amber-400" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-amber-400/70">Important Note</p>
            <p className="text-xs text-white/35 leading-relaxed">
              CosmoDrop does not store data. Do not close or switch this tab
              until the file transfer is fully complete.
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
