# claude-vibe-flow Distribution Strategy (2025)

> Single Source, Multi-Publish

---

## 1. 4 Core Distribution Models

| Category | Form | Target | Value |
|----------|------|--------|-------|
| **Intelligence** | GitHub Template | New Users (0→1) | Clone and start |
| **Intelligence** | npx CLI | Existing Projects (1→N) | Single command setup |
| **Intelligence** | Claude Plugin | Teams/Enterprise | Standardized, secure |
| **Action** | MCP Server | Advanced Users | External tool integration |

---

## 2. Current State

**✅ Implemented**: Claude Plugin
- `plugin.json` in repository root
- 16 agents, 2 commands, 1 skill registered
- Works with `claude --plugin-dir ./`

**⏸️ Deferred**: CLI, Template, MCP
- Plugin form is sufficient for current needs
- Other forms can be added when demand grows

---

## 3. Repository Structure

```
claude-vibe-flow/
├── .claude-plugin/
│   └── plugin.json      # Plugin definition
├── agents/              # 16 agent prompts
├── commands/            # Slash commands
├── skills/              # Skills
├── outputStyles/        # Quality styles
└── analysis/            # This directory
```

---

## 4. Distribution by Form

### 🟠 Claude Plugin (Current)

**Status**: Active, Primary

```bash
# Local testing
claude --plugin-dir ./claude-vibe-flow

# Validation
claude plugin validate ./claude-vibe-flow
```

**Update Flow**:
- Push to `main` → Plugin is up-to-date
- Users run `claude plugin update` to sync

### 🟢 GitHub Template (Future)

**Status**: Deferred

When needed:
1. Enable "Template repository" in settings
2. Users click "Use this template"
3. No separate maintenance required

### 🔵 npx CLI (Future)

**Status**: Deferred

When needed:
1. Create `bin/install.js`
2. Add to `package.json` as bin
3. Publish to npm

### 🟣 MCP Server (Future)

**Status**: Deferred

When needed:
1. Create `src/mcp/` TypeScript server
2. Register tools for external API access
3. Publish to Smithery/MCP Registry

---

## 5. Release Workflow

```
1. Modify agents/commands/skills
2. Update plugin.json version
3. git commit && git push
4. (Optional) git tag v1.x.x
```

---

## 6. Quality Gates

Before release, verify:

| Gate | Check |
|------|-------|
| **Context Efficiency** | Agent prompts < 500 tokens each |
| **Instruction Adherence** | Agents follow constraints |
| **Cross-Agent Sync** | pm-orchestrator routes correctly |

---

## 7. Decision: Why Plugin-Only?

| Form | Effort | Benefit | Decision |
|------|--------|---------|----------|
| Plugin | Low | Direct Claude Code integration | ✅ Now |
| Template | Low | Users can clone instead | ⏸️ Later |
| CLI | Medium | Manual copy works fine | ⏸️ Later |
| MCP | High | Context7/WebSearch suffice | ⏸️ Later |

**Principle**: Ship what works, expand when needed.

---

*Last updated: 2026-01-05*
