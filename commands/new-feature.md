---
name: new-feature
description: Workflow for implementing a new feature
tools: Task, Read, Write, Edit, Grep, Glob, Bash
---

# New Feature Implementation

## Usage

```
/claude-vibe-flow:new-feature feature_name
/claude-vibe-flow:new-feature "User authentication system"
```

## Workflow

You execute the entire workflow for implementing a new feature.

### Phase 1: Requirements Analysis

1. **Clarity Assessment**
   - Is the request clear? → Move to Phase 2
   - Is it ambiguous? → Generate questions with the `planner` agent

2. **Existing Code Analysis**
   - Check for similar features
   - Identify existing patterns and conventions

### Phase 2: Technical Design

1. **Architectural Decision**
   - Review technical feasibility with the `architect` agent
   - Plan file structure and dependencies

2. **Spec Validation**
   - Confirm completeness with the `spec-validator` agent
   - If determined as READY, proceed to implementation stage

### Phase 3: Branch Preparation

1. **Git Configuration**
   - Create branch with the `git-guardian` agent
   - Create in the format `vibe/feature_name`

### Phase 4: Implementation

1. **Code Writing**
   - Implement with the `vibe-implementer` agent
   - Follow existing patterns
   - Maintain type safety

2. **Verification**
   - Run type check
   - Run lint (if available)

### Phase 5: Testing

1. **Test Creation**
   - Generate tests with the `test-generator` agent
   - Include Happy Path/Error/Edge cases

2. **Test Quality**
   - Validate with the `test-quality-validator` agent
   - Check for missing cases

### Phase 6: Review and Completion

1. **Code Review**
   - Review with the `code-reviewer` agent
   - Check quality/security/performance

2. **Documentation Sync**
   - Update internal docs with the `docs-sync` agent
   - Update README with the `readme-sync` agent (if necessary)

3. **Commit**
   - Commit with the `git-guardian` agent
   - Meaningful commit message

---

## Automatic Agent Flow

```
Input: "Implement new feature"
     ↓
[pm-orchestrator] Request analysis
     ↓
[planner] Generate questions if ambiguous
     ↓
[architect] Technical design
     ↓
[spec-validator] Spec validation (READY?)
     ↓
[git-guardian] Branch creation
     ↓
[vibe-implementer] Implementation
     ↓
[test-generator] Test creation
     ↓
[test-quality-validator] Test quality validation
     ↓
[code-reviewer] Code review
     ↓
[docs-sync] Documentation sync
     ↓
[git-guardian] Commit
     ↓
Completion report
```

---

## Output Format

### Completion Report

```markdown
## ✅ Feature Implementation Complete: [Feature Name]

### Implementation Details
- [Change item 1]
- [Change item 2]

### Changed Files
| File | Change Type |
|------|-------------|
| `src/feature.ts` | New file |
| `src/index.ts` | Modified |

### Testing
- Total N tests added
- Coverage: XX%

### Verification Results
- ✅ Passed type check
- ✅ Passed lint
- ✅ Passed tests
- ✅ Code review complete

### Branch
`vibe/feature_name`

### Next Steps
- [ ] Create PR (Optional)
- [ ] Merge into main branch
```

---

## Termination Conditions

Request user confirmation in the following situations:
- Spec ambiguity (after planner queries)
- Possibility of conflict with existing code
- Test failure
- Serious issues found in code review
