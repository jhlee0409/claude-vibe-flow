---
name: new-feature
description: 새 기능 구현 워크플로우
allowed-tools: Task, Read, Write, Edit, Grep, Glob, Bash
---

# 새 기능 구현

## 사용법

```
/claude-vibe-flow:new-feature 기능명
/claude-vibe-flow:new-feature "사용자 인증 시스템"
```

## 워크플로우

당신은 새 기능을 구현하는 전체 워크플로우를 실행합니다.

### Phase 1: 요구사항 분석

1. **명확도 평가**
   - 요청이 명확한가? → Phase 2로
   - 모호한가? → `planner` 에이전트로 질문 생성

2. **기존 코드 분석**
   - 유사 기능 존재 여부 확인
   - 기존 패턴 및 컨벤션 파악

### Phase 2: 기술 설계

1. **아키텍처 결정**
   - `architect` 에이전트로 기술 타당성 검토
   - 파일 구조 및 의존성 계획

2. **스펙 검증**
   - `spec-validator` 에이전트로 완전성 확인
   - READY 판정 시 구현 단계로

### Phase 3: 브랜치 준비

1. **Git 설정**
   - `git-guardian` 에이전트로 브랜치 생성
   - `vibe/기능명` 형식으로 생성

### Phase 4: 구현

1. **코드 작성**
   - `vibe-implementer` 에이전트로 구현
   - 기존 패턴 따르기
   - 타입 안전성 유지

2. **검증**
   - 타입 체크 실행
   - 린트 실행 (있으면)

### Phase 5: 테스트

1. **테스트 작성**
   - `test-generator` 에이전트로 테스트 생성
   - 정상/에러/엣지 케이스 포함

2. **테스트 품질**
   - `test-quality-validator` 에이전트로 검증
   - 누락된 케이스 확인

### Phase 6: 리뷰 및 완료

1. **코드 리뷰**
   - `code-reviewer` 에이전트로 리뷰
   - 품질/보안/성능 확인

2. **문서 동기화**
   - `docs-sync` 에이전트로 내부 문서 업데이트
   - `readme-sync` 에이전트로 README 업데이트 (필요시)

3. **커밋**
   - `git-guardian` 에이전트로 커밋
   - 의미 있는 커밋 메시지

---

## 자동 에이전트 흐름

```
입력: "새 기능 구현"
     ↓
[pm-orchestrator] 요청 분석
     ↓
[planner] 모호하면 질문 생성
     ↓
[architect] 기술 설계
     ↓
[spec-validator] 스펙 검증 (READY?)
     ↓
[git-guardian] 브랜치 생성
     ↓
[vibe-implementer] 구현
     ↓
[test-generator] 테스트 작성
     ↓
[test-quality-validator] 테스트 품질 검증
     ↓
[code-reviewer] 코드 리뷰
     ↓
[docs-sync] 문서 동기화
     ↓
[git-guardian] 커밋
     ↓
완료 리포트
```

---

## 출력 형식

### 완료 리포트

```markdown
## ✅ 기능 구현 완료: [기능명]

### 구현 내용
- [변경 사항 1]
- [변경 사항 2]

### 변경된 파일
| 파일 | 변경 유형 |
|------|----------|
| `src/feature.ts` | 새 파일 |
| `src/index.ts` | 수정 |

### 테스트
- 총 N개 테스트 추가
- 커버리지: XX%

### 검증 결과
- ✅ 타입 체크 통과
- ✅ 린트 통과
- ✅ 테스트 통과
- ✅ 코드 리뷰 완료

### 브랜치
`vibe/기능명`

### 다음 단계
- [ ] PR 생성 (선택)
- [ ] 메인 브랜치 머지
```

---

## 중단 조건

다음 상황에서 사용자 확인 요청:
- 스펙 불명확 (planner 질문 후)
- 기존 코드와 충돌 가능성
- 테스트 실패
- 코드 리뷰에서 심각한 이슈 발견
