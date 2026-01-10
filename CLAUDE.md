# CLAUDE.md - claude-vibe-flow

## Project Overview

A lightweight framework for Claude Code that streamlines development workflows with specialized agents and commands.

**Version**: 1.0.0  
**Node.js**: >= 20.0.0  
**Repository**: https://github.com/jhlee0409/claude-vibe-flow

## Quick Reference

```bash
# Installation
npx claude-vibe-flow

# Development
npm run build        # Compile TypeScript
npm test            # Run tests
npm run typecheck   # Type check
```

## Architecture

```
.claude/
├── agents/                       # 10 specialized agents
│   ├── cvf-orchestrator.md      # Master coordinator (vibe coding)
│   ├── cvf-planner.md           # Idea → spec
│   ├── cvf-applier.md           # Apply confirmed alternatives
│   ├── cvf-reviewer.md          # Code review
│   ├── cvf-debugger.md          # Bug fixing
│   ├── cvf-architect.md         # System architecture
│   ├── cvf-security.md          # Security analysis
│   ├── cvf-performance.md       # Performance optimization
│   ├── cvf-researcher.md        # External research
│   └── cvf-ui-ux.md             # UI/UX design
├── skills/                       # Model-invoked
│   └── verify-before-commit/SKILL.md
├── commands/                     # User-invoked
│   ├── cvf:plan.md, cvf:review.md, cvf:ship.md, cvf:check.md, cvf:workflow.md
├── scripts/                      # Utility scripts
│   ├── detect-test-framework.sh
│   ├── load-context.sh
│   └── run-tests.sh             # Optional test runner
└── hooks.json                    # SessionStart hook
```

## Core Concept

```
Claude implements → Agents assist → Commands orchestrate
```

- **Claude**: Does the implementation (native capability)
- **Agents**: Specialized assistants for specific domains
- **Commands**: User-invoked workflows

## Hooks

| Hook | Trigger | Behavior |
|------|---------|----------|
| `SessionStart` | Session begins | Load context from `.claude-vibe-flow/` |

## Skills

Skills are auto-invoked by Claude based on context.

### verify-before-commit
- Triggers before: "commit", "push", "ship", "PR"
- Checks: diagnostics, tests, TODOs, formatting

## Agents

| Agent | Use When |
|-------|----------|
| `cvf-orchestrator` | User wants to build a product ("build me...", "make an app...") |
| `cvf-planner` | Vague idea needs structure |
| `cvf-applier` | User confirms alternative ("이걸로 해줘", "apply this", "go with option B") |
| `cvf-reviewer` | Explicit code review request |
| `cvf-debugger` | Bug reports, errors |
| `cvf-architect` | Architecture decisions, system design |
| `cvf-security` | Security concerns, auth, vulnerabilities |
| `cvf-performance` | Performance issues, optimization |
| `cvf-researcher` | Library selection, best practices lookup |
| `cvf-ui-ux` | UI design, styling, accessibility |

## Commands

| Command | Action |
|---------|--------|
| `/cvf:plan "idea"` | Create implementation spec |
| `/cvf:review` | Code review on changes |
| `/cvf:ship` | Verify → commit → push → PR |
| `/cvf:check` | Show verification status |
| `/cvf:workflow type "desc"` | Execute multi-agent workflow |

## Running Tests (Optional)

```bash
# Use the provided script
bash .claude/scripts/run-tests.sh

# Or run directly
npm test
```

## Development

### File Structure

```
src/cli.ts          # npx installer
tests/unit/         # Vitest tests
docs/               # Migration docs
```

### Adding Features

1. Skills go in `.claude/skills/<name>/SKILL.md`
2. Commands go in `.claude/commands/<name>.md`
3. Agents go in `.claude/agents/<name>.md`

### Testing

```bash
npm test                    # All tests
npm run test:watch          # Watch mode
```

---

## 🚨 Implementation Protocol (MANDATORY DELEGATION)

> **모든 코드 변경은 `cvf-applier` 에이전트를 통해 실행해야 한다.**

### 강제 위임 규칙

| 조건 | 행동 |
|------|------|
| 2+ 파일 변경 | **MUST** invoke `cvf-applier` |
| 타입/인터페이스 변경 | **MUST** invoke `cvf-applier` |
| API 수정 | **MUST** invoke `cvf-applier` |
| 인증/보안 코드 | **MUST** invoke `cvf-applier` |
| 데이터베이스/데이터 변경 | **MUST** invoke `cvf-applier` |
| 사용자 확정 ("이걸로 해줘", "apply this") | **MUST** invoke `cvf-applier` |

### 예외 (직접 처리 가능)

**모든 조건을 충족해야 함:**
- 단일 파일만 변경
- 10줄 미만 변경
- 타입/인터페이스 변경 없음
- 테스트 파일 업데이트 불필요
- 순수 코스메틱 (오타, 주석)

**예외 시에도 `lsp_diagnostics` 검증 필수.**

### 프로토콜 상세

전체 구현 프로토콜은 `.claude/agents/cvf-applier.md` 참조:
- Phase 0: Checkpoint (안전망)
- Phase 1: Impact Analysis (영향 분석)
- Phase 2: Risk Assessment (리스크 평가 & Go/No-Go)
- Phase 3: Implementation Plan (구현 계획)
- Phase 4: Incremental Implementation (증분 구현)
- Phase 5: Verification Gates (검증 게이트)
- Phase 6: Completion Report (완료 보고)

### 핵심 규칙 요약

```
CHECKPOINT → ANALYZE → ASSESS → PLAN → IMPLEMENT → VERIFY
```

| 규칙 | 내용 |
|------|------|
| **Zero Assumptions** | 확인 안 되면 가정하지 말고 확인하라 |
| **Incremental** | 한 번에 최대 3개 파일, 각 파일마다 검증 |
| **No Type Suppression** | `as any`, `@ts-ignore`, `@ts-expect-error` 금지 |
| **3-Strike Rollback** | 3회 연속 실패 시 체크포인트로 롤백 |
| **Evidence Required** | 완료 보고 시 검증 결과 증거 필수 |
| **Use ASCII Flow Diagrams** | 프로세스·플로우·계획 설명 시 상자·선(│, ─, ┌┐└┘, ▼, ▲, ◀, ▶)을 활용한 텍스트 다이어그램으로 단계·계층을 명확히 표기 |

### 위반 시

프로토콜 위반 발견 시:
1. 즉시 작업 중단
2. 사용자에게 솔직히 알림
3. `cvf-applier` 재호출로 정상 플로우 복귀
