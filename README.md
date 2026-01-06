# Claude Vibe Flow

[한국어](README.ko.md) | **English**

A lightweight framework for [Claude Code](https://github.com/anthropics/claude-code) that enforces test discipline and streamlines development workflows.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![npm version](https://img.shields.io/npm/v/claude-vibe-flow)](https://www.npmjs.com/package/claude-vibe-flow)

## Features

- **Test Enforcement**: Session cannot exit if tests weren't run after code changes
- **3 Focused Agents**: planner, reviewer, debugger
- **4 Essential Commands**: /plan, /review, /ship, /check
- **Pre-commit Verification**: Diagnostics + tests + TODOs checked before commit

## Installation

### For Existing Projects
```bash
cd your-project
npx claude-vibe-flow
claude
```

### For New Projects
```bash
mkdir my-app && cd my-app
git init
npx claude-vibe-flow
claude
```

## Usage

### Planning
```bash
/plan "Add user authentication"
```
Turns vague ideas into concrete specs with MVP scope.

### Code Review
```bash
/review                    # Review all changes
/review src/auth.ts        # Review specific file
```

### Ship (Commit + Push + PR)
```bash
/ship                      # Verify → commit → push → PR
/ship "feat: add auth"     # With custom message
```

### Check Status
```bash
/check                     # Full verification status
```

## Test Enforcement

The core feature. When you change code:

1. **Skill reminds**: After implementation, Claude runs tests
2. **Hook blocks**: If you try to exit without running tests, session blocks

```bash
# Escape hatch (use sparingly)
export SKIP_TEST_CHECK=1
```

## Directory Structure

```
your-project/
├── .claude/
│   ├── agents/
│   │   ├── planner.md         # Idea → concrete spec
│   │   ├── reviewer.md        # Code review
│   │   └── debugger.md        # Bug fixing
│   ├── commands/
│   │   ├── plan.md, review.md, ship.md, check.md
│   ├── skills/
│   │   ├── test-enforcer/SKILL.md
│   │   └── verify-before-commit/SKILL.md
│   ├── scripts/
│   │   ├── check-tests-ran.sh      # Blocking hook
│   │   ├── detect-test-framework.sh
│   │   ├── load-context.sh
│   │   └── run-tests.sh
│   └── hooks.json              # SessionStart, Stop, PostToolUse
└── .mcp.json                   # MCP servers config
```

## Agents

| Agent | Triggers On | Purpose |
|-------|-------------|---------|
| `planner` | "I want to build...", "Help me plan..." | Turn ideas into specs |
| `reviewer` | "Review my code", "Check this PR" | Code review |
| `debugger` | "It's broken", "Getting an error" | Bug fixing |

## Commands

| Command | Description |
|---------|-------------|
| `/plan` | Plan a new feature |
| `/review` | Request code review |
| `/ship` | Commit + push + create PR |
| `/check` | Show verification status |

## Supported Test Frameworks

Auto-detected:
- **Node.js**: Jest, Vitest, Mocha
- **Python**: Pytest
- **Go**: go test
- **Rust**: cargo test
- **Ruby**: RSpec, Minitest

Custom: Create `.claude-vibe-flow/test-command.txt` with your test command.

## MCP Servers

Pre-configured in `.mcp.json`:
- **Context7**: Documentation lookup
- **GitHub**: Issues and PRs (requires `GITHUB_TOKEN`)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE)
