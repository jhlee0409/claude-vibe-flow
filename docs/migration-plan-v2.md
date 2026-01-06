# Claude Vibe Flow v2: Migration Plan

> **Date**: 2026-01-06  
> **Status**: Approved for Implementation  
> **Target**: 0→1 Makers (Solo developers starting side/toy projects)  
> **Core Problem**: Users always forget to run tests

---

## Executive Summary

Transform claude-vibe-flow from a 22-agent orchestration system into a streamlined Claude Code native architecture.

### Key Metrics

| Metric | Current (v1) | Target (v2) | Improvement |
|--------|--------------|-------------|-------------|
| Agents | 22 | 3 | **86% reduction** |
| Commands | 13 | 4 | **69% reduction** |
| Hook Events | 5 | 3 | **40% reduction** |
| Files to Manage | ~40 | ~10 | **75% reduction** |
| Test Enforcement | Prompt-based (ignorable) | **Blocking hook** | Deterministic |

### Core Philosophy Shift

```
BEFORE: "22 agents orchestrating Claude"
AFTER:  "Claude with guardrails that ensure tests run"
```

---

## 1. Architecture Decision

### Feature Mapping

| User Need | Current Approach | New Approach | Why |
|-----------|------------------|--------------|-----|
| **Test enforcement** | Hook prompts (ignorable) | **Skill + Blocking Hook** | Skill reminds, hook blocks |
| **Workflow orchestration** | 22 agents with handoffs | **3 agents** | Claude handles routing natively |
| **Planning** | planner + architect + idea-shaper + spec-validator | **1 planner agent** | Over-engineered for 0→1 |
| **Implementation** | vibe-implementer + frontend-implementer | **Claude native** | Claude Code is already an implementer |
| **Testing** | test-generator + test-quality-validator | **Skill** (model-invoked) | Auto-triggers post-implementation |
| **Review** | code-reviewer + code-simplifier | **Optional agent** | Only for explicit requests |
| **Git** | git-guardian | **Command** | Simple automation |
| **Context** | context-manager + 5 others | **SessionStart hook** | Over-engineered |

### The Core Insight

> Claude Code is already an expert implementer. The problem isn't implementation—it's **test discipline**.

**New Architecture Principle**: 
- Claude implements
- Skills remind  
- Hooks enforce
- Agents are for complex multi-step reasoning only

---

## 2. New Directory Structure

```
.claude/
├── hooks.json                    # Deterministic enforcement (blocking)
│
├── agents/                       # 3 specialized agents
│   ├── planner.md               # Idea → Spec (combines 4 old agents)
│   ├── reviewer.md              # Code review (on-demand)
│   └── debugger.md              # Bug analysis
│
├── skills/                       # Model-invoked (Claude auto-uses)
│   ├── test-enforcer/
│   │   ├── SKILL.md             # Reminds to run tests
│   │   └── detect-test-runner.sh
│   └── verify-before-commit/
│       └── SKILL.md             # Pre-commit verification
│
├── commands/                     # User-invoked slash commands
│   ├── plan.md                  # /plan "feature"
│   ├── review.md                # /review
│   ├── ship.md                  # /ship (commit + push + PR)
│   └── check.md                 # /check (verification status)
│
└── scripts/                      # Hook scripts
    ├── check-tests-ran.sh       # Blocking hook (exit code 2)
    ├── detect-test-framework.sh
    └── load-context.sh          # SessionStart context loading
```

---

## 3. Component Specifications

### 3.1 Skills (Model-Invoked)

Skills are **automatically triggered by Claude** based on the description field. Unlike commands (user-invoked), Claude decides when to use skills.

#### Skill: `test-enforcer`

**Location**: `.claude/skills/test-enforcer/SKILL.md`

```markdown
---
name: test-enforcer
description: |
  MUST BE USED PROACTIVELY after any code implementation.
  Triggers when user asks to "implement", "add", "create", "build", 
  "write code", "fix", or completes any code changes.
---

# Test Enforcement Skill

After completing any code implementation, you MUST:

1. **Detect test framework**:
   - Check package.json for jest/vitest/mocha
   - Check for pytest/unittest (Python)
   - Check for go.mod (Go) or Cargo.toml (Rust)

2. **Run tests**:
   - Execute the appropriate test command
   - Report actual results (not assumptions)

3. **If no test framework**:
   - Warn user: "No test framework detected. Consider adding tests."

4. **If tests fail**:
   - List failing tests with file:line
   - Suggest fixes before proceeding

## Test Commands by Framework

| Framework | Command |
|-----------|---------|
| Jest | `npm test` or `npx jest` |
| Vitest | `npm test` or `npx vitest run` |
| Pytest | `pytest` |
| Go | `go test ./...` |
| Cargo | `cargo test` |
```

#### Skill: `verify-before-commit`

**Location**: `.claude/skills/verify-before-commit/SKILL.md`

```markdown
---
name: verify-before-commit
description: |
  MUST BE USED PROACTIVELY before any git operations.
  Triggers when user asks to "commit", "push", "ship", "create PR".
---

# Pre-Commit Verification Skill

Before committing code, verify:

## Checklist

1. **Diagnostics**: Run `lsp_diagnostics` on all changed files
2. **Tests**: Confirm tests were run and passed
3. **TODOs**: Check `todoread` for incomplete items
4. **Formatting**: Run project formatter if configured

## Blocking Conditions

DO NOT proceed with commit if:
- lsp_diagnostics shows errors
- Tests have not been run
- Tests are failing
- Critical TODOs are incomplete

## Output Format

```
## Pre-Commit Verification
- Diagnostics: [status]
- Tests: [status]
- TODOs: [status]
- Format: [status]

[Ready to commit / Blocked: reason]
```
```

---

### 3.2 Hooks (Deterministic Blocking)

**Location**: `.claude/hooks.json`

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "bash ${CLAUDE_PROJECT_ROOT}/.claude/scripts/load-context.sh",
            "timeout": 10
          }
        ]
      }
    ],
    "Stop": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "bash ${CLAUDE_PROJECT_ROOT}/.claude/scripts/check-tests-ran.sh",
            "timeout": 30
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'Code changed. Remember to run tests before completing.'"
          }
        ]
      }
    ]
  }
}
```

#### Blocking Script: `check-tests-ran.sh`

**Location**: `.claude/scripts/check-tests-ran.sh`

```bash
#!/bin/bash
# Exit code 2 = BLOCK completion

# Check if any code was modified
changed_files=$(git diff --name-only HEAD 2>/dev/null | grep -E '\.(ts|tsx|js|jsx|py|go|rs)$')

if [ -z "$changed_files" ]; then
  # No code changes, allow exit
  exit 0
fi

# Check for escape hatch
if [ "$SKIP_TEST_CHECK" = "1" ]; then
  echo "Test check skipped (SKIP_TEST_CHECK=1)"
  exit 0
fi

# Check if tests were run (marker file set by test commands)
test_marker="${TMPDIR:-/tmp}/claude-tests-ran-$(date +%Y%m%d)"
if [ -f "$test_marker" ]; then
  rm -f "$test_marker"
  exit 0
fi

# BLOCK: Tests were not run
echo '{"decision": "block", "reason": "Code was changed but tests were not run. Please run tests before completing."}' >&2
exit 2
```

---

### 3.3 Agents (3 Total)

#### Agent: `planner`

**Location**: `.claude/agents/planner.md`

```markdown
---
name: planner
description: |
  Use when user has a vague idea and needs it turned into a concrete plan.
  Examples: "I want to build...", "What if we added...", "Help me plan...",
  "Design a feature for...".
  
  Do NOT use for direct implementation tasks.
model: inherit
tools: Read, Grep, Glob, WebFetch
---

# Planner Agent

Help 0→1 makers turn vague ideas into concrete, implementable specs.

## Workflow

### Phase 1: Problem Validation (30 seconds max)
Ask ONE question: "Who is this for and what problem does it solve?"
If user can answer → proceed. If vague → help clarify.

### Phase 2: Scope Definition (2 minutes max)
Define the MVP:
- What's the ONE core feature?
- What's explicitly OUT of scope?
- What's the simplest possible version?

### Phase 3: Implementation Plan
Output:

```markdown
## Feature: [Name]

### Problem
[One sentence]

### Solution
[One paragraph]

### MVP Scope
- [ ] [Task 1 - concrete, actionable]
- [ ] [Task 2]
- [ ] [Task 3]

### Out of Scope (v1)
- [Feature A]
- [Feature B]

### Technical Notes
- [Stack/approach if non-obvious]
```

## Anti-Paralysis Rules

- MAX 2 clarifying questions
- MAX 5 minutes on planning
- If stuck → "Let's start with [simplest version] and iterate"
- Default to existing patterns in codebase
```

#### Agent: `reviewer`

**Location**: `.claude/agents/reviewer.md`

```markdown
---
name: reviewer
description: |
  Use when user explicitly asks for "code review", "review my code",
  "check this PR", "is this code good?".
  
  Do NOT use proactively - only on explicit request.
model: inherit
tools: Read, Grep, Glob
---

# Code Reviewer Agent

Provide constructive code review feedback.

## Review Checklist

1. **Correctness**: Does it do what it's supposed to do?
2. **Edge Cases**: What could break?
3. **Simplicity**: Can this be simpler?
4. **Security**: Any obvious vulnerabilities?
5. **Performance**: Any obvious bottlenecks?

## Output Format

### Critical (must fix)
- [Issue with file:line reference]

### Suggestions (nice to have)
- [Improvement idea]

### Looks Good
- [Positive observation]
```

#### Agent: `debugger`

**Location**: `.claude/agents/debugger.md`

```markdown
---
name: debugger
description: |
  Use when user reports a bug, error, or something not working.
  Examples: "It's broken", "Getting an error", "This doesn't work",
  "Help me debug", "Why is this failing?".
model: inherit
tools: Read, Grep, Glob, Bash, lsp_diagnostics
---

# Debugger Agent

Find and fix bugs efficiently.

## Workflow

### Phase 1: Reproduce (2 minutes max)
- Get the exact error message
- Identify the failing code path
- Reproduce locally if possible

### Phase 2: Analyze (3 minutes max)
- Trace the error to root cause
- Check recent changes (git diff)
- Look for similar patterns in codebase

### Phase 3: Fix
- Apply minimal fix
- Run lsp_diagnostics
- Run tests to verify

## Output Format

```markdown
## Bug Analysis

### Error
[Exact error message]

### Root Cause
[One sentence explanation]

### Fix
[Code change description]

### Verification
- lsp_diagnostics: [status]
- Tests: [status]
```

## Anti-Paralysis Rules

- MAX 5 file reads before forming hypothesis
- If unsure → "I'll try [approach]. If that doesn't work, we'll try [backup]."
```

---

### 3.4 Commands (4 Total)

#### Command: `/plan`

**Location**: `.claude/commands/plan.md`

```markdown
---
name: plan
description: Plan a new feature or idea
---

Invoke the planner agent to turn an idea into an actionable spec.

## Usage
/plan "I want to add user authentication"
/plan "What if we had dark mode?"
```

#### Command: `/review`

**Location**: `.claude/commands/review.md`

```markdown
---
name: review
description: Request a code review
---

Invoke the reviewer agent for code review.

## Usage
/review              # Review recent changes
/review src/auth.ts  # Review specific file
```

#### Command: `/ship`

**Location**: `.claude/commands/ship.md`

```markdown
---
name: ship
description: Commit, push, and create PR in one command
---

One-shot: commit → push → create PR.

## Steps
1. Run pre-commit verification (verify-before-commit skill)
2. Stage all changes: `git add -A`
3. Generate commit message (conventional commits)
4. Commit and push
5. Create PR: `gh pr create --fill`
```

#### Command: `/check`

**Location**: `.claude/commands/check.md`

```markdown
---
name: check
description: Show verification status
---

Display current verification status.

## Shows
- lsp_diagnostics on changed files
- Test run status
- TODO completion status
- Git status
```

---

## 4. Migration Steps

### Phase 1: Core Infrastructure (Day 1)

| # | Task | Risk |
|---|------|------|
| 1.1 | Create `.claude/` directory structure | Low |
| 1.2 | Create `scripts/load-context.sh` | Low |
| 1.3 | Create `hooks.json` with SessionStart only | Low |
| 1.4 | Test: Session starts and loads context | Low |

### Phase 2: Test Enforcement (Day 2) - CRITICAL

| # | Task | Risk |
|---|------|------|
| 2.1 | Create `skills/test-enforcer/SKILL.md` | Medium |
| 2.2 | Create `scripts/detect-test-framework.sh` | Low |
| 2.3 | Create `scripts/check-tests-ran.sh` (blocking) | **High** |
| 2.4 | Add Stop hook with exit code 2 | **High** |
| 2.5 | Test: Session blocks if tests not run | **High** |
| 2.6 | Add escape hatch (SKIP_TEST_CHECK env) | Medium |

### Phase 3: Skills (Day 3)

| # | Task | Risk |
|---|------|------|
| 3.1 | Create `skills/verify-before-commit/SKILL.md` | Low |
| 3.2 | Test: Skill triggers on commit intent | Medium |
| 3.3 | Refine skill descriptions for accuracy | Medium |

### Phase 4: Agents (Day 4)

| # | Task | Risk |
|---|------|------|
| 4.1 | Create `agents/planner.md` | Low |
| 4.2 | Create `agents/reviewer.md` | Low |
| 4.3 | Create `agents/debugger.md` | Low |
| 4.4 | Test: Agents trigger on correct phrases | Medium |

### Phase 5: Commands (Day 5)

| # | Task | Risk |
|---|------|------|
| 5.1 | Create `commands/plan.md` | Low |
| 5.2 | Create `commands/review.md` | Low |
| 5.3 | Create `commands/ship.md` | Low |
| 5.4 | Create `commands/check.md` | Low |
| 5.5 | Test: All commands work | Low |

### Phase 6: Cleanup (Day 6)

| # | Task | Risk |
|---|------|------|
| 6.1 | Remove old `.claude-plugin/` directory | Low |
| 6.2 | Remove old `agents/` directory (22 files) | Low |
| 6.3 | Remove old `commands/` directory (13 files) | Low |
| 6.4 | Remove old `hooks/hooks.json` | Low |
| 6.5 | Update README.md | Low |
| 6.6 | Update CLAUDE.md | Low |
| 6.7 | End-to-end test: Full workflow | Medium |

---

## 5. What Gets Removed

### Removed Agents (19 agents)

| Agent | Reason |
|-------|--------|
| vibe-orchestrator | Claude routes natively |
| idea-shaper | Merged into `planner` |
| architect | Merged into `planner` |
| spec-validator | Over-engineered for 0→1 |
| vibe-implementer | Claude implements natively |
| frontend-implementer | Claude implements natively |
| ui-ux-designer | Claude handles natively |
| test-generator | Replaced by `test-enforcer` skill |
| test-quality-validator | Over-engineered |
| code-simplifier | Merged into reviewer |
| context-manager | SessionStart hook |
| context-optimizer | Over-engineered |
| docs-sync | Manual or GitHub Actions |
| readme-sync | Manual or GitHub Actions |
| task-manager | Claude's native TODO system |
| git-guardian | `/ship` command |
| conflict-resolver | Git's native resolution |
| research-agent | Claude's native search |
| agent-manager | Not needed with 3 agents |

### Kept Agents (3 agents - renamed/merged)

| Old | New |
|-----|-----|
| planner (partial) | `planner` (combines 4) |
| code-reviewer | `reviewer` |
| issue-fixer | `debugger` |

### Removed Commands (9 commands)

| Command | Reason |
|---------|--------|
| /vibe | Natural language + `/plan` |
| /fix-bug | Natural language works |
| /refactor | Natural language works |
| /init | Implicit on first use |
| /sync-context | SessionStart hook |
| /resume | Only if SessionStart fails |
| /verify | Replaced by `/check` |
| /fast, /deep, /action | Mode system removed |

---

## 6. Risk Mitigation

### High Risk: Stop Hook Blocking

**Risk**: Hook blocks legitimate exits, frustrating users.

**Mitigation**:
```bash
# Escape hatch
export SKIP_TEST_CHECK=1
```

### High Risk: Skill Doesn't Trigger

**Risk**: Claude doesn't use test-enforcer skill consistently.

**Mitigation**:
- Use "MUST BE USED PROACTIVELY" in description
- Monitor first week, refine trigger keywords
- Fallback: Stop hook always catches

### Medium Risk: Test Detection Fails

**Risk**: Unknown test framework, false blocking.

**Mitigation**:
- Support common frameworks (jest, vitest, pytest, go test)
- Fallback: Prompt user for test command
- Store in `.claude/test-command.txt`

---

## 7. Success Criteria

### Must Have (v2.0)

- [ ] Tests run after every implementation (>90% of sessions)
- [ ] Session cannot complete if tests weren't run (blocking works)
- [ ] `/plan` command invokes planner agent
- [ ] `/ship` command does commit + push + PR
- [ ] Total files: ≤15 (vs current ~50)

### Verification Tests

```bash
# Test 1: Skill triggers after implementation
> "Add a hello world function"
# Expected: Claude writes code, then runs tests

# Test 2: Stop hook blocks without tests
> Write code, try to exit without running tests
# Expected: Blocked with "Tests were not run"

# Test 3: Planner agent activates
> "I want to build a todo app"
# Expected: Planner engages, asks clarifying question

# Test 4: Ship command works
> /ship
# Expected: Verification → commit → push → PR
```

---

## 8. Timeline

| Day | Phase | Deliverable |
|-----|-------|-------------|
| 1 | Infrastructure | `.claude/` structure, hooks.json |
| 2 | Test Enforcement | Skills, blocking hook |
| 3 | Skills Refinement | Trigger accuracy |
| 4 | Agents | planner, reviewer, debugger |
| 5 | Commands | /plan, /review, /ship, /check |
| 6 | Cleanup | Remove old files, update docs |
| 7 | Testing | E2E verification |

**Total: 7 days**

---

## 9. Open Questions

1. **Test blocking strictness**: Hard block (exit code 2) or soft warning first?
2. **Escape hatch**: Environment variable (`SKIP_TEST_CHECK=1`) sufficient?
3. **Planner depth**: Max 2 questions or more flexible?
4. **Legacy migration**: Keep `.claude-vibe-flow/` compatibility layer?

---

*Document Version: 1.0*  
*Created: 2026-01-06*  
*Author: Migration Plan Agent*
