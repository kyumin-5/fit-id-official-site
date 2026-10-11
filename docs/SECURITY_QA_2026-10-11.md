# FIT ID 운영 안정화 점검 기록 — 2026-10-11

## 이번 점검 범위

- 공식 홈페이지: 내부 링크·정적 이미지·폼 안내·연동 링크·기본 보안 헤더 검증
- Consumer: S/M/L 가상피팅 제어값 테스트(자동 생성 이미지 **픽셀 수준 품질은 미검증**)
- Partner: 상품 준비도 보조 표시, 기존 계정 권한 유지
- 쇼핑몰 SDK: 상품 식별·연결 실패·임베디드 모달 닫기 계약 검사
- Supabase: **테이블 구조, RLS 여부, 정책 정의, Storage 공개 설정 등 메타데이터만 조회. 고객 레코드/사진은 조회하지 않음.**

## Supabase 메타데이터 점검 결과

- `public` 스키마에서 조사된 20개 테이블 모두 Row-Level Security(RLS)가 활성화되어 있음.
- `consumer_profiles`, `consumer_body_scans`, `consumer_garments`, `partner_profiles`, `virtual_tryon_events`에 인증 사용자별 접근 조건이 존재함.
- `consumer_size_chart_requests`, `partner_size_chart_requests`는 현재 RLS 활성화 상태에서 개별 정책 없음(직접 접근 기본 거부일 수 있으며 호출 경로와 서버 권한을 추가 점검해야 함).
- `products`, `product_sizes`, `shops`에는 공개 SELECT 정책이 있음. **상품 데이터 공개 목적에는 맞을 수 있으나, 전체 컬럼 노출의 적절성은 재검토 필요**. 특히 쇼핑몰 소유권 연결 UUID 같은 운영 필드가 그대로 공개되는지 검토 후 권한·조회 인터페이스를 조정.
- Storage `consumer-vton-images`, `consumer-manual-products` 버킷은 private; `product-images`는 public. 실제 객체의 인증·서명 URL 흐름은 별도 end-to-end 점검 필요.
- VTON Edge Function은 배포본과 Consumer GitHub 소스가 일치하고 JWT 검증 사용.

## 출시 전 추가 확인할 항목

1. **고객 실데이터 없이** anon / 사용자 A / 사용자 B / 다른 Partner 계정으로 테이블·Storage 교차 접근 차단 검증.
2. `shops/products/product_sizes` 공개 SELECT에서 운영용 필드 노출 여부 점검. 필요하면 공개 전용 뷰/RPC와 권한 경계로 분리(기존 SDK 호환성 테스트 후 변경).
3. 프론트엔드·Edge Functions 전반에 개인정보 데이터 보관기간, 삭제, 로그 마스킹, 비정상 호출 제한이 적절한지 점검.
4. 실제 S/M/L 이미지 결과 변화가 충분히 구분되는지 동의 받은 테스트 사진으로 반복 테스트(외부 이미지 생성 API 비용 발생 가능).
5. PoC 문의 자동 접수는 아직 제공하지 않으며, 도입 전 수집 고지·보관기간·오남용 방지·접근통제·삭제 절차를 설계해야 함.
6. 테스트 계정으로 모바일/PC 실제 브라우저 흐름과 쇼핑몰 복귀·인증 상태 복구·접근성 추가 검증.

## 개발 PC 초기화 대응

모든 소스는 각 GitHub `main` 기준으로 재확보하며, Vercel Production 배포와 Supabase 프로젝트 설정을 확인한 뒤 작업. 정적 공식 홈페이지 점검은 `npm run check`, Consumer는 GitHub Actions `FIT ID Consumer Web CI`, 데모 쇼핑몰은 `Demo Commerce CI`.

**주의:** 이 문서는 제한된 메타데이터 정적 감사이며 침투 테스트 또는 개인정보 법적 적합성 인증이 아닙니다.
