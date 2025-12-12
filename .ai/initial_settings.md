# 프론트 초기 세팅

> React, Typescript, axios, tailwind, shadcn, Vite 스택 기준

1. Node 버전

- `.nvmrc` 에 Node 버전 명시 → `nvm use`로 적용

2. 필수 라이브러리 설치

   `package.json`에 이미 설치되어 있는지 확인 후 버전 호환성 고려해서 아래 라이브러리 설치

- 런타임: `react react-dom react-router-dom axios(혹은 ky)`
- 스타일: `tailwindcss @tailwindcss/postcss autoprefixer shadcn/ui` (초기화: `npx tailwindcss init -p`, 컴포넌트 설정: `npx shadcn@latest init`)
- 개발도구: `vite @vitejs/plugin-react typescript`
- 접근성: `eslint-plugin-jsx-a11y(선택)`

3. ESLint/Prettier

- ESLint, Prettier devDependency로 설치
- `.prettierrc` 예시

  ```json
  {
    "semi": true,
    "printWidth": 100,
    "tabWidth": 2,
    "endOfLine": "lf"
  }
  ```

- `.prettierignore` 예시

  ```
  node_modules/
  build/
  dist/
  *.min.js
  .github/
  ```

- ESLint는 `eslint.config.js`(Flat Config) 기준 사용. 가능하면 **import 순서**도 추가
  1. React 및 핵심 라이브러리: react, react-dom 등 프레임워크 핵심 패키지
  2. 서드파티(외부) 라이브러리: react-router-dom, lodash, axios 등 설치된 외부 모듈
  3. 내부 프로젝트 모듈 (Internal):
  - 절대 경로로 설정된 내부 컴포넌트나 서비스
  - 커스텀 훅 (hooks/), 유틸리티 함수 (utils/), API 서비스 등
  4. 로컬 컴포넌트: 현재 파일과 밀접한 상대 경로의 컴포넌트
  5. 이미지 및 자산 (Assets): .svg, .png 등 이미지 파일
  6. 스타일 파일: .css, .scss, .module.css 등

- import/order 예시 코드

  ```js
  // 1. React 및 핵심 라이브러리
  import React, { useState, useEffect } from "react";

  // 2. 외부 라이브러리 (External)
  import { Link } from "react-router-dom";
  import axios from "axios";

  // 3. 내부 모듈 (Internal/Absolute Path)
  import Button from "@/components/common/Button";
  import { formatDate } from "@/utils/date";

  // 4. 로컬/상대 경로 모듈 (Parent/Sibling)
  import LocalComponent from "./LocalComponent";

  // 5. 스타일 및 자산
  import logo from "./logo.svg";
  import "./styles.css";
  ```

4. .env.example 추가

- `.env.example`에 필요한 환경변수 명시
- `.env.example` 외에 다른 `.env` 파일들은 `.gitignore`에 추가

5. README 정리

- 프로젝트 소개, 요구 Node 버전, 설치/실행 명령, 환경변수(`VITE_API_BASE_URL`) 간단 명시

6. index.html 메타태그

- title, description, og 태그 등
- favicon도 필요시 변경

7. Vite 프록시

- vite.config.ts에 /api → http://localhost:8080 프록시(+ credentials) 설정

8. 경로 별칭

- tsconfig.json/vite에 `@/\*` 별칭 추가(절대경로 import)

9. Axios 공용 클라이언트 추가

- api.ts 파일 추가
- `baseURL`는 `VITE_API_BASE_URL` 사용
- `withCredentials: true`로 세션/쿠키 자동 전송
- 기본 헤더 `Accept: application/json` 설정

10. 주석은 한국어로 작성
