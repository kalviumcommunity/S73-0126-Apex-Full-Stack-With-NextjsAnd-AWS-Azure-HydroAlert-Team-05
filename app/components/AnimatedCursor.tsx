"use client";

import React, { useEffect, useRef } from "react";

export default function AnimatedCursor() {
  const ringRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);

  const ringPos = useRef({ x: 0, y: 0 });
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    let initialized = false;

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      // Gold dot snaps instantly
      dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;

      if (!initialized) {
        ringPos.current.x = e.clientX;
        ringPos.current.y = e.clientY;
        initialized = true;
      }
    };

    const loop = () => {
      ringPos.current.x += (mouse.current.x - ringPos.current.x) * 0.11;
      ringPos.current.y += (mouse.current.y - ringPos.current.y) * 0.11;

      ring.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      requestAnimationFrame(loop);
    };

    document.body.classList.add("custom-cursor");
    window.addEventListener("mousemove", onMove, { passive: true });
    requestAnimationFrame(loop);

    return () => {
      document.body.classList.remove("custom-cursor");
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <>
      {/* Precision gold dot */}
      <div
        ref={dotRef}
        className="cursor-dot"
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "radial-gradient(circle at 30% 30%, #FDE68A, #F59E0B)", // champagne gold
          pointerEvents: "none",
          zIndex: 100000,
          transform: "translate3d(-9999px,-9999px,0)",
          boxShadow:
            "0 0 8px rgba(251,191,36,0.45), inset 0 0 2px rgba(255,255,255,0.6)",
        }}
      />

      {/* Gold glass ring */}
      <div
        ref={ringRef}
        className="cursor-ring"
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: 38,
          height: 38,
          marginLeft: -19,
          marginTop: -19,
          borderRadius: "50%",
          border: "1px solid rgba(251,191,36,0.45)", // amber-400
          pointerEvents: "none",
          zIndex: 99999,
          transform: "translate3d(-9999px,-9999px,0)",
          background:
            "linear-gradient(135deg, rgba(251,191,36,0.08), rgba(255,255,255,0.02))",
          backdropFilter: "blur(8px)",
        }}
      />

      <style jsx global>{`
        body.custom-cursor {
          cursor: none;
        }

        .cursor-ring {
          box-shadow:
            0 0 0 1px rgba(251, 191, 36, 0.15),
            0 10px 40px rgba(251, 191, 36, 0.18),
            inset 0 0 12px rgba(255, 255, 255, 0.06);
          transition:
            transform 0.08s linear,
            box-shadow 0.3s ease,
            border-color 0.3s ease;
        }
      `}</style>
    </>
  );
}
