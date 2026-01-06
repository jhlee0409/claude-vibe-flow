# Contributing to Claude Vibe Flow

Thanks for your interest in contributing!

## Requirements

### Node.js

| Version | Status |
|---------|--------|
| Node.js 22+ | Recommended |
| Node.js 20-21 | Supported |
| Node.js < 20 | Not supported |

```bash
node --version  # Check your version
nvm use 22      # Switch to Node 22 (if using nvm)
```

## Project Structure

```
.claude-plugin/
└── plugin.json         # Plugin manifest
agents/                 # 3 specialized agents
commands/               # 4 user commands
skills/                 # 2 skills
hooks/
└── hooks.json          # Hook definitions
scripts/                # Shell scripts for hooks
```

## How to Contribute

1. **Fork the repo** and create your branch from `main`
2. **Add your changes**:
   - Agents go in `agents/`
   - Commands go in `commands/`
   - Skills go in `skills/<name>/SKILL.md`
3. **Update `.claude-plugin/plugin.json`** if needed
4. **Run tests**: `npm test`
5. **Submit a Pull Request**

## File Formats

### Agent Format

```markdown
---
name: your-agent-name
description: |
  Use this agent when...
  
  <example>
  Context: ...
  user: "..."
  assistant: "..."
  <commentary>...</commentary>
  </example>
model: inherit
color: cyan
tools: ["Read", "Grep", "Glob", "Bash"]
---

# Agent Title

You are a specialist in [domain].

## Workflow
1. [Step 1]
2. [Step 2]
```

### Skill Format

```markdown
---
name: skill-name
version: 1.0.0
description: |
  This skill should be used when...
allowed-tools: Bash, Read
---

# Skill Title

Instructions for the skill...
```

### Command Format

```markdown
---
name: command-name
description: Brief description
---

# /command Command

Documentation for the command...
```

## Testing

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run typecheck     # Type check
npm run build         # Build CLI
```

## Code Style

- Keep files focused on one responsibility
- Document non-obvious behavior
- Follow existing patterns in the codebase
