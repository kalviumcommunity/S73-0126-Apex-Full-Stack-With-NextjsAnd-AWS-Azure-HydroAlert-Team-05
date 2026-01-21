"use client";

import { MapContainer, TileLayer, Circle } from "react-leaflet";

export default function RiskMap({
  latitude,
  longitude,
  riskLevel,
}: {
  latitude: number;
  longitude: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
}) {
  const radius =
    riskLevel === "HIGH"
      ? 2000 // meters
      : riskLevel === "MEDIUM"
        ? 1000
        : 500;

  const color =
    riskLevel === "HIGH"
      ? "#ef4444"
      : riskLevel === "MEDIUM"
        ? "#f59e0b"
        : "#22c55e";

  return (
    <div className="h-[320px] w-full overflow-hidden rounded-3xl border border-white/10">
      <MapContainer
        center={[latitude, longitude]}
        zoom={11}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Circle
          center={[latitude, longitude]}
          radius={radius}
          pathOptions={{
            color,
            fillColor: color,
            fillOpacity: 0.25,
          }}
        />
      </MapContainer>
    </div>
  );
}
