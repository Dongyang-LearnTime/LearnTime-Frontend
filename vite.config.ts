import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
<<<<<<< Updated upstream
<<<<<<< Updated upstream
import tailwindcss from '@tailwindcss/vite' // 1. 이거 추가

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 2. 이거 추가
=======
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
>>>>>>> Stashed changes
=======
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
>>>>>>> Stashed changes
  ],
})