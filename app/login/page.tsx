"use client";

import React, { useState } from "react";
import { TextField, Button, Snackbar, Alert } from "@mui/material";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<null | {
    type: "success" | "error";
    text: string;
  }>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const body = await res.json();

      if (!res.ok || body?.success === false) {
        setMsg({ type: "error", text: body?.message || "Login failed" });
        setLoading(false);
        return;
      }

      if (body?.data?.token) {
        try {
          localStorage.setItem("hydro_token", body.data.token);
        } catch {}
      }

      setMsg({ type: "success", text: body.message || "Logged in" });
      setLoading(false);
      router.push("/dashboard");
    } catch (err) {
      setMsg({
        type: "error",
        text: (err as Error).message || "Network error",
      });
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center p-0">
      <div className="row w-100 mx-0" style={{ maxWidth: 1000 }}>
        <div
          className="col-md-6 d-none d-md-flex bg-primary text-white p-5 flex-column justify-content-center"
          style={{ borderTopLeftRadius: 12, borderBottomLeftRadius: 12 }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <svg
                width="56"
                height="56"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C12 2 7 8 7 12.5C7 16.6421 10.3579 20 14.5 20C18.6421 20 22 16.6421 22 12.5C22 7.63401 16.5 2 12 2Z"
                  fill="#ffffff"
                />
              </svg>
              <h2 style={{ margin: 0 }}>HydroAlert</h2>
            </div>
            <h4 className="mt-4">Real-time flood & water-level alerts</h4>
            <p className="opacity-75">
              Stay ahead with precise, local updates — keep communities safe.
            </p>
          </div>
        </div>

        <div
          className="col-12 col-md-6 bg-white p-5"
          style={{ borderTopRightRadius: 12, borderBottomRightRadius: 12 }}
        >
          <h3 className="mb-3 text-dark">Welcome back</h3>
          <p className="text-muted">
            Sign in to access the HydroAlert dashboard
          </p>

          <form
            onSubmit={handleSubmit}
            className="d-flex flex-column gap-3 mt-4"
          >
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
            />

            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
              sx={{ py: 1.5 }}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>

            <div className="d-flex justify-content-between align-items-center">
              <small className="text-black">New here?</small>
              <a href="/signup">Create account</a>
            </div>
          </form>

          <Snackbar
            open={Boolean(msg)}
            autoHideDuration={4000}
            onClose={() => setMsg(null)}
          >
            {msg ? (
              <Alert
                onClose={() => setMsg(null)}
                severity={msg.type}
                sx={{ width: "100%" }}
              >
                {msg.text}
              </Alert>
            ) : null}
          </Snackbar>
        </div>
      </div>
    </div>
  );
}
