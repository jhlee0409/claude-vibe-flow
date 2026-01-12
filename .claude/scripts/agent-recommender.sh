#!/bin/bash
# agent-recommender.sh - UserPromptSubmit Hook
# 사용자 입력에서 키워드를 감지하여 적절한 CVF 에이전트를 추천합니다.
#
# Exit Codes:
#   0 = 정보 제공 (차단 없음)

USER_INPUT="$1"

# 빈 입력 무시
if [ -z "$USER_INPUT" ]; then
  exit 0
fi

# 소문자로 변환하여 비교
INPUT_LOWER=$(echo "$USER_INPUT" | tr '[:upper:]' '[:lower:]')

# ============================================
# 에이전트 추천 로직
# ============================================

# 1. cvf-orchestrator: 제품 빌드 요청
if echo "$INPUT_LOWER" | grep -qE "(만들어|빌드|build me|make.*app|create.*app|i want to create|i need a)"; then
  echo "💡 cvf-orchestrator: 전체 제품 빌드를 조율합니다"
  exit 0
fi

# 2. cvf-applier: 확정 요청 (한국어/영어)
if echo "$INPUT_LOWER" | grep -qE "(이걸로 해줘|이걸로 진행|apply this|go with|let's do|option [a-z])"; then
  echo "💡 cvf-applier: 확정된 대안을 분석 후 적용합니다"
  exit 0
fi

# 3. cvf-debugger: 버그/에러 관련
if echo "$INPUT_LOWER" | grep -qE "(버그|bug|에러|error|안돼|안 돼|broken|not working|doesn't work|fail|실패)"; then
  echo "💡 cvf-debugger: 버그를 분석하고 수정합니다"
  exit 0
fi

# 4. cvf-security: 보안/인증 관련
if echo "$INPUT_LOWER" | grep -qE "(보안|security|인증|auth|login|로그인|password|비밀번호|token|jwt|oauth)"; then
  echo "💡 cvf-security: 보안 검토를 수행합니다"
  exit 0
fi

# 5. cvf-performance: 성능 관련
if echo "$INPUT_LOWER" | grep -qE "(느려|slow|성능|performance|최적화|optimize|빠르게|faster|lag)"; then
  echo "💡 cvf-performance: 성능 분석 및 최적화를 수행합니다"
  exit 0
fi

# 6. cvf-ui-ux: UI/디자인 관련
if echo "$INPUT_LOWER" | grep -qE "(디자인|design|ui|ux|예쁘게|스타일|style|컴포넌트|component|레이아웃|layout)"; then
  echo "💡 cvf-ui-ux: UI/UX 디자인을 개선합니다"
  exit 0
fi

# 7. cvf-architect: 구조/설계 관련
if echo "$INPUT_LOWER" | grep -qE "(구조|structure|설계|architect|아키텍처|패턴|pattern|리팩토링|refactor)"; then
  echo "💡 cvf-architect: 시스템 아키텍처를 설계합니다"
  exit 0
fi

# 8. cvf-researcher: 라이브러리/베스트프랙티스 관련
if echo "$INPUT_LOWER" | grep -qE "(라이브러리|library|뭐 써|what.*use|추천|recommend|best practice|비교|compare)"; then
  echo "💡 cvf-researcher: 외부 리서치를 수행합니다"
  exit 0
fi

# 9. cvf-planner: 기획/접근법 관련
if echo "$INPUT_LOWER" | grep -qE "(기획|plan|어떻게|how should|접근|approach|계획)"; then
  echo "💡 cvf-planner: 아이디어를 구체적인 스펙으로 변환합니다"
  exit 0
fi

# 10. cvf-reviewer: 코드 리뷰 관련
if echo "$INPUT_LOWER" | grep -qE "(리뷰|review|코드 확인|check.*code|pr 확인|검토)"; then
  echo "💡 cvf-reviewer: 코드 리뷰를 수행합니다"
  exit 0
fi

# 매칭 없으면 조용히 종료
exit 0
