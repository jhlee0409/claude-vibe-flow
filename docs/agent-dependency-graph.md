# Agent Dependency Graph

> Auto-generated from agent markdown files. Do not edit manually.
> Run `npx ts-node scripts/generate-agent-graph.ts` to regenerate.

## Visualization

```mermaid
graph TD
    A0[agent-manager]
    A1[architect]
    A2[code-reviewer]
    A3[code-simplifier]
    A4[context-manager]
    A5[context-optimizer]
    A6[docs-sync]
    A7[frontend-implementer]
    A8[git-guardian]
    A9[idea-shaper]
    A10[issue-fixer]
    A11[planner]
    A12[readme-sync]
    A13[research-agent]
    A14[spec-validator]
    A15[task-manager]
    A16[test-generator]
    A17[test-quality-validator]
    A18[ui-ux-designer]
    A19[vibe-implementer]
    A20[vibe-orchestrator]

    A0 --> A6
    A0 --> A8
    A1 --> A11
    A1 --> A14
    A1 --> A19
    A2 --> A19
    A2 --> A16
    A2 --> A10
    A2 --> A3
    A2 --> A6
    A3 --> A2
    A3 --> A19
    A3 --> A16
    A3 --> A1
    A5 --> A15
    A5 --> A20
    A5 --> A0
    A6 --> A0
    A6 --> A8
    A7 --> A18
    A7 --> A19
    A7 --> A16
    A7 --> A2
    A7 --> A1
    A8 --> A6
    A8 --> A2
    A8 --> A16
    A9 --> A20
    A9 --> A11
    A9 --> A1
    A9 --> A13
    A10 --> A2
    A10 --> A16
    A10 --> A8
    A11 --> A20
    A11 --> A1
    A11 --> A14
    A12 --> A6
    A12 --> A2
    A12 --> A19
    A13 --> A20
    A13 --> A1
    A13 --> A19
    A13 --> A10
    A14 --> A11
    A14 --> A1
    A14 --> A20
    A14 --> A19
    A15 --> A8
    A15 --> A5
    A15 --> A20
    A16 --> A17
    A16 --> A2
    A16 --> A10
    A17 --> A16
    A17 --> A2
    A17 --> A10
    A18 --> A7
    A18 --> A19
    A18 --> A1
    A18 --> A11
    A18 --> A9
    A18 --> A2
    A19 --> A1
    A19 --> A2
    A19 --> A10
    A20 --> A9
    A20 --> A11
    A20 --> A1
    A20 --> A14
    A20 --> A19
    A20 --> A7
    A20 --> A18
    A20 --> A0
```

## Agent Details

| Agent | Dependencies | Triggers |
|-------|--------------|----------|
| `agent-manager` | `docs-sync`, `git-guardian` | User wants to create, add, or modify agents; User ... |
| `architect` | `planner`, `spec-validator`, `vibe-implementer` | - |
| `code-reviewer` | `vibe-implementer`, `test-generator`, `issue-fixer`, `code-simplifier`, `docs-sync` | - |
| `code-simplifier` | `code-reviewer`, `vibe-implementer`, `test-generator`, `architect` | - |
| `context-manager` | - | - |
| `context-optimizer` | `task-manager`, `vibe-orchestrator`, `agent-manager` | - |
| `docs-sync` | `agent-manager`, `git-guardian` | - |
| `frontend-implementer` | `ui-ux-designer`, `vibe-implementer`, `test-generator`, `code-reviewer`, `architect` | - |
| `git-guardian` | `docs-sync`, `code-reviewer`, `test-generator` | - |
| `idea-shaper` | `vibe-orchestrator`, `planner`, `architect`, `research-agent` | - |
| `issue-fixer` | `code-reviewer`, `test-generator`, `git-guardian` | User reports something is broken or not working as... |
| `planner` | `vibe-orchestrator`, `architect`, `spec-validator` | - |
| `readme-sync` | `docs-sync`, `code-reviewer`, `vibe-implementer` | - |
| `research-agent` | `vibe-orchestrator`, `architect`, `vibe-implementer`, `issue-fixer` | User asks how to use an external library, framewor... |
| `spec-validator` | `planner`, `architect`, `vibe-orchestrator`, `vibe-implementer` | - |
| `task-manager` | `git-guardian`, `context-optimizer`, `vibe-orchestrator` | - |
| `test-generator` | `test-quality-validator`, `code-reviewer`, `issue-fixer` | - |
| `test-quality-validator` | `test-generator`, `code-reviewer`, `issue-fixer` | - |
| `ui-ux-designer` | `frontend-implementer`, `vibe-implementer`, `architect`, `planner`, `idea-shaper`, `code-reviewer` | - |
| `vibe-implementer` | `architect`, `code-reviewer`, `issue-fixer` | - |
| `vibe-orchestrator` | `idea-shaper`, `planner`, `architect`, `spec-validator`, `vibe-implementer`, `frontend-implementer`, `ui-ux-designer`, `agent-manager` | - |

## Dependency Matrix

| Agent | Depends On | Depended By |
|-------|------------|-------------|
| `agent-manager` | `docs-sync`, `git-guardian` | `context-optimizer`, `docs-sync`, `vibe-orchestrator` |
| `architect` | `planner`, `spec-validator`, `vibe-implementer` | `code-simplifier`, `frontend-implementer`, `idea-shaper`, `planner`, `research-agent`, `spec-validator`, `ui-ux-designer`, `vibe-implementer`, `vibe-orchestrator` |
| `code-reviewer` | `vibe-implementer`, `test-generator`, `issue-fixer`, `code-simplifier`, `docs-sync` | `code-simplifier`, `frontend-implementer`, `git-guardian`, `issue-fixer`, `readme-sync`, `test-generator`, `test-quality-validator`, `ui-ux-designer`, `vibe-implementer` |
| `code-simplifier` | `code-reviewer`, `vibe-implementer`, `test-generator`, `architect` | `code-reviewer` |
| `context-manager` | - | - |
| `context-optimizer` | `task-manager`, `vibe-orchestrator`, `agent-manager` | `task-manager` |
| `docs-sync` | `agent-manager`, `git-guardian` | `agent-manager`, `code-reviewer`, `git-guardian`, `readme-sync` |
| `frontend-implementer` | `ui-ux-designer`, `vibe-implementer`, `test-generator`, `code-reviewer`, `architect` | `ui-ux-designer`, `vibe-orchestrator` |
| `git-guardian` | `docs-sync`, `code-reviewer`, `test-generator` | `agent-manager`, `docs-sync`, `issue-fixer`, `task-manager` |
| `idea-shaper` | `vibe-orchestrator`, `planner`, `architect`, `research-agent` | `ui-ux-designer`, `vibe-orchestrator` |
| `issue-fixer` | `code-reviewer`, `test-generator`, `git-guardian` | `code-reviewer`, `research-agent`, `test-generator`, `test-quality-validator`, `vibe-implementer` |
| `planner` | `vibe-orchestrator`, `architect`, `spec-validator` | `architect`, `idea-shaper`, `spec-validator`, `ui-ux-designer`, `vibe-orchestrator` |
| `readme-sync` | `docs-sync`, `code-reviewer`, `vibe-implementer` | - |
| `research-agent` | `vibe-orchestrator`, `architect`, `vibe-implementer`, `issue-fixer` | `idea-shaper` |
| `spec-validator` | `planner`, `architect`, `vibe-orchestrator`, `vibe-implementer` | `architect`, `planner`, `vibe-orchestrator` |
| `task-manager` | `git-guardian`, `context-optimizer`, `vibe-orchestrator` | `context-optimizer` |
| `test-generator` | `test-quality-validator`, `code-reviewer`, `issue-fixer` | `code-reviewer`, `code-simplifier`, `frontend-implementer`, `git-guardian`, `issue-fixer`, `test-quality-validator` |
| `test-quality-validator` | `test-generator`, `code-reviewer`, `issue-fixer` | `test-generator` |
| `ui-ux-designer` | `frontend-implementer`, `vibe-implementer`, `architect`, `planner`, `idea-shaper`, `code-reviewer` | `frontend-implementer`, `vibe-orchestrator` |
| `vibe-implementer` | `architect`, `code-reviewer`, `issue-fixer` | `architect`, `code-reviewer`, `code-simplifier`, `frontend-implementer`, `readme-sync`, `research-agent`, `spec-validator`, `ui-ux-designer`, `vibe-orchestrator` |
| `vibe-orchestrator` | `idea-shaper`, `planner`, `architect`, `spec-validator`, `vibe-implementer`, `frontend-implementer`, `ui-ux-designer`, `agent-manager` | `context-optimizer`, `idea-shaper`, `planner`, `research-agent`, `spec-validator`, `task-manager` |