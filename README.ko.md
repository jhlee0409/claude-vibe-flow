# Claude Code ClaudeVibeFlow

Claude Code를 활용한 풀 바이브 코딩을 위한 범용 에이전트 및 명령어 플러그인입니다.

## 설치 방법

### 방법 1: 플러그인 마켓플레이스 (권장)

```bash
# 마켓플레이스 추가 (GitHub 저장소)
/plugin marketplace add your-org/claude-vibe-flow

# 플러그인 설치
/plugin install claude-vibe-flow

# 프로젝트 범위로 설치 (선택)
/plugin install claude-vibe-flow --scope project
```

### 방법 2: 로컬 개발/테스트

```bash
# 로컬 플러그인으로 실행
claude --plugin-dir ./claude-vibe-flow

# 플러그인 검증
claude plugin validate ./claude-vibe-flow
```

### 방법 3: 수동 복사 (레거시)

```bash
# agents만 복사
cp -r claude-vibe-flow/agents/ your-project/.claude/agents/

# commands 복사
cp -r claude-vibe-flow/commands/ your-project/.claude/commands/
```

---

## 구조 (공식 플러그인 형식)

```
claude-vibe-flow/
├── .claude-plugin/
│   └── plugin.json           # 플러그인 메타데이터 (필수)
├── agents/                   # 서브에이전트 (16개)
│   ├── git-guardian.md
│   ├── issue-fixer.md
│   ├── code-reviewer.md
│   ├── pm-orchestrator.md
│   └── ...
├── commands/                 # 슬래시 명령어
│   ├── new-feature.md
│   └── check-setup.md
├── skills/                   # 스킬
│   └── research.md
├── outputStyles/             # 출력 품질 스타일
└── README.md
```

---

## Description 기반 자동 라우팅

Claude Code가 에이전트의 **description** 필드를 기반으로 자동 선택합니다 (공식 패턴).

### 동작 방식

```
사용자 요청 → Claude가 에이전트 description 분석 → 적합한 에이전트 자동 선택
```

### 주요 패턴

| 의도 | 에이전트 | Description 키워드 |
|------|----------|-------------------|
| 코드 리뷰 | `code-reviewer` | PROACTIVELY executes after code changes |
| 버그 수정 | `issue-fixer` | AUTOMATICALLY executes on errors |
| 기능 생성 | `vibe-implementer` | AUTOMATICALLY executes for clear requests |
| 테스트 생성 | `test-generator` | AUTOMATICALLY writes tests |
| 복잡한 작업 | `pm-orchestrator` | AUTOMATICALLY routes after analysis |

### 예시

```bash
"코드 검토해줘"     → code-reviewer (description 매칭)
"버그 고쳐줘"       → issue-fixer (description 매칭)
"버튼 만들어줘"     → vibe-implementer (description 매칭)
"테스트 추가해줘"   → test-generator (description 매칭)
```

> Claude Code의 네이티브 의미론적 매칭으로 에이전트 description 기반 라우팅

---

## 에이전트 목록

### 🔴 핵심 (Critical)

| 에이전트 | 설명 | 트리거 |
|----------|------|--------|
| `git-guardian` | Git 워크플로우 자동화 | 세션 시작, 커밋 요청 |
| `issue-fixer` | 버그 수정 전문가 | 에러, 버그, fix, debug |
| `code-reviewer` | 코드 리뷰 | 코드 변경 후 자동 |
| `test-generator` | 테스트 생성 | test, 커버리지 |

### 🟡 품질 (Quality)

| 에이전트 | 설명 | 트리거 |
|----------|------|--------|
| `test-quality-validator` | 테스트 품질 검증 | 테스트 작성 후 |
| `context-optimizer` | 토큰 최적화 | 컨텍스트 50%+ |

### 🟢 오케스트레이션 (Orchestration)

| 에이전트 | 설명 | 트리거 |
|----------|------|--------|
| `pm-orchestrator` | 요청 분석/라우팅 | 복잡한 기능 요청 |
| `planner` | 요구사항 명확화 | 모호한 요청 |
| `architect` | 기술 설계 | 아키텍처 결정 |
| `spec-validator` | 스펙 완전성 검증 | 구현 시작 전 |
| `vibe-implementer` | 빠른 구현 | 명확한 구현 요청 |
| `task-manager` | 작업 생명주기 | 세션 시작/종료 |

### 🔵 메타 (Meta)

| 에이전트 | 설명 | 트리거 |
|----------|------|--------|
| `agent-manager` | 에이전트 생태계 관리 | 에이전트 관련 요청 |
| `docs-sync` | 내부 문서 동기화 | 구현 완료 후 |
| `readme-sync` | README 동기화 | Public API 변경 |

---

## Commands 사용법

### new-feature 명령어

```bash
/claude-vibe-flow:new-feature "기능명"
```

전체 구현 워크플로우 자동 실행:
1. 요구사항 분석
2. 기술 설계
3. 브랜치 생성
4. 구현
5. 테스트
6. 리뷰
7. 커밋

### check-setup 명령어

```bash
/claude-vibe-flow:check-setup
```

플러그인 설치 상태 및 의존성 확인

---

## 프로젝트별 CLAUDE.md 예시

```markdown
# CLAUDE.md - Your Project

## 서브에이전트 자동 선택

| 트리거 | 에이전트 |
|--------|----------|
| 버그, 에러, fix | `issue-fixer` |
| 테스트, test | `test-generator` |
| 코드 변경 후 | `code-reviewer` |
| 세션 시작 | `git-guardian` |

## Quick Reference

\`\`\`bash
npm run dev      # 개발 서버
npm run build    # 빌드
npm run test     # 테스트
npm run lint     # 린트
\`\`\`

## 핵심 규칙

- 코드 변경 전 관련 파일 먼저 읽기
- 변경 후 검증 명령어 실행
- 기존 패턴 따르기
```

---

## 커스터마이징 가이드

### 에이전트 추가

```markdown
# agents/my-custom-agent.md

---
name: my-custom-agent
description: 설명. AUTOMATICALLY 트리거 조건.
tools: Read, Grep, Glob
model: sonnet
---

# 에이전트 내용
```

### 프로젝트 특화 에이전트 (별도 생성 필요)

다음은 범용 템플릿에서 제외되었습니다:

- `security-validator` - 보안 마스킹 패턴 (프로젝트별 다름)
- `type-sync-checker` - 타입 동기화 (프로젝트 구조에 의존)
- `api-integration` - API 스키마 검증 (프로젝트별 다름)
- `i18n-validator` - 다국어 검증 (프로젝트별 다름)
- `vercel-constraint-checker` - Vercel 특화

---

## CLI 명령어 레퍼런스

```bash
# 설치/관리
/plugin install claude-vibe-flow
/plugin uninstall claude-vibe-flow
/plugin enable claude-vibe-flow
/plugin disable claude-vibe-flow
/plugin update claude-vibe-flow

# 개발/디버그
claude --plugin-dir ./claude-vibe-flow
claude plugin validate .
claude --debug
```

---

## 설치 체크리스트

- [ ] `/plugin install claude-vibe-flow` 실행
- [ ] `CLAUDE.md`에 에이전트 테이블 추가
- [ ] Quick Reference 추가
- [ ] 프로젝트 특화 에이전트 생성 (필요시)

---

## 라이선스

MIT
