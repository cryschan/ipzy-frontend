# SEO 개선 가이드

## 📌 개요

이 문서는 ipzy 서비스의 검색엔진 최적화(SEO) 전략과 구현 방법을 다룹니다.

**목표**:

- 구글/네이버 검색 노출 개선
- 사용자 유입 증대
- Core Web Vitals 최적화
- 소셜 미디어 공유 최적화

---

## ✅ 완료된 SEO 설정 (2025-12-19 기준)

### 기본 메타 태그 (index.html)

- ✅ 한국어 설정 (`lang="ko"`)
- ✅ Title, Description, Keywords
- ✅ Open Graph 태그 (Facebook 공유)
- ✅ Twitter Card 태그
- ✅ Canonical URL
- ✅ Theme Color (#FB5010)

### Vercel 배포 설정

- ✅ SPA 라우팅 (vercel.json)
- ✅ 보안 헤더 (X-Content-Type-Options, X-Frame-Options, etc.)
- ✅ 정적 파일 캐싱 (1년)

### 구조화된 데이터 (Schema.org)

- ✅ **WebApplication 스키마** (`index.html:38-53`)
  - 앱 이름, URL, 설명, 카테고리
  - 무료 서비스 정보 (price: 0)

- ✅ **Organization 스키마** (`index.html:54-62`)
  - 조직명, URL, 로고

### 검색 엔진 크롤링

- ✅ **robots.txt** (`public/robots.txt`)
  - `/admin/`, `/mypage/`, `/payment/`, `/auth/` 크롤링 차단
  - sitemap.xml 위치 명시

- ✅ **sitemap.xml** (`public/sitemap.xml`)
  - 홈(priority 1.0), 퀴즈(0.9), 가격(0.8), 로그인(0.5) 등록
  - 최종 수정일: 2025-12-19

### 페이지별 동적 SEO

- ✅ **react-helmet-async** 설치 및 설정
  - App.tsx에 HelmetProvider 추가
  - SEO 컴포넌트 생성 (`src/components/SEO.tsx`)

- ✅ **주요 페이지 SEO 적용**
  - 홈 페이지 (`/`): 기본 메타 태그
  - 퀴즈 페이지 (`/quiz`): "AI 코디 퀴즈 - 뭐입지"
  - 가격 페이지 (`/pricing`): "가격 안내 - 뭐입지"

### 빌드 최적화

- ✅ **Vite 코드 스플리팅** (`vite.config.ts`)
  - react-vendor: 44.44 kB (React, React Router)
  - ui-vendor: 14.28 kB (Lucide React)
  - query-vendor: 24.44 kB (React Query)
  - 총 빌드 크기: ~381 kB (gzip: ~106 kB)

- ✅ **프로덕션 최적화**
  - CSS 코드 스플리팅 활성화
  - 프로덕션 빌드에서 console/debugger 제거
  - 번들 크기 경고 임계값: 1000 KB

---

## 🎯 남은 SEO 개선 작업

### 🔴 우선순위 높음 (배포 전 권장)

#### 1. Google Search Console 등록 (15분)

**목적**: 사이트 색인 생성 및 검색 성과 모니터링

**절차**:

1. https://search.google.com/search-console 접속
2. "속성 추가" 클릭 → URL 접두어: `https://ipzy.vercel.app`
3. 소유권 확인 방법:
   - **방법 A (권장)**: HTML 메타 태그 추가
     ```html
     <!-- index.html <head>에 추가 -->
     <meta name="google-site-verification" content="YOUR_CODE" />
     ```
   - **방법 B**: HTML 파일 업로드 (`public/google[CODE].html`)

4. Sitemap 제출:
   - 서치 콘솔 → 색인 생성 → Sitemaps
   - URL 입력: `sitemap.xml` → 제출

**완료 확인**:
- 사이트맵 상태: "성공"
- 검색 성과 데이터 수집 시작 (2-3일 소요)

---

#### 2. OG 이미지 생성 (1시간)

**목적**: 소셜 공유 시 매력적인 미리보기 이미지 제공

**요구사항**:
- 크기: 1200x630px (권장)
- 비율: 1.91:1
- 포맷: PNG 또는 JPG
- 용량: 300KB 이하

**디자인 포함 요소**:
- "뭐입지" 로고
- "AI 코디 추천 서비스" 문구
- 브랜드 컬러 (#FB5010)
- 시각적 요소 (예: 옷 아이콘, 퀴즈 이미지)

**저장 위치**: `public/og-image.png`

**테스트 도구**:
- 카카오톡 공유 디버거: https://developers.kakao.com/tool/debugger/sharing
- Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/

---

### 🟡 우선순위 중간 (1-2주 내)

#### 3. 이미지 최적화 (2시간)

현재 프로젝트의 모든 이미지를 WebP 포맷으로 변환:

```bash
# 이미지 파일 확인
find public src -type f \( -name "*.jpg" -o -name "*.png" \)

# WebP 변환 (Squoosh 사용 권장)
# https://squoosh.app/
```

**반응형 이미지 구현**:

```tsx
<picture>
  <source srcset="/images/hero.webp" type="image/webp" />
  <img
    src="/images/hero.jpg"
    alt="AI 코디 추천 서비스 뭐입지"
    width="1200"
    height="630"
    loading="lazy"
  />
</picture>
```

**압축 도구**:
- TinyPNG: https://tinypng.com/
- Squoosh: https://squoosh.app/

---

#### 4. Alt 텍스트 전수 검사 (1시간)

모든 `<img>` 태그에 의미 있는 alt 속성 추가:

```bash
# alt 속성 없는 이미지 검색
grep -r "<img" src --include="*.tsx" | grep -v "alt="
```

**가이드**:

```html
<!-- ❌ 나쁜 예 -->
<img src="logo.png" />
<img src="logo.png" alt="이미지" />

<!-- ✅ 좋은 예 -->
<img src="logo.png" alt="뭐입지 로고" />
<img src="quiz.png" alt="AI 코디 추천 퀴즈 시작 화면" />
```

---

#### 5. Core Web Vitals 측정 및 개선 (3시간)

**측정 도구**:
- PageSpeed Insights: https://pagespeed.web.dev/
- Chrome DevTools → Lighthouse

**목표**:
- LCP (Largest Contentful Paint) < 2.5초
- FID (First Input Delay) < 100ms
- CLS (Cumulative Layout Shift) < 0.1

**개선 방법**:

1. **LCP 개선**:
   - 히어로 이미지 preload 추가:
     ```html
     <link rel="preload" as="image" href="/hero-image.webp" />
     ```
   - 폰트 preload:
     ```html
     <link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin />
     ```

2. **CLS 개선**:
   - 모든 이미지에 width/height 명시:
     ```tsx
     <img src="image.jpg" width="800" height="600" alt="..." />
     ```
   - 폰트 로딩 최적화:
     ```css
     @font-face {
       font-family: "CustomFont";
       font-display: swap;
     }
     ```

3. **FID 개선**:
   - 이미 완료: 코드 스플리팅 ✅
   - Third-party 스크립트 최소화

---

### 🟢 우선순위 낮음 (1개월 내)

#### 6. Breadcrumbs 네비게이션 (2시간)

사용자와 검색 엔진이 페이지 계층 구조를 이해하도록 지원:

**구현 예시**:

```tsx
// src/components/Breadcrumbs.tsx
export default function Breadcrumbs({
  items
}: {
  items: Array<{ label: string; href?: string }>
}) {
  return (
    <nav aria-label="breadcrumb">
      <ol className="flex gap-2 text-sm text-gray-600">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            {item.href ? (
              <a href={item.href} className="hover:text-[#FB5010]">
                {item.label}
              </a>
            ) : (
              <span className="text-[#1a1a1a]" aria-current="page">
                {item.label}
              </span>
            )}
            {index < items.length - 1 && <span>/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// 사용 예시 (Result 페이지)
<Breadcrumbs
  items={[
    { label: "홈", href: "/" },
    { label: "퀴즈", href: "/quiz" },
    { label: "결과" }
  ]}
/>
```

**적용 페이지**:
- 결과 페이지 (`/result`)
- 마이페이지 (`/mypage`)
- 계정 관리 (`/mypage/account`)

---

#### 7. 접근성 (a11y) 개선 (2시간)

접근성은 SEO와 사용자 경험 모두에 긍정적 영향:

**체크리스트**:

- [ ] Semantic HTML 사용 (`<header>`, `<main>`, `<footer>`, `<nav>`)
- [ ] ARIA 레이블 추가 (아이콘 버튼, 네비게이션)
- [ ] 키보드 네비게이션 테스트 (Tab 키로 모든 요소 접근 가능)
- [ ] Focus 스타일링:
  ```css
  button:focus-visible,
  a:focus-visible {
    outline: 2px solid #FB5010;
    outline-offset: 2px;
  }
  ```
- [ ] Skip to content 링크 추가

**검사 도구**:
- Lighthouse Accessibility 스코어 (목표: 90+)
- axe DevTools Chrome Extension
- WAVE: https://wave.webaim.org/

---

#### 8. 내부 링크 구조 개선 (1시간)

**명확한 링크 텍스트 사용**:

```tsx
{/* ❌ 나쁜 예 */}
<a href="/quiz">여기를 클릭</a>
<a href="/pricing">더 보기</a>

{/* ✅ 좋은 예 */}
<a href="/quiz">AI 코디 추천 퀴즈 시작하기</a>
<a href="/pricing">가격 플랜 자세히 보기</a>
```

**관련 페이지 링크 전략**:
- 홈 페이지 → 퀴즈, 가격, 로그인
- 결과 페이지 → 가격 (프리미엄 추천), 다시 퀴즈
- 가격 페이지 → 퀴즈 체험, 로그인

---

#### 9. 폰트 최적화 (1시간)

폰트 로딩 최적화로 LCP 개선:

**현재 폰트 확인**:
```bash
# 프로젝트에서 사용 중인 폰트 확인
grep -r "font-family" src --include="*.css" --include="*.tsx"
```

**최적화 방법**:

1. **Google Fonts 사용 시**:
   ```html
   <!-- ?display=swap 파라미터 추가 -->
   <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap" rel="stylesheet">
   ```

2. **로컬 폰트 사용 시**:
   ```css
   @font-face {
     font-family: "CustomFont";
     src: url("/fonts/custom.woff2") format("woff2");
     font-display: swap;
     font-weight: 400;
     font-style: normal;
   }
   ```

3. **Preload 추가**:
   ```html
   <link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin />
   ```

---

## 📊 SEO 성과 측정

### 주요 지표 (KPI)

1. **검색 노출**:
   - 목표: 월 10,000회 이상
   - 측정: Google Search Console

2. **자연 검색 트래픽**:
   - 목표: 월 500 방문자 이상
   - 측정: Google Analytics, Vercel Analytics

3. **검색 순위**:
   - 목표 키워드:
     - "AI 코디 추천" (1-5위)
     - "무신사 코디" (1-10위)
     - "스타일 매칭" (1-10위)
   - 측정: Ahrefs, SEMrush, Naver Search Advisor

4. **Core Web Vitals**:
   - LCP < 2.5초
   - FID < 100ms
   - CLS < 0.1
   - 측정: PageSpeed Insights, Search Console

5. **전환율**:
   - 퀴즈 완료율: 50% 이상
   - 회원가입 전환율: 10% 이상
   - 측정: Google Analytics

### 모니터링 대시보드

**주간 체크리스트**:

- [ ] Google Search Console 확인
- [ ] 신규 키워드 순위 확인
- [ ] 페이지 오류 확인
- [ ] Core Web Vitals 확인

**월간 체크리스트**:

- [ ] 트래픽 분석 리포트 작성
- [ ] 키워드 순위 변동 분석
- [ ] 경쟁사 분석
- [ ] 콘텐츠 업데이트 계획 수립

---

## 🛠️ 유용한 도구 모음

### SEO 분석

- Google Search Console: https://search.google.com/search-console
- Google Analytics: https://analytics.google.com/
- Naver Search Advisor: https://searchadvisor.naver.com/
- Ahrefs: https://ahrefs.com/
- SEMrush: https://www.semrush.com/

### 성능 측정

- PageSpeed Insights: https://pagespeed.web.dev/
- Lighthouse: Chrome DevTools → Lighthouse 탭
- WebPageTest: https://www.webpagetest.org/
- Web Vitals Chrome Extension

### 구조화된 데이터

- Google Rich Results Test: https://search.google.com/test/rich-results
- Schema.org: https://schema.org/
- Schema Markup Validator: https://validator.schema.org/

### 소셜 미디어

- 카카오톡 공유 디버거: https://developers.kakao.com/tool/debugger/sharing
- Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
- Twitter Card Validator: https://cards-dev.twitter.com/validator

### 접근성

- axe DevTools: Chrome Extension
- WAVE: https://wave.webaim.org/
- Lighthouse Accessibility 스코어

### 이미지 최적화

- TinyPNG: https://tinypng.com/
- Squoosh: https://squoosh.app/
- SVGO: https://jakearchibald.github.io/svgomg/
- ImageOptim (Mac): https://imageoptim.com/

---

## 📚 참고 자료

### 공식 가이드

- Google SEO Starter Guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Google Search Central: https://developers.google.com/search
- Web.dev SEO: https://web.dev/learn/
- Schema.org Documentation: https://schema.org/docs/documents.html

### 한국 시장

- Naver 웹마스터 가이드: https://searchadvisor.naver.com/guide
- Daum 검색등록: https://register.search.daum.net/index.daum

### 성능 최적화

- Vercel 성능 가이드: https://vercel.com/docs/concepts/analytics
- React Performance: https://react.dev/learn/render-and-commit
- Vite 최적화: https://vitejs.dev/guide/build.html

### 접근성

- MDN Web Accessibility: https://developer.mozilla.org/ko/docs/Web/Accessibility
- W3C ARIA: https://www.w3.org/WAI/ARIA/apg/

---

## 📋 완료 체크리스트

### ✅ 완료 (2025-12-19)

- [x] robots.txt 생성
- [x] sitemap.xml 생성
- [x] Schema.org 구조화된 데이터 추가
- [x] react-helmet-async 설치 및 설정
- [x] SEO 컴포넌트 생성
- [x] 주요 페이지 SEO 적용 (홈, 퀴즈, 가격)
- [x] Vite 빌드 최적화 (코드 스플리팅)

### 🔴 우선순위 높음

- [ ] Google Search Console 등록 및 sitemap 제출
- [ ] OG 이미지 생성 (1200x630px)

### 🟡 우선순위 중간

- [ ] 이미지 WebP 변환
- [ ] Alt 텍스트 전수 검사
- [ ] Core Web Vitals 측정 및 개선

### 🟢 우선순위 낮음

- [ ] Breadcrumbs 네비게이션 구현
- [ ] 접근성 (a11y) 개선
- [ ] 내부 링크 구조 개선
- [ ] 폰트 최적화

---

**최종 업데이트**: 2025-12-19
**작성자**: Claude Code
**프로덕션 URL**: https://ipzy.vercel.app
**빌드 크기**: 380.74 kB (gzip: 106.16 kB)
