# CLAUDE.md - claude-vibe-flow

## Project Overview

A universal agent and command plugin for Claude Code. Provides persistent context management, automated development workflows, and 21 specialized agents for vibe coding.

**Version**: 1.1.0  
**Node.js**: >= 20.0.0 (22+ recommended)  
**Repository**: https://github.com/jhlee0409/claude-vibe-flow

**Structure:**
```
claude-vibe-flow/
├── .claude-plugin/
│   └── plugin.json             # Plugin definition (21 agents, 13 commands)
├── hooks/
│   └── hooks.json              # Hook settings (verification loop)
├── agents/                     # 21 specialized agents
├── commands/                   # 13 slash commands (including modes)
├── skills/                     # Skills (research)
├── outputStyles/               # Quality styles (3 patterns)
├── scripts/
│   ├── load-context.sh         # SessionStart hook context loader
│   └── generate-agent-graph.ts # Agent dependency graph generator
├── src/
│   └── cli.ts                  # npx CLI installer
├── tests/
│   └── unit/                   # Vitest validation tests
└── docs/
    ├── active-spec-protocol.md # Spec state machine protocol
    └── agent-dependency-graph.md # Agent relationship graph
```

---

## Quick Reference

```bash
# Installation (for existing projects)
npx claude-vibe-flow

# Local development
claude --plugin-dir ./claude-vibe-flow

# Plugin validation
claude plugin validate ./claude-vibe-flow

# Run tests
npm test

# Type checking
npm run typecheck
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
Today's date: 2026-01-06
</env>

❌ Wrong: "Written: 2025-01-06" (based on knowledge cutoff)
✅ Correct: "Written: 2026-01-06" (based on env)

❌ Wrong: "React best practices" search
✅ Correct: "React best practices 2026" search
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
| **Hook Level** | `hooks.json` | PreToolUse check before Read/Grep/Glob/task |
| **Agent Level** | `planner.md`, `architect.md`, `vibe-orchestrator.md` | Hard limits on exploration |
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
| `SessionStart` | Session start | Auto-load context via `scripts/load-context.sh` |
| `PreToolUse` | Before Edit/Write/Read/Grep/Glob/task | File protection + exploration checkpoint |
| `PostToolUse` | After Edit/Write | lsp_diagnostics + formatting reminder |
| `SubagentStop` | After subagent completes | Verify subagent output |
| `Stop` | Session end attempt | TODO/verification/test check |

**Stop hook verification**: TODO complete + lsp_diagnostics clean + Tests run + Formatting done

---

## 🤖 Agent List (21 agents)

### Core Orchestration
| Agent | Description |
|-------|-------------|
| `vibe-orchestrator` | Routes user requests to appropriate agents |
| `idea-shaper` | Transforms vague ideas into validated, actionable specifications |
| `planner` | Clarifies requirements through Socratic dialogue |
| `architect` | Technical feasibility and architectural decisions |
| `vibe-implementer` | Fast implementation across all domains |
| `frontend-implementer` | Frontend specialist (React 19, Vue 3.5, Svelte 5) |
| `ui-ux-designer` | UI/UX design, design systems, accessibility audits |

### Quality & Verification
| Agent | Description |
|-------|-------------|
| `spec-validator` | Validates specification completeness |
| `code-reviewer` | Code quality, security, performance review |
| `test-generator` | Test generation across all technical domains |
| `test-quality-validator` | Test quality and bug detection assessment |
| `code-simplifier` | Complexity reduction while preserving behavior |

### Context & Documentation
| Agent | Description |
|-------|-------------|
| `context-manager` | Codebase mapping and architecture documentation |
| `context-optimizer` | Token efficiency and context window optimization |
| `docs-sync` | Automatic CLAUDE.md synchronization |
| `readme-sync` | README synchronization for public APIs |
| `task-manager` | Task lifecycle and session handoff |

### Utility & Support
| Agent | Description |
|-------|-------------|
| `git-guardian` | Git workflow automation (`vibe/*` branching) |
| `issue-fixer` | Bug fixing through root cause analysis |
| `research-agent` | Version-aware documentation lookup |
| `agent-manager` | Agent ecosystem health and synchronization |

Dependency graph: `docs/agent-dependency-graph.md`

---

## 📋 Commands (13 commands)

### Workflow Commands
| Command | Description |
|---------|-------------|
| `/claude-vibe-flow:vibe` | Unified command: idea → plan → implement (full pipeline by default) |
| `/claude-vibe-flow:vibe --idea` | Idea validation only |
| `/claude-vibe-flow:vibe --plan` | Requirements and architecture only |
| `/claude-vibe-flow:vibe --implement` | Direct implementation only |
| `/claude-vibe-flow:fix-bug` | Direct bug fixing with root cause analysis |
| `/claude-vibe-flow:refactor` | Code restructuring without behavior changes |
| `/claude-vibe-flow:init` | Initialize `.claude-vibe-flow/` directory |
| `/claude-vibe-flow:sync-context` | Refresh codebase context map |
| `/claude-vibe-flow:resume` | Manually load context from previous session |
| `/claude-vibe-flow:commit-push-pr` | One-shot: commit → push → create PR |

### Mode Commands
| Command | Description |
|---------|-------------|
| `/claude-vibe-flow:verify` | Enable Verification mode |
| `/claude-vibe-flow:fast` | Enable FastVibe mode |
| `/claude-vibe-flow:deep` | Enable DeepWork mode |
| `/claude-vibe-flow:action` | Enable Action mode (anti-paralysis) |

### Utility Commands
| Command | Description |
|---------|-------------|
| `/claude-vibe-flow:check` | Validate environment (--setup, --mcp flags) |
| `/claude-vibe-flow:ask` | Q&A about codebase or libraries |

---

## 🔌 MCP Servers

Pre-configured in `.mcp.json`:

| Server | Purpose | Auto-Start |
|--------|---------|------------|
| `context7` | Documentation lookup (prevents hallucinations) | ✅ |
| `github` | GitHub integration (issues, PRs) | ✅ (requires `GITHUB_TOKEN`) |
| `sequential-thinking` | Chain of Thought workspace | ✅ |

---

## 🚀 Full Vibe Coding Mode

Agents are **role guides**, and Claude automatically switches roles while executing the pipeline.

```
Request → [IDEA] idea-shaper → [PLAN] planner → [DESIGN] architect → [IMPLEMENT] vibe-implementer → [TEST] test-generator → [REVIEW] code-reviewer → ✅
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
- **No exit without Active Context**: Never exit after modifying code without updating the spec file

---

## 🧪 Testing

### Test Suites

| Test | Description |
|------|-------------|
| `validate-agents.test.ts` | Agent markdown structure (frontmatter, sections) |
| `validate-commands.test.ts` | Command markdown structure |
| `validate-plugin.test.ts` | plugin.json integrity (sync with agents/commands) |
| `validate-hooks.test.ts` | Hook system structure |
| `cli-e2e.test.ts` | CLI installation flow |

### Running Tests

```bash
npm test                    # Run all tests
npm run test:watch          # Watch mode
npm run test:coverage       # Coverage report
npm run validate            # Verbose output
```

### Validation Requirements

- **Agents**: Must have `name`, `description`, `tools` frontmatter
- **Agents**: Must have Principles/Goal, Constraints/Instructions, Linked Agents sections
- **Commands**: Must have `name`, `description` frontmatter
- **plugin.json**: Must reference all agents and commands in directories

---

## Output Styles (Official Patterns)

Activate quality styles that match your project characteristics.

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

## 📖 Skills

| Skill | Description | Delegation |
|-------|-------------|------------|
| `research` | Version-aware documentation lookup | Delegates to `research-agent` |

Usage: `/research [query]`, `/research --latest [query]`, `/research --version N [query]`

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

**Command**: `/claude-vibe-flow:vibe --plan <feature-description>`

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

---

## Development

### Adding New Agents

1. Create `agents/your-agent.md` with frontmatter:
   ```markdown
   ---
   name: your-agent
   description: One-line description
   tools: Read, Write, Bash, Glob, Grep
   ---
   ```
2. Add required sections: Goal/Principles, Constraints/Instructions, Linked Agents
3. Update `.claude-plugin/plugin.json` to include the new agent
4. Run `npm test` to validate structure

### Adding New Commands

1. Create `commands/your-command.md` with frontmatter
2. Update `.claude-plugin/plugin.json`
3. Run `claude plugin validate ./`

### Regenerating Agent Graph

```bash
npx ts-node scripts/generate-agent-graph.ts
```

---

## Changelog

- **v1.1.0**: Added `/vibe` unified command and `idea-shaper` agent. Removed legacy `/new-feature` and `/plan` commands.
- **v1.0.0**: Initial release with 18 agents, 15 commands, 5 hooks, 3 MCP servers
