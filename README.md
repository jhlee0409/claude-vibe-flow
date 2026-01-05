# Claude Vibe Flow

[한국어](README.ko.md) | **English**

A suite of 17 specialized agents for [Claude Code](https://github.com/anthropics/claude-code) that provides persistent context management and automated development workflows.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![npm version](https://img.shields.io/npm/v/claude-vibe-flow)](https://www.npmjs.com/package/claude-vibe-flow)

## Features

- **Context Persistence**: Saves project state to `.claude-vibe-flow/` and auto-loads it when starting a new Claude Code session via [SessionStart hook](https://github.com/anthropics/claude-code).
- **Agent Orchestration**: Routes complex requests to specialized agents (Architecture, Implementation, Testing) instead of a single generalist model.
- **Workflow Automation**: Standardized pipelines for feature development, refactoring, and bug fixing.

> **Note**: Context is stored in markdown files and auto-injected at session start. If context doesn't load automatically, run `/claude-vibe-flow:resume`.

## Installation

### For New Projects (Template)

[![Use this template](https://img.shields.io/badge/Use%20this-Template-2ea44f?style=for-the-badge)](https://github.com/jhlee0409/claude-vibe-flow/generate)

Or click **"Use this template"** on GitHub, then:
```bash
cd my-app
claude
```

### For Existing Projects (CLI)
```bash
cd your-project
npx claude-vibe-flow
claude
```

## Usage

Run these commands inside **Claude Code**.

### Initialization
Sets up the `.claude-vibe-flow` directory for context storage.
```bash
/claude-vibe-flow:init
```

### Development
Start a new feature with the full agent pipeline (Planner -> Architect -> Implementer).
```bash
/claude-vibe-flow:new-feature "Add simple JWT authentication"
```

### Maintenance
Refresh the context map after manual file changes.
```bash
/claude-vibe-flow:sync-context
```

Analyze and fix bugs.
```bash
/claude-vibe-flow:fix-bug "Error: undefined property 'user'"
```

## Agents

### Core
| Agent | Description |
|-------|-------------|
| `pm-orchestrator` | Routes user requests to the appropriate agents. |
| `planner` | Clarifies requirements and creates specifications. |
| `architect` | Makes technical design decisions. |
| `vibe-implementer` | Implements code changes based on specs. |

### Quality & Maintenance
| Agent | Description |
|-------|-------------|
| `test-generator` | Generates unit and integration tests. |
| `code-reviewer` | Reviews code for quality and security issues. |
| `issue-fixer` | Analyzes and resolves bugs. |
| `spec-validator` | Validates specifications against requirements. |
| `test-quality-validator` | Checks test coverage and quality. |

### Context & Management
| Agent | Description |
|-------|-------------|
| `context-manager` | Maintains the persistent context graph. |
| `context-optimizer` | Optimizes context usage for token limits. |
| `task-manager` | Tracks task progress and status. |
| `agent-manager` | Manages agent interaction and lifecycle. |

### Utilities
| Agent | Description |
|-------|-------------|
| `git-guardian` | Handles git operations and commit messages. |
| `docs-sync` | Synchronizes documentation with code changes. |
| `readme-sync` | Keeps READMEs updated. |
| `research-agent` | Performs external research (web/docs). |

## Commands

| Command | Description |
|---------|-------------|
| `/claude-vibe-flow:init` | Initializes the Vibe Flow environment. |
| `/claude-vibe-flow:new-feature` | Starts a new feature development workflow. |
| `/claude-vibe-flow:fix-bug` | Analyzes and fixes a specified bug. |
| `/claude-vibe-flow:refactor` | Refactors code without changing behavior. |
| `/claude-vibe-flow:sync-context` | Synchronizes the context map. |
| `/claude-vibe-flow:resume` | Manually loads context from previous session. |
| `/claude-vibe-flow:check-setup` | Verifies Vibe Flow installation. |
| `/claude-vibe-flow:check-mcp` | Checks status of MCP servers. |
| `/claude-vibe-flow:ask` | Asks a question about the codebase. |

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

[MIT](LICENSE)
