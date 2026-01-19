"use client";

import { useEffect, useState } from "react";

/* ---------------- TYPES ---------------- */

type WeatherResponse = {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  weather: {
    description: string;
  }[];
};

/* ---------------- FLOOD RISK FORMULA ---------------- */
/*
  Simple heuristic-based risk model
  (Explainable + evaluation-friendly)
*/
function calculateFloodRisk(data: {
  humidity: number;
  windSpeed: number;
  tempCelsius: number;
}) {
  const { humidity, windSpeed, tempCelsius } = data;

  let score = 0;

  // Saturation indicator
  score += humidity * 0.4;

  // Storm intensity indicator
  score += windSpeed * 5;

  // Persistent rainfall proxy
  if (tempCelsius < 25) score += 10;

  if (score < 40) {
    return {
      level: "LOW",
      color: "green",
      message: "Normal weather conditions. No immediate flood threat.",
    };
  }

  if (score < 70) {
    return {
      level: "MEDIUM",
      color: "amber",
      message:
        "Moderate rainfall conditions detected. Stay alert in low-lying areas.",
    };
  }

  return {
    level: "HIGH",
    color: "red",
    message:
      "Severe weather conditions detected. Flooding possible in vulnerable zones.",
  };
}

/* ---------------- DASHBOARD ---------------- */

export default function DashboardPage() {
  const [data, setData] = useState<WeatherResponse | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const res = await fetch(
          `/api/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`
        );
        const json = await res.json();
        setData(json);
      },
      async () => {
        // fallback: Mumbai
        const res = await fetch(`/api/weather?lat=19.076&lon=72.8777`);
        const json = await res.json();
        setData(json);
      }
    );
  }, []);

  if (!data) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-white">
        <p className="animate-pulse text-lg">
          Initializing flood intelligence…
        </p>
      </div>
    );
  }

  const tempCelsius = Math.round(data.main.temp - 273.15);

  const risk = calculateFloodRisk({
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    tempCelsius,
  });

  /* ---------------- UI ---------------- */

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl space-y-10">
        {/* Header */}
        <header>
          <h1 className="text-4xl font-extrabold tracking-tight">HydroAlert</h1>
          <p className="text-slate-400">
            Real-time flood early warning system using open meteorological data
          </p>
        </header>

        {/* FLOOD RISK HERO */}
        <section
          className={`rounded-3xl border p-8 ${
            risk.color === "red"
              ? "border-red-500/20 bg-red-500/10 shadow-[0_0_80px_rgba(255,0,0,0.25)]"
              : risk.color === "amber"
                ? "border-amber-400/20 bg-amber-400/10 shadow-[0_0_60px_rgba(251,191,36,0.25)]"
                : "border-green-400/20 bg-green-400/10 shadow-[0_0_60px_rgba(34,197,94,0.25)]"
          }`}
        >
          <p
            className={`text-sm uppercase tracking-widest ${
              risk.color === "red"
                ? "text-red-400"
                : risk.color === "amber"
                  ? "text-amber-400"
                  : "text-green-400"
            }`}
          >
            Flood Risk Level
          </p>

          <h2
            className={`mt-3 text-6xl font-black ${
              risk.color === "red"
                ? "text-red-500"
                : risk.color === "amber"
                  ? "text-amber-400"
                  : "text-green-400"
            }`}
          >
            {risk.level}
          </h2>

          <p className="mt-4 max-w-xl text-slate-200">{risk.message}</p>
        </section>

        {/* DATA GRID */}
        <section className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {[
            ["📍 Location", data.name],
            ["🌡️ Temperature", `${tempCelsius}°C`],
            ["💧 Humidity", `${data.main.humidity}%`],
            ["🌬️ Wind Speed", `${data.wind.speed} m/s`],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
            >
              <p className="text-sm text-slate-400">{label}</p>
              <p className="mt-2 text-2xl font-semibold">{value}</p>
            </div>
          ))}
        </section>

        {/* WEATHER INTELLIGENCE */}
        <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
          <h3 className="text-xl font-semibold">Weather Intelligence</h3>
          <p className="mt-3 text-slate-300">
            Current conditions indicate{" "}
            <span className="font-medium text-white">
              {data.weather[0].description}
            </span>
            .
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Data source: OpenWeather (Live)
          </p>
        </section>

        {/* PREPAREDNESS */}
        <section className="rounded-3xl border border-amber-400/20 bg-amber-400/10 p-8">
          <h3 className="text-xl font-semibold text-amber-300">
            Emergency Preparedness
          </h3>
          <ul className="mt-4 space-y-2 text-amber-200">
            <li>• Move valuables to higher ground</li>
            <li>• Avoid low-lying roads and flooded areas</li>
            <li>• Keep emergency supplies and power banks ready</li>
            <li>• Monitor local disaster management advisories</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
