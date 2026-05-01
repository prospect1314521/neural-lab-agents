# Project 04: Neural Lab

Neural Lab is an experimental deployment of an automated, multi-agent code-review companion. It gamifies the coding learning process through decentralized challenges and intelligent, real-time code analysis. 

## 🎯 The Vision

To bridge the gap between static tutorials and real-world deployment. Project 04 provides an interactive sandbox that doesn't just evaluate syntax, but maps architectural integrity, pinpoints security vulnerabilities, and provides gamified mentorship feedback.

## 🧠 Core Architecture & Logic Flow

- **Multi-Agent Swarm Integration:** 
  - **Static Auditor:** Parses code structure for performance and syntax anti-patterns.
  - **Security Sentinel:** Deep scanning for potential vulnerabilities (e.g., SQLi, XSS, hardcoded secrets).
  - **Mentor Agent:** Synthesizes findings into gamified, constructive context.
- **Credit Allocation Strategy:** 
  - `40% Edge Execution:` Powering real-time sandboxed environments.
  - `60% LLM Processing:` Running complex, long-chain reasoning on the backend to evaluate code safety and logic.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Environment Setup:
   Copy the example environment file and add your target configuration:
   ```bash
   cp .env.example .env
   ```
   *Make sure your `GEMINI_API_KEY` is properly configured in the `.env` file.*

### Running the Environment

Start the development telemetry system:
```bash
npm run dev
```

The interface will be available locally at `http://localhost:3000`.

## 🛠️ Stack

- **Frontend:** React 19, Vite, Tailwind CSS v4
- **Animation:** Motion for React
- **Icons:** Lucide React
- **LLM Engine:** Multi-agent prompt chaining architecture via Gemini 2.5 Flash

## 📄 License
MIT License
