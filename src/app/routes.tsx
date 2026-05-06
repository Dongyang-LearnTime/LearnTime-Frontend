import ProtectedRoute from "./ProtectedRoute";
import Home from "../pages/Home";
import SignupPage from "../pages/auth/SignupPage";
import LoginPage from "../pages/auth/LoginPage";
import CreateStudyPage from "../pages/study/create/CreateStudyPage";
import NotesWritePage from "../pages/study/notes/NotesWritePage";
import NotesEditPage from "../pages/study/notes/NotesEditPage";
import NotesDetailPage from "../pages/study/notes/NotesDetailPage";
import QuizSolvePage from "../pages/study/quiz/QuizSolvePage";
import QuizResultPage from "../pages/study/quiz/QuizResultPage";


// App.tsx에서 사용할 라우트 설정 배열
// ProtectedRoute => 로그인 필요한 페이지에 사용
export const routes = [
  {
    path: "/",
    element: <Home />
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
    path: "/study/plan/create",
    element:
      <ProtectedRoute>
        <CreateStudyPage />
      </ProtectedRoute>
  },
  {
    path: "/study/notes/write/:studyId",
    element:
      <ProtectedRoute>
        <NotesWritePage />
      </ProtectedRoute>
  },
  {
    path: "/study/notes/:noteId",
    element:
      <ProtectedRoute>
        <NotesDetailPage />
      </ProtectedRoute>
  },
  {
    path: "/study/notes/edit/:noteId",
    element:
      <ProtectedRoute>
        <NotesEditPage />
      </ProtectedRoute>
  },
  {
    path: "/study/quiz/:quizId",
    element:
      <ProtectedRoute>
        <QuizSolvePage />
      </ProtectedRoute>
  },
  {
    path: "/study/quiz/history/:quizHistoryId",
    element:
      <ProtectedRoute>
        <QuizResultPage />
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