import ProtectedRoute from "./ProtectedRoute";
import Home from "../pages/Home";
import NotFoundPage from "./NotFoundPage";
import SignupPage from "../pages/auth/SignupPage";
import LoginPage from "../pages/auth/LoginPage";
import StudyStudioPage from "../pages/study/studio/StudyStudioPage";
import CreateStudyPage from "../pages/study/create/CreateStudyPage";
import NotesWritePage from "../pages/study/notes/NotesWritePage";
import NotesEditPage from "../pages/study/notes/NotesEditPage";
import NotesDetailPage from "../pages/study/notes/NotesDetailPage";
import QuizSolvePage from "../pages/study/quiz/QuizSolvePage";
import QuizResultPage from "../pages/study/quiz/QuizResultPage";
import CreatePostPage from "../pages/community/post/CreatePostPage";
import FriendRequestPage from "../pages/community/friend/FriendRequestPage";


// App.tsx에서 사용할 라우트 설정 배열
// ProtectedRoute => 로그인 필요한 페이지에 사용
export const routes = [
  {
    path: "/",
    element: <Home />
  },
  {
    path: "*", // 정해진 링크 외의 다른 링크
    element: <NotFoundPage />
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
    path: "/study/:studyId",
    element:
      <ProtectedRoute>
        <StudyStudioPage />
      </ProtectedRoute>
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
  },
  {
    path: "/community/post/create",
    element:
      <ProtectedRoute>
        <CreatePostPage />
      </ProtectedRoute>
  },
  {
    path: "/friend/requests",
    element:
      <ProtectedRoute>
        <FriendRequestPage />
      </ProtectedRoute>
  },
  // { 관리자 페이지 예상
  //   path : "/admin",
  //   element : 
  //   <ProtectedRoute requiredRole={Role.ROLE_ADMIN}>
  //     <AdminPage />
  //   </ProtectedRoute>
  // }
];