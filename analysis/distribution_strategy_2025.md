# claude-vibe-flow Distribution Strategy (2025-2026)

> Standard Stack for Autonomous Coding

---

## 1. The 4 Core Distribution Models

We distribute Vibe Flow in four distinct forms to match user needs.

| Model | Form | Target | Value |
|-------|------|--------|-------|
| **1. Intelligence** | **Claude Plugin** | Teams/Enterprise | Standardized, secure integration. (Current) |
| **2. Intelligence** | **GitHub Template** | New Users (0→1) | "Clone & Go". Requires Setup Guide. |
| **3. Intelligence** | **npx CLI** | Existing Projects (1→N) | "Vibe Doctor" injection. |
| **4. Action** | **MCP Server** | Power Users | Modular tool usage. |

---

## 2. Detailed Strategy by Model

### A. Claude Plugin (Current Mainstream)
- **Status**: Stable.
- **Delivery**: `git clone` + `claude plugin add`.
- **Pros**: Direct integration with Claude Code.

### B. GitHub Template (The Growth Engine) 🚀
*Target: New Projects*

This is the primary channel for new users. However, we must handle the "Cold Start" problem.

**Dual-Track Guide for Template Users:**

| User Type | Condition | Action Guide |
|-----------|-----------|--------------|
| **Track A (Veteran)** | Has `claude` CLI | 1. Clone Repo<br>2. Run `./scripts/setup_vibe.sh` |
| **Track B (Newcomer)** | No `claude` CLI | 1. **Install Prerequisites**: `npm i -g @anthropic-ai/claude-code`<br>2. Clone Repo<br>3. Run Setup |

> **Note**: The `README.md` must prominently display this Track B guide.

### C. npx CLI (The Expansion Engine)
*Target: Brownfield Projects*

- **Command**: `npx create-vibe-flow` (Future)
- **Strategy**: Wraps `setup_vibe.sh` into a standalone binary.
- **Goal**: Inject Vibe Standard Stack into *any* project.

### D. MCP Server (The Component)
- **Strategy**: Distribute individual tools (like `issue-fixer`) via Smithery.io later.

---

## 3. Growth Strategy (The Viral Loop)

### A. Artifact Sharing
Leverage the `walkthrough.md` artifact. This file serves as concrete proof of the system's automated debugging and reporting capabilities, encouraging users to share their results.

### B. Community Configuration
Allow users to share custom `task.md` templates and agent prompts, similar to how dotfiles or shell configurations are shared.

---

## 5. Immediate Action Plan (Q1 2026)

### Phase 1: Foundation (Completed)
- [x] Stable Plugin Architecture
- [x] Automated Installer (`setup_vibe.sh`)
- [x] Standard Stack Definition

### Phase 2: Documentation (In Progress)
- [ ] **Landing Page**: GitHub Pages or README.io.
- [ ] **Demo**: Technical demonstration of the `/fix-bug` command.
- [ ] **Technical Blog**: Explanation of the autonomous coding workflow.

### Phase 3: Community Growth
- [ ] **Twitter Strategy**:
    - [ ] "Day 1": Announcement thread focusing on "The Flow" (not just the tool).
    - [ ] "Day 3": Share `walkthrough.md` examples as "Proof of Work".
    - [ ] "Day 7": Retweet user success stories (The "Vibe Check").
- [ ] **Discord Strategy**:
    - [ ] Establish a dedicated `#vibe-coding` channel.
    - [ ] Pin `setup_vibe.sh` instruction as the entry point.
    - [ ] Weekly "Prompt Sharing" session to encourage `task.md` template exchange.

---

## 6. Success Metrics

1.  **Template Usage**: Number of repository forks/usage.
2.  **Retention**: Frequency of `/sync-context` usage (indicating sustained use).
3.  **Contributions**: Pull requests for new MCP integrations.

---

*Last Refined: 2026-01-05*
