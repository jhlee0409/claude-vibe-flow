# Claude Vibe Flow

[한국어](README.ko.md) | **English**

A suite of 21 specialized agents for [Claude Code](https://github.com/anthropics/claude-code) that provides persistent context management and automated development workflows.

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
Start a new feature with the full agent pipeline (Idea -> Plan -> Architect -> Implement).
```bash
/claude-vibe-flow:vibe "Add simple JWT authentication"
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

### Core Orchestration
| Agent | Description |
|-------|-------------|
| `vibe-orchestrator` | Routes user requests to the appropriate agents. |
| `idea-shaper` | Transforms vague ideas into validated, actionable specifications. |
| `planner` | Clarifies requirements through Socratic dialogue. |
| `architect` | Makes technical design decisions. |
| `vibe-implementer` | Implements code changes based on specs. |

### Frontend Specialists
| Agent | Description |
|-------|-------------|
| `frontend-implementer` | Frontend implementation (React 19, Svelte 5, Vue 3.5, WCAG 2.2). |
| `ui-ux-designer` | UI/UX design systems, accessibility audits, design tokens. |

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
| `code-simplifier` | Reduces code complexity while preserving behavior. |

## Commands

### Workflow Commands
| Command | Description |
|---------|-------------|
| `/claude-vibe-flow:init` | Initializes the Vibe Flow environment. |
| `/claude-vibe-flow:vibe` | Unified command: idea → plan → implement (full pipeline). |
| `/claude-vibe-flow:vibe --idea` | Idea validation only. |
| `/claude-vibe-flow:vibe --plan` | Requirements and architecture only. |
| `/claude-vibe-flow:vibe --implement` | Direct implementation only. |
| `/claude-vibe-flow:fix-bug` | Analyzes and fixes a specified bug. |
| `/claude-vibe-flow:refactor` | Refactors code without changing behavior. |
| `/claude-vibe-flow:sync-context` | Synchronizes the context map. |
| `/claude-vibe-flow:resume` | Manually loads context from previous session. |
| `/claude-vibe-flow:check` | Verifies installation (use `--setup` or `--mcp` flags). |
| `/claude-vibe-flow:ask` | Asks a question about the codebase. |
| `/claude-vibe-flow:commit-push-pr` | Commit, push, and create PR in one command. |

### Mode Commands
| Command | Description |
|---------|-------------|
| `/claude-vibe-flow:verify` | Enables Verification mode - thorough checks after every edit. |
| `/claude-vibe-flow:fast` | Enables FastVibe mode - rapid prototyping with minimal checks. |
| `/claude-vibe-flow:deep` | Enables DeepWork mode - complex tasks with detailed planning. |
| `/claude-vibe-flow:action` | Enables Action mode - extreme bias toward action, anti-paralysis. |

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

[MIT](LICENSE)
