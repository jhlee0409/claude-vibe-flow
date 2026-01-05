# CLAUDE.md - claude-vibe-flow

## 프로젝트 개요

Claude Code를 위한 범용 에이전트 및 명령어 플러그인.

**구조:**
```
claude-vibe-flow/
├── .claude-plugin/
│   └── plugin.json             # 플러그인 정의
├── hooks/
│   └── hooks.json              # 훅 설정 (검증 루프)
├── agents/                     # 17개 에이전트
├── commands/                   # 12개 슬래시 명령어 (모드 포함)
├── skills/                     # 스킬
└── outputStyles/               # 품질 스타일
```

---

## 🕐 Temporal Awareness (필수)

**Knowledge cutoff ≠ 현재 날짜**

Claude의 학습 데이터는 2025년 1월까지이지만, 실제 날짜는 다를 수 있음.

### 규칙

1. **날짜/연도 작성 전** → `<env>`의 `Today's date` 확인
2. **리서치 시** → 현재 연도 기준 검색 쿼리 사용
3. **"최신", "현재" 언급 시** → env 날짜 기준으로 판단
4. **문서 작성 시** → env에서 날짜 추출하여 사용

### 예시

```
<env>
Today's date: 2026-01-05
</env>

❌ 잘못됨: "작성일: 2025-01-05" (knowledge cutoff 기준)
✅ 올바름: "작성일: 2026-01-05" (env 기준)

❌ 잘못됨: "React best practices" 검색
✅ 올바름: "React best practices 2026" 검색
```

---

## Quick Reference

```bash
# 로컬 테스트
claude --plugin-dir ./claude-vibe-flow

# 플러그인 검증
claude plugin validate ./claude-vibe-flow
```

---

## 🎨 모드 시스템

모드는 **행동 패턴**을 정의합니다. 슬래시 커맨드에 직접 통합되어 있습니다.

| 모드 | 용도 | 활성화 |
|------|------|--------|
| `Verification` | 철저한 검증 강제 | Stop 훅 자동, `/claude-vibe-flow:verify` |
| `FastVibe` | 빠른 프로토타이핑 | `/claude-vibe-flow:fast` |
| `DeepWork` | 복잡한 작업의 철저한 계획 | `/claude-vibe-flow:deep` |

### 모드별 행동 차이

| 측면 | Verification | FastVibe | DeepWork |
|------|--------------|----------|----------|
| 계획 | 기본 | 최소 | 철저 |
| lsp_diagnostics | 매 수정마다 | 마지막만 | 매 수정마다 |
| TODO 추적 | 강제 | 선택 | 상세 |
| 테스트 | 필수 | 연기 | 단계별 |

---

## 🔧 Claude Code 내장 도구 활용 (MUST)

### 필수 도구

| 도구 | 용도 | 언제 사용 |
|------|------|----------|
| `lsp_diagnostics` | 에러/경고 확인 | 모든 Edit/Write 후 |
| `lsp_find_references` | 영향 분석 | 리팩토링 전 |
| `lsp_rename` | 안전한 이름 변경 | 심볼 리네임 시 |
| `lsp_goto_definition` | 정의 탐색 | 버그 추적 시 |
| `ast_grep_search` | 패턴 검색 | 대규모 코드 분석 |
| `todowrite` | 작업 추적 | 복잡한 작업 시작 시 |

### 검증 루프 (핵심 패턴)

```
Edit/Write → lsp_diagnostics → 에러 있으면 수정 → 다시 검증 → 클린하면 진행
```

---

## 🪝 훅 시스템

### 활성 훅

| 훅 | 트리거 | 동작 |
|----|--------|------|
| `SessionStart` | 세션 시작 | 컨텍스트 자동 로드 |
| `PostToolUse` | Edit/Write 후 | lsp_diagnostics 리마인드 |
| `Stop` | 세션 종료 시도 | TODO/검증/테스트 체크 |

### Stop 훅 검증 항목

1. **TODO 완료**: `todowrite` 사용 시 모든 항목 완료 확인
2. **코드 품질**: 수정된 파일에 `lsp_diagnostics` 실행 확인
3. **테스트**: 구현 작업 시 테스트 실행 확인

---

## 에이전트 목록

### 핵심 (Critical)
| 에이전트 | 설명 |
|----------|------|
| `git-guardian` | Git 워크플로우 자동화 |
| `issue-fixer` | 버그 수정 전문가 |
| `code-reviewer` | 코드 리뷰 |
| `test-generator` | 테스트 생성 |

### 품질 (Quality)
| 에이전트 | 설명 |
|----------|------|
| `test-quality-validator` | 테스트 품질 검증 |
| `context-optimizer` | 토큰 최적화 |
| `context-manager` | 코드베이스 매핑 |

### 오케스트레이션 (Orchestration)
| 에이전트 | 설명 |
|----------|------|
| `pm-orchestrator` | 요청 분석/라우팅 |
| `planner` | 요구사항 명확화 |
| `architect` | 기술 설계 |
| `spec-validator` | 스펙 완전성 검증 |
| `vibe-implementer` | 빠른 구현 |
| `task-manager` | 작업 생명주기 |

### 메타 (Meta)
| 에이전트 | 설명 |
|----------|------|
| `agent-manager` | 에이전트 생태계 관리 |
| `docs-sync` | 내부 문서 동기화 |
| `readme-sync` | README 동기화 |
| `research-agent` | 기술 문서 리서치 |

---

## 🚀 Full Vibe Coding Mode

### 개념

에이전트는 **역할 가이드**이며, 메인 Claude가 자동으로 역할을 전환하며 파이프라인을 실행합니다.

### 활성화

사용자의 구현/생성 의도를 LLM이 동적으로 감지하여 자동 활성화.

### 파이프라인

```
사용자 요청
    ↓
[INTAKE] 요구사항 분석 → 부족시 질문
    ↓
[CONTEXT] 프로젝트 컨텍스트 자동 감지
    ↓
[REFINE] 스펙 구체화
    ↓
[PLAN] 작업 계획
    ↓
[IMPLEMENT] 구현
    ↓
[VERIFY] 검증 도구 자동 감지 → 실행
    ↓
[TEST] 테스트 프레임워크 감지 → 테스트
    ↓
[REVIEW] 품질 체크
    ↓
✅ 완료
```

### 핵심 원칙

| 원칙 | 설명 |
|------|------|
| 하드코딩 금지 | 도구명, 경로, 패턴 하드코딩 ❌ |
| 자동 감지 | 프로젝트 설정 파일 분석으로 도구 결정 |
| 패턴 학습 | 기존 코드베이스 패턴 따르기 |
| LLM 위임 | 구체적 판단은 LLM이 동적으로 |

### 에이전트 활용

각 단계에서 해당 역할 가이드(에이전트) 참조:
- INTAKE/REFINE → `planner`
- PLAN → `architect`, `pm-orchestrator`
- IMPLEMENT → `vibe-implementer`
- VERIFY/TEST → `test-generator`, `issue-fixer`
- REVIEW → `code-reviewer`

---

## 핵심 규칙

### ✅ 필수 (MUST)
- 에이전트 수정 전 기존 파일 먼저 읽기
- `plugin.json`과 에이전트 목록 동기화 유지
- 에이전트 description 기반 자동 라우팅 활용
- **[NEW] Active Context Sync**: 모든 에이전트는 `.claude-vibe-flow/active_spec.md`를 최신 상태로 유지해야 함. (Strict Sync Protocol)

### ❌ 금지 (NEVER)
- 에이전트 간 순환 참조
- 하드코딩된 프로젝트 경로
- 프로젝트 특화 로직 (범용성 유지)
- **Active Context 없이 종료 금지**: 코드를 수정하고도 spec 파일을 업데이트하지 않고 종료하는 행위 금지.

---

## Output Styles (공식 패턴)

프로젝트 특성에 맞는 품질 스타일을 활성화할 수 있습니다.

| 스타일 | 용도 | 적합한 프로젝트 |
|--------|------|----------------|
| `production-ready` | 배포 품질 체크 | 프로덕션 서비스 |
| `frontend-quality` | SEO, 접근성, 성능 | 웹 애플리케이션 |
| `security-hardened` | 보안 강화 | API, 인증 시스템 |

### 사용법

프로젝트 CLAUDE.md에 스타일 명시:
```markdown
## Output Styles
- production-ready
- frontend-quality
```

자세한 내용: `outputStyles/README.md`
