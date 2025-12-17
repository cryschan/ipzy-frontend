import js from "@eslint/js";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      prettierRecommended,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            [
              // 1) React 및 핵심 라이브러리 (react, react-dom)
              "^react$",
              "^react-dom$",
              // 2) React 관련 라이브러리 (react-router-dom 등)
              "^react-",
              // 3) 서드파티 라이브러리 (@로 시작하는 패키지, 기타 외부 패키지)
              "^@?\\w",
              // 4) 내부 프로젝트 모듈 (상대 경로: ../, ./)
              "^\\.\\.(?!/?$)",
              "^\\.\\./?$",
              "^\\./(?=.*/)(?!/?$)",
              "^\\.(?!/?$)",
              "^\\./?$",
              // 5) 스타일 파일 (css, scss)
              "^.+\\.s?css$",
              // 6) Side effect imports (import './file' without any binding)
              "^\\u0000",
            ],
          ],
        },
      ],
      "simple-import-sort/exports": "error",
    },
  },
]);
