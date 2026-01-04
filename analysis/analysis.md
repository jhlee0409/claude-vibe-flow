# ClaudeVibeFlow: Detailed File Analysis Report

A deep analysis of the `claude-vibe-flow` directory reveals that this is a sophisticated framework for building an autonomous agent ecosystem utilizing **Claude Code** (CLI).

## 1. Overall Architecture

This project aims beyond simple coding style suggestions, targeting an **Agent Orchestration** system that automates the entire development process.

### Core Structure:
- **`agents/` (15 agents)**: Specialized agents for specific domains (Git, Reviews, Design, Tests, etc.).
- **`commands/`**: Provides slash commands (`new-feature`, `check-setup`) to automatically execute workflows.
- **`config/`**: Contains routing rules (`intent-routing.md`) that analyze user intent and connect to the appropriate agent.

## 2. Key Agent Analysis

| Agent Group | Key Agent | Core Role |
| :--- | :--- | :--- |
| **Orchestration** | `pm-orchestrator` | Analyzes complexity/clarity to route tasks to a single agent or pipeline. |
| **Critical** | `git-guardian` | Automates **Vibe Coding** style branch naming (`vibe/*`) and atomic commits. |
| **Critical** | `issue-fixer` | Specializes in debugging and fixing errors when they occur. |
| **Quality** | `code-reviewer` | Automatically performs code quality and security reviews after changes. |
| **Meta** | `agent-manager` | Monitors the health of the agent ecosystem and manages new agent creation. |

## 3. Workflow and Automation (Vibe Coding Optimized)

The most prominent feature of this template is the **Automatic Trigger** system.

- **Branch Management**: Upon session start, `git-guardian` automatically checks the current branch and creates a new one in the format `vibe/[context]-[feature]` if necessary.
- **Intent-Based Routing**: When a user says "Validate types," `type-sync-checker` is automatically summoned based on `intent-routing.md` rules.
- **Pipeline Execution**: For complex requests (Epic level), it configures a sophisticated pipeline: `planner` → `architect` → `spec-validator` → `vibe-implementer`.

## 4. Customization and Extensibility

- **Adding Agents**: Easily create project-specific agents by adding new agent files to the `agents/` directory.
- **`CLAUDE.md` Integration**: Customize behavior by overriding `intent-routing.md` or defining trigger tables per project.

## 5. Conclusion and Recommendations

This template is not just a collection of text files but an "Operating System" that allows you to use Claude like an actual **Autonomous Development Team**.

- **Recommendation**: When developing new features, use the `/project:new-feature "feature-name"` command to follow the standard workflow suggested by the system.
- **Caution**: Since context is included in every prompt, it is important to keep `CLAUDE.md` within 300 lines to manage token efficiency.

---
*Antigravity AI Analysis Complete*
