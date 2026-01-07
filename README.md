# Rendering Strategies in FloodGuard (SSG, SSR, ISR)

This project demonstrates how **Static Site Generation (SSG)**,  
**Server-Side Rendering (SSR)**, and **Hybrid Rendering using Incremental Static Regeneration (ISR)** can be combined effectively in a real-world Next.js application.

The goal is to balance **performance**, **data freshness**, and **scalability** based on the nature of each page and its data requirements.

---

## How Rendering Choices Affect Performance, Scalability, and Data Freshness

In a Next.js application, rendering strategy directly impacts:

- **Performance** → how fast pages load (TTFB)
- **Scalability** → how well the app handles traffic
- **Data Freshness** → how up-to-date the content is

Each rendering mode optimizes different parts of this triangle.

### Static Site Generation (SSG)
- **Performance:** Excellent (served as pre-built HTML)
- **Scalability:** Excellent (no server computation per request)
- **Data Freshness:** Low (data updates only on rebuild)

### Server-Side Rendering (SSR)
- **Performance:** Moderate (server renders on every request)
- **Scalability:** Lower (high server load at scale)
- **Data Freshness:** Excellent (always up-to-date)

### Hybrid Rendering (ISR)
- **Performance:** Very good
- **Scalability:** Very good
- **Data Freshness:** Good (time-based updates)

ISR acts as a middle ground between SSG and SSR.

---

## Rendering Strategies Used in FloodGuard

FloodGuard uses all three rendering modes based on real-world needs.

### Static Rendering (SSG) — `/about`
- Used for project information that rarely changes
- Implemented using:
  ```ts
  export const revalidate = false;
- Benefits:
    - Instant page load
    - Zero runtime cost
    - Ideal for informational or marketing content

### Server-Side Rendering (SSR) — `/dashboard`
- Used for live weather and flood data
- Implemented using:
    ```tsx
    export const dynamic = "force-dynamic";
    fetch(url, { cache: "no-store" });

- Benefits:
    - Always fresh data
    - Accurate real-time alerts

- Trade-off:
    - Higher server cost
    - Slower than static pages

### Hybrid Rendering (ISR) — /districts
- Used for district-level flood risk data
- Implemented using:
    ```tsx
    export const revalidate = 60;
- Benefits:
    - Near-static performance
    - Periodic data freshness
    - Much better scalability than SSR

## Case Study: “The News Portal That Felt Outdated”

### Scenario Overview

At **DailyEdge**, a news and media startup, the homepage was implemented using **Static Site Generation (SSG)**.  
This made the page extremely fast to load, but users began reporting that the **“Breaking News”** section often displayed headlines that were hours old.

To fix this, the engineering team switched the entire homepage to **Server-Side Rendering (SSR)**.  
While this solved the freshness problem, it introduced new issues:
- Slower page load times
- Increased server usage
- Higher hosting costs due to rendering on every request

This scenario highlights the core challenge in modern web applications:  
**balancing speed, data freshness, and scalability**.

---

### Trade-off Analysis

Each rendering strategy optimizes different aspects of the system.

| Rendering Mode | Speed | Data Freshness | Scalability |
|---------------|------|----------------|-------------|
| Static (SSG)  | ✅ Excellent | ❌ Poor | ✅ Excellent |
| Dynamic (SSR) | ❌ Slower | ✅ Excellent | ❌ Poor |
| Hybrid (ISR)  | ✅ Good | ✅ Good | ✅ Good |

Using a single rendering strategy for all pages leads to inefficiencies and poor user experience.

---

