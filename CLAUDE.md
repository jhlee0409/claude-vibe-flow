# CLAUDE.md - claude-vibe-flow

## Project Overview

A universal agent and command plugin for Claude Code.

**Structure:**
```
claude-vibe-flow/
├── .claude-plugin/
│   └── plugin.json             # Plugin definition
├── hooks/
│   └── hooks.json              # Hook settings (verification loop)
├── agents/                     # 17 agents
├── commands/                   # 12 slash commands (including modes)
├── skills/                     # Skills
└── outputStyles/               # Quality styles
```

---

## 🕐 Temporal Awareness (Required)

**Knowledge cutoff ≠ Current date**

Claude's training data is up to January 2025, but the actual date may differ.

### Rules

1. **Before writing dates/years** → Check `Today's date` in `<env>`
2. **When researching** → Use search queries based on current year
3. **When mentioning "latest", "current"** → Judge based on env date
4. **When writing documents** → Extract date from env

### Example

```
<env>
Today's date: 2026-01-05
</env>

❌ Wrong: "Written: 2025-01-05" (based on knowledge cutoff)
✅ Correct: "Written: 2026-01-05" (based on env)

❌ Wrong: "React best practices" search
✅ Correct: "React best practices 2026" search
```

---

## Quick Reference

```bash
# Local testing
claude --plugin-dir ./claude-vibe-flow

# Plugin validation
claude plugin validate ./claude-vibe-flow
```

---

## 🎨 Mode System

| Mode | Purpose | Activation |
|------|---------|------------|
| `Verification` | Enforce thorough verification | `/claude-vibe-flow:verify` |
| `FastVibe` | Rapid prototyping | `/claude-vibe-flow:fast` |
| `DeepWork` | Complex tasks | `/claude-vibe-flow:deep` |

| Aspect | Verification | FastVibe | DeepWork |
|--------|--------------|----------|----------|
| Planning | Default | Minimal | Thorough |
| lsp_diagnostics | Every edit | Final only | Every edit |
| TODO tracking | Required | Optional | Detailed |
| Testing | Required | Deferred | Step-by-step |

---

## 🔧 Claude Code Built-in Tools (MUST)

| Tool | Purpose | When to Use |
|------|---------|-------------|
| `lsp_diagnostics` | Check errors/warnings | After every Edit/Write |
| `lsp_find_references` | Impact analysis | Before refactoring |
| `lsp_rename` | Safe renaming | When renaming symbols |
| `lsp_goto_definition` | Definition navigation | When tracking bugs |
| `ast_grep_search` | Pattern search | Large-scale code analysis |
| `todowrite` | Task tracking | When starting complex tasks |

### Verification Loop (Core Pattern)

```
Edit/Write → lsp_diagnostics → Fix if errors → Re-verify → Proceed when clean
```

---

## 🪝 Hook System

| Hook | Trigger | Action |
|------|---------|--------|
| `SessionStart` | Session start | Auto-load context |
| `PostToolUse` | After Edit/Write | lsp_diagnostics reminder |
| `Stop` | Session end attempt | TODO/verification/test check |

**Stop hook verification**: TODO complete + lsp_diagnostics clean + Tests run

---

## Agent List

| Category | Agents |
|----------|--------|
| **Core** | `git-guardian`, `issue-fixer`, `code-reviewer`, `test-generator` |
| **Quality** | `test-quality-validator`, `context-optimizer`, `context-manager` |
| **Orchestration** | `pm-orchestrator`, `planner`, `architect`, `spec-validator`, `vibe-implementer`, `task-manager` |
| **Meta** | `agent-manager`, `docs-sync`, `readme-sync`, `research-agent` |

Dependency graph: `docs/agent-dependency-graph.md`

---

## 🚀 Full Vibe Coding Mode

Agents are **role guides**, and Claude automatically switches roles while executing the pipeline.

```
Request → [INTAKE] planner → [PLAN] architect → [IMPLEMENT] vibe-implementer → [TEST] test-generator → [REVIEW] code-reviewer → ✅
```

| Principle | Description |
|-----------|-------------|
| No hardcoding | Never hardcode tool names, paths, patterns |
| Auto-detection | Determine tools by analyzing project config files |
| Pattern learning | Follow existing codebase patterns |

---

## Core Rules

### ✅ Required (MUST)
- Read existing files before modifying agents
- Keep `plugin.json` and agent list in sync
- Utilize automatic routing based on agent descriptions
- **Active Context Sync**: All agents must keep `.claude-vibe-flow/active_spec.md` up to date
  - Detailed protocol: See `docs/active-spec-protocol.md`
  - Section ownership, state transitions, and agent-specific rules defined

### ❌ Forbidden (NEVER)
- Circular references between agents
- Hardcoded project paths
- Project-specific logic (maintain generality)
- **No exit without Active Context**: Never exit after modifying code without updating the spec file.

---

## Output Styles (Official Patterns)

You can activate quality styles that match your project characteristics.

| Style | Purpose | Suitable Projects |
|-------|---------|-------------------|
| `production-ready` | Deployment quality check | Production services |
| `frontend-quality` | SEO, accessibility, performance | Web applications |
| `security-hardened` | Security hardening | APIs, authentication systems |

### Usage

Specify styles in your project's CLAUDE.md:
```markdown
## Output Styles
- production-ready
- frontend-quality
```

Details: `outputStyles/README.md`
