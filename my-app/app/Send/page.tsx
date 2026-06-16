"use client";

import { motion } from "motion/react";

import {
  Copy,
  FolderOpen,
  FileUp,
  Info,
  AlertTriangle,
  Hash,
} from "lucide-react";
import { useState } from "react";

const steps = [
  { n: "1", text: 'Create a room by clicking "Create Room"' },
  { n: "2", text: "Share the 6-digit code with your recipient" },
  { n: "3", text: "Upload files or folders to the room" },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export default function SendPage() {
  const [roomCode, setRoomCode] = useState(["—", "—", "—", "—", "—"]);

  const handleCopy = async () => {
    const roomcodeNumber = roomCode.toString();
    navigator.clipboard.writeText(roomcodeNumber);
  };

  const handleCreateRoom = async () => {
    try {
      const res = await fetch("/api");
      const data = await res.json();

      setRoomCode(data.message.toString().split(""));
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="relative flex flex-col flex-1 items-center px-4 sm:px-6 pt-19 pb-16">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[min(700px,100vw)] h-[400px] rounded-full bg-[radial-gradient(ellipse_at_top,rgba(59,130,100,0.15)_0%,transparent_70%)] blur-3xl" />

      <div className="relative w-full max-w-2xl flex flex-col gap-4 sm:gap-5">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0, duration: 0.5, ease: EASE }}
          className="text-center space-y-2 px-2"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Send <span className="text-[#6ee7b7]">Files</span>
          </h1>
          <p className="text-xs sm:text-sm text-white/40 max-w-sm sm:max-w-xl mx-auto leading-relaxed">
            Create a room and share the 6-digit code with your recipient to
            start transferring files securely and directly between devices.
          </p>
        </motion.div>

        {/* ── Room ID card ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.5, ease: EASE }}
          className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5 flex flex-col gap-4"
        >
          <div className="flex items-center gap-2 text-white/50 text-xs font-semibold tracking-widest uppercase">
            <Hash size={13} className="text-[#6ee7b7]" />
            Room ID
          </div>

          {/* digit boxes + copy — stacks on very small screens */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex gap-1.5 sm:gap-2 flex-1">
              {roomCode.map((ch, i) => (
                <div
                  key={i}
                  className="flex-1 h-10 sm:h-12 flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-base sm:text-lg font-bold text-white/20"
                >
                  {ch}
                </div>
              ))}
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-xl border border-white/10 bg-white/[0.05] hover:border-[rgba(59,130,100,0.4)] hover:bg-[rgba(59,130,100,0.1)] text-white/50 hover:text-white text-xs font-medium transition-colors active:scale-95"
            >
              <Copy size={13} />
              Copy
            </button>
          </div>

          <button
            onClick={handleCreateRoom}
            className="w-full py-3 rounded-xl bg-[rgba(59,130,100,0.8)] hover:bg-[rgba(59,130,100,1)] border border-[rgba(59,130,100,0.5)] text-white font-semibold text-sm transition-colors shadow-lg shadow-[rgba(59,130,100,0.2)] active:scale-[0.98]"
          >
            Create Room
          </button>
        </motion.div>

        {/* ── File upload dropzone ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.5, ease: EASE }}
          className="rounded-2xl border border-dashed border-white/15 bg-white/[0.03] hover:border-[rgba(59,130,100,0.4)] hover:bg-[rgba(59,130,100,0.04)] transition-colors group cursor-pointer p-6 sm:p-10 flex flex-col items-center gap-4 text-center"
        >
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border border-white/10 bg-white/[0.05] flex items-center justify-center group-hover:border-[rgba(59,130,100,0.4)] transition-colors">
            <FileUp
              size={22}
              className="text-white/30 group-hover:text-[#6ee7b7] transition-colors"
            />
          </div>

          <div className="space-y-1">
            <p className="text-white/70 font-medium text-sm">
              Upload File or Folder
            </p>
            <p className="text-white/30 text-xs">
              Drag & drop or tap to select
            </p>
          </div>

          {/* buttons — full width on mobile, auto on larger */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <input
              type="file"
              id="fileUpload"
              accept=".png,.jpg,.jpeg,.pdf,.mp3,.mp4"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                console.log(file);
              }}
            />

            {/* Button */}
            <label
              htmlFor="fileUpload"
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[rgba(59,130,100,0.7)] hover:bg-[rgba(59,130,100,1)] border border-[rgba(59,130,100,0.4)] text-white text-xs font-semibold transition-colors active:scale-95 cursor-pointer"
            >
              <FileUp size={13} />
              Select PNG
            </label>

            <input
              type="file"
              id="folderUpload"
              multiple
              className="hidden"
              onChange={(e) => {
                const files = e.target.files;

                if (files) {
                  console.log(`Total files: ${files.length}`);

                  Array.from(files).forEach((file) => {
                    console.log(file.webkitRelativePath);
                  });
                }
              }}
            />

            <label
              htmlFor="folderUpload"
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/15 text-white/70 hover:text-white text-xs font-semibold transition-colors active:scale-95"
            >
              <FolderOpen size={13} />
              Select Folder
            </label>

          </div>
        </motion.div>

        {/* ── How to use ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.5, ease: EASE }}
          className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5 flex flex-col gap-4"
        >
          <div className="flex items-center gap-2 text-white/50 text-xs font-semibold tracking-widest uppercase">
            <Info size={13} className="text-[#6ee7b7]" />
            How to Use
          </div>

          <div className="flex flex-col gap-3">
            {steps.map(({ n, text }, i) => (
              <motion.div
                key={n}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }}
                className="flex items-start gap-3"
              >
                <span className="shrink-0 w-6 h-6 rounded-full bg-[rgba(59,130,100,0.2)] border border-[rgba(59,130,100,0.35)] flex items-center justify-center text-[10px] font-bold text-[#6ee7b7]">
                  {n}
                </span>
                <p className="text-xs sm:text-sm text-white/50 leading-relaxed pt-0.5">
                  {text}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Warning note ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42, duration: 0.5, ease: EASE }}
          className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.05] p-4 flex items-start gap-3"
        >
          <div className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-xl border border-amber-500/25 bg-amber-500/10 flex items-center justify-center mt-0.5">
            <AlertTriangle size={14} className="text-amber-400" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-amber-400/80">
              Important Note
            </p>
            <p className="text-xs text-white/40 leading-relaxed">
              CosmoDrop does not store data on a backend database. To prevent
              data loss or room disconnection, please do not close or switch
              this tab until the file transfer is fully complete.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
