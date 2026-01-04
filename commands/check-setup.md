---
name: check-setup
description: Vibe coding environment setup validation. Checks the setup status of agents and CLAUDE.md.
---

# Vibe Coding Environment Validation

This command checks if the Vibe coding environment is correctly set up.

## Validation Items

### 1. Agent Structure Verification

```markdown
Required Agents (15):
- [ ] git-guardian
- [ ] issue-fixer
- [ ] code-reviewer
- [ ] test-generator
- [ ] test-quality-validator
- [ ] context-optimizer
- [ ] pm-orchestrator
- [ ] planner
- [ ] architect
- [ ] spec-validator
- [ ] vibe-implementer
- [ ] task-manager
- [ ] agent-manager
- [ ] docs-sync
- [ ] readme-sync
```

### 2. CLAUDE.md Verification

```markdown
Required Sections:
- [ ] Quick Reference (Commands)
- [ ] Agent Auto-selection Table
- [ ] Core Rules
```

---

## How to Run

```
/claude-vibe-flow:check-setup
```

Or in natural language:
```
"Check Vibe coding environment"
"Verify vibe setup"
```

---

## Output Format

```markdown
## 🔧 Vibe Coding Environment Validation

### Agent Status
| Category | Installed | Missing |
|----------|-----------|---------|
| Core | N | - |
| Quality | N | - |
| Orchestration | N | - |
| Meta | N | - |

### CLAUDE.md Status
| Section | Status |
|---------|--------|
| Quick Reference | ✅/❌ |
| Agent Table | ✅/❌ |
| Core Rules | ✅/❌ |

### Recommended Actions
1. [List of required actions]

---
✅ Environment ready! / ⚠️ Some setup required
```

---

## Auto-fix

When missing items are found:
- Provides a list of missing agents
- Provides a CLAUDE.md template

---

## Validation Script (Internal)

```bash
# Check agent files
ls .claude/agents/*.md 2>/dev/null | wc -l

# Check existence of CLAUDE.md
test -f CLAUDE.md && echo "exists"
```
