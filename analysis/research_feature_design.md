# Research 기능 설계 문서

> 작성일: 2026-01-05
> 상태: 설계 완료, 구현 대기

---

## 1. 개요

### 1.1 목표
`claude-vibe-flow`에 **자동 리서치 기능**을 추가하여, 프로젝트 컨텍스트 기반의 정확한 기술 문서를 제공한다.

### 1.2 핵심 가치
- **자동 감지**: 키워드가 아닌 의도 기반으로 리서치 필요성 판단
- **버전 매칭**: 프로젝트 패키지 버전에 맞는 문서 검색
- **인라인 제공**: 답변 흐름에 자연스럽게 정보 통합
- **폴백 보장**: MCP 없이도 WebSearch로 동작

---

## 2. 설계 결정 사항

### 2.1 트리거 방식

| 방식 | 선택 | 이유 |
|------|------|------|
| 키워드 기반 | ❌ | 언어별 키워드 관리 필요, 확장성 낮음 |
| **의도 기반** | ✅ | 언어 무관, 문맥 이해, 자연스러운 UX |

```
사용자 프롬프트 → Claude가 의도 분석 → 리서치 필요 여부 판단
```

### 2.2 패키지 감지 방식

| 방식 | 선택 | 이유 |
|------|------|------|
| **복잡한 MCP 감지기** | ❌ | 설치 복잡도 높음, 오버엔지니어링 |
| **System Prompt 규칙** | ✅ | "package.json 읽어라" 지시 하나로 해결, Zero-Cost |

```markdown
Rule: "기술 제안 시 반드시 프로젝트 루트의 패키지 관리 파일(package.json 등)을 먼저 읽고 버전을 확인하세요."
```

```yaml
# 탐색 대상 파일
- package.json        # npm (JS/TS)
- requirements*.txt   # pip (Python)
- pyproject.toml      # Poetry (Python)
- go.mod              # Go
- Cargo.toml          # Rust
- Gemfile             # Ruby
- composer.json       # PHP
- *.csproj            # .NET
- build.gradle*       # Java/Kotlin
- pom.xml             # Maven
```

### 2.3 결과 제공 방식

| 방식 | 선택 | 이유 |
|------|------|------|
| 섹션 분리 | ❌ | 답변과 출처가 분리됨 |
| 출처만 | ❌ | 클릭해서 확인 필요 |
| **인라인** | ✅ | 자연스러운 흐름, 읽기 편함 |

```markdown
예시 출력:

React Server Components는 **React 18.2+**에서 사용 가능합니다.
(현재 프로젝트: react@18.2.0 ✓)

기본 사용법:
...
```

### 2.4 도구 선택 전략

```
우선순위:
1. vibe-research MCP (번들된 경우) → 최적
2. Context7 MCP (설치된 경우) → 향상
3. WebSearch (항상 가능) → 폴백
```

---

## 3. 구성 요소

### 3.1 Research Agent

```
파일: agents/research-agent.md
역할: 리서치 의도 자동 감지 및 실행
트리거: 문맥에서 리서치 필요성 판단
```

**자동 활성화 조건:**
- 최신 정보/버전/트렌드 질문
- 특정 라이브러리/프레임워크 사용법 질문
- 공식 문서 참조가 필요한 질문
- "어떻게 하는지", "best practice" 류 질문
- 버전 호환성, 마이그레이션 관련 질문

**비활성화 조건:**
- 단순 코드 수정/리팩토링 요청
- 프로젝트 내부 로직 질문
- 버그 수정 (원인 분석은 제외)
- 파일 구조 질문

### 3.2 Research Skill

```
파일: skills/research.md
역할: /research 명령으로 명시적 호출
사용법: /research [질문]
```

**옵션:**
```bash
/research React hooks 사용법       # 기본 (프로젝트 버전 기준)
/research --latest Next.js 기능    # 최신 버전 기준
/research --version 17 React 문법  # 특정 버전 기준
```

### 3.3 MCP Server (선택적)

```
파일: src/mcp/research-server.ts
역할: 패키지 감지 + 문서 검색 도구 제공
상태: 선택적 (없으면 폴백)
```

**제공 Tools:**
| Tool | 설명 |
|------|------|
| `detect_packages` | 프로젝트 패키지 버전 감지 |
| `search_docs` | 버전 맞춤 공식 문서 검색 |

---

## 4. 데이터 흐름

### 4.1 자동 리서치 (Agent)

```
┌─────────────────────────────────────────────────────────────┐
│ 사용자: "React에서 서버 컴포넌트 어떻게 써?"                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ 1. 의도 분석                                                 │
│    → "리서치 필요" 판단                                      │
│    → research-agent 활성화                                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. 패키지 감지                                               │
│    → Glob: **/package.json                                  │
│    → 발견: react@18.2.0, next@14.0.0                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. 문서 검색                                                 │
│    → MCP 있음? → vibe-research 사용                         │
│    → MCP 없음? → WebSearch 폴백                             │
│    → 쿼리: "React 18 Server Components documentation"       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. 결과 통합 (인라인)                                        │
│                                                             │
│    React Server Components는 **React 18.2+**에서 지원됩니다. │
│    (현재 프로젝트: react@18.2.0 ✓)                          │
│                                                             │
│    사용법:                                                   │
│    ```tsx                                                   │
│    async function Page() { ... }                            │
│    ```                                                      │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 명시적 리서치 (Skill)

```
┌─────────────────────────────────────────────────────────────┐
│ 사용자: /research TypeScript 5.0 새 기능                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ /research 스킬 활성화                                        │
│ → 패키지 감지 → 문서 검색 → 결과 제공                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. 타입 정의

### 5.1 패키지 정보

```typescript
interface DetectedPackage {
  name: string;        // "react"
  version: string;     // "18.2.0"
  type: "runtime" | "dev" | "peer";
  ecosystem: "npm" | "pypi" | "go" | "rust" | "ruby" | "php" | "dotnet" | "maven";
  source: string;      // "package.json"
}
```

### 5.2 문서 검색 결과

```typescript
interface DocSearchResult {
  title: string;
  url: string;
  snippet: string;
  source: "official" | "community" | "web";
  version?: string;
  relevance: number;   // 0-1
}
```

### 5.3 패키지 감지기 인터페이스

```typescript
interface PackageDetector {
  ecosystem: string;
  filePatterns: string[];
  parse(content: string, filePath: string): DetectedPackage[];
}
```

---

## 6. 파일 구조

```
claude-vibe-flow/
│
├── agents/
│   └── research-agent.md       ← NEW
│
├── skills/
│   └── research.md             ← NEW
│
├── config/
│   ├── intent-routing.md       # 업데이트 (리서치 라우팅 추가)
│   └── package-detectors.yaml  ← NEW
│
└── src/mcp/                    ← NEW (선택적)
    ├── research-server.ts
    ├── tools/
    │   ├── detect-packages.ts
    │   └── search-docs.ts
    ├── detectors/
    │   ├── index.ts
    │   ├── npm.ts
    │   ├── pypi.ts
    │   └── go.ts
    └── types.ts
```

---

## 7. 구현 우선순위

| 순서 | 항목 | 필수 여부 | 설명 |
|------|------|----------|------|
| 1 | `research-agent.md` | 필수 | 자동 리서치 에이전트 |
| 2 | `skills/research.md` | 필수 | /research 명시적 호출 |
| 3 | `intent-routing.md` 업데이트 | 필수 | 리서치 라우팅 규칙 추가 |
| 4 | `package-detectors.yaml` | 권장 | 패키지 감지 설정 |
| 5 | `src/mcp/*` | 선택 | MCP 서버 (향상된 경험) |

---

## 8. 폴백 전략

### 8.1 MCP 없는 환경

```markdown
## Research Agent 폴백 로직

1. vibe-research MCP 확인 → 없음
2. Context7 MCP 확인 → 없음
3. WebSearch 폴백 실행:
   - 쿼리: "{패키지명} {버전} {질문} documentation"
   - 우선 순위: 공식 사이트 > MDN > Stack Overflow
```

### 8.2 패키지 감지 실패

```markdown
## 패키지 감지 실패 시

1. 프로젝트 루트에 패키지 파일 없음
2. → 버전 명시 없이 최신 문서 기준 검색
3. → 사용자에게 버전 확인 요청
   "프로젝트 버전을 감지하지 못했습니다.
    특정 버전이 필요하면 알려주세요."
```

---

## 9. 출력 형식 예시

### 9.1 정상 케이스

```markdown
**React 18에서 useEffect 사용법**입니다.
(현재 프로젝트: react@18.2.0 ✓)

### 기본 사용법

```tsx
useEffect(() => {
  // 사이드 이펙트
  return () => {
    // 클린업
  };
}, [dependencies]);
```

### 주의사항 (React 18 기준)
- Strict Mode에서 개발 시 2번 실행됨
- 클린업 함수 반환 권장

📚 출처: react.dev/reference/react/useEffect
```

### 9.2 버전 불일치 경고

```markdown
⚠️ **버전 주의**

질문하신 `useOptimistic` 훅은 **React 19+**에서 지원됩니다.
현재 프로젝트: react@18.2.0

**옵션:**
1. React 19로 업그레이드: `npm install react@19`
2. React 18에서 유사 구현: `useTransition` + 로컬 상태
```

### 9.3 패키지 미감지

```markdown
프로젝트에서 React 버전을 감지하지 못했습니다.
**최신 버전(React 19)** 기준으로 안내드립니다.

특정 버전이 필요하시면 알려주세요.
예: "React 17 기준으로 알려줘"
```

---

## 10. intent-routing.md 추가 규칙

```markdown
## 리서치 계열

| 키워드 | 컨텍스트 | 처리 방식 | 설명 |
|--------|----------|-----------|------|
| 어떻게, how to | 라이브러리/프레임워크 | `research-agent` | 사용법 리서치 |
| 최신, latest, 새 기능 | 기술 트렌드 | `research-agent` | 최신 정보 리서치 |
| 마이그레이션, 업그레이드 | 버전 변경 | `research-agent` | 버전 비교 리서치 |
| best practice | 패턴/방법론 | `research-agent` | 권장 사항 리서치 |
| 공식 문서, docs | 문서 참조 | `research-agent` | 문서 검색 |

### 네거티브 룰 (리서치 불필요)

| 요청 유형 | 처리 방식 | 이유 |
|-----------|-----------|------|
| 이 코드 수정해줘 | 직접 수정 | 내부 로직 |
| 버그 고쳐줘 | `issue-fixer` | 디버깅 |
| 리팩토링해줘 | `vibe-implementer` | 코드 변환 |
| 파일 어디있어 | 직접 Glob | 탐색 |
```

---

## 11. 향후 확장

### 11.1 추가 패키지 감지기
- Swift (Package.swift)
- Kotlin (build.gradle.kts)
- Elixir (mix.exs)
- Dart (pubspec.yaml)

### 11.2 문서 소스 확장
- DevDocs API 연동
- GitHub README 자동 참조
- 로컬 문서 인덱싱

### 11.3 캐싱
- 패키지 버전 캐싱 (세션 단위)
- 문서 검색 결과 캐싱 (TTL 기반)

---

## 12. 체크리스트

### 구현 전

- [ ] research-agent.md 작성
- [ ] skills/research.md 작성
- [ ] intent-routing.md 업데이트
- [ ] package-detectors.yaml 작성

### 구현 후 (선택)

- [ ] src/mcp/research-server.ts
- [ ] 패키지 감지기 (npm, pypi, go)
- [ ] 문서 검색 도구

### 테스트

- [ ] 의도 감지 정확도 테스트
- [ ] 패키지 감지 테스트 (각 언어별)
- [ ] 폴백 동작 테스트
- [ ] 버전 불일치 경고 테스트

---

*문서 작성: Claude Code*
*최종 수정: 2026-01-05*
