# CLAUDE.md - claude-vibe-flow

## Project Overview

A lightweight framework for Claude Code that enforces test discipline and streamlines development workflows.

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
├── agents/                       # 3 specialized agents
│   ├── planner.md               # Idea → spec
│   ├── reviewer.md              # Code review
│   └── debugger.md              # Bug fixing
├── skills/                       # Model-invoked
│   ├── test-enforcer/SKILL.md   # Runs tests after implementation
│   └── verify-before-commit/SKILL.md
├── commands/                     # User-invoked
│   ├── plan.md, review.md, ship.md, check.md
├── scripts/                      # Hook scripts
│   ├── check-tests-ran.sh       # Exit code 2 = block
│   ├── detect-test-framework.sh
│   ├── load-context.sh
│   └── run-tests.sh             # Test runner with auto-marker
└── hooks.json                    # Deterministic enforcement
```

## Core Concept

```
Claude implements → Skills remind → Hooks enforce
```

- **Claude**: Does the implementation (native capability)
- **Skills**: Remind to run tests after code changes
- **Hooks**: Block session exit if tests weren't run

## Hooks

| Hook | Trigger | Behavior |
|------|---------|----------|
| `SessionStart` | Session begins | Load context from `.claude-vibe-flow/` |
| `PostToolUse` | After Edit/Write | Reminder to run tests |
| `Stop` | Session exit attempt | **BLOCK** if tests not run (exit code 2) |

## Skills

Skills are auto-invoked by Claude based on context.

### test-enforcer
- Triggers after: "implement", "add", "create", "fix", code changes
- **Recommended**: Use `run-tests.sh` wrapper for automatic marker creation
- Detects test framework
- Runs tests
- Creates marker file for Stop hook

### verify-before-commit
- Triggers before: "commit", "push", "ship", "PR"
- Checks: diagnostics, tests, TODOs, formatting

## Agents

| Agent | Use When |
|-------|----------|
| `planner` | Vague idea needs structure |
| `reviewer` | Explicit code review request |
| `debugger` | Bug reports, errors |

## Commands

| Command | Action |
|---------|--------|
| `/plan "idea"` | Create implementation spec |
| `/review` | Code review on changes |
| `/ship` | Verify → commit → push → PR |
| `/check` | Show verification status |

## Test Enforcement Flow

```
1. User writes code (Edit/Write)
2. PostToolUse hook: "Remember to run tests"
3. test-enforcer skill: Detects framework, runs tests, creates marker
4. User tries to exit
5. Stop hook: Checks marker file
   - Marker exists → Allow exit
   - No marker + code changed → BLOCK (exit 2)
```

## Escape Hatches

```bash
# Skip test check for this session
export SKIP_TEST_CHECK=1

# Custom test command
echo "npm run test:unit" > .claude-vibe-flow/test-command.txt
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
