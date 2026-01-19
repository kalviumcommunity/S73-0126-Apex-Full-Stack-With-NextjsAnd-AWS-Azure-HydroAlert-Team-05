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
        credentials: "include", // ✅ THIS IS THE FIX
        body: JSON.stringify({ email, password }),
      });

      const body = await res.json();

      if (!res.ok || body?.success === false) {
        setMsg({ type: "error", text: body?.message || "Login failed" });
        return;
      }

      setMsg({ type: "success", text: "Login successful" });

      router.replace("/dashboard");
    } catch (err) {
      setMsg({
        type: "error",
        text: (err as Error).message || "Network error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center p-0">
      <div className="row w-100 mx-0" style={{ maxWidth: 1000 }}>
        <div className="col-12 col-md-6 bg-white p-5">
          <h3 className="mb-3">Welcome back</h3>

          <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
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
              type="submit"
              disabled={loading}
              sx={{ py: 1.5 }}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <Snackbar
            open={Boolean(msg)}
            autoHideDuration={4000}
            onClose={() => setMsg(null)}
          >
            {msg && (
              <Alert severity={msg.type} onClose={() => setMsg(null)}>
                {msg.text}
              </Alert>
            )}
          </Snackbar>
        </div>
      </div>
    </div>
  );
}
