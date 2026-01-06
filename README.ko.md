# Claude Vibe Flow

**한국어** | [English](README.md)

테스트 규율을 강제하고 개발 워크플로우를 간소화하는 [Claude Code](https://github.com/anthropics/claude-code) 경량 프레임워크.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![npm version](https://img.shields.io/npm/v/claude-vibe-flow)](https://www.npmjs.com/package/claude-vibe-flow)

## 주요 기능

- **테스트 강제**: 코드 변경 후 테스트를 실행하지 않으면 세션 종료 불가
- **3개의 집중 에이전트**: planner, reviewer, debugger
- **4개의 필수 명령어**: /plan, /review, /ship, /check
- **커밋 전 검증**: 진단 + 테스트 + TODO 확인

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

### 기획
```bash
/plan "사용자 인증 추가"
```
막연한 아이디어를 MVP 범위가 있는 구체적인 스펙으로 변환합니다.

### 코드 리뷰
```bash
/review                    # 모든 변경 사항 리뷰
/review src/auth.ts        # 특정 파일 리뷰
```

### 배포 (커밋 + 푸시 + PR)
```bash
/ship                      # 검증 → 커밋 → 푸시 → PR
/ship "feat: add auth"     # 커스텀 메시지와 함께
```

### 상태 확인
```bash
/check                     # 전체 검증 상태
```

## 테스트 강제

핵심 기능입니다. 코드를 변경할 때:

1. **스킬이 알림**: 구현 후, Claude가 테스트를 실행합니다
2. **훅이 차단**: 테스트를 실행하지 않고 종료하려 하면 세션이 차단됩니다

```bash
# 탈출구 (아껴서 사용하세요)
export SKIP_TEST_CHECK=1
```

## 디렉토리 구조

공식 Claude Code Plugin 형식을 사용합니다:

```
your-project/
├── .claude-plugin/
│   └── plugin.json         # 플러그인 매니페스트 (필수)
├── agents/
│   ├── planner.md         # 아이디어 → 구체적 스펙
│   ├── reviewer.md        # 코드 리뷰
│   └── debugger.md        # 버그 수정
├── skills/
│   ├── test-enforcer/SKILL.md      # 구현 후 자동 테스트 실행
│   └── verify-before-commit/SKILL.md  # 커밋 전 검사
├── commands/
│   ├── plan.md            # /plan 명령어
│   ├── review.md          # /review 명령어
│   ├── ship.md            # /ship 명령어
│   └── check.md           # /check 명령어
├── hooks/
│   └── hooks.json         # SessionStart, Stop (차단), PostToolUse
└── scripts/
    ├── check-tests-ran.sh # 차단 훅 스크립트
    ├── detect-test-framework.sh
    ├── load-context.sh
    └── run-tests.sh       # 자동 마커 생성 테스트 러너
```

## 에이전트

| 에이전트 | 트리거 | 목적 |
|-------|-------------|---------|
| `planner` | "만들고 싶어...", "기획 도와줘..." | 아이디어를 스펙으로 |
| `reviewer` | "코드 리뷰해줘", "PR 확인해줘" | 코드 리뷰 |
| `debugger` | "안 돼", "에러 발생" | 버그 수정 |

## 명령어

| 명령어 | 설명 |
|---------|-------------|
| `/plan` | 새 기능 기획 |
| `/review` | 코드 리뷰 요청 |
| `/ship` | 커밋 + 푸시 + PR 생성 |
| `/check` | 검증 상태 표시 |

## 지원 테스트 프레임워크

자동 감지:
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
