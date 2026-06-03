import { HeroSection } from "@/components/ui/hero-section";

const features = [
  {
    title: "No Login",
    desc: "No hassle. Jump straight in — zero accounts, zero friction.",
  },
  {
    title: "Fast & Efficient",
    desc: "Lightning-fast way to transfer files directly between peers.",
  },
  {
    title: "No Storage",
    desc: "No DB, no cloud storage. Data never touches a server — totally secure.",
  },
  {
    title: "Privacy First",
    desc: "Your files are encrypted in transit and never stored. We respect your privacy.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col flex-1">

      {/* Client island — only animated parts */}
      <HeroSection />

      {/* ── CHUNK 2 · Feature cards — pure static HTML, zero JS ── */}
      <section className="flex flex-col items-center py-30 px-6 gap-12 min-h-screen justify-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white/90 text-center">
          Why <span className="text-[#6ee7b7]">CosmoDrop</span>?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 flex flex-col gap-3 hover:border-[rgba(59,130,100,0.4)] hover:bg-white/[0.07] transition-colors"
            >
              <h3 className="text-base font-semibold text-[#6ee7b7]">{f.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CHUNK 3 · Footer — static ── */}
      <footer className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-6 py-6 px-4 border-t border-white/5 text-white/25 text-sm text-center">
        <p>Made with <span className="text-red-400">♥</span> by Suman</p>
        <p>© {new Date().getFullYear()} CosmoDrop · All rights reserved.</p>
      </footer>

    </div>
  );
}
