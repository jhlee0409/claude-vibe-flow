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

## Prerequisites

**Track A: Existing Users**
If you already use `claude` CLI, just proceed to Installation.

**Track B: New Users**
You need the Claude Code CLI (Beta) installed first.
```bash
npm install -g @anthropic-ai/claude-code
claude login
```

## 🏁 Getting Started

Choose the installation method that fits your needs.

### Method 1: New Project (GitHub Template) 🌟
> **Best for:** Starting a new project with full Vibe Coding setup.

```bash
git clone https://github.com/jhlee0409/claude-vibe-flow.git my-new-project
cd my-new-project
claude
```
> ✨ Plugin & MCP servers are auto-configured via `.claude-plugin/` and `.mcp.json`

Then initialize:
```
/claude-vibe-flow:init
```

---

### Method 2: Existing Project (Full Experience) 📦
> **Best for:** Adding full Vibe Coding capabilities to your existing project.

```bash
cd your-existing-project
npx vibe-flow init
claude
```

Then initialize:
```
/claude-vibe-flow:init
```

---

### Method 3: MCP Only (Lightweight) ⚡️
> **Best for:** Projects where you only need the core MCP tools without agents/commands.

```bash
npx vibe-flow
```
*Note: This only installs MCP servers (Context7, GitHub, Sequential Thinking). No agents or commands.*



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
| `/claude-vibe-flow:fix-bug` | Pipes error logs to Issue Fixer agent for RCA and patching. |
| `/claude-vibe-flow:refactor` | Improves code structure without changing business logic. |
| `/claude-vibe-flow:ask` | Quick Q&A about codebase or external docs (no file changes). |

---

## 🤝 Contributing

We welcome contributions! Please open an issue or submit a Pull Request.

## 📄 License

This project is licensed under the **MIT License**.
