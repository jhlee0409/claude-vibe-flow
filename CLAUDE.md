# CLAUDE.md - claude-vibe-flow

> 모든 설명/주석/문서는 **한글**, UI 텍스트는 **영어**로 유지합니다.

## 1) Project Overview
- Claude Code용 경량 프레임워크: 에이전트·커맨드·스킬로 아이디어→아키텍처→구현→검증 자동화
- **Version**: 1.0.0 · **Node.js**: >= 20 · **Repo**: https://github.com/jhlee0409/claude-vibe-flow
- 주요 자산: 10 에이전트, 5 명령어, 다계층 스킬(프로그레시브 로딩), 훅/스크립트 기반 안전망

## 2) Quick Reference (필수 커맨드)
```bash
npm run build        # Build TypeScript
npm run typecheck    # tsconfig 기반 타입 체크
npm test             # Vitest 단위/통합 테스트
npm run lint         # ESLint (있다면 실행)
```
- 설치: `npx claude-vibe-flow`
- 테스트 스크립트: `bash .claude/scripts/run-tests.sh`

## 3) Directory Map (요약)
```
.claude/
  agents/      # 10 specialized agents
  commands/    # /cvf:* 명령어 정의
  skills/      # tiered skills (Discovery→Overview→Specific→Generate)
  scripts/     # detect-test-framework.sh, load-context.sh, run-tests.sh
  hooks.json   # SessionStart 등 훅 설정
src/            # cli.ts 등
tests/unit/     # Vitest 테스트
docs/           # 프로토콜/마이그레이션 문서
```
- 추가 문서: docs/active-spec-protocol.md, architecture-critical-analysis.md, migration-plan-v2.md, v2-critical-review.md

## 4) Agents & Skills (Progressive Loading)
- 에이전트: cvf-orchestrator, cvf-planner, cvf-applier, cvf-reviewer, cvf-debugger, cvf-architect, cvf-security, cvf-performance, cvf-researcher, cvf-ui-ux
- 명령어: /cvf:plan, /cvf:review, /cvf:ship, /cvf:check, /cvf:workflow
- 스킬(티어): Discovery→Overview→Specific→Generate
  - api-design, database-schema-designer, test-automator, security-scanning, prompt-caching, rag-retrieval, verify-before-commit
- 프로그레시브 로딩 원칙: 필요 시점에만 상세 문서/레퍼런스/스크립트 로드하여 토큰 절약

## 5) Golden Rules
- UI 텍스트는 항상 **영어** (버튼/라벨/에러/토스트/placeholder). 주석·문서는 한글 허용
- 타입 억제 금지: `as any`, `@ts-ignore`, `@ts-expect-error` 사용 불가
- cvf-applier 트리거: 2+ 파일, 타입/인터페이스, API, 보안/데이터, 사용자 확정 문구("이걸로 해줘", "apply this" 등)
- 프런트엔드 시각/레이아웃 변경은 `cvf-ui-ux` 에이전트로 위임 (접근성/영문 UI 확인)
- 체크포인트 후 작업: `/rewind`(ESC ESC) 또는 `git stash push -u -m "checkpoint: ..."`

## 6) SSOT Principles (Single Source of Truth)

> "처음부터 잘 짜서, 나중에 수정이 쉽게" — 사용자 스트레스 최소화

### 핵심 철학
사용자는 코드를 보지 않고 제품을 만듭니다. 나중에 기능 추가/수정 요청 시 **사이드 이펙트 없이** 한 파일만 수정하면 모든 곳에 반영되어야 합니다.

### 파일 구조 원칙
```
src/
  core/<domain>/       ← 비즈니스 로직 (SSOT)
    validation.ts      ← 모든 검증 규칙
    logic.ts           ← 모든 도메인 로직
  api/<domain>.ts      ← 모든 API 호출
  types/<domain>.ts    ← 모든 타입 정의
  constants/<domain>.ts ← 모든 상수
  components/<Feature>/ ← UI만 (비즈니스 로직 금지)
  hooks/use<Domain>.ts  ← 상태 관리만
  utils/               ← 순수 함수만
```

### SSOT 배치 규칙 (BLOCKING)
| 코드 유형 | SSOT 위치 | 절대 금지 위치 |
|----------|----------|---------------|
| Validation/비즈니스 규칙 | `src/core/<domain>/` | Components, Hooks |
| API 호출 | `src/api/<domain>.ts` | Components |
| 타입 정의 | `src/types/<domain>.ts` | Component 내 inline |
| 상수/설정 | `src/constants/` | 하드코딩 |

### 왜 SSOT인가?
```
Week 1: "로그인 만들어줘" → SSOT 구조로 구현
Week 2: "회원가입 추가" → 기존 validation 재사용
Week 3: "비밀번호 규칙 변경" → validation.ts 1개 파일만 수정 → 모든 폼 자동 업데이트
Week 4: "2FA 추가" → 기존 로직 확장, 사이드 이펙트 없음
```

### SSOT 위반 = BLOCKING ERROR
- 컴포넌트에 validation 로직 작성 → ❌ 중단, `src/core/`로 추출
- 컴포넌트에 API 호출 직접 작성 → ❌ 중단, `src/api/`로 추출
- 기존 로직 복사 → ❌ 중단, import로 재사용

### 에이전트별 SSOT 적용
- `cvf-planner`: 계획 시 SSOT 파일 구조 결정
- `cvf-architect`: 설계 시 SSOT 원칙 적용
- `cvf-applier`: 구현 시 SSOT 검증 + 위반 시 차단

## 7) Workflow Patterns
- **Starter Webapp**: planner → researcher → ui-ux → architect → implement → reviewer
  - Scaffold → UI/접근성 → 아키텍처 결정 → 구현 → 리뷰, 전 단계 UI 영어 확인
- **Bugfix**: debugger → (security/performance 필요 시) → reviewer, 재현 로그 우선, 최소 변경
- **Secure**: planner → security → architect → implement → security → reviewer
  - 입력 검증, 비밀 외부화, least privilege, 출력 인코딩, audit 체크
- 워크플로 실행: `/cvf:workflow <type> "desc"` (starter-webapp/feature/secure/perf/ui/research/audit/debug)

## 8) Testing & Verification
- 변경 파일마다 `lsp_diagnostics` 실행 (문서형 파일도 시도 후 결과 기록)
- 표준 게이트: `npm run typecheck` → `npm test` → `npm run lint` → `npm run build`(필요 시)
- verify-before-commit 스킬: ship/commit/push/PR 전 게이트 자동 확인
- 테스트 없는 경우: 테스트 전략/커버리지 계획을 노트에 남김

## 9) Hooks & Safety Nets
- Branch Guard: main 보호, feature/* 또는 checkpoint/* 권장 (`.claude/scripts/branch-guard.sh`)
- Pre-commit Gate: `.claude/scripts/pre-commit-gate.sh` → `typecheck → test → lint`, 실패 시 차단. `ALLOW_UNSAFE=1` 사용 시 결과 보고 필수
- TODO Stop: `.claude/scripts/todo-stop.sh` – 열려있는 TODO 있으면 중단
- SessionStart: `.claude/scripts/load-context.sh` 로 컨텍스트 로드
- Prompt Keywords: "build", "apply this", "optimize", "auth" 등 시 관련 에이전트 자동 제안
- Checkpoint: `/rewind`(ESC ESC) 또는 stash/branch로 안전망 확보 후 진행

## 10) Update Policy
- 자동 권고: 24h마다 버전/훅/스킬 변경사항 점검
- 수동 점검: `/cvf:check` 또는 `/cvf:workflow audit`
- 버전 메타: `~/.claude/.cvf-version.json`에 최근 검사 시점/버전 기록
- 갱신 흐름: /cvf:check → 필요 시 /cvf:plan 또는 /cvf:workflow audit → 변경 적용 → verify-before-commit 후 ship

## 11) Security & Secrets
- 비밀/토큰/자격증명은 코드/로그에 금지, env/secret manager 사용
- 입력 검증 + 출력 인코딩 필수, SQL은 파라미터 바인딩, XSS 방지
- 최소 권한(least privilege)·역할 기반 접근, 민감 로그 최소화
- 보안 터치 시 `cvf-security`로 이중 점검, `npm audit`/SAST 권장

## 12) UI Text Guidelines (영어 전용)
- Buttons: "Confirm", "Cancel", "Save", "Delete"
- Toasts: "Changes saved successfully", "An error occurred"
- Placeholders: "Enter email", "Enter password"
- Errors: "This field is required", "Please try again"
- 주석/문서 예시: 한글 가능. UI 문자열은 항상 영어 유지

## 13) Commit / PR Discipline
- 커밋 전: `lsp_diagnostics` + typecheck + test + lint 모두 통과
- 금지: force push main, 타입 억제, 큰 배치(>3파일/50라인) 변경
- PR: 요약, 위험, 검증 결과, 스크린샷(필요 시) 포함; UI 영어 여부 확인
- verify-before-commit 스킬로 게이트 확인 후 `/cvf:ship` 사용

## 14) Anchor Comments (권장)
- 목적/이유/엣지케이스를 간결히 한글로 남김
- UI 텍스트는 영어로 유지, 주석은 한글 가능
- 예시: `// 에러 처리: 재시도 3회 후 fallback 응답 반환`

## 15) Additional Docs (@docs 참조)
- `docs/active-spec-protocol.md`: active_spec 관리 규칙 및 훅 연계
- `docs/architecture-critical-analysis.md`: 아키텍처 판단 기준
- `docs/migration-plan-v2.md`: v2 마이그레이션 계획
- `docs/v2-critical-review.md`: v2 리뷰 및 리스크 요약
- README.md / README.ko.md: 프로젝트 개요 및 사용법

## 16) Implementation Protocol (cvf-applier 필수)
- 모든 코드 변경 시 cvf-applier 단계 준수 (Checkpoint→Analyze→Assess→Plan→Implement→Verify)
- 예외(직접 처리 가능): 단일 파일, 10줄 미만, 타입/인터페이스/테스트 영향 없음, 순수 코스메틱
- 실패 3회 연속 시 체크포인트로 롤백, 증거 남기기
- 한 번에 최대 3파일, 파일당 ~50라인 이내 증분 변경 권장

## 17) Workflow Snippets (UI 영어 예시)
- Starter Webapp: `/cvf:workflow starter-webapp "Bootstrap React TS webapp"`
- Feature: `/cvf:workflow feature "Add user profile page"`
- Secure: `/cvf:workflow secure "Handle payment flow"`
- Checkpoint: `/rewind` → "Restore checkpoint? (Y/n)"

## 18) Troubleshooting 패턴
- 오류/버그 보고: `cvf-debugger` 호출, 재현 절차 기록, 최소 변경 우선
- 성능 문제: `cvf-performance` 호출, 측정→가설→완화 순서
- 외부 라이브러리/베스트프랙티스: `cvf-researcher` 호출

## 19) Skills Progressive Tiers (요약)
- Discovery: 사용 조건·트리거를 짧게 식별
- Overview: 핵심 워크플로, 체크리스트, 출력 포맷
- Specific: references/* 세부 가이드 (조건부 로드)
- Generate: scripts/assets 예시·템플릿 (필요 시 실행)
- 스킬 위치: `.claude/skills/<name>/SKILL.md` (필수), references/examples/scrips는 필요 시 추가

## 20) Hooks & Scripts 링크
- Branch guard: `.claude/scripts/branch-guard.sh`
- Pre-commit gate: `.claude/scripts/pre-commit-gate.sh` (typecheck→test→lint, ALLOW_UNSAFE=1 보고)
- TODO stop: `.claude/scripts/todo-stop.sh`
- Context loader: `.claude/scripts/load-context.sh`
- Test runner: `.claude/scripts/run-tests.sh`

## 21) Checklist Before Ship
- [ ] lsp_diagnostics: 변경 파일 0 errors
- [ ] typecheck / lint / test / build (필요 시) 완료
- [ ] UI 텍스트 영어만 사용 확인
- [ ] TODO 리스트 모두 완료/취소
- [ ] 체크포인트/스토리 정리, 필요한 경우 PR 설명에 검증 결과 포함
