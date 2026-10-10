# FIT ID 공식 홈페이지 · 배포본 v1.1

공식 홈페이지: https://fit-id-official-site.vercel.app/
Vercel 프로젝트: `fit-id-official-site` (기존 Consumer / Partner / 쇼핑몰 프로젝트와 별도)

## 현재 구축된 기능

- FIT ID 브랜드 소개, 실제 잘 맞는 옷 기준, FIT CHECK 과정 설명
- 소비자 앱, 파트너 웹, 쇼핑몰 데모로 연결되는 CTA
- PoC 파트너 소개, FAQ, 제휴 문의 텍스트 생성/복사
- 모바일/태블릿/데스크톱 반응형, 기본 SEO 메타정보와 공유 이미지 SVG

**주의:** 현재 제휴 문의서는 서버에 제출되지 않습니다. 자동 문의 접수와 연락처 수신을 원한다면 별도 기능 구현이 필요합니다.

## GitHub 연동 (최초 1회만)

1. GitHub https://github.com/new 로 이동해서 로그인합니다.
2. 소유자를 `kyumin-5`, 저장소 이름을 `fit-id-official-site`로 하고 새 **빈 저장소**를 생성합니다. README·.gitignore 자동 추가는 해제합니다.
3. ZIP을 별도 폴더에 압축 해제한 뒤, 해당 폴더에서 PowerShell을 엽니다.
4. 아래 명령을 실행합니다.

```powershell
Set-ExecutionPolicy -Scope Process Bypass -Force
.\PUBLISH_TO_GITHUB.ps1
```

5. Vercel의 **fit-id-official-site 프로젝트 > Settings > Git**에서 위 저장소를 연결합니다.
6. Production Branch가 `main`인지 확인합니다. 이후 main push가 자동 배포됩니다.

Vercel 프로젝트는 현재 API를 통해 소스 파일을 직접 배포한 상태이며 아직 GitHub 저장소에는 연결되지 않았습니다.

## 로컬 실행 및 검사

```powershell
npx serve . -l 3000
node --check .\app.js
```

- 공식 도메인 구입 시 canonical/og:url/og:image 주소를 함께 변경하세요.
- 서비스 소개 화면 중 그래픽/파트너 지표는 실제 데이터가 아니라 설명용 시연 UI입니다.
- 사업자정보 및 개인정보처리방침 등 법적 표시 의무는 사업 주체와 실제 서비스 형태에 맞게 검토해야 합니다.
- OG 공유 이미지는 현재 SVG이며, 일부 SNS에서 미리보기가 제한될 수 있습니다. PNG 파일은 원본 ZIP에 포함돼 있어 추후 절대 URL로 설정할 수 있습니다.