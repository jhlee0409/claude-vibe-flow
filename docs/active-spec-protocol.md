# Active Spec Synchronization Protocol

This document defines the rules for managing `.claude-vibe-flow/active_spec.md` across agents.

## Overview

The `active_spec.md` file serves as a shared blackboard for task coordination. Each agent has specific ownership and access rules.

## Version & Metadata
- **Spec Version**: 1.1.0
- **Last Reviewed**: 2026-01-10
- **Maintainer**: cvf-planner (spec), cvf-architect (design), cvf-applier (implementation), cvf-reviewer (approval)
- **Hook Integration**: Stop hook enforces completion + diagnostics; SessionStart loads context

## Policies & Hooks
- **Branch Guard**: work on feature/checkpoint branches; main is protected
- **Pre-flight**: before editing, run `/cvf:check` (verify diagnostics + TODOs)
- **Checkpoint**: use `/rewind` (double ESC) or git stash/branch before risky edits
- **UI Text**: All user-facing strings must be English; comments/docs may be Korean

## Maintenance Commands (Info/Verify/Update)
- `/cvf:check` — verify active spec state, diagnostics, TODOs before edits
- `/cvf:plan "<task>"` — gather/refresh goal & requirements (Info)
- `/cvf:workflow audit` — run audit workflow to refresh design/implementation notes (Update)
- `/cvf:ship` — verify → commit → push → PR (uses verify-before-commit skill)

## File Structure

```markdown
# Active Specification: [Task Name]

> **Status**: [emoji] [State]
> **Last Updated**: [Date]

## 1. Goal
[One-line description - owned by planner]

## 2. Requirements (Planner)
- [ ] Requirement 1
- [ ] Requirement 2

## 3. Technical Design (Architect)
- **Stack**: [tech choices]
- **Key Decisions**: [decisions]

## 4. Implementation Checklist (Implementer)
- [ ] File implementation
- [ ] Test verification

## 5. Review Notes (Reviewer)
- [ ] Issue 1
```

## Section Ownership

| Section | Owner Agent | Read Access | Write Access |
|---------|-------------|-------------|--------------|
| Header (Status, Date) | ANY | ALL | On state change |
| 1. Goal | planner | ALL | planner only |
| 2. Requirements | planner | ALL | planner only |
| 3. Technical Design | architect | ALL | architect only |
| 4. Implementation | vibe-implementer | ALL | implementer only |
| 5. Review Notes | code-reviewer | ALL | reviewer only |

## State Machine

```
[Not Created]
      │
      ▼ (planner creates)
  🔴 Not Started
      │
      ▼ (planner fills requirements)
  🟡 In Progress
      │
      ▼ (all sections complete)
  🟢 Ready for Review
      │
      ▼ (code-reviewer approves)
  ✅ Completed
      │
      ▼ (task-manager archives)
  📁 Archived
```

## Agent Rules

### planner

**Before starting:**
1. Check if `.claude-vibe-flow/active_spec.md` exists
2. If exists, READ current content first
3. If not exists, CREATE with template

**After work:**
1. UPDATE sections 1 and 2
2. SET status to `🟡 In Progress`
3. UPDATE `Last Updated` timestamp
4. NEVER modify sections 3, 4, or 5

### architect

**Before starting:**
1. READ `.claude-vibe-flow/active_spec.md` first
2. VERIFY sections 1 and 2 are complete
3. If incomplete, DELEGATE back to planner

**After work:**
1. UPDATE section 3 only
2. UPDATE `Last Updated` timestamp
3. NEVER modify sections 1, 2, 4, or 5

### vibe-implementer

**Before starting:**
1. CHECK if `.claude-vibe-flow/active_spec.md` exists
2. If exists (Deep Mode): READ and follow spec
3. If not exists (Quick Mode): proceed with chat context

**During work (Deep Mode only):**
1. UPDATE checkboxes in section 4 as items complete
2. Mark `[x]` in real-time, not at the end
3. If spec needs change, UPDATE spec first, then implement

**After work:**
1. VERIFY all section 4 checkboxes are checked
2. UPDATE `Last Updated` timestamp
3. NEVER modify sections 1, 2, 3, or 5

### code-reviewer

**Before starting:**
1. READ `.claude-vibe-flow/active_spec.md`
2. VERIFY implementation matches spec

**After work:**
1. ADD notes to section 5
2. If approved, SET status to `✅ Completed`
3. UPDATE `Last Updated` timestamp

### task-manager

**On task completion:**
1. ARCHIVE file to `.claude-vibe-flow/archive/spec_log_[date].md`
2. DELETE original `active_spec.md`
3. Directory remains for next task

## Validation Checklist

Before modifying `active_spec.md`, verify:

- [ ] I own this section
- [ ] I read the current content first
- [ ] My preconditions are met (previous sections exist)
- [ ] I ran `/cvf:check` or diagnostics on related files
- [ ] I will update the timestamp
- [ ] I will NOT modify other agents' sections

## Error Handling

| Error | Agent | Action |
|-------|-------|--------|
| File doesn't exist | architect | Return to planner |
| Section incomplete | architect | Return to planner |
| Spec mismatch | vibe-implementer | Update spec, then implement |
| Review fails | code-reviewer | Add notes, keep status `🟡` |

## Integration with Hooks

The Stop hook validates:
1. If `todowrite` was used, all items must be complete
2. If code was modified, `lsp_diagnostics` must be clean
3. If `active_spec.md` exists and was modified, all agent rules must be followed

### Automation & Guardrails
- Branch guard: `.claude/scripts/branch-guard.sh` (예: main 보호, feature/* 권장)
- Pre-commit gate: `.claude/scripts/pre-commit-gate.sh` → `typecheck → test → lint` 순 실행, 실패 시 차단. `ALLOW_UNSAFE=1` 사용 시 결과 보고 필수
- TODO stop: `.claude/scripts/todo-stop.sh` – 열려있는 TODO 있으면 중단
- Prompt keywords: "build", "apply this", "optimize", "auth" 등은 관련 에이전트 자동 제안
- Version metadata: `~/.claude/.cvf-version.json`에 최근 버전/검사 시점 기록
- Update policy: 24h 자동 점검 권고, 수동 `/cvf:check` 또는 `/cvf:workflow audit`
- cvf info/verify/update: `/cvf:check`(상태), `/cvf:workflow audit`(사전 점검), `/cvf:ship` 전 `verify-before-commit` 스킬로 게이트 확인
- Checkpoint: `/rewind`(ESC ESC) 또는 `git stash push -u -m "checkpoint: ..."` 후 진행
