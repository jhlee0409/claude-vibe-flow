# Claude Code 공식 문서 분석

> **분석일**: 2026-01-06  
> **소스**: https://code.claude.com/docs/ko/

---

## 1. 서브에이전트 (Sub-agents)

### 개념
- Claude Code가 작업을 위임할 수 있는 **사전 구성된 AI 성격**
- 각 서브에이전트는 **독립된 컨텍스트 윈도우**에서 작동
- 주 대화의 컨텍스트 오염 방지

### 파일 위치 및 우선순위

| 유형 | 위치 | 우선순위 |
|------|------|----------|
| 프로젝트 | `.claude/agents/` | 최고 |
| CLI | `--agents` 플래그 | 중간 |
| 사용자 | `~/.claude/agents/` | 낮음 |
| 플러그인 | 플러그인 내 `agents/` | 플러그인 순서 |

### 파일 형식

```markdown
---
name: your-sub-agent-name           # 필수: 소문자 + 하이픈
description: |                       # 필수: 언제 호출할지 설명
  Use this agent when...
  <example>
  user: "..."
  assistant: "..."
  </example>
tools: tool1, tool2, tool3          # 선택: 생략시 모든 도구 상속
model: sonnet                        # 선택: sonnet, opus, haiku, inherit
color: cyan                          # 선택: UI 색상
---

# Agent Title

Your agent's system prompt here...
```

### 핵심 구성 필드

| 필드 | 필수 | 설명 |
|------|------|------|
| `name` | O | 소문자, 숫자, 하이픈만 (최대 64자) |
| `description` | O | 자연어 설명 + 예시 포함 권장 |
| `tools` | X | 쉼표로 구분된 도구 목록, MCP 도구 포함 가능 |
| `model` | X | `sonnet`, `opus`, `haiku`, `inherit` |
| `color` | X | UI 표시 색상 |

### 호출 방식

1. **자동 위임**: Claude가 description 기반으로 자율 선택
2. **명시적 호출**: `Use the code-reviewer subagent to check my changes`
3. **체이닝**: 여러 에이전트 순차 호출 가능
4. **재개 가능**: `agentId`로 이전 대화 계속 가능

### 사전 사용 유도 키워드
description에 포함시 더 적극적으로 사용:
- `"use PROACTIVELY"`
- `"MUST BE USED when..."`

---

## 2. 플러그인 (Plugins)

### 개념
- 명령, 에이전트, 훅, 스킬, MCP 서버를 패키징하여 배포
- 마켓플레이스를 통해 설치/공유

### 디렉토리 구조

```
my-plugin/
├── .claude-plugin/
│   └── plugin.json          # 플러그인 메타데이터 (필수)
├── commands/                 # 슬래시 명령 (선택)
│   └── hello.md
├── agents/                   # 서브에이전트 (선택)
│   └── helper.md
├── skills/                   # 에이전트 스킬 (선택)
│   └── my-skill/
│       └── SKILL.md
├── hooks/                    # 이벤트 핸들러 (선택)
│   └── hooks.json
└── .mcp.json                 # MCP 서버 설정 (선택)
```

### plugin.json 형식

```json
{
  "name": "my-plugin",
  "description": "Plugin description",
  "version": "1.0.0",
  "author": {
    "name": "Author Name"
  }
}
```

### 설치 방법

```bash
# 마켓플레이스 추가
/plugin marketplace add your-org/claude-plugins

# 플러그인 설치
/plugin install formatter@your-org

# 관리
/plugin enable|disable|uninstall plugin-name@marketplace
```

---

## 3. 에이전트 스킬 (Agent Skills)

### 개념
- **모델 호출 (Model-invoked)**: Claude가 컨텍스트 기반으로 자율 사용
- 슬래시 명령(사용자 호출)과 다름
- 전문 지식을 발견 가능한 기능으로 패키징

### 파일 위치

| 유형 | 위치 |
|------|------|
| Personal | `~/.claude/skills/skill-name/SKILL.md` |
| Project | `.claude/skills/skill-name/SKILL.md` |
| Plugin | 플러그인 내 `skills/` |

### SKILL.md 형식

```markdown
---
name: your-skill-name               # 필수: 소문자, 숫자, 하이픈 (최대 64자)
description: |                       # 필수: 무엇을 하고 언제 사용하는지 (최대 1024자)
  Brief description of what this Skill does and when to use it.
allowed-tools: Read, Grep, Glob     # 선택: 허용 도구 제한
---

# Your Skill Name

## Instructions
Step-by-step guidance for Claude.

## Examples
Concrete examples of using this Skill.
```

### 핵심 필드

| 필드 | 필수 | 설명 |
|------|------|------|
| `name` | O | 소문자, 숫자, 하이픈 (최대 64자) |
| `description` | O | 무엇을 하고 언제 사용하는지 (최대 1024자) |
| `allowed-tools` | X | 스킬 활성화시 사용 가능한 도구 제한 |

### 지원 파일 구조

```
my-skill/
├── SKILL.md           # 필수
├── reference.md       # 선택: 상세 문서
├── examples.md        # 선택: 예제
├── scripts/           # 선택: 유틸리티
│   └── helper.py
└── templates/         # 선택: 템플릿
    └── template.txt
```

Claude는 필요할 때만 추가 파일을 읽음 (점진적 공개).

---

## 4. 출력 스타일 (Output Styles)

### 개념
- Claude Code의 **시스템 프롬프트를 직접 수정**
- 소프트웨어 엔지니어링 외 용도로 Claude Code 적응 가능

### 기본 제공 스타일

| 스타일 | 설명 |
|--------|------|
| Default | 기본 소프트웨어 엔지니어링 모드 |
| Explanatory | 교육용 인사이트 제공 |
| Learning | 협업 학습 + TODO(human) 마커 |

### 파일 위치

| 유형 | 위치 |
|------|------|
| User | `~/.claude/output-styles/` |
| Project | `.claude/output-styles/` |

### 형식

```markdown
---
name: My Custom Style
description: Brief description for display
---

# Custom Style Instructions

You are an interactive CLI tool that...

## Specific Behaviors
...
```

### 변경 방법

```bash
/output-style                    # 메뉴 열기
/output-style explanatory        # 직접 전환
/output-style:new I want...      # 새 스타일 생성 (Claude 도움)
```

### 관련 기능 비교

| 기능 | 영향 범위 |
|------|----------|
| Output Style | 시스템 프롬프트 **대체** |
| CLAUDE.md | 시스템 프롬프트 **뒤에** 추가 |
| `--append-system-prompt` | 시스템 프롬프트에 **추가** |
| Agents | 특정 작업에 **위임** |
| Slash Commands | **저장된 프롬프트** |

---

## 5. 훅 (Hooks)

### 개념
- 라이프사이클 지점에서 실행되는 **결정론적 셸 명령**
- LLM 선택에 의존하지 않고 특정 작업 보장

### 이벤트 종류

| 이벤트 | 트리거 시점 | 차단 가능 |
|--------|-------------|----------|
| `PreToolUse` | 도구 호출 전 | O |
| `PostToolUse` | 도구 호출 후 | X |
| `UserPromptSubmit` | 사용자 프롬프트 제출 시 | O |
| `Notification` | 알림 전송 시 | X |
| `Stop` | 응답 완료 시 | O (exit code 2) |
| `SubagentStop` | 서브에이전트 완료 시 | X |
| `PreCompact` | 컴팩트 작업 전 | X |
| `SessionStart` | 세션 시작/재개 시 | X |
| `SessionEnd` | 세션 종료 시 | X |

### 설정 위치

| 위치 | 파일 |
|------|------|
| User | `~/.claude/settings.json` |
| Project | `.claude/settings.json` |
| Plugin | `hooks/hooks.json` |

### hooks.json 형식

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash|Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "your-script.sh"
          }
        ]
      }
    ],
    "PostToolUse": [...],
    "Stop": [...]
  }
}
```

### Matcher 패턴

| 패턴 | 의미 |
|------|------|
| `*` | 모든 도구 |
| `Bash` | Bash 도구만 |
| `Edit\|Write` | Edit 또는 Write |
| `""` (빈 문자열) | 이벤트에 따라 다름 |

### 환경 변수

훅 스크립트에서 사용 가능:
- `$CLAUDE_PROJECT_DIR`: 프로젝트 루트
- stdin: JSON 형식의 이벤트 데이터

### 차단 메커니즘 (PreToolUse, Stop)

| Exit Code | 동작 |
|-----------|------|
| 0 | 계속 진행 |
| 2 | **차단** + stderr를 Claude에 피드백 |
| 기타 | 오류 로깅 후 계속 |

---

## 6. CVF 프레임워크 적용 전략

### 네이밍 컨벤션

| 요소 | 형식 | 예시 |
|------|------|------|
| Commands | `/cvf:name` | `/cvf:plan`, `/cvf:review` |
| Agents | `cvf-name` | `cvf-planner`, `cvf-debugger` |
| Skills | `cvf-name` (필요시) | `test-enforcer` (기존 유지) |

### 에이전트 유기적 연결 전략

```
                    ┌─────────────────┐
                    │   cvf-planner   │
                    │  (기획/설계)     │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
    ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
    │cvf-architect│  │cvf-researcher│  │  cvf-ui-ux  │
    │  (아키텍처)  │  │   (조사)     │  │  (UI/UX)   │
    └──────┬──────┘  └──────┬──────┘  └──────┬──────┘
           │                │                │
           └────────────────┼────────────────┘
                            ▼
                    ┌─────────────────┐
                    │  Claude Native  │
                    │   (구현)        │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
    ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
    │cvf-reviewer │  │cvf-security │  │cvf-performance│
    │  (리뷰)     │  │  (보안)     │  │   (성능)     │
    └──────┬──────┘  └──────┬──────┘  └──────┬──────┘
           │                │                │
           └────────────────┼────────────────┘
                            ▼
                    ┌─────────────────┐
                    │  cvf-debugger   │
                    │  (버그 수정)    │
                    └─────────────────┘
```

### Description 작성 가이드

사전 호출 유도를 위해 다음 패턴 사용:

```markdown
description: |
  Expert [domain] specialist. Use PROACTIVELY when [trigger conditions].
  MUST BE USED for [specific scenarios].
  
  <example>
  user: "[typical user request]"
  assistant: "I'll use the [agent] to [action]."
  </example>
```

---

## 7. 참고 링크

- [서브에이전트](https://code.claude.com/docs/ko/sub-agents)
- [플러그인](https://code.claude.com/docs/ko/plugins)
- [에이전트 스킬](https://code.claude.com/docs/ko/skills)
- [출력 스타일](https://code.claude.com/docs/ko/output-styles)
- [훅 가이드](https://code.claude.com/docs/ko/hooks-guide)
- [훅 참조](https://code.claude.com/docs/ko/hooks)
