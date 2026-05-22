// ============================================================
// app/App.tsx
// 앱의 루트 컴포넌트.
// react-router-dom의 RouterProvider에 routes 설정을 주입한다.
// ============================================================
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';

export default function App() {
  return <RouterProvider router={router} />;
}
