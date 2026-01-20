"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-20 space-y-24">
        {/* HERO */}
        <section className="grid gap-12 md:grid-cols-2 items-center">
          <div>
            <p className="text-sm uppercase tracking-widest text-slate-400">
              Flood Early Warning System
            </p>

            <h1 className="mt-4 text-5xl md:text-6xl font-extrabold leading-tight">
              Real-time flood risk alerts that{" "}
              <span className="text-blue-400">save lives</span>
            </h1>

            <p className="mt-6 max-w-xl text-slate-300">
              HydroAlert analyzes rainfall, river levels, and weather patterns
              to detect flood risk early — so communities can act before
              disaster strikes.
            </p>

            <div className="mt-8 flex gap-4">
              <Link
                href="/signup"
                className="rounded-xl bg-blue-500 px-6 py-3 font-semibold hover:bg-blue-600 transition text-white text-decoration-none-lg"
              >
                Get started — it’s free
              </Link>
            </div>

            <div className="mt-12 flex gap-8 text-center">
              <div>
                <p className="text-3xl font-bold">24h</p>
                <p className="text-sm text-slate-400">Data refresh</p>
              </div>
              <div>
                <p className="text-3xl font-bold">500+</p>
                <p className="text-sm text-slate-400">District checks</p>
              </div>
              <div>
                <p className="text-3xl font-bold">Instant</p>
                <p className="text-sm text-slate-400">Alerts</p>
              </div>
            </div>
          </div>

          {/* DASHBOARD PREVIEW */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_0_60px_rgba(59,130,246,0.15)]">
            <p className="text-sm uppercase tracking-widest text-slate-400">
              Live Preview
            </p>

            <div className="mt-6 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 p-6">
              <p className="text-lg font-semibold">Flood Risk</p>
              <p className="mt-2 text-4xl font-black text-red-400">HIGH</p>
              <p className="mt-2 text-slate-300 text-sm">
                Severe weather conditions detected
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-white/5 p-4">
                <p className="text-xs text-slate-400">Aluva</p>
                <p className="text-lg font-bold text-red-400">High</p>
              </div>
              <div className="rounded-xl bg-white/5 p-4">
                <p className="text-xs text-slate-400">Kozhikode</p>
                <p className="text-lg font-bold text-green-400">Low</p>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Real-time Dashboard",
              desc: "Color-coded flood risk, rainfall, and wind data designed for instant decisions.",
            },
            {
              title: "District Risk Map",
              desc: "Interactive district-level insights with trend detection and alerts.",
            },
            {
              title: "Early Warnings",
              desc: "Actionable alerts with preparedness steps when risk levels rise.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-8 hover:bg-white/10 transition"
            >
              <h3 className="text-xl font-semibold">{f.title}</h3>
              <p className="mt-3 text-slate-300">{f.desc}</p>
            </div>
          ))}
        </section>

        {/* FOOTER */}
        <footer className="text-center text-sm text-slate-500">
          © {new Date().getFullYear()} HydroAlert — Built for safer communities
        </footer>
      </div>
    </main>
  );
}
