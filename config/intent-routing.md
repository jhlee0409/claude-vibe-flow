# Intent-Based Routing Rules

> Common mapping rules referenced by `pm-orchestrator` and `CLAUDE.md`.

---

## Verb Pattern Mapping

### Review Lineage

| Keyword | Context | Agent | Description |
|---------|---------|-------|-------------|
| review, 검토해, 리뷰해 | Code, PR, changes | `code-reviewer` | Review code quality/security/performance |
| review, 검토해 | Architecture, design | `architect` | Review technical design |
| review, 검토해 | Specs, requirements | `spec-validator` | Review spec completeness |

### Validation Lineage

| Keyword | Context | Agent | Description |
|---------|---------|-------|-------------|
| validate, verify, 검증해 | Tests, quality, coverage | `test-quality-validator` | Validate test quality |
| validate, verify, 검증해 | Types, sync, types | `type-sync-checker` | Validate type file synchronization |
| validate, verify, 검증해 | Security, masking, sensitive info | `security-validator` | Validate security rules |
| validate, verify, 검증해 | API, payload, schema | `api-integration` | Validate API consistency |
| validate, verify, 검증해 | Vercel, deployment, imports | `vercel-constraint-checker` | Validate Vercel constraints |

### Verification/Check Lineage

| Keyword | Context | Process Method | Description |
|---------|---------|----------------|-------------|
| check, verify, 확인해 | Agents, status | `agent-manager` | Agent ecosystem status |
| check, verify, 확인해 | Code existence, implementation status | Direct Grep/Read | Agent not required |
| check, verify, 확인해 | Files, structure | Direct Glob/Read | Agent not required |
| check, verify, 확인해 | Settings, environment | Direct Read | Agent not required |

---

## Implementation/Modification Lineage

| Keyword | Context | Agent | Description |
|---------|---------|-------|-------------|
| create, implement, add, 만들어줘, 구현해줘, 추가해줘 | Features, components | `pm-orchestrator` | Route after complexity analysis |
| fix, modify, resolve, doesn't work, 고쳐줘, 수정해줘, 안돼 | Bugs, errors | `issue-fixer` | Bug fixes |
| improve, optimize, faster, 개선해줘, 최적화해줘, 빠르게 | Performance, quality | `vibe-implementer` | Improvement implementation |
| write tests, test, 테스트 짜줘, 테스트해줘 | Tests | `test-generator` | Test creation |

---

## Inquiry/Exploration Lineage

| Keyword | Context | Process Method | Description |
|---------|---------|----------------|-------------|
| how to?, is it possible?, would it be good?, 어떻게 해?, 가능해?, 좋을까? | Technical advisory | `architect` | Support technical decisions |
| what's needed?, organize this, 뭐가 필요해?, 정리해줘 | Requirements | `planner` | Clarify requirements |
| explain, let me know, 설명해줘, 알려줘 | Simple questions | Direct answer | Agent not required |
| find, where is, 찾아줘, 어디있어 | Code exploration | Direct Grep/Glob | Agent not required |

---

## Session/Task Lineage

| Keyword | Context | Agent | Description |
|---------|---------|-------|-------------|
| continue, resume, earlier work, 이어서, 계속, 아까 하 하던거 | Session restoration | `task-manager` | Task restoration |
| commit, push, 커밋해줘, push해줘 | Git operations | `git-guardian` | Git workflow |
| update docs, 문서 업데이트 | After implementation | `docs-sync` | Internal document synchronization |
| update README, README 업데이트 | Public API change | `readme-sync` | README synchronization |

---

## Compound Keyword Priority

When multiple contexts apply to the same verb:

1. **Specific context priority**: "Validate types" → `type-sync-checker`
2. **File path-based**: Mentioning `masking.ts` → `security-validator`
3. **Recent task-based**: "Validate" immediately after test creation → `test-quality-validator`
4. **Fallback**: Ambiguous context → `pm-orchestrator` decision

---

## Negative Rules (Agent Not Required)

| Request Type | Process Method | Reason |
|--------------|----------------|--------|
| Simple question/explanation | Direct answer | No overhead required |
| File reading only | Direct Read | Simple task |
| Simple search | Direct Grep/Glob | Simple task |
| Git status check | Direct Bash | Simple command |

---

## Automatic Triggers (Upon Task Completion)

| Trigger Condition | Agent | Action |
|-------------------|-------|--------|
| Code change complete | `code-reviewer` | Automatic review |
| Test creation complete | `test-quality-validator` | Quality validation |
| `types.ts` modified | `type-sync-checker` | Sync validation |
| `masking.ts` modified | `security-validator` | Security validation |
| `api/` folder modified | `vercel-constraint-checker` | Constraint validation |
| Implementation complete | `docs-sync` | Documentation sync |
| Public API change | `readme-sync` | README update |
| Agent creation/modification | `agent-manager` | Registration and validation |
| Context 50%+ | `context-optimizer` | Memory optimization |

---

## Usage Examples

```
User: "Review code"
→ Verb: Review + Context: Code → code-reviewer ✅

User: "Validate types"
→ Verb: Validate + Context: Types → type-sync-checker ✅

User: "Check if this function exists"
→ Verb: Check + Context: Code existence → Direct Grep ✅

User: "Check agent status"
→ Verb: Check + Context: Agent → agent-manager ✅

User: "Validate" (Context ambiguous)
→ pm-orchestrator decides after analyzing conversation context
```

---

## Extension per Project

This file contains general rules. Project-specific rules override in `CLAUDE.md`:

```markdown
# CLAUDE.md Example

## Project-Specific Routing

| Keyword | Agent | Reason |
|---------|-------|--------|
| Validate masking | `security-validator` | inner-lens specific |
| API payload | `api-integration` | inner-lens specific |
```
