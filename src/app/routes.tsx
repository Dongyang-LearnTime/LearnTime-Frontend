import ProtectedRoute from "./ProtectedRoute";
import HomePage from "../pages/HomePage";
import LearnTimeMainPage from "../pages/LearnTimeMainPage";
import NotFoundPage from "./NotFoundPage";
import SignupPage from "../pages/auth/SignupPage";
import LoginPage from "../pages/auth/LoginPage";
import StudyStudioPage from "../pages/study/studio/StudyStudioPage";
import StudyInvitationPage from "../pages/study/invitation/StudyInvitationPage";
import CreateStudyPage from "../pages/study/create/CreateStudyPage";
import NotesWritePage from "../pages/study/notes/NotesWritePage";
import NotesEditPage from "../pages/study/notes/NotesEditPage";
import NotesDetailPage from "../pages/study/notes/NotesDetailPage";
import QuizSolvePage from "../pages/study/quiz/QuizSolvePage";
import QuizResultPage from "../pages/study/quiz/QuizResultPage";
import CreatePostPage from "../pages/community/post/CreatePostPage";
import FriendRequestPage from "../pages/community/friend/FriendRequestPage";
import NotificationPage from "../pages/notification/NotificationPage";


// App.tsx에서 사용할 라우트 설정 배열
// ProtectedRoute => 로그인 필요한 페이지에 사용
export const routes = [
  {
    path: "/",
    // 로그인 여부에 따라 분기:
    // - 로그인 전: HomePage (랜딩 페이지, 자체 레이아웃 보유)
    // - 로그인 후: LearnTimeMainPage (ProtectedRoute로 감쌈)
    noLayout: true, // HomePage가 full-page 레이아웃을 직접 관리
    element: (
      <ProtectedRoute fallback={<HomePage />}>
        <LearnTimeMainPage />
      </ProtectedRoute>
    )
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
    path: "/notifications",
    element:
      <ProtectedRoute>
        <NotificationPage />
      </ProtectedRoute>
  },
  {
    path: "/study/:studyId",
    element:
      <ProtectedRoute>
        <StudyStudioPage />
      </ProtectedRoute>
  },
  {
    path: "/study/invitation",
    element:
      <ProtectedRoute>
        <StudyInvitationPage />
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
  }
  // { 관리자 페이지 예상
  //   path : "/admin",
  //   element : 
  //   <ProtectedRoute requiredRole={Role.ROLE_ADMIN}>
  //     <AdminPage />
  //   </ProtectedRoute>
  // }
];