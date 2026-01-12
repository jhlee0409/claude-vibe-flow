# Claude Vibe Flow

[한국어](README.ko.md) | **English**

A lightweight framework for [Claude Code](https://github.com/anthropics/claude-code) that streamlines development workflows with specialized agents, commands, and skills.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![npm version](https://img.shields.io/npm/v/claude-vibe-flow)](https://www.npmjs.com/package/claude-vibe-flow)

## Features

- **10 Specialized Agents**: cvf-orchestrator, cvf-planner, cvf-applier, cvf-reviewer, cvf-debugger, cvf-architect, cvf-security, cvf-performance, cvf-researcher, cvf-ui-ux
- **5 Essential Commands**: /cvf:plan, /cvf:review, /cvf:ship, /cvf:check, /cvf:workflow
- **7 Tiered Skills**: Progressive loading skills (Discovery→Overview→Specific→Generate) for api-design, database-schema-designer, test-automator, security-scanning, prompt-caching, rag-retrieval, verify-before-commit
- **Pre-commit Verification**: Diagnostics + tests + TODOs checked before commit
- **Vibe Coding Support**: Natural language to shipped product with cvf-orchestrator
- **Safety Nets**: Branch guard, pre-commit gate, TODO stop, checkpoint system

## Installation

### For Existing Projects
```bash
cd your-project
npx claude-vibe-flow
claude
```

### For New Projects
```bash
mkdir my-app && cd my-app
git init
npx claude-vibe-flow
claude
```

## Usage

### Build Products with Natural Language
```bash
"Build me a habit tracking app"
"I need a dashboard that shows my GitHub stats"
"Quick landing page for my side project"
```
The `cvf-orchestrator` automatically coordinates planning, architecture, implementation, and review.

### Planning
```bash
/cvf:plan "Add user authentication"
```
Turns vague ideas into concrete specs with MVP scope.

### Code Review
```bash
/cvf:review                    # Review all changes
/cvf:review src/auth.ts        # Review specific file
```

### Ship (Commit + Push + PR)
```bash
/cvf:ship                      # Verify → commit → push → PR
/cvf:ship "feat: add auth"     # With custom message
```

### Check Status
```bash
/cvf:check                     # Full verification status
```

### Multi-Step Workflow
```bash
/cvf:workflow starter-webapp "Bootstrap React TS webapp"    # Full webapp workflow
/cvf:workflow feature "Add user profile page"             # Feature development
/cvf:workflow secure "Handle payment flow"                 # Security-focused
/cvf:workflow perf "Optimize slow queries"                  # Performance tuning
/cvf:workflow ui "Redesign settings page"                 # UI/UX work
/cvf:workflow research "Compare auth libraries"            # External research
/cvf:workflow audit                                       # Pre-release audit
/cvf:workflow debug "Fix login bug"                       # Bug fixing
```
Coordinates multiple agents for complex tasks.

## Directory Structure

```
your-project/
├── .claude/
│   ├── agents/                  # 10 specialized agents
│   │   ├── cvf-orchestrator.md  # Master coordinator (vibe coding)
│   │   ├── cvf-planner.md       # Idea → concrete spec
│   │   ├── cvf-applier.md       # Apply confirmed alternatives
│   │   ├── cvf-reviewer.md      # Code review
│   │   ├── cvf-debugger.md      # Bug fixing
│   │   ├── cvf-architect.md     # System architecture
│   │   ├── cvf-security.md      # Security analysis
│   │   ├── cvf-performance.md   # Performance optimization
│   │   ├── cvf-researcher.md    # External research
│   │   └── cvf-ui-ux.md         # UI/UX design
│   ├── commands/                # 5 slash commands
│   │   ├── cvf:plan.md          # Plan new features
│   │   ├── cvf:review.md        # Request code review
│   │   ├── cvf:ship.md          # Commit + push + PR
│   │   ├── cvf:check.md         # Show verification status
│   │   └── cvf:workflow.md      # Execute multi-agent workflows
│   ├── skills/                  # 7 tiered skills (progressive loading)
│   │   ├── api-design/          # API design patterns
│   │   ├── database-schema-designer/  # Database design
│   │   ├── test-automator/      # Test automation
│   │   ├── security-scanning/   # Security analysis
│   │   ├── prompt-caching/      # Prompt optimization
│   │   ├── rag-retrieval/       # RAG implementation
│   │   └── verify-before-commit/    # Pre-commit verification
│   ├── scripts/                 # Safety net scripts
│   │   ├── branch-guard.sh      # Protect main branch
│   │   ├── pre-commit-gate.sh   # Verify before commit
│   │   ├── todo-stop.sh         # Block commits with open TODOs
│   │   ├── load-context.sh      # Load session context
│   │   └── run-tests.sh         # Run tests
│   └── hooks.json               # SessionStart hook
├── .github/
│   ├── ISSUE_TEMPLATE/          # Issue templates
│   └── workflows/
│       └── ci.yml               # CI/CD workflow
├── docs/                        # Project documentation
│   ├── active-spec-protocol.md  # Spec management rules
│   ├── architecture-critical-analysis.md  # Architecture decisions
│   ├── migration-plan-v2.md    # Migration guide
│   └── v2-critical-review.md   # v2 review summary
├── CLAUDE.md                    # Framework instructions (Korean)
├── CONTRIBUTING.md             # Contribution guidelines
└── .mcp.json                   # MCP servers config
```

## Agents

| Agent | Triggers On | Purpose |
|-------|-------------|---------|
| `cvf-orchestrator` | "Build me...", "Make an app that...", "I want to create..." | End-to-end product building |
| `cvf-planner` | "Help me plan...", "How should I approach..." | Turn ideas into specs |
| `cvf-applier` | "이걸로 해줘", "Apply this", "Go with option B" | Apply confirmed alternatives with analysis |
| `cvf-reviewer` | "Review my code", "Check this PR" | Code review |
| `cvf-debugger` | "It's broken", "Getting an error" | Bug fixing |
| `cvf-architect` | "How should I structure...", "Design this..." | System architecture |
| `cvf-security` | "Is this secure?", "Adding auth..." | Security analysis |
| `cvf-performance` | "This is slow", "Optimize..." | Performance tuning |
| `cvf-researcher` | "What library should I use?", "Best practices for..." | External research |
| `cvf-ui-ux` | "Design a component", "Make this look better" | UI/UX design |

## Commands

| Command | Description |
|---------|-------------|
| `/cvf:plan` | Plan a new feature |
| `/cvf:review` | Request code review |
| `/cvf:ship` | Commit + push + create PR |
| `/cvf:check` | Show verification status |
| `/cvf:workflow` | Execute multi-agent workflow |

## Skills (Progressive Loading)

Skills use progressive loading to save tokens - only load detailed references when needed.

| Skill | Purpose | Trigger |
|-------|---------|---------|
| `api-design` | REST/GraphQL API design patterns | API endpoint creation |
| `database-schema-designer` | Database modeling and relationships | Database design |
| `test-automator` | Automated test generation | Testing workflows |
| `security-scanning` | Security vulnerability analysis | Security concerns |
| `prompt-caching` | Prompt optimization techniques | Performance tuning |
| `rag-retrieval` | RAG implementation patterns | AI/Search features |
| `verify-before-commit` | Pre-commit verification gates | Commit/push/PR operations |

Each skill has 4 tiers:
- **Discovery**: Usage conditions and triggers
- **Overview**: Core workflow and checklists
- **Specific**: Detailed guides (loaded on demand)
- **Generate**: Scripts and templates (loaded on demand)

## SSOT Principles (Single Source of Truth)

> **"Build it right the first time, so modifications are easy later."**

Claude Vibe Flow enforces SSOT architecture to minimize side effects when users request changes.

### Why SSOT?

```
Week 1: "Build login" → CVF creates SSOT structure
Week 2: "Add signup" → Reuses existing validation
Week 3: "Change password rules" → Update ONE file, all forms updated
Week 4: "Add 2FA" → Extend existing logic, no side effects
```

**Without SSOT**: Change breaks multiple files, user frustrated.
**With SSOT**: Change in one place, everything works.

### File Structure

```
src/
  core/<domain>/           ← Business logic (SSOT)
    validation.ts          ← All validation rules
    logic.ts               ← All domain logic
  api/<domain>.ts          ← All API calls (SSOT)
  types/<domain>.ts        ← All type definitions (SSOT)
  constants/<domain>.ts    ← All constants (SSOT)
  components/<Feature>/    ← UI only (NO business logic)
  hooks/use<Domain>.ts     ← State management only
  utils/                   ← Pure functions only
```

### SSOT Rules (Enforced)

| Code Type | SSOT Location | Never Put In |
|-----------|---------------|--------------|
| Validation/Business rules | `src/core/<domain>/` | Components, Hooks |
| API calls | `src/api/<domain>.ts` | Components |
| Type definitions | `src/types/<domain>.ts` | Inline in components |
| Constants/Config | `src/constants/` | Hardcoded anywhere |

### Agent Enforcement

| Agent | SSOT Role |
|-------|-----------|
| `cvf-planner` | Plans SSOT file structure |
| `cvf-architect` | Designs with SSOT principles |
| `cvf-applier` | Implements in SSOT locations + verifies |
| `cvf-reviewer` | Blocks SSOT violations as Critical |

**SSOT violations are treated as Critical issues and block commits.**

## Safety Nets

### Branch Guard
- Protects `main` branch from direct commits
- Suggests `feature/*` or `checkpoint/*` branches

### Pre-commit Gate
- Runs `typecheck → test → lint` before commit
- Fails if any gate fails
- Use `ALLOW_UNSAFE=1` to bypass (not recommended)

### TODO Stop
- Blocks commits if open TODOs exist
- Ensures tasks are completed before shipping

### Checkpoint System
- Use `/rewind` (ESC ESC) or `git stash` to create checkpoints
- Safe rollback when experiments go wrong

## Running Tests (Optional)

Tests can be run manually when needed:

```bash
bash .claude/scripts/run-tests.sh
```

Auto-detected frameworks:
- **Node.js**: Jest, Vitest, Mocha
- **Python**: Pytest
- **Go**: go test
- **Rust**: cargo test
- **Ruby**: RSpec, Minitest

Custom: Create `.claude-vibe-flow/test-command.txt` with your test command.

## MCP Servers

Pre-configured in `.mcp.json`:
- **Context7**: Documentation lookup
- **GitHub**: Issues and PRs (requires `GITHUB_TOKEN`)

## Development

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Run tests
npm test

# Type check
npm run typecheck
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE)
