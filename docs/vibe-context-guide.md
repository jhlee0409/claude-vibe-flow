# Vibe Context Guide

This document defines the **Active Context Files** strategy, a core mechanism for "Full Vibe Coding". It ensures context persistence, accurate handoffs, and scalability across agentic workflows.

## 1. Core Concept: "The Blackboard"

Instead of relying solely on chat history (which fades and drifts), we use **Active Context Files** as a persistent "Blackboard".
- **Agents** read from and write to these files.
- **Goal**: De-couple the "State" from the "Chat Log".

## 2. File Structure (Namespace Isolation)

All context files are stored in the **`.vibe-flow/`** directory to keep the project root clean.

### `.vibe-flow/active_spec.md` (The Source of Truth)
- **Role**: The living specification of the current task.
- **Content**: Requirements, Implementation Plan, Progress Checklist, Technical Decisions.
- **Lifecycle**: Created by `planner` -> Updated by `implementer` -> Deleted by `task-manager`.

### `.vibe-flow/context_status.md` (The Memory Bank)
- **Role**: Session summary and optimization log.
- **Content**: Key decisions, skipped files list, token usage summary.
- **Managed by**: `context-optimizer`.

### `.vibe-flow/archive/` (History)
- **Role**: Permanent storage for completed specs.
- **Format**: `spec_log_[YYYYMMDD].md`

## 3. Lifecycle Management

The "Full Vibe" lifecycle follows a creation-update-deletion loop.

### Phase 1: Creation (Planner)
- **Trigger**: New complex request.
- **Action**: `planner` clarifies requirements and **CREATES** `active_spec.md`.
- **Status**: `[ ] Waiting for User Approval`

### Phase 2: Execution Loop (Architect & Implementer)
- **Trigger**: User approval.
- **Action**: Agents **MUST READ** `active_spec.md` first.
- **Update Rule**:
  - `architect`: Appends technical design decisions.
  - `vibe-implementer`: Updates progress checkboxes (`[x]`).
- **Strict Sync Protocol**: Agents CANNOT finish their turn without updating the file.

### Phase 3: Cleanup (Task Manager)
- **Trigger**: User confirms "Task Complete".
- **Action**:
  1. Archive: Move `.vibe-flow/active_spec.md` to `.vibe-flow/archive/spec_log_[date].md`.
  2. Delete: Remove `.vibe-flow/active_spec.md` (ensure directory remains).
  3. Reset: Clear chat context if needed.

## 4. Strict Sync Protocol

To prevent "Context Drift", all agents must adhere to the following protocol:

> **🛑 STOP & CHECK**
> Before you say "I'm done", check:
> 1. Did I modify code? -> Did I update the status in `active_spec.md`?
> 2. Did I make a design decision? -> Is it recorded in `active_spec.md`?
> 3. If `active_spec.md` does not exist -> Ask user "Should I create a spec file first?"

## 5. Spec Rotation System (Token Management)

Managed by `context-optimizer`.

- **Trigger**: `active_spec.md` > 300 lines.
- **Rotation**:
  1. Extract completed (`[x]`) items.
  2. Move them to `docs/archive/`.
  3. Replace with a summary line: `> [Previous Tasks Archived]`
- **Goal**: Keep the active context lightweight.

---

## Example: `active_spec.md` Template

```markdown
# Active Spec: User Authentication

## Goal
Implement JWT-based login system.

## Status
- [x] Design DB Schema (User table)
- [ ] Implement API Endpoints
  - [ ] POST /login
  - [ ] POST /register
- [ ] Unit Tests

## Technical Decisions
- Use `bcrypt` for password hashing.
- Token expiration: 1 hour.
```
