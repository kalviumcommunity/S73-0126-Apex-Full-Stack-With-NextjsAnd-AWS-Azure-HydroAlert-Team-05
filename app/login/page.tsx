"use client";

import React, { useState, useEffect } from "react";
import { TextField, Button, Snackbar, Alert } from "@mui/material";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, refresh } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [msg, setMsg] = useState<null | {
    type: "success" | "error";
    text: string;
  }>(null);

  /* ✅ REDIRECT WHEN AUTH CONTEXT UPDATES */
  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSubmit(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const body = await res.json();

      if (!res.ok || body?.success === false) {
        setMsg({ type: "error", text: body?.message || "Login failed" });
        return;
      }

      setMsg({ type: "success", text: "Login successful" });
      await refresh();
      router.replace("/dashboard");
    } catch (err) {
      setMsg({
        type: "error",
        text: (err as Error).message || "Network error",
      });
    } finally {
      setLoadingSubmit(false);
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
              disabled={loadingSubmit}
              sx={{ py: 1.5 }}
            >
              {loadingSubmit ? "Signing in..." : "Sign in"}
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
