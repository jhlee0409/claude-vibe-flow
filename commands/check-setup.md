---
name: check-setup
description: Vibe coding 환경 설정 검증. 에이전트, CLAUDE.md 설정 상태를 확인합니다.
---

# Vibe Coding 환경 검증

이 명령어는 vibe coding 환경이 올바르게 설정되었는지 확인합니다.

## 검증 항목

### 1. 에이전트 구조 확인

```markdown
필수 에이전트 (15개):
- [ ] git-guardian
- [ ] issue-fixer
- [ ] code-reviewer
- [ ] test-generator
- [ ] test-quality-validator
- [ ] context-optimizer
- [ ] pm-orchestrator
- [ ] planner
- [ ] architect
- [ ] spec-validator
- [ ] vibe-implementer
- [ ] task-manager
- [ ] agent-manager
- [ ] docs-sync
- [ ] readme-sync
```

### 2. CLAUDE.md 확인

```markdown
필수 섹션:
- [ ] Quick Reference (명령어)
- [ ] 에이전트 자동 선택 테이블
- [ ] 핵심 규칙
```

---

## 실행 방법

```
/claude-vibe-flow:check-setup
```

또는 자연어로:
```
"바이브 코딩 환경 확인해줘"
"vibe setup 검증"
```

---

## 출력 형식

```markdown
## 🔧 Vibe Coding 환경 검증

### 에이전트 상태
| 카테고리 | 설치됨 | 누락 |
|----------|--------|------|
| 핵심 | N개 | - |
| 품질 | N개 | - |
| 오케스트레이션 | N개 | - |
| 메타 | N개 | - |

### CLAUDE.md 상태
| 섹션 | 상태 |
|------|------|
| Quick Reference | ✅/❌ |
| 에이전트 테이블 | ✅/❌ |
| 핵심 규칙 | ✅/❌ |

### 권장 조치
1. [필요한 조치 목록]

---
✅ 환경 준비 완료! / ⚠️ 일부 설정 필요
```

---

## 자동 수정

누락된 항목 발견 시:
- 누락 에이전트 목록 제공
- CLAUDE.md 템플릿 제공

---

## 검증 스크립트 (내부)

```bash
# 에이전트 파일 확인
ls .claude/agents/*.md 2>/dev/null | wc -l

# CLAUDE.md 존재 확인
test -f CLAUDE.md && echo "exists"
```
