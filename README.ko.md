# Claude Vibe Flow

**한국어** | [English](README.md)

전문 에이전트, 명령어, 스킬로 개발 워크플로우를 간소화하는 [Claude Code](https://github.com/anthropics/claude-code) 경량 프레임워크.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![npm version](https://img.shields.io/npm/v/claude-vibe-flow)](https://www.npmjs.com/package/claude-vibe-flow)

## 주요 기능

- **10개의 전문 에이전트**: cvf-orchestrator, cvf-planner, cvf-applier, cvf-reviewer, cvf-debugger, cvf-architect, cvf-security, cvf-performance, cvf-researcher, cvf-ui-ux
- **5개의 필수 명령어**: /cvf:plan, /cvf:review, /cvf:ship, /cvf:check, /cvf:workflow
- **7개의 티어드 스킬**: 프로그레시브 로딩 스킬 (Discovery→Overview→Specific→Generate) - api-design, database-schema-designer, test-automator, security-scanning, prompt-caching, rag-retrieval, verify-before-commit
- **4개의 자동 훅**: 에이전트 추천, 커밋 전 검증, 체크포인트 알림, UI 영어 확인
- **바이브 코딩 지원**: cvf-orchestrator로 자연어를 완성된 프로덕트로
- **안전망**: 브랜치 가드, 사전 커밋 게이트, TODO 스톱, 체크포인트 시스템

## 설치

### 기존 프로젝트
```bash
cd your-project
npx claude-vibe-flow
claude
```

### 새 프로젝트
```bash
mkdir my-app && cd my-app
git init
npx claude-vibe-flow
claude
```

## 사용법

### 자연어로 프로덕트 빌드
```bash
"습관 추적 앱 만들어줘"
"GitHub 통계 보여주는 대시보드 필요해"
"사이드 프로젝트용 랜딩 페이지 빠르게"
```
`cvf-orchestrator`가 자동으로 기획, 아키텍처, 구현, 리뷰를 조율합니다.

### 기획
```bash
/cvf:plan "사용자 인증 추가"
```
막연한 아이디어를 MVP 범위가 있는 구체적인 스펙으로 변환합니다.

### 코드 리뷰
```bash
/cvf:review                    # 모든 변경 사항 리뷰
/cvf:review src/auth.ts        # 특정 파일 리뷰
```

### 배포 (커밋 + 푸시 + PR)
```bash
/cvf:ship                      # 검증 → 커밋 → 푸시 → PR
/cvf:ship "feat: add auth"     # 커스텀 메시지와 함께
```

### 상태 확인
```bash
/cvf:check                     # 전체 검증 상태
```

### 멀티스텝 워크플로우
```bash
/cvf:workflow starter-webapp "React TS 웹앵앱 부트스트랩"   # 전체 웹앱 워크플로우
/cvf:workflow feature "사용자 프로필 페이지 추가"          # 기능 개발
/cvf:workflow secure "결제 플로우 처리"                  # 보안 중심
/cvf:workflow perf "느린 쿼리 최적화"                    # 성능 튜닝
/cvf:workflow ui "설정 페이지 리디자인"                   # UI/UX 작업
/cvf:workflow research "인증 라이브러리 비교"            # 외부 리서치
/cvf:workflow audit                                     # 릴리스 전 감사
/cvf:workflow debug "로그인 버그 수정"                   # 버그 수정
```
복잡한 작업을 위해 여러 에이전트를 조율합니다.

## 디렉토리 구조

```
your-project/
├── .claude/
│   ├── agents/                  # 10개의 전문 에이전트
│   │   ├── cvf-orchestrator.md  # 마스터 코디네이터 (바이브 코딩)
│   │   ├── cvf-planner.md       # 아이디어 → 구체적 스펙
│   │   ├── cvf-applier.md       # 확정된 대안 적용
│   │   ├── cvf-reviewer.md      # 코드 리뷰
│   │   ├── cvf-debugger.md      # 버그 수정
│   │   ├── cvf-architect.md     # 시스템 아키텍처
│   │   ├── cvf-security.md      # 보안 분석
│   │   ├── cvf-performance.md   # 성능 최적화
│   │   ├── cvf-researcher.md    # 외부 리서치
│   │   └── cvf-ui-ux.md         # UI/UX 디자인
│   ├── commands/                # 5개 슬래시 명령어
│   │   ├── cvf:plan.md          # 새 기능 기획
│   │   ├── cvf:review.md        # 코드 리뷰 요청
│   │   ├── cvf:ship.md          # 커밋 + 푸시 + PR
│   │   ├── cvf:check.md         # 검증 상태 표시
│   │   └── cvf:workflow.md      # 멀티 에이전트 워크플로우 실행
│   ├── skills/                  # 7개의 티어드 스킬 (프로그레시브 로딩)
│   │   ├── api-design/          # API 설계 패턴
│   │   ├── database-schema-designer/  # 데이터베이스 설계
│   │   ├── test-automator/      # 테스트 자동화
│   │   ├── security-scanning/   # 보안 분석
│   │   ├── prompt-caching/      # 프롬프트 최적화
│   │   ├── rag-retrieval/       # RAG 구현
│   │   └── verify-before-commit/    # 커밋 전 검증
│   ├── scripts/                 # 훅 & 안전망 스크립트
│   │   ├── agent-recommender.sh # CVF 에이전트 자동 추천
│   │   ├── checkpoint-reminder.sh # 대규모 편집 전 체크포인트
│   │   ├── detect-test-framework.sh # 테스트 프레임워크 감지
│   │   ├── git-guard.sh         # 커밋 전 검증 게이트
│   │   ├── load-context.sh      # 세션 컨텍스트 로드
│   │   ├── run-tests.sh         # 테스트 실행
│   │   └── ui-english-check.sh  # UI 텍스트 영어 확인
│   └── hooks.json               # 4개 훅 이벤트 설정
├── .github/
│   ├── ISSUE_TEMPLATE/          # 이슈 템플릿
│   └── workflows/
│       └── ci.yml               # CI/CD 워크플로우
├── docs/                        # 프로젝트 문서
│   ├── active-spec-protocol.md  # 스펙 관리 규칙
│   ├── architecture-critical-analysis.md  # 아키텍처 결정
│   ├── migration-plan-v2.md    # 마이그레이션 가이드
│   └── v2-critical-review.md   # v2 리뷰 요약
├── CLAUDE.md                    # 프레임워크 지침 (한국어)
├── CONTRIBUTING.md             # 기여 가이드라인
└── .mcp.json                   # MCP 서버 설정
```

## 에이전트

| 에이전트 | 트리거 | 목적 |
|-------|-------------|---------|
| `cvf-orchestrator` | "만들어줘...", "앱 만들고 싶어...", "만들어야 해..." | 엔드투엔드 프로덕트 빌드 |
| `cvf-planner` | "기획 도와줘...", "어떻게 접근해야..." | 아이디어를 스펙으로 |
| `cvf-applier` | "이걸로 해줘", "이걸로 진행해", "B 옵션으로" | 확정된 대안 분석 후 적용 |
| `cvf-reviewer` | "코드 리뷰해줘", "PR 확인해줘" | 코드 리뷰 |
| `cvf-debugger` | "안 돼", "에러 발생" | 버그 수정 |
| `cvf-architect` | "어떻게 구조를...", "설계해줘..." | 시스템 아키텍처 |
| `cvf-security` | "보안 괜찮아?", "인증 추가..." | 보안 분석 |
| `cvf-performance` | "느려", "최적화해줘..." | 성능 튜닝 |
| `cvf-researcher` | "어떤 라이브러리?", "베스트 프랙티스..." | 외부 리서치 |
| `cvf-ui-ux` | "컴포넌트 디자인", "더 예쁘게..." | UI/UX 디자인 |

## 명령어

| 명령어 | 설명 |
|---------|-------------|
| `/cvf:plan` | 새 기능 기획 |
| `/cvf:review` | 코드 리뷰 요청 |
| `/cvf:ship` | 커밋 + 푸시 + PR 생성 |
| `/cvf:check` | 검증 상태 표시 |
| `/cvf:workflow` | 멀티 에이전트 워크플로우 실행 |

## 스킬 (프로그레시브 로딩)

스킬은 토큰 절약을 위해 프로그레시브 로딩을 사용합니다 - 필요할 때만 상세 레퍼런스를 로드합니다.

| 스킬 | 목적 | 트리거 |
|-------|---------|---------|
| `api-design` | REST/GraphQL API 설계 패턴 | API 엔드포인트 생성 |
| `database-schema-designer` | 데이터베이스 모델링 및 관계 | 데이터베이스 설계 |
| `test-automator` | 자동화 테스트 생성 | 테스트 워크플로우 |
| `security-scanning` | 보안 취약점 분석 | 보안 우려 |
| `prompt-caching` | 프롬프트 최적화 기법 | 성능 튜닝 |
| `rag-retrieval` | RAG 구현 패턴 | AI/검색 기능 |
| `verify-before-commit` | 커밋 전 검증 게이트 | 커밋/푸시/PR 작업 |

각 스킬은 4개의 티어를 가집니다:
- **Discovery**: 사용 조건 및 트리거
- **Overview**: 핵심 워크플로우 및 체크리스트
- **Specific**: 상세 가이드 (요청 시 로드)
- **Generate**: 스크립트 및 템플릿 (요청 시 로드)

## SSOT 원칙 (Single Source of Truth)

> **"처음부터 잘 짜서, 나중에 수정이 쉽게."**

Claude Vibe Flow는 사용자가 변경을 요청할 때 사이드 이펙트를 최소화하기 위해 SSOT 아키텍처를 강제합니다.

### 왜 SSOT인가?

```
Week 1: "로그인 만들어줘" → CVF가 SSOT 구조로 생성
Week 2: "회원가입 추가해줘" → 기존 validation 재사용
Week 3: "비밀번호 규칙 변경해줘" → 파일 1개만 수정, 모든 폼 자동 업데이트
Week 4: "2FA 추가해줘" → 기존 로직 확장, 사이드 이펙트 없음
```

**SSOT 없이**: 변경하면 여러 파일이 깨지고, 사용자 스트레스.
**SSOT 있으면**: 한 곳만 변경, 모든 게 작동.

### 파일 구조

```
src/
  core/<domain>/           ← 비즈니스 로직 (SSOT)
    validation.ts          ← 모든 검증 규칙
    logic.ts               ← 모든 도메인 로직
  api/<domain>.ts          ← 모든 API 호출 (SSOT)
  types/<domain>.ts        ← 모든 타입 정의 (SSOT)
  constants/<domain>.ts    ← 모든 상수 (SSOT)
  components/<Feature>/    ← UI만 (비즈니스 로직 금지)
  hooks/use<Domain>.ts     ← 상태 관리만
  utils/                   ← 순수 함수만
```

### SSOT 규칙 (강제)

| 코드 유형 | SSOT 위치 | 절대 금지 위치 |
|-----------|---------------|--------------|
| Validation/비즈니스 규칙 | `src/core/<domain>/` | Components, Hooks |
| API 호출 | `src/api/<domain>.ts` | Components |
| 타입 정의 | `src/types/<domain>.ts` | 컴포넌트 내 인라인 |
| 상수/설정 | `src/constants/` | 하드코딩 |

### 에이전트별 역할

| 에이전트 | SSOT 역할 |
|-------|-----------|
| `cvf-planner` | SSOT 파일 구조 계획 |
| `cvf-architect` | SSOT 원칙으로 설계 |
| `cvf-applier` | SSOT 위치에 구현 + 검증 |
| `cvf-reviewer` | SSOT 위반을 Critical로 차단 |

**SSOT 위반은 Critical 이슈로 처리되어 커밋이 차단됩니다.**

## 안전망

### 브랜치 가드
- `main` 브랜치를 직접 커밋으로부터 보호
- `feature/*` 또는 `checkpoint/*` 브랜치 사용 제안

### 사전 커밋 게이트
- 커밋 전 `typecheck → test → lint` 실행
- 게이트 실패 시 커밋 차단
- `ALLOW_UNSAFE=1` 사용으로 우회 가능 (권장하지 않음)

### TODO 스톱
- 열린 TODO가 있으면 커밋 차단
- 배포 전 작업 완료 보장

### 체크포인트 시스템
- `/rewind` (ESC ESC) 또는 `git stash`로 체크포인트 생성
- 실험이 잘못될 경우 안전한 롤백

## 훅 (자동 트리거)

CVF는 Claude Code 훅을 사용하여 주요 라이프사이클 이벤트에서 워크플로우를 자동화합니다.

### 훅 이벤트

| 이벤트 | 스크립트 | 용도 |
|-------|----------|------|
| **SessionStart** | `load-context.sh` | 세션 시작 시 프로젝트 컨텍스트 로드 |
| **UserPromptSubmit** | `agent-recommender.sh` | 키워드 기반 CVF 에이전트 자동 추천 |
| **PreToolUse (Bash)** | `git-guard.sh` | git commit/push 전 검증 |
| **PreToolUse (Edit)** | `checkpoint-reminder.sh` | 대규모 편집 전 체크포인트 알림 |
| **PostToolUse (Edit)** | `ui-english-check.sh` | UI 컴포넌트 한글 텍스트 감지 |

### 에이전트 자동 추천

자연어를 입력하면 CVF가 자동으로 적절한 에이전트를 추천합니다:

```
"앱 만들어줘" → 💡 cvf-orchestrator 추천
"버그 있어"   → 💡 cvf-debugger 추천
"이걸로 해줘" → 💡 cvf-applier 추천
```

### 커밋 전 검증

`git commit` 전에 CVF가 자동으로 실행:
1. **TypeScript 타입체크** - 타입 에러 감지
2. **테스트** - 테스트 통과 확인
3. **린트** - 코드 스타일 검사

```bash
# 검증 우회 (권장하지 않음)
ALLOW_UNSAFE=1 git commit -m "message"
```

### 체크포인트 알림

CVF가 다음 파일 편집 전 체크포인트 생성을 알립니다:
- 설정 파일 (package.json, tsconfig.json)
- 코어 로직 (src/core/*)
- API 레이어 (src/api/*)
- 타입 정의 (src/types/*)
- 대용량 파일 (100줄 이상)

### UI 영어 확인

CVF 규칙: **UI 텍스트는 영어만 사용해야 합니다.**

컴포넌트 파일 편집 후 CVF가 한글 텍스트를 감지하고 수정을 제안합니다:
```
⚠️  한글 UI 텍스트 감지됨
  ❌ "저장" → ✅ "Save"
  ❌ "취소" → ✅ "Cancel"
```

## 테스트 실행 (선택)

필요할 때 수동으로 테스트를 실행할 수 있습니다:

```bash
bash .claude/scripts/run-tests.sh
```

자동 감지 프레임워크:
- **Node.js**: Jest, Vitest, Mocha
- **Python**: Pytest
- **Go**: go test
- **Rust**: cargo test
- **Ruby**: RSpec, Minitest

커스텀: `.claude-vibe-flow/test-command.txt`에 테스트 명령어를 작성하세요.

## MCP 서버

`.mcp.json`에 사전 구성됨:
- **Context7**: 문서 조회
- **GitHub**: 이슈 및 PR (`GITHUB_TOKEN` 필요)

## 개발

```bash
# 의존성 설치
npm install

# TypeScript 빌드
npm run build

# 테스트 실행
npm test

# 타입 체크
npm run typecheck
```

## 기여하기

[CONTRIBUTING.md](CONTRIBUTING.md)를 참조하세요.

## 라이선스

[MIT](LICENSE)
