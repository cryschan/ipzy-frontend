import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
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
          // 벤더 코드 분리
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "ui-vendor": ["lucide-react"],
          "query-vendor": ["@tanstack/react-query"],
        },
      },
    },
    // 번들 크기 경고 임계값 (KB)
    chunkSizeWarningLimit: 1000,
    // CSS 코드 스플리팅
    cssCodeSplit: true,
  },
  // 프로덕션 최적화
  esbuild: {
    drop: process.env.NODE_ENV === "production" ? ["console", "debugger"] : [],
  },
});
