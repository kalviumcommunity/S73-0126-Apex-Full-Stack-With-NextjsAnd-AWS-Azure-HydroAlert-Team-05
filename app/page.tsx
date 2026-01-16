"use client";

import React from "react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div style={{ backgroundColor: "#ffffff" }}>
      <section
        style={{
          background: "linear-gradient(135deg,#0D6EFD 0%,#0DCBF0 100%)",
        }}
        className="py-5 text-white"
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-7">
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 12,
                    background: "rgba(255,255,255,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    width="34"
                    height="34"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2C12 2 7 8 7 12.5C7 16.6421 10.3579 20 14.5 20C18.6421 20 22 16.6421 22 12.5C22 7.63401 16.5 2 12 2Z"
                      fill="#fff"
                      opacity="0.95"
                    />
                  </svg>
                </div>
                <div>
                  <h6 className="mb-0" style={{ opacity: 0.95 }}>
                    HydroAlert
                  </h6>
                  <small className="text-white-50">
                    Flood Early Warning Dashboard
                  </small>
                </div>
              </div>

              <h1
                className="display-4 fw-bold mt-4"
                style={{ color: "#ffffff" }}
              >
                Real-time flood risk alerts that save lives
              </h1>
              <p className="lead text-white-50 mt-3" style={{ maxWidth: 680 }}>
                HydroAlert visualizes rainfall and river data, highlights
                districts at risk, and sends early warnings so communities can
                act fast.
              </p>

              <div className="mt-4 d-flex gap-3">
                <Link href="/signup" className="btn btn-light btn-lg">
                  Get started — {"it's"} free
                </Link>
                <Link
                  href="/dashboard"
                  className="btn btn-outline-light btn-lg"
                >
                  View demo
                </Link>
              </div>

              <div className="d-flex gap-3 mt-5">
                <div className="text-center">
                  <h3 className="mb-0">24h</h3>
                  <small className="text-white-50">Data refresh</small>
                </div>
                <div className="text-center">
                  <h3 className="mb-0">500+</h3>
                  <small className="text-white-50">District checks</small>
                </div>
                <div className="text-center">
                  <h3 className="mb-0">Alerts</h3>
                  <small className="text-white-50">Actionable tips</small>
                </div>
              </div>
            </div>

            <div className="col-md-5 d-none d-md-block">
              <div
                className="card shadow-lg"
                style={{ borderRadius: 18, overflow: "hidden" }}
              >
                <div style={{ background: "#ffffff", padding: 24 }}>
                  <div
                    style={{
                      height: 260,
                      borderRadius: 12,
                      background: "linear-gradient(180deg,#ffffff, #e9f7ff)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div className="text-center">
                      <h5 className="mb-2">Live Preview</h5>
                      <p className="text-dark mb-0">
                        Rainfall intensity • River level • Risk
                      </p>
                    </div>
                  </div>

                  <div className="d-flex gap-2 mt-3">
                    <div className="flex-fill p-2 bg-white rounded shadow-sm">
                      <small className="text-dark">Aluva</small>
                      <div className="fw-bold text-danger">High</div>
                    </div>
                    <div className="flex-fill p-2 bg-white rounded shadow-sm">
                      <small className="text-dark">Kozhikode</small>
                      <div className="fw-bold text-success">Low</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="container py-5"
        style={{ backgroundColor: "#ffffff" }}
      >
        <div className="row g-4">
          <div className="col-md-4">
            <div className="p-4 rounded shadow-sm h-100">
              <h5 className="fw-bold text-dark">Real-time Dashboard</h5>
              <p className="text-dark fw-semibold">
                Color-coded risk, rainfall and water-level charts designed for
                quick decisions.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-4 rounded shadow-sm h-100">
              <h5 className="fw-bold text-dark">District Map</h5>
              <p className="text-dark fw-semibold">
                Interactive map highlights districts by risk — drill down for
                trends and alerts.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-4 rounded shadow-sm h-100">
              <h5 className="fw-bold text-dark">Early Warnings</h5>
              <p className="text-dark fw-semibold">
                In-app and email notifications with step-by-step preparedness
                tips when risk is high.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-4 text-center" style={{ color: "#6c757d" }}>
        © {new Date().getFullYear()} HydroAlert — Built for safer communities
      </footer>
    </div>
  );
}
