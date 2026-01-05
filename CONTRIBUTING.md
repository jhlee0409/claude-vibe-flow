# Contributing to Claude Vibe Flow

First off, thanks for taking the time to contribute! Flow with the vibe. 🌊

## Requirements

### Node.js Compatibility

| Version | Status |
|---------|--------|
| Node.js 18+ | ✅ Recommended |
| Node.js 16-17 | ⚠️ Supported (warning shown) |
| Node.js < 16 | ❌ Not supported |

```bash
node --version  # Check your version
nvm use 18      # Switch to Node 18 (if using nvm)
```

## Core Philosophy

1. **Vibe Code Only**: We prioritize "Flow" over "Feature". Does this change make the developer feel more powerful?
2. **MCP First**: If you are adding a capability, try to use an MCP server instead of a complex script.
3. **No Context Dump**: Agents must use `Context7` or `Context Manager` to read files. Do not dump 100 files into the context window.

## How to Contribute

1. **Fork the repo** and create your branch from `main`.
2. **Add your Feature/Agent**.
   - Agents go in `agents/`
   - Commands go in `commands/`
   - Skills go in `skills/`
3. **Update `plugin.json`** if you added new agents/commands.
4. **Run Validation**.
   ```bash
   claude plugin validate ./
   ```
5. **Submit a Pull Request**.

## Developing Agents

### File Format

```markdown
---
name: your-agent-name
description: One-line description of what this agent does.
tools: Read, Write, Bash, Glob, Grep
model: inherit
---

# Agent Title

You are a specialist in [domain].

## When to Trigger
- [Condition 1]
- [Condition 2]

## Workflow
1. [Step 1]
2. [Step 2]
```

### Best Practices

- Always specify `tools:` explicitly
- Use `model: inherit` unless you need a specific model
- Keep descriptions actionable and clear
- Reference other agents when handoff is needed

## Developing Commands

Commands are user-facing entry points. They should:

1. Have a clear, memorable name
2. Include usage examples
3. Delegate to appropriate agents

## Testing Your Changes

```bash
# Run unit tests
npm test

# Type checking
npm run typecheck

# Validate plugin structure
claude plugin validate ./

# Test locally
claude --plugin-dir ./

# Verbose test output
npm run validate
```

### Test Coverage

| Test Suite | Description |
|------------|-------------|
| `validate-agents.test.ts` | Agent markdown structure validation |
| `validate-commands.test.ts` | Command markdown structure validation |
| `validate-plugin.test.ts` | plugin.json integrity checks |
| `validate-hooks.test.ts` | Hook system integration tests |
| `cli-e2e.test.ts` | CLI installation E2E tests |

## Code Style

- Use clear, descriptive names
- Keep agent files focused on one responsibility
- Document any non-obvious behavior
