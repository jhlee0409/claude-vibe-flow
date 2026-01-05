---
name: init
description: Initialize the Vibe Coding environment. Creates necessary directory structures, configuration files, and context templates to enable the "Active Context" workflow.
tools: Bash, Write, Read
---

# Initialize Vibe Coding Environment

## Usage

```
/claude-vibe-flow:init
```

## Workflow

You execute the initialization process to set up the **Active Context** environment.

### Phase 1: Directory Structure Setup

1.  **Create Root Directory**
    -   Check if `.vibe-flow/` exists.
    -   If not, create it: `mkdir -p .vibe-flow/archive`

2.  **Git Integration**
    -   Check `.gitignore`.
    -   Ensure `.vibe-flow/` is **NOT** ignored (it is essential context).
    -   Ensure `.vibe-flow/archive/` is ignored (optional, to keep repo light).

### Phase 2: Core Context Files Creation

Create the following files with default templates if they don't exist.

#### 1. `.vibe-flow/active_spec.md` (The Blackboard)
This is the single source of truth for the current task.

```markdown
# Active Specification: [Task Name]

> **Status**: 🟡 In Progress
> **Last Updated**: [Date]

## 1. Goal
[Simple one-line description of what we are building right now]

## 2. Requirements (Planner)
- [ ] Requirement 1
- [ ] Requirement 2

## 3. Technical Design (Architect)
- **Stack**: [e.g., React, Node.js]
- **Key Decisions**:
  - [Decision 1]

## 4. Implementation Checklist (Implementer)
- [ ] [File Name] implementation
- [ ] Test verification

## 5. Review Notes (Reviewer)
- [ ] [Issue 1]
```

#### 2. `.vibe-flow/current_goal.md` (The Compass)
Keeps the high-level objective clear.

```markdown
# Current Project Goal

## Vision
[Brief description of the final product]

## Immediate Milestone
[What we are focusing on this session]
```

### Phase 3: Validation

1.  **Verification**
    -   Verify files are created.
    -   Output the status to the user.

---

## Output Format

### Initialization Report

```markdown
# ✅ Vibe Environment Initialized

## 📁 Directory: `.vibe-flow/` is ready.

## 📄 Active Files Created:
1.  **`active_spec.md`**: The central blackboard for Agents.
    -   *Use this to sync `planner` and `implementer`.*
2.  **`current_goal.md`**: High-level alignment.

## 🚀 Next Steps
1.  Edit `.vibe-flow/current_goal.md` to define your project.
2.  Run `/claude-vibe-flow:new-feature "Your Feature"` to start Vibe Coding.

> ✨ MCP servers are auto-configured via `.mcp.json` - no manual setup needed!
```

### Phase 4: Initial Context Sync

1. **Auto-Integration**
    - Execute `/claude-vibe-flow:sync-context` to generate the initial system map.
    - This ensures the system understands the starting state of the project.
