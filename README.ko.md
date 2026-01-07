# Claude Vibe Flow

**한국어** | [English](README.md)

전문 에이전트와 명령어로 개발 워크플로우를 간소화하는 [Claude Code](https://github.com/anthropics/claude-code) 경량 프레임워크.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![npm version](https://img.shields.io/npm/v/claude-vibe-flow)](https://www.npmjs.com/package/claude-vibe-flow)

## 주요 기능

- **10개의 전문 에이전트**: cvf-orchestrator, cvf-planner, cvf-applier, cvf-reviewer, cvf-debugger, cvf-architect, cvf-security, cvf-performance, cvf-researcher, cvf-ui-ux
- **5개의 필수 명령어**: /cvf:plan, /cvf:review, /cvf:ship, /cvf:check, /cvf:workflow
- **커밋 전 검증**: 진단 + 테스트 + TODO 확인
- **바이브 코딩 지원**: cvf-orchestrator로 자연어를 완성된 프로덕트로

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
/cvf:workflow feature "사용자 인증"   # 표준 기능 워크플로우
/cvf:workflow secure "결제 플로우"    # 보안 중심 워크플로우
/cvf:workflow audit                   # 릴리스 전 감사
```
복잡한 작업을 위해 여러 에이전트를 조율합니다.

## 디렉토리 구조

```
your-project/
├── .claude/
│   ├── agents/
│   │   ├── cvf-orchestrator.md # 마스터 코디네이터 (바이브 코딩)
│   │   ├── cvf-planner.md     # 아이디어 → 구체적 스펙
│   │   ├── cvf-applier.md     # 확정된 대안 적용
│   │   ├── cvf-reviewer.md    # 코드 리뷰
│   │   ├── cvf-debugger.md    # 버그 수정
│   │   ├── cvf-architect.md   # 시스템 아키텍처
│   │   ├── cvf-security.md    # 보안 분석
│   │   ├── cvf-performance.md # 성능 최적화
│   │   ├── cvf-researcher.md  # 외부 리서치
│   │   └── cvf-ui-ux.md       # UI/UX 디자인
│   ├── commands/
│   │   ├── cvf:plan.md, cvf:review.md, cvf:ship.md, cvf:check.md, cvf:workflow.md
│   ├── skills/
│   │   └── verify-before-commit/SKILL.md
│   ├── scripts/
│   │   ├── detect-test-framework.sh
│   │   ├── load-context.sh
│   │   └── run-tests.sh
│   └── hooks.json              # SessionStart 훅
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

## 기여하기

[CONTRIBUTING.md](CONTRIBUTING.md)를 참조하세요.

## 라이선스

[MIT](LICENSE)
