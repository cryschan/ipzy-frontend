# 배포 가이드 (Deployment Guide)

## 📌 개요

이 문서는 ipzy 프론트엔드의 Vercel 배포 설정 및 프로덕션 환경 구성에 대한 가이드입니다.

**배포 URL**: https://ipzy.vercel.app
**배포 플랫폼**: Vercel
**빌드 크기**: 380.74 kB (gzip: 106.16 kB)
**최종 업데이트**: 2025-12-19

---

## ✅ 완료된 배포 설정 (2025-12-19 기준)

### 1. 기본 SEO 메타 태그 (`index.html`)

#### Primary 메타 태그

- ✅ `lang="ko"` - 한국어 설정
- ✅ `title` - "뭐입지 - AI 코디 추천 서비스"
- ✅ `description` - 서비스 설명
- ✅ `keywords` - 검색 키워드
- ✅ `theme-color` - 브랜드 컬러 (#FB5010)

#### Open Graph 태그 (소셜 공유)

```html
<meta property="og:type" content="website" />
<meta property="og:url" content="https://ipzy.vercel.app/" />
<meta property="og:title" content="뭐입지 - AI 코디 추천 서비스" />
<meta property="og:description" content="4가지 질문으로 찾는 나만의 스타일..." />
<meta property="og:image" content="https://ipzy.vercel.app/og-image.png" />
<meta property="og:site_name" content="뭐입지" />
<meta property="og:locale" content="ko_KR" />
```

#### Twitter 카드 태그

```html
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:title" content="뭐입지 - AI 코디 추천 서비스" />
<meta property="twitter:image" content="https://ipzy.vercel.app/og-image.png" />
```

#### 검색엔진 최적화

```html
<meta name="robots" content="index, follow" />
<meta name="googlebot" content="index, follow" />
<link rel="canonical" href="https://ipzy.vercel.app/" />
```

---

### 2. 구조화된 데이터 (Schema.org)

#### ✅ WebApplication 스키마 (`index.html:38-53`)

```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "뭐입지",
    "url": "https://ipzy.vercel.app",
    "description": "4가지 질문으로 찾는 나만의 스타일. AI가 추천하는 무신사 코디",
    "applicationCategory": "LifestyleApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "KRW"
    }
  }
</script>
```

#### ✅ Organization 스키마 (`index.html:54-62`)

```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "뭐입지",
    "url": "https://ipzy.vercel.app",
    "logo": "https://ipzy.vercel.app/logo.png"
  }
</script>
```

---

### 3. 검색 엔진 크롤링 파일

#### ✅ robots.txt (`public/robots.txt`)

```txt
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /mypage/
Disallow: /payment/
Disallow: /auth/
Disallow: /dev/
Disallow: /error/

Sitemap: https://ipzy.vercel.app/sitemap.xml
```

#### ✅ sitemap.xml (`public/sitemap.xml`)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://ipzy.vercel.app/</loc>
    <lastmod>2025-12-19</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://ipzy.vercel.app/quiz</loc>
    <lastmod>2025-12-19</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://ipzy.vercel.app/pricing</loc>
    <lastmod>2025-12-19</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

---

### 4. 페이지별 동적 SEO

#### ✅ react-helmet-async 설치 및 설정

```bash
npm install react-helmet-async --legacy-peer-deps
```

#### ✅ SEO 컴포넌트 생성 (`src/components/SEO.tsx`)

```typescript
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

export default function SEO({
  title = "뭐입지 - AI 코디 추천 서비스",
  description = "4가지 질문으로 찾는 나만의 스타일. AI가 추천하는 무신사 코디를 만나보세요.",
  keywords = "코디 추천, AI 스타일링, 무신사, 패션, 옷 추천, 스타일 매칭",
  image = "https://ipzy.vercel.app/og-image.png",
  url = "https://ipzy.vercel.app",
  type = "website"
}: SEOProps) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      <link rel="canonical" href={url} />
    </Helmet>
  );
}
```

#### ✅ App.tsx에 HelmetProvider 추가

```typescript
import { HelmetProvider } from 'react-helmet-async';

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {/* ... */}
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
```

#### ✅ 주요 페이지 SEO 적용

- **홈 페이지** (`src/pages/Home.tsx`): 기본 메타 태그
- **퀴즈 페이지** (`src/pages/Quiz.tsx`): "AI 코디 퀴즈 - 뭐입지"
- **가격 페이지** (`src/pages/Pricing.tsx`): "가격 안내 - 뭐입지"

---

### 5. Vercel 설정 파일 (`vercel.json`)

#### ✅ SPA 라우팅 설정

모든 경로를 `index.html`로 리다이렉트하여 클라이언트 사이드 라우팅 지원:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

#### ✅ 보안 헤더

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; base-uri 'self'; font-src 'self' data:; img-src 'self' data: https:; script-src 'self' 'sha256-3Y7vMnll7IN/K5jBROzTww3qUNBZsijMh578IW3GKxE=' 'sha256-CQ7wi/abxhfyhGbLe4lxpnG0azaZnJ2YzDGBaxJ/KPY='; style-src 'self'; connect-src 'self' https: http:; frame-ancestors 'none'; form-action 'self'; object-src 'none'; manifest-src 'self'; upgrade-insecure-requests"
        }
      ]
    }
  ]
}
```

> 참고: `X-XSS-Protection` 헤더는 최신 브라우저에서 더 이상 사용되지 않으므로 제거했습니다.  
> JSON-LD는 `index.html`에 인라인으로 포함되며, 해당 블록에 대한 SHA-256 해시를 `script-src`에 추가하여 `'unsafe-inline'` 없이 동작합니다. 인라인 JSON-LD 내용을 변경하면 해시도 반드시 갱신해야 합니다.

검증 체크리스트:

- [ ] 스키마(웹앱/조직) JSON-LD가 크롤러에서 정상 인식되는지
- [ ] 페이지 렌더/라우팅 정상 (/, /quiz, /pricing, /result)
- [ ] API 통신 정상 (`connect-src` 정책으로 차단되지 않는지)
- [ ] 외부 리소스 사용 시(추가될 경우) 해당 도메인 화이트리스트 반영

#### ✅ 정적 파일 캐싱 (1년)

```json
{
  "source": "/(.*)\\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)",
  "headers": [
    {
      "key": "Cache-Control",
      "value": "public, max-age=31536000, immutable"
    }
  ]
}
```

---

### 6. 빌드 최적화 (`vite.config.ts`)

#### ✅ 코드 스플리팅 (manualChunks)

```typescript
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "ui-vendor": ["lucide-react"],
          "query-vendor": ["@tanstack/react-query"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
  },
  esbuild: {
    drop: process.env.NODE_ENV === "production" ? ["console", "debugger"] : [],
  },
});
```

**빌드 결과**:

```
dist/index.html                         3.31 kB │ gzip:   1.05 kB
dist/assets/index-Rim25Oj4.css         50.75 kB │ gzip:   9.54 kB
dist/assets/ui-vendor-IHPHYtUA.js      14.28 kB │ gzip:   5.36 kB
dist/assets/query-vendor-CCGRwIjm.js   24.44 kB │ gzip:   7.41 kB
dist/assets/react-vendor-kxMDg0Cx.js   44.44 kB │ gzip:  15.94 kB
dist/assets/index-BgbRj7Yc.js         380.74 kB │ gzip: 106.16 kB
✓ built in 1.78s
```

---

### 7. 세션 만료 처리 (`src/api/api.ts`)

#### ✅ 401/419 응답 시 자동 처리

```typescript
// 세션 만료 알럿 표시
alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");

// 일반 사용자: 메인 페이지(/)로 이동
// 관리자: /admin/login으로 이동
window.location.replace(redirectPath);
```

---

## 🚀 자동 배포 설정 (Git 연동)

### Vercel + GitHub 자동 배포 (권장)

#### 설정 방법

1. **Vercel Dashboard에서 Git 연동**
   - https://vercel.com/dashboard 접속
   - 프로젝트 선택 → Settings → Git
   - Connect Git Repository → GitHub 저장소 선택

2. **자동 배포 규칙**

   ```
   main 브랜치 → 프로덕션 (https://ipzy.vercel.app)
   feature/* 브랜치 → 미리보기 배포 (고유 URL)
   ```

3. **배포 트리거**
   - `main` 브랜치에 push → 자동으로 프로덕션 배포
   - PR 생성 → 미리보기 배포 자동 생성
   - 커밋마다 빌드 상태 GitHub에 표시

#### 개발 워크플로우

**일반 개발**:

```bash
# 1. 기능 브랜치 생성
git checkout -b feature/new-feature

# 2. 코드 작성 후 커밋
git add .
git commit -m "feat: 새로운 기능 추가"
git push origin feature/new-feature

# → Vercel이 자동으로 미리보기 배포 생성
# → PR에 미리보기 URL 댓글 추가
```

**프로덕션 배포**:

```bash
# 3. PR 생성 및 병합
gh pr create --title "새 기능 추가" --base main
gh pr merge 123 --squash

# → main 브랜치 업데이트
# → Vercel이 자동으로 프로덕션 배포 시작
# → 1-2분 후 https://ipzy.vercel.app 업데이트 완료
```

#### 장점

✅ **완전 자동화**: `git push` → 자동 배포
✅ **미리보기 배포**: PR마다 고유 URL 생성
✅ **쉬운 롤백**: 클릭 한 번으로 이전 버전 복구
✅ **환경 변수 관리**: GUI로 프로덕션/미리보기 환경 분리

---

## 🔄 백엔드 배포 후 필수 작업

### 1. Vercel 환경 변수 설정

#### 방법 A: Vercel Dashboard (권장)

1. https://vercel.com/dashboard 접속
2. 프로젝트 선택 → Settings → Environment Variables
3. 변수 추가:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `https://your-backend-api.com`
   - **Environment**: Production, Preview, Development 모두 선택
4. Deployments → Redeploy

#### 방법 B: Vercel CLI

```bash
vercel env add VITE_API_BASE_URL
# 프로덕션 URL 입력: https://your-backend-api.com
# Environment: Production 선택

# 변수 확인
vercel env ls
```

---

### 2. 백엔드 CORS 설정

백엔드 서버에서 다음 도메인을 허용해야 합니다:

```
허용 Origin: https://ipzy.vercel.app
허용 Methods: GET, POST, PUT, DELETE, OPTIONS
허용 Headers: Content-Type, Authorization
Credentials: true (쿠키/세션 사용 시)
```

**Spring Boot 예시**:

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("https://ipzy.vercel.app")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

---

### 3. OAuth 리다이렉트 URL 업데이트

#### 카카오 개발자 콘솔

1. https://developers.kakao.com/ 접속
2. 내 애플리케이션 → 앱 선택
3. 제품 설정 → 카카오 로그인 → Redirect URI 설정
4. 추가: `https://ipzy.vercel.app/auth/callback`

#### 구글 Cloud Console

1. https://console.cloud.google.com/ 접속
2. API 및 서비스 → 사용자 인증 정보
3. OAuth 2.0 클라이언트 ID 선택
4. 승인된 리디렉션 URI 추가: `https://ipzy.vercel.app/auth/callback`

---

## 📋 남은 배포 작업 체크리스트

### 🔴 우선순위 높음 (배포 전 권장)

- [ ] **Google Search Console 등록** (15분)
  - https://search.google.com/search-console
  - sitemap.xml 제출
  - 소유권 확인 메타 태그 추가

- [ ] **OG 이미지 생성** (1시간)
  - 크기: 1200x630px
  - 위치: `public/og-image.png`
  - 디자인: 로고 + 서비스 설명 + 브랜드 컬러

### 🟡 우선순위 중간 (1-2주 내)

- [ ] **이미지 WebP 변환** (2시간)
  - 모든 이미지를 WebP 포맷으로 변환
  - 압축 도구: Squoosh, TinyPNG

- [ ] **Alt 텍스트 전수 검사** (1시간)
  - 모든 `<img>` 태그에 의미 있는 alt 추가

- [ ] **Core Web Vitals 측정 및 개선** (3시간)
  - PageSpeed Insights 테스트
  - LCP < 2.5초, FID < 100ms, CLS < 0.1 목표

### 🟢 우선순위 낮음 (1개월 내)

- [ ] **Breadcrumbs 네비게이션** (2시간)
- [ ] **접근성 (a11y) 개선** (2시간)
- [ ] **폰트 최적화** (1시간)
- [ ] **Google Analytics 설치** (30분)
- [ ] **Sentry 에러 트래킹** (1시간)

---

## 🎨 추가 권장 사항

### 1. Favicon 업데이트

브랜드 파비콘으로 교체:

**현재 설정** (`index.html`):

```html
<link rel="icon" type="image/svg+xml" href="/vite.svg" />
```

**권장 파일**:

```
public/favicon.ico (32x32, 16x16 멀티사이즈)
public/favicon.svg (벡터)
public/apple-touch-icon.png (180x180, iOS용)
```

**업데이트** (`index.html`):

```html
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
```

---

### 2. 성능 모니터링

#### Vercel Analytics (권장)

1. Vercel Dashboard → Analytics 탭
2. Enable Analytics
3. 무료 플랜: 2,500 이벤트/월

#### Google Analytics (선택)

1. https://analytics.google.com/ 에서 GA4 속성 생성
2. 측정 ID 확인 (G-XXXXXXXXXX)
3. `index.html`에 추가:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", "G-XXXXXXXXXX");
</script>
```

---

### 3. 에러 트래킹 (Sentry)

```bash
npm install @sentry/react
```

`src/main.tsx`에 추가:

```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0,
});
```

---

## 🔍 배포 확인 체크리스트

### 프론트엔드 확인

- [x] 사이트 접속 확인: https://ipzy.vercel.app
- [x] 모든 페이지 라우팅 정상 작동 (/, /quiz, /pricing 등)
- [x] 새로고침 시 404 없이 정상 작동 (SPA 라우팅)
- [x] 빌드 성공 (380.74 kB, gzip: 106.16 kB)

### SEO 확인

- [x] 페이지 소스 보기 → 메타 태그 확인
- [x] robots.txt 생성 확인
- [x] sitemap.xml 생성 확인
- [x] Schema.org 구조화된 데이터 추가
- [ ] Facebook 공유 디버거 테스트
- [ ] Google Search Console 등록

### 보안 확인

- [x] 보안 헤더 설정 (vercel.json)
- [x] SSL 인증서 (HTTPS)
- [ ] 보안 헤더 검증: https://securityheaders.com/?q=https://ipzy.vercel.app

### 성능 확인

- [x] 코드 스플리팅 적용
- [x] CSS 코드 스플리팅 활성화
- [x] 정적 파일 캐싱 (1년)
- [ ] Lighthouse 스코어 확인 (목표: 90+)
- [ ] PageSpeed Insights 테스트

### 백엔드 연동 확인 (배포 후)

- [ ] API 호출 정상 작동
- [ ] CORS 에러 없음
- [ ] 카카오 로그인 정상 작동
- [ ] 구글 로그인 정상 작동
- [ ] 세션 만료 처리 정상 작동

---

## 🚨 트러블슈팅

### 1. 환경 변수가 적용되지 않음

**원인**: Vercel은 빌드 시점에 환경 변수를 주입합니다.

**해결**:

1. Vercel Dashboard에서 환경 변수 확인
2. Deployments → 최신 배포 → Redeploy
3. 또는 새로운 커밋 푸시

---

### 2. 404 에러 발생 (페이지 새로고침 시)

**원인**: `vercel.json`의 rewrites 설정 누락

**해결**:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

### 3. CORS 에러

**원인**: 백엔드에서 프론트엔드 도메인 미허용

**해결**:

- 백엔드 CORS 설정에 `https://ipzy.vercel.app` 추가
- `allowCredentials: true` 설정 (쿠키 사용 시)

---

### 4. OAuth 로그인 실패

**원인**: 리다이렉트 URI 미등록

**해결**:

- 카카오/구글 개발자 콘솔에서 `https://ipzy.vercel.app/auth/callback` 등록
- 정확한 URL 확인 (trailing slash 주의)

---

### 5. 빌드 실패

**원인**: TypeScript 타입 에러, ESLint 에러

**해결**:

```bash
# 로컬에서 빌드 테스트
npm run build

# 타입 체크
npm run type-check  # 또는 tsc --noEmit

# 린트 체크
npm run lint
```

---

## 📊 배포 모니터링

### Vercel Dashboard

- **Deployments**: 모든 배포 이력 확인
- **Analytics**: 트래픽, 성능 지표
- **Logs**: 빌드 로그, 런타임 로그
- **Speed Insights**: Core Web Vitals 측정

### GitHub 통합

- PR에 배포 상태 자동 업데이트
- 커밋 옆에 배포 성공/실패 표시
- 미리보기 URL 자동 코멘트

---

## 📚 참고 자료

### 공식 문서

- Vercel 공식 문서: https://vercel.com/docs
- Vite 배포 가이드: https://vitejs.dev/guide/static-deploy.html
- React Helmet Async: https://github.com/staylor/react-helmet-async

### SEO 관련

- Google SEO 가이드: https://developers.google.com/search/docs
- Open Graph 프로토콜: https://ogp.me/
- Schema.org: https://schema.org/
- Naver 웹마스터: https://searchadvisor.naver.com/

### 성능 측정

- PageSpeed Insights: https://pagespeed.web.dev/
- Lighthouse: Chrome DevTools
- Web Vitals: https://web.dev/vitals/

---

**최종 업데이트**: 2025-12-19
**작성자**: Claude Code
**배포 환경**: Vercel
**프로덕션 URL**: https://ipzy.vercel.app
**빌드 크기**: 380.74 kB (gzip: 106.16 kB)
