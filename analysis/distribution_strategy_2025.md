# ClaudeVibeFlow Comprehensive Guide to Distribution and Expansion Strategies (2025)

This document outlines the four core forms for providing `claude-vibe-flow` to users and the **2025 AI Tool Distribution Strategy** for efficiently managing them in a single repository.

---

## 1. 2025's 4 Core Integrated Distribution Models

The agent system you've built is provided in four forms depending on the user's needs and proficiency.

| Category | Form | Target Audience | Core Value (UX/DX) |
| :--- | :--- | :--- | :--- |
| **Intelligence (Brain)** | **GitHub Template** | 0 → 1 New Users | Provides a guide for the entire process from ideation to implementation |
| **Intelligence (Brain)** | **npx CLI (Initializer)**| 1 → N Existing Users | Instantly transplant agents to existing projects with a single command |
| **Intelligence (Brain)** | **Claude Plugin** | Practical/Enterprise Users | Stable management and security with standardized specifications (`plugin.json`) |
| **Action (Hands)** | **MCP Server** | Advanced/Expert Users | Provides 'tools' for agents to communicate directly with external tools (GitHub/Jira/DB) |

---

## 2. Integrated Management System (Single Source, Multi-Publish)

Efficiency is maximized by treating the **Claude Plugin** format as the "Master Source" and automatically deriving the other 3 forms via CI/CD pipelines. This ensures scalability without quadrupling the maintenance effort.

### 📂 Integrated Repository Structure
```text
/claude-vibe-flow
├── agents/             <-- [Common Core] Intelligence of 15 agents (Prompt source)
├── commands/           <-- [Common Core] System control command set
├── src/mcp/            <-- [Action] MCP Server logic (TypeScript/Node.js)
├── bin/install.js      <-- [Distribution] File transplantation engine for npx installation
├── plugin.json         <-- [Distribution] Official Claude Code plugin definition
├── package.json        <-- [Distribution] npm publication and CLI command definition
└── README.md           <-- [Guide] Guide for 4 core entry points per user situation
```

---

## 3. Technical Guide for Single Repository Management and Distribution

We propose specific technical workflows for simultaneously managing and distributing four forms from a single source.

### 3.1 Scalable Core Configuration (Single Source)
*   **The Master Repo**: Function as the "Plugin" source (Official runtime). All other forms are *derived* from this.
*   **Automated Sync**:
    *   **To NPM (CLI)**: A GitHub Action automatically packages the current state into `bin/install.js` and publishes to NPM on release.
    *   **To Template**: A GitHub Action pushes the latest `agents/` and `config/` to a separate "clean" template repository.
    *   **To MCP**: The MCP server code resides in `src/mcp` and is published as a package from the same repo.

### 3.2 Core Installation Logic (`bin/install.js`)
The core mechanism used when recruiting agents to a user's existing project via npx.
```javascript
// Example of core mechanism
const fs = require('fs-extra');
const path = require('path');

async function setupVibe() {
  const targetPath = process.cwd(); // User's project folder
  const sourcePath = path.join(__dirname, '../'); // Template's source folder

  // 1. Copy core agents and command folders
  await fs.copy(path.join(sourcePath, 'agents'), path.join(targetPath, '.claude-vibe/agents'));
  await fs.copy(path.join(sourcePath, 'commands'), path.join(targetPath, '.claude-vibe/commands'));

  // 2. Context Discovery and CLAUDE.md creation
  const techStack = await autoDetectTechStack(targetPath); // Analysis by AI or script
  await createCustomClaudeMd(targetPath, techStack);

  console.log("Vibe agents successfully recruited! Run 'claude' to start your first conversation.");
}
```

### 3.3 Integrated Distribution Workflow (CI/CD)
1.  **Work**: Developer modifies prompts in the `agents/` folder or source code in `src/mcp/`.
2.  **Tag**: Tag the version with `git push origin v1.0.0`.
3.  **Deploy**: `npm publish` is automatically performed through GitHub Actions, etc.
4.  **Sync**: Template users (Fork), Plugin users (Auto-update), and CLI users (npx re-run) all receive the **latest prompt intelligence simultaneously**.

---

## 4. Implementation Specs for Agents

Technical details are defined so that agents can immediately write logic when requested to "construct this distribution environment."

### 4.1 Core Configuration File Templates (JSON Schema)

#### `plugin.json` (for Claude Code)
```json
{
  "name": "claude-vibe-flow",
  "version": "1.0.0",
  "description": "Autonomous Vibe Coding Agents for Professional Devs",
  "entry": "agents/pm-orchestrator.md",
  "commands": "commands/*.md",
  "capabilities": ["filesystem", "terminal"]
}
```

#### `package.json` (for CLI & MCP)
```json
{
  "name": "claude-vibe",
  "version": "1.0.0",
  "bin": { "vibe-init": "./bin/install.js" },
  "dependencies": {
    "fs-extra": "^11.0.0",
    "chalk": "^5.0.0",
    "@modelcontextprotocol/sdk": "^0.1.0"
  }
}
```

### 4.2 Core Detection Logic of the Analysis Agent (`vibe-init`)
Key items the AI must analyze when transplanting into an existing project:
1.  **Tech Stack**: Identify framework (React, Next.js, Go, etc.) through `package.json` or folder structure.
2.  **Test Environment**: Check for installation of `vitest`, `jest`, `playwright`, etc., and reflect in `test-generator`.
3.  **Project Style**: Read 2-3 existing code samples to extract a 'Coding Style Guide' for `vibe-implementer` into `CLAUDE.md`.

---

## 5. 2025 AI Tool UX/DX Core Principles (BP)

---

## Summary: "An Ecosystem Where Ideas Become Services"

Your system is based on **one powerful agent source (Core)** and functions as a template, a plugin, or a powerful automation engine (MCP) depending on the user's choice. Through the combination of these four strategies, `claude-vibe-flow` will evolve beyond a simple tool into an unrivaled AI development infrastructure.

---
*Antigravity AI: 2025 Comprehensive Distribution and Expansion Strategy established*
