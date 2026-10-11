# FIT ID · 공식 홈페이지

- **운영 주소:** https://fit-id-official-site.vercel.app/
- **GitHub:** https://github.com/kyumin-5/fit-id-official-site
- **Vercel 프로젝트:** `fit-id-official-site` · `main` 브랜치에 배포
- **연동 서비스:** Consumer https://fit-id-consumer-mtvz.vercel.app/ · Partner https://fit-id-partner2.vercel.app/ · 데모 쇼핑몰 https://fit-id-demo-malls.vercel.app/

## 현재 제공하는 화면

- FIT ID 소개 및 신체정보·잘 맞는 옷·착용 피드백·FIT CHECK 설명
- 가상피팅 소개(사이즈별 예상 가상 착장 이미지; 콘셉트 이미지 포함), Consumer 체험 링크
- 초기 PoC 파트너 협업 흐름과 이메일·카카오톡 상담 채널
- 반응형 모바일·태블릿·데스크톱 UI, SEO/OG 메타 및 보안 헤더

**상품·AI 이미지 및 가상피팅 결과:** 랜딩의 에디토리얼/시연 사진은 콘셉트 예시이며 실제 사용자의 피팅 결과가 아닙니다. 실제 착용 결과의 물리적 정확성을 보장하는 기술이라고 표현하지 않습니다.

**PoC 문의:** 홈페이지 양식은 **문안 생성/복사 후 메일 앱 또는 카카오톡으로 직접 전달**하는 방식입니다. 아직 개인정보를 백엔드에 자동 저장하거나 담당자에게 자동 전송하지 않습니다.

## 초기화되는 개발 PC에서 다시 시작하기

새 컴퓨터에는 Git, Node.js LTS, VS Code 등 필요한 도구를 준비한 뒤 아래를 실행합니다.

```powershell
git clone https://github.com/kyumin-5/fit-id-official-site.git
cd fit-id-official-site
npm run check
npm run dev
```

개발 기록의 기준은 로컬 ZIP이 아닌 **GitHub `main`과 Vercel Production**입니다. 수정 시 별도 브랜치와 Pull Request를 사용하고, GitHub Actions `FIT ID Official Site CI`의 정적 품질 검사를 통과한 뒤 `main`에 병합합니다. `main` 변경 후 Vercel Production 상태가 READY인지 확인합니다.

## 검증 및 운영 주의사항

```powershell
npm run check
```

검사는 JavaScript 문법, 에셋 존재, 내부 링크/앵커, 주요 서비스 URL, 가상피팅 고지, 문의 프로세스, 기본 보안 헤더를 확인합니다. **실제 결제·개인 인증·사진 기반 AI 정확도·브라우저 전체 시각 검증을 대체하지는 않습니다.**

AI 가상피팅은 Consumer/Supabase 측 기능이며 이 정적 홈페이지는 개인정보나 전신 사진을 처리하지 않습니다. 향후 홈페이지에서 제휴 문의 자동 접수를 구현할 경우 개인정보 수집 고지, 접근제어, 보관기간, 스팸·남용 방지 등의 보호 조치부터 설계해야 합니다.

## 연락처

- 이메일: ben-12@naver.com
- 카카오톡 채널: https://pf.kakao.com/_LXiFX
- 전화: 010-2314-9022
