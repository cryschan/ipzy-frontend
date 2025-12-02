# 보안

이 문서는 API의 보안 전략과 구현 지침을 설명합니다.

---

## 인증 (Authentication)

### JWT (JSON Web Token)

#### Access Token

**유효기간**: 1시간

**Payload**
```typescript
{
  sub: string;        // user id
  email: string;
  role: "user" | "admin";
  iat: number;        // issued at (timestamp)
  exp: number;        // expiration (timestamp)
}
```

**사용법**
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Refresh Token

**유효기간**:
- 일반: 7일
- Remember Me: 30일

**Payload**
```typescript
{
  sub: string;        // user id
  tokenId: string;    // 토큰 고유 ID (revoke용)
  iat: number;
  exp: number;
}
```

**저장 위치**:
- 클라이언트: httpOnly 쿠키 또는 secure storage
- 서버: 데이터베이스 (무효화 처리용)

#### 토큰 갱신 프로세스

```
1. Access Token 만료
2. 클라이언트가 Refresh Token으로 POST /auth/refresh 호출
3. 서버가 Refresh Token 검증
4. 새로운 Access Token과 Refresh Token 발급
5. 기존 Refresh Token 무효화
```

#### 토큰 무효화

다음 경우 토큰이 무효화됩니다:
- 로그아웃
- 비밀번호 변경
- 계정 삭제
- 관리자에 의한 강제 로그아웃

---

## CORS (Cross-Origin Resource Sharing)

### 허용 출처

```typescript
const allowedOrigins = [
  'https://mweoipji.com',
  'https://www.mweoipji.com',
  'https://admin.mweoipji.com',
  'http://localhost:3000',      // 개발용
  'http://localhost:5173'       // Vite 개발용
];
```

### CORS 헤더

```http
Access-Control-Allow-Origin: https://mweoipji.com
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization, X-Request-ID
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 86400
```

### Preflight 요청

모든 비단순 요청(Content-Type: application/json 등)은 OPTIONS preflight 요청을 먼저 보냅니다.

서버는 OPTIONS 요청에 대해 200 응답과 적절한 CORS 헤더를 반환해야 합니다.

---

## Rate Limiting

### 전역 제한

```typescript
const globalRateLimit = {
  windowMs: 60 * 1000,  // 1분
  max: 100              // 요청 100회
};
```

### 인증 API 제한

브루트포스 공격 방지:

```typescript
const authRateLimit = {
  windowMs: 15 * 60 * 1000,  // 15분
  max: 10                     // 로그인 시도 10회
};
```

적용 대상:
- `POST /auth/login`
- `POST /auth/admin/login`
- `POST /auth/register`

### 비밀번호 재설정 제한

```typescript
const passwordResetRateLimit = {
  windowMs: 60 * 60 * 1000,  // 1시간
  max: 3                      // 3회
};
```

적용 대상:
- `POST /auth/password/forgot`

### 코디 추천 제한

플랜별 일일 한도로 처리:
- Free: 3회/일
- Basic: 10회/일
- Pro: 무제한

### Rate Limit 헤더

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642352400
```

### 429 에러 응답

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT",
    "message": "요청 제한을 초과했습니다",
    "details": {
      "retryAfter": 60,
      "limit": 100,
      "windowMs": 60000
    }
  }
}
```

---

## 입력 검증

### 검증 라이브러리

Zod 또는 Joi 사용 권장

### 검증 규칙 예시

#### 이메일

```typescript
const emailSchema = z.string()
  .email("유효한 이메일을 입력해주세요")
  .max(100, "이메일은 100자 이하여야 합니다");
```

#### 비밀번호

```typescript
const passwordSchema = z.string()
  .min(8, "비밀번호는 8자 이상이어야 합니다")
  .max(100, "비밀번호는 100자 이하여야 합니다")
  .regex(/[A-Za-z]/, "영문을 포함해야 합니다")
  .regex(/[0-9]/, "숫자를 포함해야 합니다")
  .regex(/[!@#$%^&*]/, "특수문자를 포함해야 합니다");
```

#### 이름

```typescript
const nameSchema = z.string()
  .min(2, "이름은 2자 이상이어야 합니다")
  .max(50, "이름은 50자 이하여야 합니다")
  .regex(/^[가-힣a-zA-Z\s]+$/, "이름은 한글 또는 영문만 가능합니다");
```

#### 휴대폰 번호

```typescript
const phoneSchema = z.string()
  .regex(/^01[0-9]-?[0-9]{4}-?[0-9]{4}$/, "올바른 휴대폰 번호 형식이 아닙니다")
  .optional();
```

### Sanitization

모든 사용자 입력은 sanitize 처리:

```typescript
function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '')  // HTML 태그 제거
    .slice(0, 1000);       // 최대 길이 제한
}
```

### SQL Injection 방지

- ORM 사용 (Prisma, TypeORM 등)
- Prepared Statements 사용
- 직접 쿼리 문자열 조합 금지

### XSS (Cross-Site Scripting) 방지

- 사용자 입력 HTML escape
- Content-Security-Policy 헤더 설정
- `X-XSS-Protection` 헤더 설정

---

## HTTPS

### 필수 사항

- 모든 API는 HTTPS를 통해서만 제공
- HTTP 요청은 HTTPS로 자동 리다이렉트
- HSTS (HTTP Strict Transport Security) 헤더 설정

### 헤더

```http
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

---

## 보안 헤더

### 필수 헤더

```http
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

---

## 민감 정보 보호

### 비밀번호

- bcrypt 해싱 (salt rounds: 12)
- 절대 평문 저장 금지
- 절대 응답에 포함 금지

```typescript
import bcrypt from 'bcrypt';

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

### 카드 정보

- PCI DSS 준수
- 카드 번호 토큰화
- 실제 카드 번호는 서버에 저장하지 않음
- 마스킹 처리: `****-****-****-1234`

### 개인 정보

- 이메일 부분 마스킹: `u***@example.com`
- 전화번호 부분 마스킹: `010-****-5678`
- 로그에 개인정보 기록 금지

---

## API 키 관리

### 환경 변수

모든 시크릿은 환경 변수로 관리:

```env
# JWT
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_REFRESH_SECRET=another-secret-key-min-32-chars

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/db

# Payment
PAYMENT_API_KEY=pk_test_...
PAYMENT_SECRET_KEY=sk_test_...

# Email
SMTP_HOST=smtp.gmail.com
SMTP_USER=noreply@mweoipji.com
SMTP_PASS=app-specific-password
```

### 키 로테이션

정기적으로 키 변경 (권장: 90일마다)

---

## 로깅 및 모니터링

### 보안 이벤트 로깅

다음 이벤트는 반드시 로그 기록:
- 로그인 성공/실패
- 비밀번호 변경
- 권한 변경
- 계정 삭제
- 결제 처리
- API 오류 (4xx, 5xx)

### 로그 형식

```json
{
  "level": "info",
  "event": "login_success",
  "userId": "user-123",
  "ip": "192.168.1.1",
  "userAgent": "Mozilla/5.0...",
  "requestId": "req-abc123"
}
```

### 민감 정보 제외

로그에서 제외해야 할 정보:
- 비밀번호
- 토큰
- 카드 정보
- 개인정보 (이름, 이메일 등은 마스킹)

---

## OWASP Top 10 대응

### A01: Broken Access Control

- JWT 기반 인증
- 역할 기반 접근 제어 (RBAC)
- 리소스 소유권 검증

### A02: Cryptographic Failures

- HTTPS 필수
- bcrypt 비밀번호 해싱
- 민감 정보 암호화

### A03: Injection

- ORM 사용
- Prepared Statements
- 입력 검증 및 sanitization

### A04: Insecure Design

- API 설계 리뷰
- 보안 테스트
- Threat modeling

### A05: Security Misconfiguration

- 보안 헤더 설정
- 기본 비밀번호 변경
- 불필요한 기능 비활성화

### A06: Vulnerable Components

- 정기적인 의존성 업데이트
- `npm audit` 실행
- Dependabot 사용

### A07: Authentication Failures

- Rate limiting
- MFA 지원 (관리자)
- 강력한 비밀번호 정책

### A08: Software and Data Integrity Failures

- 코드 서명
- CI/CD 파이프라인 보안
- 의존성 무결성 검증

### A09: Security Logging Failures

- 포괄적 로깅
- 로그 모니터링
- 이상 탐지

### A10: Server-Side Request Forgery

- URL 검증
- 화이트리스트 사용
- 내부 네트워크 접근 제한

---

## 취약점 보고

보안 취약점 발견 시:

**이메일**: security@mweoipji.com

**응답 시간**: 영업일 기준 48시간 이내

**보상 프로그램**: 향후 운영 예정
