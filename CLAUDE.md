# CLAUDE.md - claude-vibe-flow

## Project Overview

A lightweight framework for Claude Code that streamlines development workflows with specialized agents and commands.

**Version**: 1.0.0  
**Node.js**: >= 20.0.0  
**Repository**: https://github.com/jhlee0409/claude-vibe-flow

## Quick Reference

```bash
# Installation
npx claude-vibe-flow

# Development
npm run build        # Compile TypeScript
npm test            # Run tests
npm run typecheck   # Type check
```

## Architecture

```
.claude/
├── agents/                       # 9 specialized agents
│   ├── cvf-orchestrator.md      # Master coordinator (vibe coding)
│   ├── cvf-planner.md           # Idea → spec
│   ├── cvf-reviewer.md          # Code review
│   ├── cvf-debugger.md          # Bug fixing
│   ├── cvf-architect.md         # System architecture
│   ├── cvf-security.md          # Security analysis
│   ├── cvf-performance.md       # Performance optimization
│   ├── cvf-researcher.md        # External research
│   └── cvf-ui-ux.md             # UI/UX design
├── skills/                       # Model-invoked
│   └── verify-before-commit/SKILL.md
├── commands/                     # User-invoked
│   ├── cvf:plan.md, cvf:review.md, cvf:ship.md, cvf:check.md, cvf:workflow.md
├── scripts/                      # Utility scripts
│   ├── detect-test-framework.sh
│   ├── load-context.sh
│   └── run-tests.sh             # Optional test runner
└── hooks.json                    # SessionStart hook
```

## Core Concept

```
Claude implements → Agents assist → Commands orchestrate
```

- **Claude**: Does the implementation (native capability)
- **Agents**: Specialized assistants for specific domains
- **Commands**: User-invoked workflows

## Hooks

| Hook | Trigger | Behavior |
|------|---------|----------|
| `SessionStart` | Session begins | Load context from `.claude-vibe-flow/` |

## Skills

Skills are auto-invoked by Claude based on context.

### verify-before-commit
- Triggers before: "commit", "push", "ship", "PR"
- Checks: diagnostics, tests, TODOs, formatting

## Agents

| Agent | Use When |
|-------|----------|
| `cvf-orchestrator` | User wants to build a product ("build me...", "make an app...") |
| `cvf-planner` | Vague idea needs structure |
| `cvf-reviewer` | Explicit code review request |
| `cvf-debugger` | Bug reports, errors |
| `cvf-architect` | Architecture decisions, system design |
| `cvf-security` | Security concerns, auth, vulnerabilities |
| `cvf-performance` | Performance issues, optimization |
| `cvf-researcher` | Library selection, best practices lookup |
| `cvf-ui-ux` | UI design, styling, accessibility |

## Commands

| Command | Action |
|---------|--------|
| `/cvf:plan "idea"` | Create implementation spec |
| `/cvf:review` | Code review on changes |
| `/cvf:ship` | Verify → commit → push → PR |
| `/cvf:check` | Show verification status |
| `/cvf:workflow type "desc"` | Execute multi-agent workflow |

## Running Tests (Optional)

```bash
# Use the provided script
bash .claude/scripts/run-tests.sh

# Or run directly
npm test
```

## Development

### File Structure

```
src/cli.ts          # npx installer
tests/unit/         # Vitest tests
docs/               # Migration docs
```

### Adding Features

1. Skills go in `.claude/skills/<name>/SKILL.md`
2. Commands go in `.claude/commands/<name>.md`
3. Agents go in `.claude/agents/<name>.md`

### Testing

```bash
npm test                    # All tests
npm run test:watch          # Watch mode
```
