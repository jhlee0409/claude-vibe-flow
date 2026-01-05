---
name: deep
description: Activate DeepWork mode for thorough planning and careful implementation of complex tasks.
tools: Read, Write, Edit, Grep, Glob, Bash
---

# Deep Command - DeepWork Mode

## Usage

```
/claude-vibe-flow:deep "Implement authentication system"
/claude-vibe-flow:deep
```

---

## MODE: DeepWork (ACTIVE)

> **Purpose**: Thorough planning, careful implementation, and comprehensive documentation for complex tasks.

### Behavior Changes (MUST FOLLOW)

When DeepWork mode is active, you MUST:

#### 1. Comprehensive Planning (Before ANY Code)

```markdown
1. Analyze the full scope of changes
2. Identify all affected files and dependencies using:
   - lsp_find_references: Before modifying any symbol
   - ast_grep_search: Pattern analysis across codebase
3. Create detailed todo list with subtasks using todowrite
4. Consider edge cases and failure modes
5. Document design decisions in .claude-vibe-flow/active_spec.md
```

#### 2. Mandatory Tool Usage

| Tool | When | Why |
|------|------|-----|
| `todowrite` | Start of task | Detailed task breakdown |
| `lsp_find_references` | Before modifying symbols | Impact analysis |
| `ast_grep_search` | Pattern discovery | Find similar code |
| `lsp_diagnostics` | After EVERY change | Immediate error detection |
| `lsp_rename` | Symbol renaming | Safe refactoring |

#### 3. Staged Implementation

```markdown
Phase 1 - PLAN:
  - Document approach in active_spec.md
  - Create comprehensive todowrite

Phase 2 - PREPARE:
  - Set up necessary scaffolding
  - Verify dependencies

Phase 3 - IMPLEMENT:
  - One logical change at a time
  - lsp_diagnostics after EVERY edit
  - Mark todos complete in real-time

Phase 4 - INTEGRATE:
  - Connect components
  - Update imports/exports

Phase 5 - VERIFY:
  - Run full test suite
  - Confirm lsp_diagnostics clean
  - Review documentation
```

#### 4. Pre-Implementation Checklist

```markdown
Before writing any code, confirm:
[ ] Scope fully understood
[ ] All affected files identified (lsp_find_references)
[ ] Dependencies mapped
[ ] Existing patterns analyzed (ast_grep_search)
[ ] Detailed todowrite created
[ ] Design documented in active_spec.md
```

#### 5. Post-Implementation Checklist

```markdown
After implementation, confirm:
[ ] All todos completed (todoread)
[ ] Full test suite passing
[ ] lsp_diagnostics clean (0 errors)
[ ] Documentation updated
[ ] active_spec.md status updated
```

---

## When to Use DeepWork

| Scenario | Use DeepWork? |
|----------|---------------|
| New major feature | Yes |
| System refactoring | Yes |
| Security-critical code | Yes |
| Database migrations | Yes |
| Quick bug fix | No (use normal) |
| Simple UI change | No (use /fast) |

## Constraints

- **NEVER** skip the planning phase
- **NEVER** proceed without clear scope
- **ALWAYS** update documentation
- **ALWAYS** use the mandatory tools
- **ALWAYS** verify at each stage

## Exiting DeepWork Mode

- Start a new session
- Or say "exit deep mode"
- Or use `/claude-vibe-flow:fast` for quick tasks

## Related Commands

- `/claude-vibe-flow:verify` - Run verification checks
- `/claude-vibe-flow:fast` - Switch to FastVibe mode
