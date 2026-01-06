---
name: check
description: Unified environment validation command. Checks setup, MCP servers, and overall health. Use --setup, --mcp flags for specific checks.
tools: Bash, Read
---

# Check - Environment Validation

Unified command for validating the Vibe Coding environment.

## Usage

```bash
# Full check (default) - runs all validations
/claude-vibe-flow:check

# Setup only - validates agents, CLAUDE.md structure
/claude-vibe-flow:check --setup

# MCP only - validates MCP server configuration
/claude-vibe-flow:check --mcp
```

---

## Flags

| Flag | Scope | Checks |
|------|-------|--------|
| (none) | Full | Setup + MCP + Context |
| `--setup` | Setup | Agents, CLAUDE.md, plugin.json |
| `--mcp` | MCP | Context7, GitHub, Sequential Thinking |

---

## Validation Details

### Setup Validation (`--setup`)

#### 1. Agent Structure

```markdown
Required Agents (19):
- [ ] vibe-orchestrator
- [ ] idea-shaper
- [ ] planner
- [ ] architect
- [ ] vibe-implementer
- [ ] spec-validator
- [ ] code-reviewer
- [ ] test-generator
- [ ] test-quality-validator
- [ ] code-simplifier
- [ ] context-manager
- [ ] context-optimizer
- [ ] docs-sync
- [ ] readme-sync
- [ ] task-manager
- [ ] git-guardian
- [ ] issue-fixer
- [ ] research-agent
- [ ] agent-manager
```

#### 2. CLAUDE.md Structure

```markdown
Required Sections:
- [ ] Quick Reference (Commands)
- [ ] Agent List Table
- [ ] Core Rules
- [ ] Hook System
```

#### 3. Plugin Integrity

```markdown
Checks:
- [ ] plugin.json exists and is valid JSON
- [ ] All agent paths resolve to existing files
- [ ] All command paths resolve to existing files
```

---

### MCP Validation (`--mcp`)

#### Vibe Standard Stack

| Server | Purpose | Required |
|--------|---------|----------|
| `context7` | Documentation lookup | Recommended |
| `github` | GitHub integration | Optional |
| `sequential-thinking` | Complex reasoning | Optional |

#### Validation Steps

```markdown
1. Check .mcp.json exists
2. Parse and validate structure
3. List configured servers
4. Provide setup instructions for missing servers
```

---

## Output Format

### Full Check (Default)

```markdown
## 🔧 Vibe Environment Check

### Setup Status
| Component | Status | Details |
|-----------|--------|---------|
| Agents | ✅ 19/19 | All agents present |
| Commands | ✅ 13/13 | All commands present |
| CLAUDE.md | ✅ Valid | All sections present |
| plugin.json | ✅ Valid | Sync verified |

### MCP Status
| Server | Status | Notes |
|--------|--------|-------|
| context7 | ✅ Configured | Ready |
| github | ⚠️ Missing | Optional - add GITHUB_TOKEN |
| sequential-thinking | ✅ Configured | Ready |

### Context Status
| Item | Status |
|------|--------|
| .claude-vibe-flow/ | ✅ Exists |
| active_spec.md | ⚠️ Not found (OK if no active task) |

---

## Overall: ✅ Environment Ready

Tips:
- Run `/init` to set up context management
- Run `/vibe` to start building
```

### Setup Only (`--setup`)

```markdown
## 🔧 Setup Validation

### Agent Status
| Category | Count | Status |
|----------|-------|--------|
| Core Orchestration | 5/5 | ✅ |
| Quality & Verification | 5/5 | ✅ |
| Context & Documentation | 5/5 | ✅ |
| Utility & Support | 4/4 | ✅ |

### CLAUDE.md Status
| Section | Status |
|---------|--------|
| Quick Reference | ✅ |
| Agent List | ✅ |
| Core Rules | ✅ |

### Plugin Integrity
- ✅ plugin.json valid
- ✅ All 19 agent paths exist
- ✅ All 13 command paths exist

---

## Result: ✅ Setup Valid
```

### MCP Only (`--mcp`)

```markdown
## 🔌 MCP Server Status

### Configured Servers
| Server | Status | Config |
|--------|--------|--------|
| context7 | ✅ Active | npx -y @anthropic/context7-mcp |
| sequential-thinking | ✅ Active | npx -y @anthropic/sequential-thinking-mcp |

### Missing (Optional)
| Server | Purpose | Setup |
|--------|---------|-------|
| github | Issues/PRs | Add GITHUB_TOKEN to environment |

### Configuration File
Location: `.mcp.json`

---

## Result: ✅ MCP Ready

To add GitHub integration:
1. Create a GitHub personal access token
2. Add to your environment: export GITHUB_TOKEN=your_token
3. Restart Claude Code
```

---

## Error Handling

### Missing Agents

```markdown
## ⚠️ Setup Issues Found

### Missing Agents (2)
- idea-shaper
- spec-validator

### Fix
Run the following to reinstall:
```bash
npx claude-vibe-flow
```

Or manually create the missing agent files in `agents/`
```

### Invalid plugin.json

```markdown
## ❌ Plugin Error

plugin.json is invalid or missing.

### Fix
1. Check JSON syntax: `cat .claude-plugin/plugin.json | jq .`
2. Reinstall: `npx claude-vibe-flow`
```

---

## Related Commands

| Command | Relationship |
|---------|--------------|
| `/init` | Run after check passes to set up context |
| `/vibe` | Start building after environment is ready |
| `/resume` | Load existing context |
