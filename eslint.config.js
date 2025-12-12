import js from "@eslint/js";
import eslintPluginImport from "eslint-plugin-import";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
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
      import: eslintPluginImport,
    },
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "import/order": [
        "warn",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          // import 순서 정책 상세 (.ai/initial_settings.md 반영)
          pathGroups: [
            // 1) React 및 핵심 라이브러리
            { pattern: "react", group: "external", position: "before" },
            { pattern: "react-dom", group: "external", position: "before" },
            // 2) 서드파티(외부) 라이브러리
            { pattern: "react-router-dom", group: "external", position: "before" },
            // 3) 내부 프로젝트 모듈(@/** 절대경로)
            { pattern: "@/**", group: "internal", position: "after" },
            // 5) 이미지 및 자산
            {
              pattern: "**/*.{svg,png,jpg,jpeg,gif,webp}",
              group: "index",
              position: "after",
            },
            // 6) 스타일 파일
            { pattern: "**/*.{css,scss}", group: "index", position: "after" },
          ],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
    },
    settings: {
      "import/resolver": {
        node: {
          moduleDirectory: ["node_modules", "src"],
        },
      },
    },
  },
]);
