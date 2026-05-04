import ProtectedRoute from "./ProtectedRoute";
import Home from "../pages/Home";
import SignupPage from "../pages/auth/Signup";
import LoginPage from "../pages/auth/Login";
import CreateStudy from "../pages/study/create/CreateStudy";
import StudyNotes from "../pages/study/notes/StudyNotes";

// App.tsx에서 사용할 라우트 설정 배열
// ProtectedRoute => 로그인 필요한 페이지에 사용
export const routes = [
  {
    path : "/",
    element : <Home />
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path : "/study/plan/create",
    element : 
      <ProtectedRoute> 
        <CreateStudy />
      </ProtectedRoute>
  },
  {
    path : "/study/notes/:id",
    element : 
    <ProtectedRoute> 
      <StudyNotes />
    </ProtectedRoute>
  }
  // { 관리자 페이지 예상
  //   path : "/admin",
  //   element : 
  //   <ProtectedRoute requiredRole={Role.ROLE_ADMIN}>
  //     <AdminPage />
  //   </ProtectedRoute>
  // }
];