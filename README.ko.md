# Claude Vibe Flow

**한국어** | [English](README.md)

[Claude Code](https://github.com/anthropics/claude-code)를 위한 21개의 전문 에이전트 제품군으로, 영구적인 컨텍스트 관리와 자동화된 개발 워크플로우를 제공합니다.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![npm version](https://img.shields.io/npm/v/claude-vibe-flow)](https://www.npmjs.com/package/claude-vibe-flow)

## 주요 기능

- **컨텍스트 저장**: 프로젝트 상태를 `.claude-vibe-flow/`에 저장하고, Claude Code 세션 시작 시 [SessionStart 훅](https://github.com/anthropics/claude-code)을 통해 자동으로 불러옵니다.
- **에이전트 오케스트레이션**: 복잡한 요청을 분석하여 적절한 전문 에이전트(기획, 설계, 구현, 테스트 등)에게 라우팅합니다.
- **워크플로우 자동화**: 기능 개발, 리팩토링, 버그 수정을 위한 표준화된 파이프라인을 제공합니다.

> **참고**: 컨텍스트는 마크다운 파일로 저장되며 세션 시작 시 자동 주입됩니다. 자동 로드가 안 될 경우 `/claude-vibe-flow:resume`을 실행하세요.

## 설치

### 새 프로젝트 (템플릿)

[![Use this template](https://img.shields.io/badge/Use%20this-Template-2ea44f?style=for-the-badge)](https://github.com/jhlee0409/claude-vibe-flow/generate)

GitHub에서 **"Use this template"** 버튼 클릭 후:
```bash
cd my-app
claude
```

### 기존 프로젝트 (CLI)
```bash
cd your-project
npx claude-vibe-flow
claude
```

## 사용법

**Claude Code** 내부에서 다음 명령어들을 실행하세요.

### 초기화
컨텍스트 저장소인 `.claude-vibe-flow` 디렉토리를 생성합니다.
```bash
/claude-vibe-flow:init
```

### 개발
전체 에이전트 파이프라인(아이디어 -> 기획 -> 설계 -> 구현)을 통해 새 기능을 개발합니다.
```bash
/claude-vibe-flow:vibe "간단한 JWT 인증 추가해줘"
```

### 유지관리
수동으로 파일을 변경한 경우 컨텍스트 맵을 동기화합니다.
```bash
/claude-vibe-flow:sync-context
```

버그를 분석하고 수정합니다.
```bash
/claude-vibe-flow:fix-bug "Error: undefined property 'user'"
```

## 에이전트 목록

### 핵심 오케스트레이션
| 에이전트 | 설명 |
|-------|-------------|
| `vibe-orchestrator` | 사용자 요청을 분석하여 적절한 에이전트에게 라우팅합니다. |
| `idea-shaper` | 막연한 아이디어를 검증된 실행 가능한 명세로 변환합니다. |
| `planner` | 소크라테스 대화법으로 요구사항을 명확히 합니다. |
| `architect` | 기술적인 설계 의사결정을 수행합니다. |
| `vibe-implementer` | 명세에 따라 코드를 구현합니다. |

### 프론트엔드 전문가
| 에이전트 | 설명 |
|-------|-------------|
| `frontend-implementer` | 프론트엔드 구현 (React 19, Svelte 5, Vue 3.5, WCAG 2.2). |
| `ui-ux-designer` | UI/UX 디자인 시스템, 접근성 감사, 디자인 토큰. |

### 품질 및 유지보수
| 에이전트 | 설명 |
|-------|-------------|
| `test-generator` | 유닛 및 통합 테스트를 생성합니다. |
| `code-reviewer` | 코드 품질과 보안 문제를 검토합니다. |
| `issue-fixer` | 버그를 분석하고 해결합니다. |
| `spec-validator` | 요구사항에 대한 명세를 검증합니다. |
| `test-quality-validator` | 테스트 커버리지와 품질을 확인합니다. |

### 컨텍스트 및 관리
| 에이전트 | 설명 |
|-------|-------------|
| `context-manager` | 영구 컨텍스트 그래프를 유지 관리합니다. |
| `context-optimizer` | 토큰 제한에 맞춰 컨텍스트를 최적화합니다. |
| `task-manager` | 작업 진행 상황과 상태를 추적합니다. |
| `agent-manager` | 에이전트 상호작용 및 수명 주기를 관리합니다. |

### 유틸리티
| 에이전트 | 설명 |
|-------|-------------|
| `git-guardian` | Git 작업 및 커밋 메시지를 처리합니다. |
| `docs-sync` | 코드 변경 사항과 문서를 동기화합니다. |
| `readme-sync` | README를 프로젝트 상태와 동기화합니다. |
| `research-agent` | 웹/문서 검색 등 외부 조사를 수행합니다. |
| `code-simplifier` | 동작을 유지하면서 코드 복잡도를 줄입니다. |

## 명령어 목록

### 워크플로우 명령어
| 명령어 | 설명 |
|---------|-------------|
| `/claude-vibe-flow:init` | Vibe Flow 환경을 초기화합니다. |
| `/claude-vibe-flow:vibe` | 통합 명령어: 아이디어 → 기획 → 구현 (전체 파이프라인). |
| `/claude-vibe-flow:vibe --idea` | 아이디어 검증만 수행합니다. |
| `/claude-vibe-flow:vibe --plan` | 요구사항과 아키텍처만 수행합니다. |
| `/claude-vibe-flow:vibe --implement` | 직접 구현만 수행합니다. |
| `/claude-vibe-flow:fix-bug` | 지정된 버그를 분석하고 수정합니다. |
| `/claude-vibe-flow:refactor` | 동작 변경 없이 코드를 리팩토링합니다. |
| `/claude-vibe-flow:sync-context` | 컨텍스트 맵을 동기화합니다. |
| `/claude-vibe-flow:resume` | 이전 세션의 컨텍스트를 수동으로 불러옵니다. |
| `/claude-vibe-flow:check` | 설치 상태를 확인합니다 (`--setup` 또는 `--mcp` 플래그 사용). |
| `/claude-vibe-flow:ask` | 코드베이스에 대해 질문합니다. |
| `/claude-vibe-flow:commit-push-pr` | 커밋, 푸시, PR 생성을 한 번에 처리합니다. |

### 모드 명령어
| 명령어 | 설명 |
|---------|-------------|
| `/claude-vibe-flow:verify` | Verification 모드 - 모든 편집 후 철저한 검증. |
| `/claude-vibe-flow:fast` | FastVibe 모드 - 최소 검증으로 빠른 프로토타이핑. |
| `/claude-vibe-flow:deep` | DeepWork 모드 - 상세한 계획과 복잡한 작업 처리. |
| `/claude-vibe-flow:action` | Action 모드 - 극단적 행동 우선, 분석 마비 방지. |

## 기여하기

자세한 내용은 [CONTRIBUTING.md](CONTRIBUTING.md)를 참조하세요.

## 라이선스

[MIT](LICENSE)
