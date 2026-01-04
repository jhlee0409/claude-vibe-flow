# Claude Code ClaudeVibeFlow

Generic agent and command plugins for Full Vibe Coding using Claude Code.

[한국어 문서 (Korean Documentation)](file:///Users/jack/client/claude-vibe-flow/README.ko.md)

## Installation

### Method 1: Plugin Marketplace (Recommended)

```bash
# Add marketplace (GitHub repository)
/plugin marketplace add your-org/claude-vibe-flow

# Install plugin
/plugin install claude-vibe-flow

# Install project-scoped (optional)
/plugin install claude-vibe-flow --scope project
```

### Method 2: Local Development/Testing

```bash
# Run as local plugin
claude --plugin-dir ./claude-vibe-flow

# Validate plugin
claude plugin validate ./claude-vibe-flow
```

### Method 3: Manual Copy (Legacy)

```bash
# Copy agents only
cp -r claude-vibe-flow/agents/ your-project/.claude/agents/

# Copy commands
cp -r claude-vibe-flow/commands/ your-project/.claude/commands/
```

---

## Structure (Official Plugin Format)

```
claude-vibe-flow/
├── .claude-plugin/
│   └── plugin.json           # Plugin metadata (Required)
├── config/
│   └── intent-routing.md     # Intent-to-Agent mapping rules
├── agents/                   # Sub-agents (15+)
│   ├── git-guardian.md
│   ├── issue-fixer.md
│   ├── code-reviewer.md
│   ├── pm-orchestrator.md
│   └── ...
├── commands/                 # Slash commands
│   ├── new-feature.md
│   └── check-setup.md
└── README.md
```

---

## Intent-Based Routing

Automatically selects agents based on **Verb + Context** combinations in `config/intent-routing.md`.

### Key Verb Patterns

| Verb | Context | Agent |
|------|----------|----------|
| **Review** | Code, PR | `code-reviewer` |
| **Validate** | Test, Quality | `test-quality-validator` |
| **Validate** | Types, Sync | `type-sync-checker` |
| **Validate** | Security, Masking | `security-validator` |
| **Check** | Agent Status | `agent-manager` |
| **Check** | Code Existence | Direct Grep/Read |
| **Create** | Feature, Component | `pm-orchestrator` → Decision |
| **Fix** | Bug, Error | `issue-fixer` |

### Examples

```bash
"Review the code"     → code-reviewer
"Validate types"      → type-sync-checker
"Validate security"   → security-validator
"Check agents"        → agent-manager
"Check this function" → Direct Grep (No agent needed)
```

> See `config/intent-routing.md` for detailed rules.

---

## Agent List

### 🔴 Critical

| Agent | Description | Trigger |
|----------|------|--------|
| `git-guardian` | Git workflow automation | Session start, commit request |
| `issue-fixer` | Bug fixing expert | Error, bug, fix, debug |
| `code-reviewer` | Code review | Automatic after code change |
| `test-generator` | Test generation | test, coverage |

### 🟡 Quality

| Agent | Description | Trigger |
|----------|------|--------|
| `test-quality-validator` | Test quality validation | After test creation |
| `context-optimizer` | Token optimization | Context 50%+ |

### 🟢 Orchestration

| Agent | Description | Trigger |
|----------|------|--------|
| `pm-orchestrator` | Request analysis/routing | Complex feature requests |
| `planner` | Requirement clarification | Ambiguous requests |
| `architect` | Technical design | Architecture decisions |
| `spec-validator` | Spec completeness validation | Before implementation starts |
| `vibe-implementer` | Fast implementation | Clear implementation requests |
| `task-manager` | Task lifecycle management | Session start/end |

### 🔵 Meta

| Agent | Description | Trigger |
|----------|------|--------|
| `agent-manager` | Agent ecosystem management | Agent-related requests |
| `docs-sync` | Internal docs sync | After implementation completion |
| `readme-sync` | README sync | Public API changes |

---

## Command Usage

### new-feature command

```bash
/claude-vibe-flow:new-feature "feature-name"
```

Automatically executes the full implementation workflow:
1. Requirement Analysis
2. Technical Design
3. Branch Creation
4. Implementation
5. Testing
6. Review
7. Commit

### check-setup command

```bash
/claude-vibe-flow:check-setup
```

Verifies plugin installation status and dependencies.

---

## Example CLAUDE.md for Projects

```markdown
# CLAUDE.md - Your Project

## Automatic Sub-agent Selection

| Trigger | Agent |
|--------|----------|
| bug, error, fix | `issue-fixer` |
| test | `test-generator` |
| After code change | `code-reviewer` |
| Session start | `git-guardian` |

## Quick Reference

\`\`\`bash
npm run dev      # Development server
npm run build    # Build
npm run test     # Test
npm run lint     # Lint
\`\`\`

## Core Rules

- Read relevant files before changing code
- Run validation commands after changes
- Follow existing patterns
```

---

## Customization Guide

### Adding an Agent

```markdown
# agents/my-custom-agent.md

---
name: my-custom-agent
description: Description. AUTOMATICALLY triggered conditions.
tools: Read, Grep, Glob
model: sonnet
---

# Agent Content
```

### Project-Specific Agents (Optional)

The following were excluded from the generic template:

- `security-validator` - Security masking patterns (Project-specific)
- `type-sync-checker` - Type synchronization (Depends on project structure)
- `api-integration` - API schema validation (Project-specific)
- `i18n-validator` - Multi-language validation (Project-specific)
- `vercel-constraint-checker` - Vercel-specific constraints

---

## CLI Command Reference

```bash
# Installation/Management
/plugin install claude-vibe-flow
/plugin uninstall claude-vibe-flow
/plugin enable claude-vibe-flow
/plugin disable claude-vibe-flow
/plugin update claude-vibe-flow

# Development/Debug
claude --plugin-dir ./claude-vibe-flow
claude plugin validate .
claude --debug
```

---

## Installation Checklist

- [ ] Run `/plugin install claude-vibe-flow`
- [ ] Add agent table to `CLAUDE.md`
- [ ] Add Quick Reference
- [ ] Create project-specific agents (if needed)

---

## License

MIT
