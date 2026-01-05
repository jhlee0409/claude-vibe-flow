# Claude Vibe Flow 🌊

> **Full Vibe Coding** for Claude Code.
> 
> A comprehensive suite of agents, commands, and tools designed to maximize flow, minimize context switching, and enforce "Vibe Coding" best practices.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Claude Code](https://img.shields.io/badge/Claude%20Code-Ready-purple)

---

## 🚀 The Vibe Standard Stack

We believe in a "Zero-Friction" environment. Vibe Flow automates the setup of the **"Unconditionally Good"** tools that every developer needs.

| Tool | Capability | Why it's essential |
|------|------------|--------------------|
| **Context7** | 📚 **Docs** | Autonomously finds the *correct* version of documentation. Prevents hallucinations. |
| **GitHub** | 🐙 **Issues/PR** | Allows agents to read issues and manage PRs directly. |
| **Sequential Thinking** | 🧠 **Reasoning** | Provides a "Chain of Thought" workspace for solving complex logic problems. |

---

## 📦 Installation (The Vibe Doctor)

We provide an automated installer to ensure your environment is perfect.

1.  **Clone the repository**
    ```bash
    git clone https://github.com/jhlee0409/claude-vibe-flow.git
    cd claude-vibe-flow
    ```

2.  **Initialize Vibe Flow**
    Run the following command inside Claude Code:
    ```
    /claude-vibe-flow:init
    ```
    
    *This will create the `.vibe-flow` context directory and guide you to the setup script.*

3.  **Run the Setup Script** (if not triggered automatically)
    ```bash
    sh scripts/setup_vibe.sh
    ```
    *The "Vibe Doctor" will check your Node.js/Git status and install the Standard Stack.*

---

## ✨ Features

### 🤖 Specialized Agents
Instead of a generic assistant, we route tasks to specialists:

*   **`pm-orchestrator`**: The boss. Analyzes intent and routes to the right agent.
*   **`planner`**: Requirement elicitation via Socratic dialogue.
*   **`context-manager`**: Maintains the "Mental Map" of your codebase.
*   **`research-agent`**: Uses Context7 to find *real* documentation.
*   **`issue-fixer`**: Reads error logs/issues and performs root cause analysis.
*   **`test-generator`**: Writes robust tests before/after implementation.

### 🔄 Active Context Sync
The system maintains a real-time map of your project in `.vibe-flow/active_spec.md`. Agents allow you to **"Stop & Resume"** without losing context.

---

## 🛠️ Commands

| Command | Description |
|---------|-------------|
| `/claude-vibe-flow:init` | Initializes the Vibe environment and runs the setup script. |
| `/claude-vibe-flow:sync-context` | Forces a re-scan of the codebase to update the context map. |
| `/claude-vibe-flow:check-mcp` | Verifies if the Standard Stack is installed and active. |
| `/claude-vibe-flow:new-feature` | Starts a new feature development cycle (`active_spec.md`). |

---

## 🤝 Contributing

We welcome contributions! Please open an issue or submit a Pull Request.

## 📄 License

This project is licensed under the **MIT License**.
