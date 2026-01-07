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

## Environment-Aware Configuration & Secrets Management

This project supports multiple deployment environments:
- Development
- Staging
- Production

### Environment Configuration
Each environment uses its own `.env` file:
- `.env.development`
- `.env.staging`
- `.env.production`

Only `.env.example` is committed to the repository to prevent
accidental exposure of sensitive data.

### Secure Secrets Management
Sensitive values such as API keys are stored using GitHub Secrets
and injected during build or deployment time.

No secrets are hardcoded or committed to the repository.

### Why Multi-Environment Setups Matter
Using separate environments allows safer testing, prevents
production outages, and ensures consistent behavior across CI/CD
pipelines.

---

## Understanding Cloud Deployments: Docker → CI/CD → AWS/Azure

This project explores how a full-stack application can be taken from
local development to the cloud using containerization and automation.

---

### Docker: Containerizing the Application
The application is containerized using Docker to ensure consistency
across development, staging, and production environments.

A Dockerfile is used to:
- Install dependencies
- Build the Next.js application
- Run the app inside a container

This makes the application portable and cloud-ready.

---

### CI/CD: Automating Builds with GitHub Actions
A GitHub Actions pipeline is configured to automatically:
- Install dependencies
- Build the application
- Fail early if issues are detected

This ensures that every code change is validated before deployment,
improving reliability and developer confidence.

---

### Cloud Deployment Strategy (AWS / Azure)
In a production setup:
- The Docker image would be pushed to a container registry (ECR / ACR)
- The app would be deployed using ECS, Elastic Beanstalk, or Azure App Service
- Environment variables and secrets would be injected securely at runtime

This separation allows safe and repeatable deployments across environments.

---

### Security & Configuration
- Secrets are never committed to the repository
- Environment variables are managed via GitHub Secrets or cloud key stores
- Different environments (dev, staging, prod) use separate configurations

---

### Reflection
The most challenging part was understanding how all the pieces
(Docker, CI/CD, and cloud services) fit together.

The most valuable learning was realizing how automation reduces
deployment errors and improves consistency.

In future deployments, adding automated testing and full CD
pipelines would further improve reliability.
