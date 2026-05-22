// ============================================================
// app/routes.tsx
// 클라이언트 사이드 라우팅 설정.
// ============================================================
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { StudyPage } from '../pages/StudyPage';
import { ExercisePage } from '../pages/ExercisePage';
import { SchedulePage } from '../pages/SchedulePage';
import { CommunityPage } from '../pages/CommunityPage';
import { EmptyPage } from '../pages/EmptyPage';
import { Home } from '../pages/home';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/home" replace />,
  },
  {
    path: '/home',
    element: <Home />,
  },
  {
    path: '/login',
    element: <EmptyPage title="로그인" />,
  },
  {
    path: '/signup',
    element: <EmptyPage title="회원가입" />,
  },
  {
    path: '/main',
    element: <MainLayout />,
    children: [
      { path: '', element: <Navigate to="study" replace /> }, // /main 접근 시 study로 리다이렉트
      { path: 'study', element: <StudyPage /> },
      { path: 'exercise', element: <ExercisePage /> },
      { path: 'schedule', element: <SchedulePage /> },
      { path: 'community', element: <CommunityPage /> },
      { path: 'settings', element: <EmptyPage title="설정" /> },
    ],
  },
]);
