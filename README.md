# Claude Vibe Flow

[한국어](README.ko.md) | **English**

A lightweight framework for [Claude Code](https://github.com/anthropics/claude-code) that streamlines development workflows with specialized agents and commands.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![npm version](https://img.shields.io/npm/v/claude-vibe-flow)](https://www.npmjs.com/package/claude-vibe-flow)

## Features

- **8 Specialized Agents**: cvf-planner, cvf-reviewer, cvf-debugger, cvf-architect, cvf-security, cvf-performance, cvf-researcher, cvf-ui-ux
- **5 Essential Commands**: /cvf:plan, /cvf:review, /cvf:ship, /cvf:check, /cvf:workflow
- **Pre-commit Verification**: Diagnostics + tests + TODOs checked before commit
- **Multi-Agent Workflows**: Coordinate agents for complex features

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
/cvf:plan "Add user authentication"
```
Turns vague ideas into concrete specs with MVP scope.

### Code Review
```bash
/cvf:review                    # Review all changes
/cvf:review src/auth.ts        # Review specific file
```

### Ship (Commit + Push + PR)
```bash
/cvf:ship                      # Verify → commit → push → PR
/cvf:ship "feat: add auth"     # With custom message
```

### Check Status
```bash
/cvf:check                     # Full verification status
```

### Multi-Step Workflow
```bash
/cvf:workflow feature "Add user auth"   # Standard feature workflow
/cvf:workflow secure "Payment flow"     # Security-focused workflow
/cvf:workflow audit                     # Pre-release audit
```
Coordinates multiple agents for complex tasks.

## Directory Structure

```
your-project/
├── .claude/
│   ├── agents/
│   │   ├── cvf-planner.md     # Idea → concrete spec
│   │   ├── cvf-reviewer.md    # Code review
│   │   ├── cvf-debugger.md    # Bug fixing
│   │   ├── cvf-architect.md   # System architecture
│   │   ├── cvf-security.md    # Security analysis
│   │   ├── cvf-performance.md # Performance optimization
│   │   ├── cvf-researcher.md  # External research
│   │   └── cvf-ui-ux.md       # UI/UX design
│   ├── commands/
│   │   ├── cvf:plan.md, cvf:review.md, cvf:ship.md, cvf:check.md, cvf:workflow.md
│   ├── skills/
│   │   └── verify-before-commit/SKILL.md
│   ├── scripts/
│   │   ├── detect-test-framework.sh
│   │   ├── load-context.sh
│   │   └── run-tests.sh
│   └── hooks.json              # SessionStart hook
└── .mcp.json                   # MCP servers config
```

## Agents

| Agent | Triggers On | Purpose |
|-------|-------------|---------|
| `cvf-planner` | "I want to build...", "Help me plan..." | Turn ideas into specs |
| `cvf-reviewer` | "Review my code", "Check this PR" | Code review |
| `cvf-debugger` | "It's broken", "Getting an error" | Bug fixing |
| `cvf-architect` | "How should I structure...", "Design this..." | System architecture |
| `cvf-security` | "Is this secure?", "Adding auth..." | Security analysis |
| `cvf-performance` | "This is slow", "Optimize..." | Performance tuning |
| `cvf-researcher` | "What library should I use?", "Best practices for..." | External research |
| `cvf-ui-ux` | "Design a component", "Make this look better" | UI/UX design |

## Commands

| Command | Description |
|---------|-------------|
| `/cvf:plan` | Plan a new feature |
| `/cvf:review` | Request code review |
| `/cvf:ship` | Commit + push + create PR |
| `/cvf:check` | Show verification status |
| `/cvf:workflow` | Execute multi-agent workflow |

## Running Tests (Optional)

Tests can be run manually when needed:

```bash
bash .claude/scripts/run-tests.sh
```

Auto-detected frameworks:
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
