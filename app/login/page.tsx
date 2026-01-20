"use client";

import { useState, useEffect } from "react";
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

  /* REDIRECT IF ALREADY AUTHENTICATED */
  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSubmit(true);
    setMsg(null);

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
    <main className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black flex items-center justify-center px-6 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_0_60px_rgba(59,130,246,0.15)]">
        {/* HEADER */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold">HydroAlert</h1>
          <p className="mt-2 text-slate-400">
            Sign in to monitor flood risk in real time
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm text-slate-400">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="text-sm text-slate-400">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          {msg && (
            <div
              className={`rounded-xl px-4 py-3 text-sm ${
                msg.type === "error"
                  ? "bg-red-500/10 text-red-300 border border-red-500/20"
                  : "bg-green-500/10 text-green-300 border border-green-500/20"
              }`}
            >
              {msg.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loadingSubmit}
            className="w-full rounded-xl bg-blue-500 py-3 font-semibold hover:bg-blue-600 transition disabled:opacity-60"
          >
            {loadingSubmit ? "Signing in…" : "Sign in"}
          </button>
        </form>

        {/* FOOTER */}
        <p className="mt-6 text-center text-sm text-slate-500">
          Flood intelligence that helps communities act early
        </p>
      </div>
    </main>
  );
}

// old exisiting code
// "use client";

// import React, { useState, useEffect } from "react";
// import { TextField, Button, Snackbar, Alert } from "@mui/material";
// import { useRouter } from "next/navigation";
// import { useAuth } from "../context/AuthContext";

// export default function LoginPage() {
//   const router = useRouter();
//   const { user, loading, refresh } = useAuth();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loadingSubmit, setLoadingSubmit] = useState(false);
//   const [msg, setMsg] = useState<null | {
//     type: "success" | "error";
//     text: string;
//   }>(null);

//   /* ✅ REDIRECT WHEN AUTH CONTEXT UPDATES */
//   useEffect(() => {
//     if (!loading && user) {
//       router.replace("/dashboard");
//     }
//   }, [user, loading, router]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoadingSubmit(true);

//     try {
//       const res = await fetch("/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({ email, password }),
//       });

//       const body = await res.json();

//       if (!res.ok || body?.success === false) {
//         setMsg({ type: "error", text: body?.message || "Login failed" });
//         return;
//       }

//       setMsg({ type: "success", text: "Login successful" });
//       await refresh();
//       router.replace("/dashboard");
//     } catch (err) {
//       setMsg({
//         type: "error",
//         text: (err as Error).message || "Network error",
//       });
//     } finally {
//       setLoadingSubmit(false);
//     }
//   };

//   return (
//     <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center p-0">
//       <div className="row w-100 mx-0" style={{ maxWidth: 1000 }}>
//         <div className="col-12 col-md-6 bg-white p-5">
//           <h3 className="mb-3">Welcome back</h3>

//           <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
//             <TextField
//               label="Email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               fullWidth
//               required
//             />
//             <TextField
//               label="Password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               fullWidth
//               required
//             />

//             <Button
//               variant="contained"
//               type="submit"
//               disabled={loadingSubmit}
//               sx={{ py: 1.5 }}
//             >
//               {loadingSubmit ? "Signing in..." : "Sign in"}
//             </Button>
//           </form>

//           <Snackbar
//             open={Boolean(msg)}
//             autoHideDuration={4000}
//             onClose={() => setMsg(null)}
//           >
//             {msg && (
//               <Alert severity={msg.type} onClose={() => setMsg(null)}>
//                 {msg.text}
//               </Alert>
//             )}
//           </Snackbar>
//         </div>
//       </div>
//     </div>
//   );
// }
