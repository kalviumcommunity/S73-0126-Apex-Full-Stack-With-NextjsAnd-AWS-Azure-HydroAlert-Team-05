"use client";

import React, { useEffect, useRef } from "react";

export default function AnimatedCursor() {
  const ref = useRef<HTMLDivElement | null>(null);
  const pos = useRef({ x: 0, y: 0 });
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let initialized = false;

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      // Initialize position immediately on first move to avoid jump/stuck
      if (!initialized) {
        pos.current.x = mouse.current.x;
        pos.current.y = mouse.current.y;
        initialized = true;
      }
    };

    const loop = () => {
      // easing follow
      pos.current.x += (mouse.current.x - pos.current.x) * 0.18;
      pos.current.y += (mouse.current.y - pos.current.y) * 0.18;
      if (el) {
        // center the cursor graphic (half of visual size)
        el.style.transform = `translate3d(${pos.current.x - 10}px, ${pos.current.y - 10}px, 0)`;
      }
      requestAnimationFrame(loop);
    };

    document.body.classList.add("custom-cursor-enabled");
    window.addEventListener("mousemove", onMove, { passive: true });
    requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.body.classList.remove("custom-cursor-enabled");
    };
  }, []);

  return (
    <div
      ref={ref}
      className="animated-cursor"
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: 20,
        height: 28,
        pointerEvents: "none",
        zIndex: 99999,
        transition: "transform 0.12s linear",
        transform: "translate3d(-9999px,-9999px,0)",
        display: "block",
      }}
    >
      <svg
        width="20"
        height="28"
        viewBox="0 0 64 88"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="gc" x1="0%" x2="100%">
            <stop offset="0%" stopColor="#0D6EFD" />
            <stop offset="100%" stopColor="#0DCBF0" />
          </linearGradient>
        </defs>
        <path
          d="M32 4C20 20 8 38 8 56C8 73 22 84 32 84C42 84 56 73 56 56C56 38 44 20 32 4Z"
          fill="url(#gc)"
          stroke="#fff"
          strokeWidth="1.5"
          opacity="0.98"
        />
        <circle cx="26" cy="36" r="4" fill="rgba(255,255,255,0.18)" />
      </svg>
      <style jsx>{`
        .animated-cursor {
          transform-origin: center;
          animation: pulse 1.8s infinite;
        }
        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.92;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
