"use client";

import { useRef, useState, KeyboardEvent, ClipboardEvent } from "react";

interface OtpInputProps {
  value: string[];
  onChange: (val: string[]) => void;
}

export function OtpInput({ value, onChange }: OtpInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const focus = (i: number) => refs.current[i]?.focus();

  const handleChange = (i: number, raw: string) => {
    const char = raw.replace(/\D/g, "").slice(-1); // digits only, last char
    const next = [...value];
    next[i] = char;
    onChange(next);
    if (char && i < 4) focus(i + 1);
  };

  const handleKey = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (value[i]) {
        const next = [...value];
        next[i] = "";
        onChange(next);
      } else if (i > 0) {
        focus(i - 1);
      }
    } else if (e.key === "ArrowLeft" && i > 0) {
      focus(i - 1);
    } else if (e.key === "ArrowRight" && i < 4) {
      focus(i + 1);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 5).split("");
    const next = Array(5).fill("").map((_, i) => digits[i] ?? value[i] ?? "");
    onChange(next);
    focus(Math.min(digits.length, 4));
  };

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 flex-1">
      {value.map((digit, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKey(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          className={[
            "flex-1 min-w-0 w-0 h-10 sm:h-12 rounded-xl border text-center text-base sm:text-lg font-bold",
            "bg-white/[0.05] text-white caret-transparent outline-none",
            "transition-all duration-200",
            digit
              ? "border-[rgba(59,130,100,0.6)] text-[#6ee7b7] shadow-[0_0_12px_rgba(59,130,100,0.2)]"
              : "border-white/10 text-white/25",
            "focus:border-[rgba(59,130,100,0.5)] focus:bg-[rgba(59,130,100,0.06)] focus:shadow-[0_0_0_3px_rgba(59,130,100,0.12)]",
          ].join(" ")}
        />
      ))}
    </div>
  );
}
