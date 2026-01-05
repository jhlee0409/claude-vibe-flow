# Claude Vibe Flow 🌊

> **Claude Code를 위한 바이브 코딩(Vibe Coding) 솔루션**
> 
> 맥락 전환(Context Switching)을 최소화하고 몰입(Flow)을 유지하기 위한 에이전트 및 도구 모음입니다.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Claude Code](https://img.shields.io/badge/Claude%20Code-Ready-purple)

---

## 🚀 The Vibe Standard Stack (표준 도구)

효율적인 개발 환경을 위해 다음 도구들을 자동으로 구성합니다.

| 도구 (Tool) | 역할 (Capability) | 설명 |
|-------------|-------------------|----------------|
| **Context7** | 📚 **문서(Docs)** | 라이브러리의 최신 공식 문서를 검색하여 정확한 정보를 제공합니다. |
| **GitHub** | 🐙 **이슈/PR** | 리포지토리의 이슈와 PR을 직접 읽고 관리합니다. |
| **Sequential Thinking** | 🧠 **논리사고** | 복잡한 문제 해결을 위한 단계별 사고(Chain of Thought) 프로세스를 지원합니다. |

---

## 사전 준비 (Prerequisites)

**기존 사용자 (Track A)**
이미 `claude` CLI를 사용 중이라면 바로 [설치](#설치-installation) 단계로 넘어가세요.

**신규 사용자 (Track B)**
이 플러그인은 Claude Code CLI (Beta)가 필요합니다. 먼저 설치하고 로그인해주세요.
```bash
npm install -g @anthropic-ai/claude-code
claude login
```

## 🏁 시작하기 (Getting Started)

상황에 맞는 설치 방법을 선택하세요.

### 방법 1: 완전한 경험 (GitHub Template) 🌟
> **추천 대상:** 신규 프로젝트, 또는 전용 에이전트와 명령어(`/fix-bug`, `/new-feature` 등)를 모두 사용하고 싶은 경우.

1.  **저장소 클론**:
    ```bash
    git clone https://github.com/jhlee0409/claude-vibe-flow.git my-new-project
    cd my-new-project
    ```

2.  **Claude Code 시작**:
    ```bash
    claude
    ```
    > ✨ 플러그인 및 MCP 서버가 `.claude-plugin/`과 `.mcp.json`을 통해 자동 설정됩니다.

3.  **초기화 및 코딩 시작**:
    ```
    /claude-vibe-flow:init
    /claude-vibe-flow:new-feature "첫 번째 기능"
    ```

### 방법 2: 표준 스택 주입 (CLI) ⚡️
> **추천 대상:** 이미 진행 중인 프로젝트에 핵심 MCP 도구(Context7, GitHub, Sequential Thinking)만 빠르게 적용하고 싶은 경우.

어떤 프로젝트든 한 줄의 명령어로 표준 스택을 주입할 수 있습니다:
```bash
npx vibe-flow
```
*참고: 이 방법은 MCP 서버만 설치하며, 에이전트 파일이나 커스텀 명령어는 포함되지 않습니다.*



---

## ✨ 주요 기능 (Features)

### 🤖 전문 에이전트 (Specialized Agents)
각 작업에 최적화된 에이전트가 업무를 수행합니다:

*   **`pm-orchestrator`**: 사용자 의도를 분석하고 작업을 적절한 에이전트에게 할당합니다.
*   **`planner`**: 모호한 요구사항을 구체적인 스펙으로 정리합니다.
*   **`context-manager`**: 코드베이스의 구조와 주요 컨텍스트를 관리합니다.
*   **`research-agent`**: Context7을 사용하여 공식 문서를 검색합니다.
*   **`issue-fixer`**: 에러 로그를 분석하고 원인을 찾아 수정합니다.
*   **`test-generator`**: 구현 전후에 필요한 테스트 코드를 작성합니다.

### 🔄 능동형 컨텍스트 동기화 (Active Context Sync)
`.vibe-flow/active_spec.md` 파일에 프로젝트의 상태를 기록하여, 세션이 끊겨도 작업을 연속적으로 이어나갈 수 있도록 지원합니다.

---

## 🛠️ 명령어 (Commands)

| 명령어 | 설명 |
|--------|------|
| `/claude-vibe-flow:init` | 바이브 환경을 초기화하고 필수 도구 설치를 안내합니다. |
| `/claude-vibe-flow:sync-context` | 코드베이스를 다시 스캔하여 컨텍스트 지도를 최신화합니다. |
| `/claude-vibe-flow:check-mcp` | Standard Stack 설치 상태 확인. |
| `/claude-vibe-flow:new-feature` | 신규 기능 개발 시작 (`active_spec.md` 생성). |
| `/claude-vibe-flow:fix-bug` | 버그 리포트/로그를 분석하여 원인을 찾고 수정합니다. |
| `/claude-vibe-flow:refactor` | 기능 변경 없이 코드 구조만 개선합니다 (Architect 호출). |
| `/claude-vibe-flow:ask` | 코드를 수정하지 않고 질문만 합니다 (빠른 Q&A). |

---

## 🤝 기여하기 (Contributing)

이슈 등록 및 PR 제출을 통해 기여할 수 있습니다.

## 📄 라이선스 (License)

이 프로젝트는 **MIT 라이선스**를 따릅니다.
