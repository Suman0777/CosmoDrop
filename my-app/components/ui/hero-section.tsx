"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { SendHorizonal, Download, ShieldCheck, Zap, ServerOff, UserX } from "lucide-react";
import { DiaTextReveal } from "@/components/ui/dia-text-reveal";
import { LineShadowText } from "@/components/ui/line-shadow-text";

const stats = [
  { icon: ShieldCheck, label: "End-to-End Secure" },
  { icon: Zap,         label: "Instant Transfer"  },
  { icon: ServerOff,   label: "Zero Storage"      },
  { icon: UserX,       label: "No Sign-up"        },
];

export function HeroSection() {
  const router = useRouter();

  return (
<section className="mt-9 mx-8 flex flex-col items-center justify-center min-h-screen text-center gap-5 md:mt-7">
        {/* badge */}
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 3 }}
          transition={{ duration: 0.5 }}
          className="text-xs font-semibold tracking-widest uppercase text-[#6ee7b7] border border-[rgba(59,130,100,0.4)] rounded-full px-4 py-1 bg-[rgba(59,130,100,0.08)]"
        >
          Secure File Sharing
        </motion.span>

        {/* main title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-6xl md:text-8xl font-bold tracking-tight text-[#6ee7b7]/70 leading-none font-serif"
        >
          Cosmo
          <LineShadowText
            shadowColor="#6ee7b7"
            className="text-white font-serif"
          >
            Drop
          </LineShadowText>
        </motion.h1>

        {/* sub-badge */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-white/40 text-sm tracking-wide"
        >
          No limit · No signup · No storage
        </motion.p>

        {/* animated reveal text */}
        <p className="text-base md:text-[17px] text-white/60 font-mono">
          <DiaTextReveal
            text="Share files instantly. No login. No storage. Just share."
            colors={["#3b8264", "#6ee7b7", "#34d399", "#a7f3d0", "#3b8264"]}
            textColor="rgba(255,255,255,0.6)"
            duration={2}
          />
        </p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-4 flex gap-9 md:mt-2 mb-7"
        >
          <button
            onClick={() => router.push("/Send")}
            className=" flex items-center gap-2 px-7 py-3 rounded-full bg-[rgba(59,130,100,0.75)] hover:bg-[rgba(59,130,100,1)] border border-[rgba(59,130,100,0.5)] text-white font-semibold text-sm transition-all hover:scale-105 active:scale-95 backdrop-blur-sm shadow-lg shadow-[rgba(59,130,100,0.2)]"
          >
            <SendHorizonal size={15} />
            Send
          </button>
          <button
            onClick={() => router.push("/Receive")}
            className="flex items-center gap-2 px-7 py-3 rounded-full bg-white/8 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm transition-all hover:scale-105 active:scale-95 backdrop-blur-sm"
          >
            <Download size={15} />
            Receive
          </button>
        </motion.div>

        {/* ── 4 icon stats row ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-8 w-full max-w-3xl"
        >
          {stats.map(({ icon: Icon, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + i * 0.1, duration: 0.4 }}
              className="flex flex-col items-center gap-2.5 px-7 py-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-[rgba(59,130,100,0.4)] hover:bg-white/10 transition-all cursor-default"
            >
              <Icon size={20} className="text-[#6ee7b7]" />
              <span className="text-[18px] text-white/50 font-medium ">
                {label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-5 flex flex-col items-center gap-1"
        >
          <span className="text-white/20 text-xs tracking-widest uppercase">
            scroll
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
            className="w-px h-5 bg-gradient-to-b from-white/30 to-transparent"
          />
        </motion.div>
      </section>
  );
}
