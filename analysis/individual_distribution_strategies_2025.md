# 4대 통합 배포 모델별 상세 전략 (2025)

본 문서는 `claude-vibe-flow`의 4가지 형태 각각에 최적화된 **개별 배포 및 유지보수 가이드**를 제공합니다.

---

## 🟢 1. GitHub Template 전략
**대상**: 0에서 1을 만드는 신규 유저 및 학습자

### 1.1 관리 전략 (Management: Automated)
*   **Source-Driven**: 템플릿 레포지토리는 메인 레포지토리의 `agents/` 및 `config/`가 변경될 때마다 CI/CD로 자동 동기화되는 **'파생물(Derivative)'**로 취급합니다.
*   **No Manual Edit**: 템플릿 레포지토리를 직접 수정하지 않고, 항상 메인 소스를 통해 업데이트를 전파합니다.

### 1.2 배포 및 업데이트 (Release)
*   **배포**: 메인 레포지토리에서 Release Tag가 생성되면 GitHub Action이 자동으로 템플릿 레포지토리에 Push합니다.
*   **업데이트**: 유저에게는 "재설치 불필요, `npx vibe-update` 커맨드로 부분 업데이트"를 권장하는 방향으로 문서를 수정합니다.

---

## 🔵 2. npx CLI (Initializer) 전략
**대상**: 이미 진행 중인 프로젝트를 가진 실무 유저 (1 → N)

### 2.1 관리 전략 (Management: Automated)
*   **Generator Code**: `bin/install.js`는 메인 레포지토리의 `agents/` 폴더를 tarball로 묶어 배포하는 단순 운반체 역할에 집중합니다.
*   **Logic Isolation**: 설치 로직과 에이전트 지능을 분리하여, 지능 업데이트 시 코드 수정 없이 패키지 버전만 올리면 되도록 설계합니다.

### 2.2 배포 및 업데이트 (Release)
*   **배포**: CI/CD 파이프라인에서 `release` 브랜치 병합 시 자동으로 `npm publish`를 수행합니다.
*   **업데이트**: 유저는 항상 `npx` 실행 시점에 최신 버전을 받게 되므로 별도 공지가 필요 없습니다.

---

## 🟠 3. Claude Code Plugin 전략
**대상**: 표준화된 규격과 보안을 중시하는 실무 및 팀 단위 유저

### 3.1 관리 전략 (Management: Source of Truth)
*   **Master Repo**: 이 저장소가 모든 에이전트와 설정의 **'원본(Source of Truth)'**입니다. 모든 변경사항은 여기서 발생합니다.
*   **규격 준수**: `plugin.json`을 Root에 두어 이 저장소 자체가 플러그인 레지스트리 역할을 겸합니다.

### 3.2 배포 및 업데이트 (Release)
*   **배포**: 별도의 '배포' 과정 없이, `main` 브랜치 자체가 최신 배포본이 됩니다.
*   **업데이트**: 다른 모든 파생 형태(CLI, Template)는 이 Master Repo의 변경사항을 트리거로 하여 업데이트됩니다.

---

## 🟣 4. MCP Server 전략
**대상**: 자동화된 도구(Actions)를 사용하려는 고도화 유저

### 4.1 관리 전략 (Management)
*   **Tool Definitions**: 에이전트가 호출할 수 있는 함수(JSON Schema)를 정의하고 관리합니다.
*   **보안 및 인증**: 외부 API(GitHub, DB 등) 연동 시 유저의 개인키(Private Key)가 안전하게 관리되도록 환경변수 설계를 최적화합니다.

### 4.2 배포 및 업데이트 (Release)
*   **배포**: Smithery, MCP Registry 등 2025년형 MCP 마켓플레이스에 등록하여 발견 가능성(Discoverability)을 높입니다.
*   **업데이트**: MCP 서버 바이너리는 독립적으로 업데이트되며, 에이전트(뇌)는 변하지 않아도 도구(손)의 성능이 올라가는 구조를 유지합니다.

---

## 5. 배포 후 업데이트 및 유지보수 수명주기 (Lifecycle)

각 형태별로 유저가 최신 버전을 수혈받는 방식이 다르므로, 제작자는 이를 고려한 업데이트 전략을 세워야 합니다.

| 형태 | 업데이트 방식 | 제작자 액션 | 유저 경험 |
| :--- | :--- | :--- | :--- |
| **Template** | **수동 (Pull)** | `upstream` 레포지토리 업데이트 공지 | 유저가 `git remote add upstream` 후 머지 필요 |
| **npx CLI** | **자동 (on-run)** | npm 패키지 버전 범핑 및 `publish` | 유저가 다음에 `npx`를 실행할 때 즉시 최신본 반영 |
| **Plugin** | **세미자동** | GitHub 레포지토리 코드 푸시 | 유저가 `claude plugin update` 실행 시 반영 |
| **MCP** | **패키지 기반** | npm/Smithery 패키지 업데이트 | 유저의 패키지 매니저 업데이트 주기에 따름 |

---

## 6. 제작자용 실전 배포 체크리스트

### ✅ Step 1: 핵심 프롬프트 개발 (Core)
*   [ ] 15개 에이전트 마크다운 파일 검토
*   [ ] `CLAUDE.md` 공통 가이드 업데이트

### ✅ Step 2: 배포용 메타데이터 작성
*   [ ] `plugin.json` (플러그인 배포용)
*   [ ] `package.json` (CLI/MCP 배포용)
*   [ ] `README.md` (3대 입구 가이드 포함)

### ✅ Step 3: 단일 레포지토리 푸시 & 태깅
*   [ ] `git commit -m "v1.1.0 release"`
*   [ ] `git tag v1.1.0 && git push --tags`

### ✅ Step 4: 마켓플레이스 및 패키지 게시
*   [ ] `npm publish` (CLI 및 MCP 서버 오케스트레이션)
*   [ ] GitHub 'Template' 설정 확인
*   [ ] (선택) Smithery/MCP Registry 등록

---

---

## 7. AI 도구 전용 출시 단계 (Release Stages) 및 품질 게이트

단순한 소프트웨어와 달리 AI 에이전트는 '지능의 정합성'이 중요하므로, 다음과 같은 단계적 출시 전략을 권장합니다.

### 7.1 출시 단계 별 전략
1.  **Alpha (내부 검증)**: 모든 15개 에이전트 간의 '페르소나 충돌' 및 '무한 루프' 여부를 내부 테스트 프로젝트에서 검증합니다.
2.  **Beta (커뮤니티/사용자 피드백)**: **GitHub Template** 형태로 선공개하여 실제 유저들의 다양한 프로젝트 환경(Context)에서 에이전트들이 어떻게 반응하는지 데이터를 수집합니다.
3.  **GA (정식 배포)**: 검증된 프롬프트를 **npx CLI**와 **Claude Plugin**으로 정식 배포하여 대중적 확산을 시작합니다.

### 7.2 품질 게이트 (Quality Gates)
배포 전 반드시 확인해야 할 3개 지표입니다.
*   **Context Efficiency**: 에이전트가 불필요하게 많은 토큰을 소모하지 않는가? (에이전트당 프롬프트 500자 이내 권장)
*   **Instruction Adherence**: 에이전트가 지시사항(예: "리팩토링 금지")을 어기고 독단적으로 행동하지 않는가?
*   **Cross-Agent Sync**: `pm-orchestrator`가 나머지 14개 에이전트에게 내리는 명령이 명확하고 일관적인가?

---

---

## 9. AI 에이전트를 위한 실전 실행 명령어 (Terminal Commands)

에이전트가 "배포 및 관리 작업을 해줘"라는 요청을 받았을 때 즉시 수행할 수 있는 표준 명령어 세트입니다.

### 9.1 초기 배포 환경 구축 (Setup)
```bash
# 1. npm 및 의존성 설치
npm init -y
npm install fs-extra chalk @modelcontextprotocol/sdk

# 2. 필수 폴더 생성
mkdir -p agents commands bin src/mcp templates
```

### 9.2 수명주기별 관리 명령어 (Lifecycle Operations)

| 작업 | 실행 명령어 (AI 주체) |
| :--- | :--- |
| **버전 업 및 배포** | `npm version patch && git push origin main --tags && npm publish` |
| **플러그인 동기화** | `claude plugin add .` (로컬 테스트용) |
| **MCP 서버 빌드** | `tsc -p tsconfig.json` (TypeScript 사용 시) |
| **템플릿 정합성 체크**| `ls agents/*.md commands/*.md plugin.json` |

### 9.3 에이전트 자동 분석 스크립트 트리거
에이전트가 `bin/install.js`를 작성할 때 포함해야 할 핵심 '해줘' 로직:
```javascript
// AI가 작성해야 할 핵심 스캐닝 로직 예시
const scanProject = async () => {
  const hasTS = fs.existsSync('tsconfig.json');
  const hasReact = pkg.dependencies['react'];
  // 분석 결과를 바탕으로 .claude-vibe/config.json 생성
};
```

---

## 10. 제작자를 위한 최종 권고

사용자님의 시스템은 **'지능(에이전트)'**이 소스 코드고, **'형태(배포 채널)'**는 배달 통로입니다. 
가장 추천하는 운영 방식은 **"프롬프트는 한 곳에서만 고치고, 배포는 자동화된 CI/CD를 통해 4곳으로 쏘아주는 것"**입니다. 이 구조가 갖춰지면 사용자님은 에이전트의 품질(IQ)을 높이는 본질적인 업무에만 집중하실 수 있습니다.

---
*Antigravity AI: 형태별 개별 배포/관리 전략 최종 보강 완료*
