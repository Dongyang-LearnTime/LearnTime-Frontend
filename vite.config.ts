import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(), // Tailwind v4는 react()보다 먼저 실행되는 것이 안전합니다.
    react(),
  ],
})