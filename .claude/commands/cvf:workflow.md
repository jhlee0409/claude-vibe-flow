---
name: cvf:workflow
description: Execute a multi-step workflow with coordinated agent collaboration
arguments:
  - name: workflow_type
    description: "Workflow type: feature, secure, perf, ui, research, audit, debug"
    required: true
  - name: description
    description: Brief description of what to build or investigate
    required: false
allowed_tools: ["Read", "Write", "Edit", "Bash", "Grep", "Glob", "WebFetch", "TodoWrite", "TodoRead", "Task"]
---

# Multi-Step Workflow Command

Execute coordinated multi-agent workflows for complex tasks.

## Usage

```bash
/cvf:workflow feature "Add user authentication"
/cvf:workflow secure "Implement payment processing"
/cvf:workflow audit                              # Run pre-release audit
/cvf:workflow --auto feature "Add dark mode"    # Skip confirmations
```

## Available Workflows

| Type | Description | Agent Chain |
|------|-------------|-------------|
| `starter-webapp` | Greenfield app: scaffold, UI, arch, tests | planner → researcher → ui-ux → architect → implement → reviewer |
| `feature` | Standard feature development | planner → architect → implement → reviewer |
| `secure` | Security-sensitive feature | planner → security → architect → implement → security → reviewer |
| `perf` | Performance-critical feature | planner → architect → implement → performance → reviewer |
| `ui` | User-facing feature | planner → ui-ux → implement → reviewer |
| `research` | Unfamiliar tech/domain | planner → researcher → architect → implement → reviewer |
| `audit` | Pre-release verification | security + performance + reviewer (parallel) |
| `debug` | Complex bug investigation | debugger → (security or performance) → reviewer |

## Workflow Execution

### Step 1: Initialize

1. Parse workflow type and description
2. Create workflow tracking in `.claude-vibe-flow/workflow-state.json`
3. Initialize todo list with workflow phases

### Step 2: Execute Phases

For each phase in the workflow:

```
┌─────────────────────────────────────────────────────┐
│ Phase: [Agent Name]                                 │
├─────────────────────────────────────────────────────┤
│ Input: [Context from previous phase]                │
│ Task: [What this agent should do]                   │
│ Status: [pending/in_progress/completed/skipped]     │
└─────────────────────────────────────────────────────┘
```

**For each agent phase:**
1. Invoke the agent with appropriate context
2. Capture agent output
3. Summarize results
4. (Unless `--auto`) Ask user to confirm proceeding

### Step 3: Implementation Phase

When reaching implementation:
1. Use todo list from planner phase
2. Implement using Claude native capabilities
3. Run tests after implementation
4. Mark implementation complete

### Step 4: Verification Phase

Final verification includes:
- Run designated reviewer agent(s)
- Ensure tests pass
- Check for any issues raised during workflow

## Flags

| Flag | Effect |
|------|--------|
| `--auto` | Skip confirmation prompts between phases |
| `--skip-tests` | Skip test running (not recommended) |
| `--dry-run` | Show workflow plan without executing |

## State Tracking

Workflow state is persisted in `.claude-vibe-flow/workflow-state.json`:

```json
{
  "workflow_id": "wf_abc123",
  "type": "feature",
  "description": "Add user authentication",
  "started_at": "2024-01-01T00:00:00Z",
  "current_phase": 2,
  "phases": [
    {"name": "planning", "agent": "cvf-planner", "status": "completed"},
    {"name": "architecture", "agent": "cvf-architect", "status": "in_progress"},
    {"name": "implementation", "agent": null, "status": "pending"},
    {"name": "review", "agent": "cvf-reviewer", "status": "pending"}
  ],
  "context": {
    "spec": "...",
    "architecture_decisions": "..."
  }
}
```

## Resuming Workflows

If a workflow is interrupted:
1. Check for existing state in `.claude-vibe-flow/workflow-state.json`
2. Offer to resume from last completed phase
3. Maintain context from previous phases
4. For emergency rollback, use `/rewind` (double ESC) to create/apply checkpoint (maps to `git stash push -u -m "checkpoint: ..."`)

## Example: Starter Webapp Workflow

```bash
/cvf:workflow starter-webapp "Bootstrap React TS webapp"
```

**Execution (UI text must be English; use /rewind before scaffold for safety):**

```
═══════════════════════════════════════════════════════
  Workflow: starter-webapp
  Description: Bootstrap React TS webapp
═══════════════════════════════════════════════════════

Phase 1/6: Planning (cvf-planner)
────────────────────────────────────────────────────────
Goal:
- [ ] Define MVP routes (/, /auth, /dashboard)
- [ ] Choose template source and license
- [ ] Identify hosting/build target

Phase 2/6: Research (cvf-researcher)
────────────────────────────────────────────────────────
Findings:
- Template candidates: vite-react-template, react-typescript-starter
- UI strings must be English
- Accessibility: include focus styles + aria-labels

Phase 3/6: UI/UX (cvf-ui-ux)
────────────────────────────────────────────────────────
Baseline kit:
- [ ] Layout shell (header/sidebar/content)
- [ ] Primary/secondary button styles (English labels)
- [ ] Form inputs with aria labels and error text in English

Phase 4/6: Architecture (cvf-architect)
────────────────────────────────────────────────────────
Decisions:
- Vite + React + TS
- State: minimal context + hooks
- Routing: react-router
- Build: npm run build

Phase 5/6: Implementation
────────────────────────────────────────────────────────
[Implementation progress...]
- [ ] Scaffold template
- [ ] Wire routes
- [ ] Add lint/typecheck scripts
- [ ] Ensure UI text is English

Phase 6/6: Review (cvf-reviewer)
────────────────────────────────────────────────────────
Checklist:
- [ ] Typecheck/build pass
- [ ] UI text English-only
- [ ] Accessibility basics present
- [ ] Tests (if provided) pass

═══════════════════════════════════════════════════════
  Workflow Complete ✓
  Duration: ~15-25 minutes
═══════════════════════════════════════════════════════
```

## Example: Feature Workflow

```bash
/cvf:workflow feature "Add user profile page"
```

**Execution:**

```
═══════════════════════════════════════════════════════
  Workflow: feature
  Description: Add user profile page
═══════════════════════════════════════════════════════

Phase 1/4: Planning (cvf-planner)
────────────────────────────────────────────────────────
[cvf-planner output...]

MVP Scope:
- [ ] Create ProfilePage component
- [ ] Add /profile route
- [ ] Fetch user data from API
- [ ] Display user info

Continue to Architecture phase? [Y/n]

Phase 2/4: Architecture (cvf-architect)
────────────────────────────────────────────────────────
[cvf-architect output...]

Decisions:
- Use existing UserContext for state
- Add ProfileService for API calls
- Component structure: ProfilePage → ProfileHeader + ProfileContent

Continue to Implementation phase? [Y/n]

Phase 3/4: Implementation
────────────────────────────────────────────────────────
[Implementation progress...]
✓ Created ProfilePage component
✓ Added /profile route
✓ Created ProfileService
✓ Tests passing

Continue to Review phase? [Y/n]

Phase 4/4: Review (cvf-reviewer)
────────────────────────────────────────────────────────
[cvf-reviewer output...]

Review Summary:
- Code quality: ✓
- Test coverage: ✓
- No security issues
- Minor suggestion: Add loading state

═══════════════════════════════════════════════════════
  Workflow Complete ✓
  Duration: 12 minutes
═══════════════════════════════════════════════════════
```

## Error Handling

If a phase fails:
1. Stop workflow execution
2. Report error with context
3. Offer options:
   - Retry current phase
   - Skip current phase (if optional)
   - Abort workflow
   - Debug with cvf-debugger

## Collaboration

This command works with:
- **cvf-planner**: Orchestrates workflows, defines phases
- **All other cvf-* agents**: Invoked as needed per workflow type
- **verify-before-commit skill**: Verifies quality gates before committing
