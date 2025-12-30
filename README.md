# 🚀 SphereHack DevOps Insight Engine

<div align="center">
  <h3> Automate. Analyze. Optimize. </h3>
  <p>The Future of Intelligent Deployment is Here.</p>
  <a href="https://sphere-hack-dev-ops-insight-engine.vercel.app/"><strong>Live Demo »</strong></a>
  <br />
  <a href="https://hub.docker.com/r/nishant0411/devops-insight-engine"><strong>Docker Hub »</strong></a>
  <br />
  <br />
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwind-css" />
  <img src="https://img.shields.io/badge/Express-4-green?style=for-the-badge&logo=express" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb" />
  <img src="https://img.shields.io/badge/Docker-Containerized-blue?style=for-the-badge&logo=docker" />
</div>

---

## 🌪️ The Problem
In the chaotic universe of DevOps, engineers are drowning in configuration files, cryptic error logs, and "it works on my machine" syndrome.
*   **Pipeline Purgatory**: Setting up CI/CD for multiple clouds is a nightmare.
*   **Log Labyrinths**: Finding the root cause of a failed build often feels like archaeology.
*   **Fragmented Tooling**: Jumping between 10 different dashboards just to see if your app is alive.

## 💡 The Solution: DevOps Insight Engine
We didn't just build a tool; we built a **co-pilot for your infrastructure**.
The **DevOps Insight Engine** is an AI-powered platform that democratizes deployment. It accepts your code, analyzes it, generates the perfect pipeline, and deploys it—all with a single click. When things break, our AI Agent doesn't just tell you *what* happened; it tells you *how* to fix it.

---

## ✨ Key Features
*   **🧠 Intelligent Repo Analysis**: Instantly scans your GitHub repository to detect stacks (Node, Python, Go) and missing critical files (Dockerfile, CI/CD workflows).
*   **⚡ One-Click Deploy**: Push to **Vercel**, **Docker Hub**, or **Cloud Platforms** without writing a single line of YAML.
*   **🤖 AI Log Doctor**: Our AI parses build logs in real-time, translating error codes into human-readable solutions and auto-patch suggestions.
*   **📊 Unified Command Center**: A glass-morphic dashboard giving you a god-mode view of all your deployments across different clouds.
*   **🔮 Self-Healing Pipelines**: (Beta) Agents that automatically commit fixes to your repo when a build fails.

---

## 🛠️ Architecture & Tech Stack

### **Frontend: The Experience**
Built with **Next.js 16 (App Router)** and **React 18** for lightning-fast server-side rendering. Styled with **Tailwind CSS 4** for a sleek, modern, dark-mode-first aesthetic.
*   *Interactive UI*: Lucide React Icons & Framer Motion (planned).
*   *State Management*: React Hooks for real-time log streaming.

### **Backend: The Brain**
A robust **Node.js** & **Express** REST API acting as the orchestrator.
*   **Database**: **MongoDB Atlas** (Mongoose 8) storing deployment states, logs, and user profiles.
*   **AI Engine**: Integrated Local/Cloud LLM support for log analysis.
*   **Containerization**: Fully Dockerized for consistent environments.

---

## 🚀 Live Demo
Experience the platform yourself:
👉 **[sphere-hack-dev-ops-insight-engine.vercel.app](https://sphere-hack-dev-ops-insight-engine.vercel.app/)**

---

## 📂 Repository Structure
```bash
.
├── 🖥️ Frontend/          # Next.js Application
│   ├── pages/            # App Routes & Views
│   ├── components/       # Reusable UI Atoms
│   └── styles/           # Global Tailwind Config
│
├── ⚙️ Backend/           # Express API Server
│   ├── routes/           # API Endpoints (GitHub, Deployments)
│   ├── models/           # Mongoose Schemas
│   └── server.js         # Entry Point
│
├── 🐳 Dockerfile         # Container Config
└── 📄 README.md          # You are here
```

---

## ⚡ Getting Started

### Prerequisites
*   Node.js 18+
*   MongoDB Atlas Connection String
*   GitHub Account & Token

### 1️⃣ Runs on Your Machine
**Clone the ecosystem:**
```bash
git clone https://github.com/nishant-0411/SphereHack-DevOps-Insight-Engine.git
cd SphereHack-DevOps-Insight-Engine
```

### 2️⃣ Backend Setup
```bash
cd Backend
npm install
# Create a .env file with your MONGO_URI
echo "MONGO_URI=mongodb+srv://..." > .env
npm run dev
```
*The Brain is now active on Port 3005.*

### 3️⃣ Frontend Setup
```bash
cd Frontend
npm install
# Point to your local or deployed backend
echo "NEXT_PUBLIC_API_URL=http://localhost:3005" > .env.local
npm run dev
```
*The Experience is live at http://localhost:3004.*

---

## 🚢 Deployment Guide

### **Deploying with Docker**
*Containerize the entire ecosystem.*
[View on Docker Hub](https://hub.docker.com/r/nishant0411/devops-insight-engine)
```bash
docker pull nishant0411/devops-insight-engine
docker run -p 3005:3005 -e MONGO_URI="your_mongodb_connection_string" nishant0411/devops-insight-engine
```

### **Deploying to Vercel**
1.  Push Frontend to GitHub.
2.  Import to Vercel.
3.  Set Environment Variable: `NEXT_PUBLIC_API_URL` -> (Link to your live backend).

---

## 📡 API Reference
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/github/analyze` | 🕵️ Scans repo & returns health score |
| `POST` | `/api/deployments` | 🚀 Triggers new deployment pipeline |
| `GET` | `/api/deployments` | 📜 Fetches history & status |
| `POST` | `/api/github/fix` | 🔧 Auto-commits missing config files |

---