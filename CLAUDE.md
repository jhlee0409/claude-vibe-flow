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
├── agents/                     # 18 agents
├── commands/                   # 14 slash commands (including modes)
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
| `Action` | Anti-paralysis, extreme action bias | `/claude-vibe-flow:action` |

| Aspect | Verification | FastVibe | DeepWork | Action |
|--------|--------------|----------|----------|--------|
| Planning | Default | Minimal | Thorough | None |
| lsp_diagnostics | Every edit | Final only | Every edit | Final only |
| TODO tracking | Required | Optional | Detailed | Skip |
| Testing | Required | Deferred | Step-by-step | Skip |
| File reads before acting | Unlimited | ~10 | Unlimited | MAX 3 |
| Questions allowed | As needed | 1-2 | As needed | MAX 1 |

---

## 🛡️ Anti-Analysis Paralysis

**Problem**: AI agents can get stuck in infinite analysis loops, reading files repeatedly without taking action.

**Solution**: Multi-layer defense system built into this plugin.

### Defense Layers

| Layer | Location | Mechanism |
|-------|----------|-----------|
| **Hook Level** | `hooks.json` | PreToolUse check before Read/Grep/Glob |
| **Agent Level** | `planner.md`, `architect.md`, `pm-orchestrator.md` | Hard limits on exploration |
| **Mode Level** | `/action` command | Extreme action bias mode |

### Key Limits

| Resource | Limit | Enforced By |
|----------|-------|-------------|
| File explorations | MAX 5-7 | Hook + Agent rules |
| Clarification rounds | MAX 3 | Planner agent |
| Options to analyze | MAX 3 | Architect agent |
| Pipeline length | MAX 4 agents | PM Orchestrator |

### When Stuck

If you notice repeated file reads without progress:
1. Use `/claude-vibe-flow:action` to force action mode
2. Or explicitly say: "Stop analyzing, just implement with assumptions"

### Philosophy

```
"Imperfect action beats perfect inaction."
"80% confidence is enough to proceed."
"Ship it, then fix it."
```

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
| `PreToolUse` | Before Edit/Write | File protection check |
| `PostToolUse` | After Edit/Write | lsp_diagnostics + formatting reminder |
| `SubagentStop` | After subagent completes | Verify subagent output |
| `Stop` | Session end attempt | TODO/verification/test check |

**Stop hook verification**: TODO complete + lsp_diagnostics clean + Tests run + Formatting done

---

## Agent List

| Category | Agents |
|----------|--------|
| **Core** | `git-guardian`, `issue-fixer`, `code-reviewer`, `test-generator` |
| **Quality** | `test-quality-validator`, `context-optimizer`, `context-manager` |
| **Orchestration** | `pm-orchestrator`, `planner`, `architect`, `spec-validator`, `vibe-implementer`, `task-manager` |
| **Meta** | `agent-manager`, `docs-sync`, `readme-sync`, `research-agent`, `code-simplifier` |

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

---

## Pro Tips (from Claude Code Creator Boris Cherny)

### Recommended Model
- Use **Opus 4.5 with thinking** for all tasks
- Larger and slower, but requires less steering and produces better results

### Parallel Execution
- Run **5 Claude instances** in terminal (use tabs numbered 1-5)
- Run **5-10 additional instances** on claude.ai/code
- Use system notifications to know when input is needed

### Plan Mode Workflow
```
1. Start most sessions in Plan mode (Shift+Tab twice)
2. Iterate with Claude until plan is satisfactory
3. Switch to auto-accept mode
4. Claude usually completes in one shot
```

**Command**: `/claude-vibe-flow:plan <feature-description>`

### Inner Loop Commands
Use slash commands for workflows you repeat many times a day:
- `/claude-vibe-flow:commit-push-pr` - Commit, push, and create PR in one shot

### Subagent Workflows
- `code-simplifier` - Run after implementation to reduce complexity
- `code-reviewer` - Proactive code review after changes

### The Most Important Tip: Verification Feedback Loop

> "The single most important factor for great results: Give Claude a way to verify its work."

This feedback loop **2-3x improves** final output quality:
- Run tests after implementation
- Use `lsp_diagnostics` after every edit
- Test UI changes in browser (Chrome extension)

### Permissions Setup
Use `/permissions` to pre-allow common safe commands:
```
Bash(npm run lint)
Bash(npm run test:*)
Bash(git:*)
```

This avoids permission prompts without using `--dangerously-skip-permissions`.
