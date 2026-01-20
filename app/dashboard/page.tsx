"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

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

type RiskResult = {
  level: "LOW" | "MEDIUM" | "HIGH";
  color: "green" | "amber" | "red";
  score: number;
  message: string;
};

type RiskTrend = {
  label: string;
  icon: string;
  color: string;
} | null;

type ImmediateAction = {
  title: string;
  action: string;
  note: string;
  className: string;
};

/* ---------------- FLOOD RISK FORMULA ---------------- */

function calculateFloodRisk(data: {
  humidity: number;
  windSpeed: number;
  tempCelsius: number;
}): RiskResult {
  const { humidity, windSpeed, tempCelsius } = data;

  let score = 0;
  score += humidity * 0.4;
  score += windSpeed * 5;
  if (tempCelsius < 25) score += 10;

  if (score < 40) {
    return {
      level: "LOW",
      color: "green",
      score,
      message: "Normal weather conditions. No immediate flood threat.",
    };
  }

  if (score < 70) {
    return {
      level: "MEDIUM",
      color: "amber",
      score,
      message:
        "Moderate rainfall conditions detected. Stay alert in low-lying areas.",
    };
  }

  return {
    level: "HIGH",
    color: "red",
    score,
    message:
      "Severe weather conditions detected. Flooding possible in vulnerable zones.",
  };
}

/* ---------------- RISK TREND LOGIC ---------------- */

function computeRiskTrend(currentScore: number): RiskTrend {
  if (typeof window === "undefined") return null;

  const prev = localStorage.getItem("previousRiskScore");
  localStorage.setItem("previousRiskScore", currentScore.toString());

  if (!prev) return null;

  const diff = currentScore - Number(prev);

  if (diff > 5)
    return { label: "Risk Rising", icon: "🔺", color: "text-red-400" };

  if (diff < -5)
    return { label: "Risk Falling", icon: "🔻", color: "text-green-400" };

  return { label: "Risk Stable", icon: "➖", color: "text-amber-400" };
}

/* ---------------- LOCATION-SPECIFIC PREPAREDNESS ---------------- */

function getPreparednessTips(
  location: string,
  riskLevel: "LOW" | "MEDIUM" | "HIGH"
): string[] {
  const loc = location.toLowerCase();

  const baseTips = {
    LOW: [
      "Stay updated with local weather advisories",
      "No immediate action required",
    ],
    MEDIUM: [
      "Prepare emergency supplies",
      "Avoid low-lying or waterlogged areas",
    ],
    HIGH: [
      "Move valuables to higher ground",
      "Avoid non-essential travel",
      "Follow official evacuation advisories",
    ],
  };

  if (
    loc.includes("mumbai") ||
    loc.includes("chennai") ||
    loc.includes("kochi") ||
    loc.includes("goa")
  ) {
    return [
      ...baseTips[riskLevel],
      "Avoid sea-facing roads and coastal zones",
      "Secure boats and waterfront property",
    ];
  }

  if (
    loc.includes("delhi") ||
    loc.includes("bengaluru") ||
    loc.includes("pune") ||
    loc.includes("hyderabad")
  ) {
    return [
      ...baseTips[riskLevel],
      "Avoid underpasses and flooded flyovers",
      "Expect traffic and public transport delays",
    ];
  }

  return [
    ...baseTips[riskLevel],
    "Monitor nearby rivers or canals",
    "Keep livestock and essentials in safe areas",
  ];
}

/* ---------------- WHAT SHOULD I DO NOW ---------------- */

function getImmediateAction(
  risk: RiskResult,
  trend: RiskTrend
): ImmediateAction {
  if (risk.level === "HIGH") {
    return {
      title: "Act Immediately",
      action: "Move to a safer location or higher ground",
      note:
        trend?.label === "Risk Rising"
          ? "Conditions are worsening rapidly. Do not delay."
          : "High flood risk detected. Stay alert and ready to evacuate.",
      className:
        "border-red-500/30 bg-red-500/10 text-red-200 shadow-[0_0_60px_rgba(255,0,0,0.25)]",
    };
  }

  if (risk.level === "MEDIUM") {
    return {
      title: "Stay Prepared",
      action: "Avoid flood-prone areas and keep essentials ready",
      note:
        trend?.label === "Risk Rising"
          ? "Risk is increasing. Situation may escalate."
          : "Conditions are stable but require attention.",
      className:
        "border-amber-400/30 bg-amber-400/10 text-amber-200 shadow-[0_0_40px_rgba(251,191,36,0.25)]",
    };
  }

  return {
    title: "No Immediate Action Needed",
    action: "Continue monitoring weather updates",
    note: "Weather conditions are currently safe.",
    className:
      "border-green-400/30 bg-green-400/10 text-green-200 shadow-[0_0_40px_rgba(34,197,94,0.25)]",
  };
}

/* ---------------- DASHBOARD ---------------- */

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  const [data, setData] = useState<WeatherResponse | null>(null);

  /* ---------- AUTH GUARD ---------- */
  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  /* ---------- WEATHER + LOCATION FETCH ---------- */
  useEffect(() => {
    if (!user) return;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        // Weather
        const res = await fetch(
          `/api/weather?lat=${latitude}&lon=${longitude}`
        );
        setData(await res.json());

        // 🔥 Persist user location (NEW)
        await fetch("/api/users/location", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ latitude, longitude }),
        });
      },
      async () => {
        const latitude = 19.076;
        const longitude = 72.8777;

        const res = await fetch(
          `/api/weather?lat=${latitude}&lon=${longitude}`
        );
        setData(await res.json());

        await fetch("/api/users/location", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ latitude, longitude }),
        });
      }
    );
  }, [user]);

  /* ---------- DERIVED VALUES ---------- */

  const tempCelsius = useMemo(() => {
    if (!data) return null;
    return Math.round(data.main.temp - 273.15);
  }, [data]);

  const risk = useMemo<RiskResult | null>(() => {
    if (!data || tempCelsius === null) return null;
    return calculateFloodRisk({
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      tempCelsius,
    });
  }, [data, tempCelsius]);

  const trend = useMemo<RiskTrend>(() => {
    if (!risk) return null;
    return computeRiskTrend(risk.score);
  }, [risk]);

  /* ---------- EARLY RETURNS ---------- */

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-white">
        Verifying authentication…
      </div>
    );
  }

  if (!data || !risk || tempCelsius === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-white animate-pulse">
        Initializing flood intelligence…
      </div>
    );
  }

  /* ---------- UI LOGIC ---------- */

  const preparednessTips = getPreparednessTips(data.name, risk.level);
  const immediateAction = getImmediateAction(risk, trend);

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold">HydroAlert</h1>
            <p className="text-slate-400">{user.email}</p>
          </div>
          <button
            onClick={async () => {
              await logout();
              router.replace("/login");
            }}
            className="rounded-xl bg-red-500/80 px-4 py-2 text-sm hover:bg-red-600"
          >
            Logout
          </button>
        </header>

        <section className="rounded-3xl border p-8 border-white/10 bg-white/5">
          <p className="text-sm uppercase tracking-widest">Flood Risk</p>
          <h2 className="mt-3 text-6xl font-black">{risk.level}</h2>
          {trend && (
            <p className={`mt-2 text-sm ${trend.color}`}>
              {trend.icon} {trend.label}
            </p>
          )}
          <p className="mt-4 max-w-xl text-slate-200">{risk.message}</p>
        </section>

        <section
          className={`rounded-3xl border p-8 ${immediateAction.className}`}
        >
          <h3 className="text-xl font-semibold">What should I do now?</h3>
          <p className="mt-4 text-2xl font-bold">{immediateAction.action}</p>
          <p className="mt-2 text-sm opacity-90">{immediateAction.note}</p>
        </section>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {[
            ["📍 Location", data.name],
            ["🌡️ Temperature", `${tempCelsius}°C`],
            ["💧 Humidity", `${data.main.humidity}%`],
            ["🌬️ Wind Speed", `${data.wind.speed} m/s`],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-white/5 p-6">
              <p className="text-sm text-slate-400">{label}</p>
              <p className="mt-2 text-2xl font-semibold">{value}</p>
            </div>
          ))}
        </section>

        <section className="rounded-3xl border border-amber-400/20 bg-amber-400/10 p-8">
          <h3 className="text-xl font-semibold text-amber-300">
            Location-Specific Preparedness
          </h3>
          <ul className="mt-4 space-y-2 text-amber-200">
            {preparednessTips.map((tip, idx) => (
              <li key={idx}>• {tip}</li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
