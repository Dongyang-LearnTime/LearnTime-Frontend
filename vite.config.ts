// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // 추가

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 추가
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // Spring Boot 로컬 서버 포트
        changeOrigin: true,
        secure: false,
      },
    },
  },
})