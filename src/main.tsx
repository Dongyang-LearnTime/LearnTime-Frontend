/**
 * @file main.tsx
 * @description 애플리케이션 진입점(Entrypoint).
 * - QueryClient 초기화 및 옵션 설정
 * - 윈도우 포커스 시 refetch 방지 및 재시도 설정
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './app/App.tsx'

/**
 * QueryClient 전역 인스턴스
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // 창 포커스 시 재요청 비활성화
      retry: 1, // API 실패 시 재시도 횟수 (1회)
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* QueryClient 컨텍스트 제공 */}
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)


