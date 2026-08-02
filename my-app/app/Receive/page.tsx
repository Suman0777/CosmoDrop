"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Download, ShieldCheck, Hash, CheckCircle2, Wifi, WifiOff } from "lucide-react";
import { OtpInput } from "@/components/ui/otp-input";
import { useSocket } from "@/lib/use-socket";
import { useRouter } from "next/navigation";

const steps = [
  { n: "1", text: "Ask the sender for the 5-digit room code." },
  { n: "2", text: "Enter the code below and click Join Room." },
  { n: "3", text: "The file downloads automatically once sent." },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export default function ReceivePage() {
  const { socket, connected } = useSocket();
  const router = useRouter();

  const [digits, setDigits] = useState<string[]>(Array(5).fill(""));
  const [joined, setJoined] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const metaRef = useRef<{ name: string; size: number; type: string } | null>(null);
  const chunksRef = useRef<ArrayBuffer[]>([]);

  const isFull = digits.every((d) => d !== "");
  const roomCode = digits.join("");

  useEffect(() => {
    if (!socket) return;

    const onFileMeta = (data: { name: string; size: number; type: string }) => {
      metaRef.current = data;
      chunksRef.current = [];
      setStatus(`Receiving "${data.name}"…`);
    };
    const onFileChunk = (data: { chunk: ArrayBuffer }) => {
      chunksRef.current.push(data.chunk);
    };
    const onTransferComplete = () => {
      if (!metaRef.current) return;
      const blob = new Blob(chunksRef.current, { type: metaRef.current.type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = metaRef.current.name;
      a.click();
      URL.revokeObjectURL(url);
      setStatus(`✓ "${metaRef.current.name}" downloaded!`);
      chunksRef.current = [];
      metaRef.current = null;
    };

    socket.on("file-meta", onFileMeta);
    socket.on("file-chunk", onFileChunk);
    socket.on("transfer-complete", onTransferComplete);

    return () => {
      socket.off("file-meta", onFileMeta);
      socket.off("file-chunk", onFileChunk);
      socket.off("transfer-complete", onTransferComplete);
    };
  }, [socket]);

  const handleJoin = () => {
    if (!isFull || !socket) return;
    socket.emit("join-room", roomCode);
    setJoined(true);
    setStatus("Joined room · waiting for sender…");
  };

  return (
    <div className="relative flex flex-1 flex-col items-center px-4 sm:px-6 pt-24 pb-16">
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[min(680px,100vw)] h-[360px] rounded-full bg-[radial-gradient(ellipse_at_top,rgba(45,212,191,0.14)_0%,transparent_70%)] blur-3xl" />

      <div className="relative w-full max-w-xl flex flex-col gap-4 sm:gap-5">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="space-y-2 text-center"
        >
          <span className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-semibold tracking-widest uppercase text-[#6ee7b7] border border-[rgba(59,130,100,0.35)] rounded-full px-3 py-1.5 bg-[rgba(59,130,100,0.08)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6ee7b7] animate-pulse" />
            Receiver Mode
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Receive <span className="text-[#6ee7b7]">Files</span>
          </h1>
          <p className="text-xs sm:text-sm leading-relaxed text-white/40 max-w-sm mx-auto">
            Join the sender's room with a 5-digit code, then the file downloads
            directly — no storage, no signup.
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
          {status ?? (connected ? "Connected to server" : "Connecting…")}
        </motion.div>

        {/* Code entry card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12, ease: EASE }}
          className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5 flex flex-col gap-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white/40 text-xs font-semibold uppercase tracking-widest">
              <Hash size={12} className="text-[#6ee7b7]" />
              Enter Room Code
            </div>
            {isFull && !joined && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                className="text-[10px] text-[#6ee7b7] font-medium tracking-wide"
              >
                Ready to join
              </motion.span>
            )}
          </div>

          <div className="w-full overflow-hidden">
            <OtpInput value={digits} onChange={setDigits} />
          </div>

          <button
            onClick={handleJoin}
            disabled={!isFull || joined}
            className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${
              isFull && !joined
                ? "bg-[rgba(59,130,100,0.8)] hover:bg-[rgba(59,130,100,1)] border border-[rgba(59,130,100,0.5)] text-white shadow-lg shadow-[rgba(59,130,100,0.2)]"
                : "bg-white/[0.05] border border-white/10 text-white/25 cursor-not-allowed"
            }`}
          >
            {joined ? "Waiting for file…" : isFull ? "Join Room →" : "Enter code to join"}
          </button>

          <div className="flex items-center justify-between">
            <button
              onClick={() => { setDigits(Array(5).fill("")); setJoined(false); setStatus(null); }}
              className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white/30 hover:text-white hover:bg-white/[0.08] text-xs font-medium transition-colors"
            >
              Clear
            </button>
            <button
              onClick={() => router.push("/Send")}
              className="text-[#6ee7b7]/60 hover:text-[#6ee7b7] text-xs font-mono transition-colors"
            >
              Create a room instead →
            </button>
          </div>
        </motion.div>

        {/* How to receive */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.22, ease: EASE }}
          className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5 flex flex-col gap-3"
        >
          <div className="flex items-center gap-2 text-white/40 text-xs font-semibold uppercase tracking-widest">
            <CheckCircle2 size={12} className="text-[#6ee7b7]" />
            How to Receive
          </div>
          <div className="flex flex-col gap-2.5">
            {steps.map(({ n, text }, i) => (
              <motion.div
                key={n}
                initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.4, ease: EASE }}
                className="flex items-start gap-3"
              >
                <span className="shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-[rgba(59,130,100,0.3)] bg-[rgba(59,130,100,0.1)] flex items-center justify-center text-[9px] sm:text-[10px] font-bold text-[#6ee7b7]">
                  {n}
                </span>
                <p className="text-xs sm:text-sm leading-relaxed text-white/45 pt-0.5">{text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Security note */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.34, ease: EASE }}
          className="flex items-start gap-3 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.04] p-4"
        >
          <div className="shrink-0 w-7 h-7 rounded-xl border border-emerald-400/25 bg-emerald-500/[0.08] flex items-center justify-center mt-0.5">
            <ShieldCheck size={13} className="text-emerald-400" />
          </div>
          <div className="space-y-1 min-w-0">
            <p className="text-xs font-semibold text-emerald-400/70">Stay Connected</p>
            <p className="text-xs leading-relaxed text-white/35">
              Keep this tab open during the transfer. Closing early will
              interrupt the incoming file stream.
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
