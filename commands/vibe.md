---
name: vibe
description: Unified command for idea-to-implementation workflow. Full pipeline by default, with --idea, --plan, --implement flags for specific phases.
tools: Task, Read, Write, Edit, Grep, Glob, Bash
---

# Vibe - Unified Development Command

The single entry point for all "building" workflows. From vague ideas to deployed features.

## Usage

```bash
# Full pipeline: idea -> plan -> implement (default)
/claude-vibe-flow:vibe "I want to build something that helps developers write TILs"

# Idea phase only: validate and refine the concept
/claude-vibe-flow:vibe --idea "AI-powered code review tool"

# Plan phase only: requirements and architecture
/claude-vibe-flow:vibe --plan "GitHub commit-based TIL generator"

# Implement phase only: direct to coding
/claude-vibe-flow:vibe --implement "Add getById method to UserService"
```

---

## Flags

| Flag | Phase | Agents Involved | Output |
|------|-------|-----------------|--------|
| (none) | Full | idea-shaper -> planner -> architect -> vibe-implementer -> reviewers | Working code |
| `--idea` | Idea Only | idea-shaper | Validated concept in `active_spec.md` |
| `--plan` | Plan Only | planner -> architect -> spec-validator | Technical spec in `active_spec.md` |
| `--implement` | Implement Only | vibe-implementer -> test-generator -> code-reviewer | Working code |

---

## Workflow Pipelines

### Full Pipeline (Default)

```
/vibe "description"
     |
     v
+------------------+
|   idea-shaper    |  Phase 1: Idea Validation
|  - Problem fit   |  - Is this worth building?
|  - User persona  |  - Who needs this?
|  - Value prop    |  - What's the core value?
|  - MVP scope     |  - What's the minimum?
+------------------+
     |
     v
+------------------+
|     planner      |  Phase 2: Requirements
|  - Features      |  - What exactly are we building?
|  - User stories  |  - How will it work?
|  - Acceptance    |  - How do we know it's done?
+------------------+
     |
     v
+------------------+
|    architect     |  Phase 3: Technical Design
|  - Tech stack    |  - What technologies?
|  - Structure     |  - How is it organized?
|  - Trade-offs    |  - What are the risks?
+------------------+
     |
     v
+------------------+
|  spec-validator  |  Phase 4: Validation Gate
|  - Completeness  |  - Is everything defined?
|  - READY?        |  - Can we implement?
+------------------+
     |
     v
+------------------+
|  git-guardian    |  Phase 5: Branch Setup
|  - vibe/* branch |  - Clean git workflow
+------------------+
     |
     v
+------------------+
| vibe-implementer |  Phase 6: Implementation
|  - Write code    |  - Following patterns
|  - Type safety   |  - No errors
+------------------+
     |
     v
+------------------+
|  test-generator  |  Phase 7: Testing
|  - Unit tests    |  - Happy path
|  - Edge cases    |  - Error handling
+------------------+
     |
     v
+------------------+
|  code-reviewer   |  Phase 8: Review
|  - Quality       |  - Is it good?
|  - Security      |  - Is it safe?
+------------------+
     |
     v
+------------------+
|    docs-sync     |  Phase 9: Documentation
|  - Update docs   |  - Keep in sync
+------------------+
     |
     v
Completion Report
```

---

### --idea Pipeline

```
/vibe --idea "concept"
     |
     v
+------------------+
|   idea-shaper    |
|  - Problem       |
|  - User          |
|  - Value         |
|  - Assumptions   |
|  - MVP scope     |
+------------------+
     |
     v
active_spec.md created
(Ready for: /vibe --plan or full /vibe)
```

---

### --plan Pipeline

```
/vibe --plan "feature"
     |
     v
+------------------+
|     planner      |
|  - Requirements  |
|  - User stories  |
+------------------+
     |
     v
+------------------+
|    architect     |
|  - Tech design   |
|  - Structure     |
+------------------+
     |
     v
+------------------+
|  spec-validator  |
|  - READY check   |
+------------------+
     |
     v
active_spec.md updated
(Ready for: /vibe --implement)
```

---

### --implement Pipeline

```
/vibe --implement "task"
     |
     v
+------------------+
|  git-guardian    |
|  - Branch check  |
+------------------+
     |
     v
+------------------+
| vibe-implementer |
|  - Write code    |
+------------------+
     |
     v
+------------------+
|  test-generator  |
|  - Write tests   |
+------------------+
     |
     v
+------------------+
|  code-reviewer   |
|  - Review        |
+------------------+
     |
     v
Completion Report
```

---

## Smart Routing (for default /vibe)

When no flag is provided, analyze the input to determine optimal starting point:

| Input Pattern | Detection | Starting Phase |
|---------------|-----------|----------------|
| Problem/desire language | "I want...", "X is frustrating...", "What if..." | idea-shaper |
| Feature language | "Add X feature", "Build Y system" | planner |
| Specific task language | "In file X, add Y", "Create Z method" | vibe-implementer |

### Examples

```bash
# Detected as IDEA (vague)
/vibe "developers waste too much time on documentation"
# -> Starts at idea-shaper

# Detected as FEATURE (concrete)
/vibe "add dark mode toggle to settings page"  
# -> Starts at planner

# Detected as TASK (specific)
/vibe "add onClick handler to Button.tsx"
# -> Starts at vibe-implementer
```

---

## Output Format

### Completion Report (Full Pipeline)

```markdown
## Vibe Complete: [Feature Name]

### Journey
| Phase | Agent | Status |
|-------|-------|--------|
| Idea | idea-shaper | Validated |
| Plan | planner + architect | Designed |
| Validate | spec-validator | READY |
| Implement | vibe-implementer | Done |
| Test | test-generator | 5 tests |
| Review | code-reviewer | Approved |

### Summary
- **Problem**: [What we solved]
- **Solution**: [What we built]
- **Files Changed**: [Count]

### Changed Files
| File | Change |
|------|--------|
| `src/feature.ts` | New |
| `tests/feature.test.ts` | New |

### Verification
- Type check: Pass
- Lint: Pass
- Tests: 5/5 Pass

### Branch
`vibe/feature-name`

### Next Steps
- [ ] Create PR: `/commit-push-pr`
- [ ] Continue iteration: `/vibe "enhancement"`
```

### Partial Completion (--idea or --plan)

```markdown
## Vibe Paused: [Concept Name]

### Completed Phase
[idea | plan]

### Output
`active_spec.md` updated with:
- [Summary of what was defined]

### Continue Options
- Full pipeline: `/vibe "continue with [concept]"`
- Next phase: `/vibe --plan` or `/vibe --implement`
- Review spec: Read `.claude-vibe-flow/active_spec.md`
```

---

## Continuation Support

The `/vibe` command respects existing `active_spec.md`:

```bash
# First: idea only
/vibe --idea "TIL automation"
# -> Creates active_spec.md with validated idea

# Later: continue to planning
/vibe --plan
# -> Reads active_spec.md, continues from idea phase

# Finally: implement
/vibe --implement
# -> Reads active_spec.md, implements the planned feature
```

---

## Interruption Handling

If interrupted mid-pipeline:

1. Check `active_spec.md` for current state
2. Check `git status` for uncommitted work
3. Resume from last completed phase

```bash
# After interruption
/vibe
# -> Detects active_spec.md exists
# -> "Found existing spec for [X]. Continue from [phase]?"
```

---

## Constraints

- Always create/update `active_spec.md` at phase transitions
- Never skip spec-validator before implementation (in full pipeline)
- Always run lsp_diagnostics after implementation
- Respect user's explicit flag choice (don't auto-upgrade --idea to full)

---

## Related Commands

| Command | Relationship |
|---------|--------------|
| `/new-feature` | Legacy alias for `/vibe --plan` + `/vibe --implement` |
| `/plan` | Legacy alias for `/vibe --plan` |
| `/fix-bug` | Separate workflow (not part of /vibe) |
| `/refactor` | Separate workflow (not part of /vibe) |
