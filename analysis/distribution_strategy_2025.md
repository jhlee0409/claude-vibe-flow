# ClaudeVibeFlow 배포 및 확장 전략 종합 가이드 (2025)

본 문서는 `claude-vibe-flow`를 사용자에게 제공하는 4가지 핵심 형태와 이를 단일 레포지토리에서 효율적으로 관리하는 **2025년형 AI 도구 배포 전략**을 정리합니다.

---

## 1. 2025년 4대 통합 배포 모델

사용자님이 구축하신 에이전트 시스템은 유저의 요구와 숙련도에 따라 4가지 형태로 제공됩니다.

| 구분 | 형태 | 주 대상 | 핵심 가치 (UX/DX) |
| :--- | :--- | :--- | :--- |
| **지능 (Brain)** | **GitHub Template** | 0 → 1 신규 유저 | 아이데이션부터 구현까지 전 과정 가이드 제공 |
| **지능 (Brain)** | **npx CLI (Initializer)**| 1 → N 기존 유저 | 명령어 한 줄로 기존 프로젝트에 에이전트 즉시 이식 |
| **지능 (Brain)** | **Claude Plugin** | 실무/기업 유저 | 표준화된 규격(`plugin.json`)으로 안정적 관리 및 보안 |
| **행동 (Hands)** | **MCP Server** | 고도화/전문 유저 | 에이전트에게 외부 툴(GitHub/Jira/DB)과 직접 통신하는 '도구' 제공 |

---

## 2. 단일 관리 체계 (Single Source of Truth)

4가지 형태를 각각 다른 곳에서 관리하지 않고, **하나의 레포지토리**에서 통합 관리하여 운영 효율을 높입니다.

### 📂 통합 레포지토리 구조
```text
/claude-vibe-flow
├── agents/             <-- [공통 핵심] 15개 에이전트의 '지능' (프롬프트 소스)
├── commands/           <-- [공통 핵심] 시스템 컨트롤 명령어 세트
├── src/mcp/            <-- [행동] MCP 서버 로직 (TypeScript/Node.js)
├── bin/install.js      <-- [배포] npx 설치 시 실행되는 파일 이식 엔진
├── plugin.json         <-- [배포] 클로드 코드 공식 플러그인 정의
├── package.json        <-- [배포] npm 게시 및 CLI 명령어 정의
└── README.md           <-- [가이드] 유저 상황별 4대 입구 안내
```

---

## 3. 단일 레포지토리 관리 및 배포 기술 가이드

하나의 소스(Single Source)에서 4가지 형태를 동시에 관리하고 배포하기 위한 구체적인 기술 워크플로우를 제안합니다.

### 3.1 배포 형태별 핵심 설정 (Config)
*   **GitHub Template**: GitHub 프로젝트 설정에서 **'Template repository'** 체크박스를 활성화합니다. (설정 외 추가 작업 없음)
*   **Claude Plugin**: 루트 폴더에 **`plugin.json`** 파일을 유지합니다. 클로드 코드가 해당 레포지토리 주소를 직접 인식하여 에이전트들을 로드합니다.
*   **npx CLI (npm)**: `package.json`의 `bin` 섹션에 실행 스크립트(`bin/install.js`)를 등록한 후, **`npm publish`**를 수행합니다. 
*   **MCP Server**: `project/src/mcp` 로직을 컴파일하여 패키지에 포함하거나, 별도의 MCP 레지스트리에 등록합니다.

### 3.2 핵심 설치 로직 (`bin/install.js`)
npx를 통해 유저의 기존 프로젝트에 에이전트를 영입할 때 사용하는 핵심 메커니즘입니다.
```javascript
// 핵심 메커니즘 예시
const fs = require('fs-extra');
const path = require('path');

async function setupVibe() {
  const targetPath = process.cwd(); // 유저의 프로젝트 폴더
  const sourcePath = path.join(__dirname, '../'); // 템플릿의 소스 폴더

  // 1. 핵심 에이션트 및 명령어 폴더 복사
  await fs.copy(path.join(sourcePath, 'agents'), path.join(targetPath, '.claude-vibe/agents'));
  await fs.copy(path.join(sourcePath, 'commands'), path.join(targetPath, '.claude-vibe/commands'));

  // 2. 프로젝트 상황 인식(Context Discovery) 및 CLAUDE.md 생성
  const techStack = await autoDetectTechStack(targetPath); // AI 또는 스크립트가 분석
  await createCustomClaudeMd(targetPath, techStack);

  console.log("Vibe 에이전트 영입 성공! 'claude'를 실행하여 첫 대화를 시작하세요.");
}
```

### 3.3 통합 배포 워크플로우 (CI/CD)
1.  **Work**: 개발자가 `agents/` 폴더 내의 프롬프트나 `src/mcp/` 소스 코드를 수정합니다.
2.  **Tag**: `git push origin v1.0.0` 으로 버전을 태깅합니다.
3.  **Deploy**: GitHub Actions 등을 통해 자동으로 `npm publish`가 수행됩니다.
4.  **Sync**: 템플릿 유저(Fork), 플러그인 유저(Auto-update), CLI 유저(npx 재실행) 모두가 **동시에 최신 프롬프트 지능**을 수혈받습니다.

---

---

## 4. 에이전트를 위한 실전 구현 명세 (Implementation Specs)

에이전트에게 "이 배포 환경을 구축해줘(해줘)"라고 요청했을 때 즉각 로직을 짤 수 있도록 기술적 세부 정보를 정의합니다.

### 4.1 핵심 설정 파일 템플릿 (JSON Schema)

#### `plugin.json` (Claude Code용)
```json
{
  "name": "claude-vibe-flow",
  "version": "1.0.0",
  "description": "Autonomous Vibe Coding Agents for Professional Devs",
  "entry": "agents/pm-orchestrator.md",
  "commands": "commands/*.md",
  "capabilities": ["filesystem", "terminal"]
}
```

#### `package.json` (CLI & MCP용)
```json
{
  "name": "claude-vibe",
  "version": "1.0.0",
  "bin": { "vibe-init": "./bin/install.js" },
  "dependencies": {
    "fs-extra": "^11.0.0",
    "chalk": "^5.0.0",
    "@modelcontextprotocol/sdk": "^0.1.0"
  }
}
```

### 4.2 분석 에이전트(`vibe-init`)의 3대 검출 로직
AI가 기존 프로젝트를 이식할 때 분석해야 할 핵심 항목입니다.
1.  **Tech Stack**: `package.json` 또는 폴더 구조를 통해 프레임워크(React, Next.js, Go 등) 파악.
2.  **Test Environment**: `vitest`, `jest`, `playwright` 등 설치 여부 확인 후 `test-generator`에 반영.
3.  **Project Style**: 기존 코드 샘플을 2~3개 읽어 `vibe-implementer`가 따를 '코딩 스타일 가이드'를 `CLAUDE.md`에 추출.

---

## 5. 2025년형 AI 도구 UX/DX 핵심 원칙 (BP)

---
## 요약: "아이디어만 있으면 서비스가 되는 생태계"

사용자님의 시스템은 **하나의 강력한 에이전트 소스(Core)**를 기반으로, 유저의 선택에 따라 때로는 템플릿이 되고, 때로는 플러그인이 되며, 때로는 강력한 자동화 엔진(MCP)으로 작동합니다. 이 4대 전략의 결합을 통해 `claude-vibe-flow`는 단순한 도구를 넘어 독보적인 AI 개발 인프라로 자리 잡을 것입니다.

---
*Antigravity AI: 2025 종합 배포 및 확장 전략 수립 완료*
