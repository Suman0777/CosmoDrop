"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Download, ShieldCheck, Hash, CheckCircle2 } from "lucide-react";
import { OtpInput } from "@/components/ui/otp-input";
import { useRouter } from "next/navigation";

const steps = [
  { n: "1", text: "Ask the sender for the 5-digit room code." },
  { n: "2", text: "Enter the code below to join the active transfer room." },
  { n: "3", text: "Accept and download the incoming files instantly." },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export default function ReceivePage() {
  const [digits, setDigits] = useState<string[]>(Array(5).fill(""));
  const isFull = digits.every((d) => d !== "");
  const router = useRouter();

  return (
    <div className="relative flex flex-1 flex-col items-center px-4 sm:px-6 pt-17 pb-16">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[min(680px,100vw)] h-[360px] rounded-full bg-[radial-gradient(ellipse_at_top,rgba(45,212,191,0.14)_0%,transparent_70%)] blur-3xl" />

      <div className="relative w-full max-w-xl flex flex-col gap-4 sm:gap-5">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="space-y-2 text-center"
        >
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 3 }}
            transition={{ duration: 0.5 }}
            className=" cursor-pointer text-xs font-semibold tracking-widest uppercase text-[#6ee7b7] border border-[rgba(59,130,100,0.4)] rounded-full px-4 py-1 bg-[rgba(59,130,100,0.08)]"
            onClick={(e) => {
              router.push("/");
            }}
          >
            Go to HomePage ←
          </motion.span>

          <h1 className=" mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Receive <span className="text-[#6ee7b7]">Files</span>
          </h1>

          <p className="text-xs sm:text-sm leading-relaxed text-white/40 max-w-lg mx-auto">
            Join the sender's room with a 5-digit code, then download files
            directly and securely — no storage, no signup.
          </p>
        </motion.div>

        {/* ── Code entry card ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12, ease: EASE }}
          className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5 flex flex-col gap-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white/40 text-xs font-semibold uppercase tracking-widest">
              <Hash size={12} className="text-[#6ee7b7]" />
              Enter Room Code
            </div>
            {isFull && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-[10px] text-[#6ee7b7] font-medium tracking-wide"
              >
                Ready to join
              </motion.span>
            )}
          </div>

          {/* OTP — constrained so it never overflows */}
          <div className="w-full overflow-hidden">
            <OtpInput value={digits} onChange={setDigits} />
          </div>

          <button
            disabled={!isFull}
            className={[
              "w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-[0.98]",
              isFull
                ? "w-full py-3 rounded-xl bg-[rgba(59,130,100,0.8)] hover:bg-[rgba(59,130,100,1)] border border-[rgba(59,130,100,0.5)] text-white font-semibold text-sm transition-colors shadow-lg shadow-[rgba(59,130,100,0.2)] active:scale-[0.98]"
                : "bg-white/[0.05] border border-white/10 text-white/25 cursor-not-allowed",
            ].join(" ")}
          >
            {isFull ? "Join Room →" : "Enter code to join"}
          </button>

          <div className="flex justify-between items-center">
            <button
              className="w-[200px] py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white/25 hover:bg-white/[0.1] transition-colors"
              onClick={() => {
                setDigits(Array(5).fill(""));
              }}
            >
              Clear Code
            </button>

            <button
              className="text-[#6ee7b7] hover:text-green-300/60 text-[12px] font-mono"
              onClick={(e) => {
                router.push("/Send");
              }}
            >
              Create New Room ?
            </button>
          </div>
        </motion.div>

        {/* ── How to receive ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.22, ease: EASE }}
          className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5 flex flex-col gap-3"
        >
          <div className="flex items-center gap-2 text-white/40 text-xs font-semibold uppercase tracking-widest">
            <CheckCircle2 size={12} className="text-green-700 " />
            How to Receive
          </div>

          <div className="flex flex-col gap-2.5">
            {steps.map(({ n, text }, i) => (
              <motion.div
                key={n}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.3 + i * 0.08,
                  duration: 0.4,
                  ease: EASE,
                }}
                className="flex items-start gap-3"
              >
                <span className="shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-green-400/30 bg-cyan-500/10 flex items-center justify-center text-[9px] sm:text-[10px] font-bold text-green-300">
                  {n}
                </span>
                <p className="text-xs sm:text-sm leading-relaxed text-white/45 pt-0.5">
                  {text}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Security note ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.34, ease: EASE }}
          className="flex items-start gap-3 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.04] p-4"
        >
          <div className="shrink-0 w-7 h-7 rounded-xl border border-emerald-400/25 bg-emerald-500/[0.08] flex items-center justify-center mt-0.5">
            <ShieldCheck size={13} className="text-emerald-400" />
          </div>
          <div className="space-y-1 min-w-0">
            <p className="text-xs font-semibold text-emerald-400/70">
              Stay Connected
            </p>
            <p className="text-xs leading-relaxed text-white/35">
              Keep this tab open during the transfer. Closing or switching tabs
              early can interrupt the incoming file stream.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
