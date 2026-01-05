---
name: refactor
description: Request code structural improvements without changing behavior. Skips functional requirement gathering (Planner) and goes straight to Architect + Implementer.
tools: Bash, Read, Edit
---

# 🧹 Refactor Command

## Usage

```
/claude-vibe-flow:refactor "Target file/function and improvement goal"
```

## Workflow

1.  **Design Phase (Architect)**
    - The `architect` agent analyzes the target code.
    - Focuses on readability, performance, or modularity.
    - Does NOT change external behavior (business logic).

2.  **Implementation Phase (Implementer)**
    - The `vibe-implementer` applies the changes.
    - Ensures existing tests still pass.

## Examples

- `/claude-vibe-flow:refactor "Extract UserAuth logic from App.tsx"`
- `/claude-vibe-flow:refactor "Optimize the loop in processData function"`
- `/claude-vibe-flow:refactor "Apply Clean Architecture to the API layer"`
