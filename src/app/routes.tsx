import { lazy } from 'react';
import { Outlet } from 'react-router';
import ProtectedRoute from "./ProtectedRoute";
import { GlobalHeader } from "../components/layout/GlobalHeader";
import { StudySidebarLayout } from "../components/layout/StudySidebarLayout";

// 페이지 컴포넌트 지연 로딩 (Lazy Loading)
const HomePage = lazy(() => import("../pages/HomePage"));
const LearnTimeMainPage = lazy(() => import("../pages/LearnTimeMainPage"));
const NotFoundPage = lazy(() => import("./NotFoundPage"));
const SignupPage = lazy(() => import("../pages/auth/SignupPage"));
const EmailVerifyPage = lazy(() => import("../pages/auth/EmailVerifyPage"));
const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const StudyInvitationPage = lazy(() => import("../pages/study/invitation/StudyInvitationPage"));
const CreateStudyPage = lazy(() => import("../pages/study/create/CreateStudyPage"));
const NotesWritePage = lazy(() => import("../pages/study/notes/NotesWritePage"));
const StudyNotesListPage = lazy(() => import("../pages/study/notes/StudyNotesListPage"));
const NotesEditPage = lazy(() => import("../pages/study/notes/NotesEditPage"));
const NotesDetailPage = lazy(() => import("../pages/study/notes/NotesDetailPage"));
const QuizSolvePage = lazy(() => import("../pages/study/quiz/QuizSolvePage"));
const QuizResultPage = lazy(() => import("../pages/study/quiz/QuizResultPage"));
const QuizHistoryListPage = lazy(() => import("../pages/study/quiz/QuizHistoryListPage"));
const CreatePostPage = lazy(() => import("../pages/community/post/CreatePostPage"));
const FriendRequestPage = lazy(() => import("../pages/community/friend/FriendRequestPage"));
const NotificationPage = lazy(() => import("../pages/notification/NotificationPage"));
const UnderConstructionPage = lazy(() => import("../pages/UnderConstructionPage"));
const StudyQuizListPage = lazy(() => import("../pages/study/quiz/StudyQuizListPage"));
const StudyFeedbackListPage = lazy(() => import("../pages/study/feedback/StudyFeedbackListPage"));
const CommunityPage = lazy(() => import("../pages/community/CommunityPage"));
const PostDetailPage = lazy(() => import("../pages/community/post/PostDetailPage"));
const PostEditPage = lazy(() => import("../pages/community/post/PostEditPage"));
const RankingPage = lazy(() => import("../pages/community/RankingPage"));
const ProfilePage = lazy(() => import("../pages/profile/ProfilePage"));
const MessageListPage = lazy(() => import("../pages/message/MessageListPage"));
const SchedulePage = lazy(() => import("../pages/schedule/SchedulePage"));
const ExercisePage = lazy(() => import("../pages/exercise/ExercisePage"));
const BadgeTierInfoPage = lazy(() => import("../pages/community/tire/BadgeTierInfoPage"));
const MyPage = lazy(() => import("../pages/mypage/MyPage"));
const StudyRedirector = lazy(() => import("../pages/study/studio/StudyRedirector"));
const StudyEmptyPage = lazy(() => import("../pages/study/studio/StudyEmptyPage"));
const StudyStudioPage = lazy(() => import("../pages/study/studio/StudyStudioPage"));

export const routes = [
  // 레이아웃이 없는 비인증/인증 분기 페이지
  {
    path: "/",
    noLayout: true,
    element: (
      <ProtectedRoute fallback={<HomePage />}>
        <GlobalHeader />
        <LearnTimeMainPage />
      </ProtectedRoute>
    )
  },
  { path: "*", element: <NotFoundPage /> },
  { path: "/signup", element: <SignupPage /> },
  { path: "/signup/verify", element: <EmailVerifyPage /> },
  { path: "/login", element: <LoginPage /> },

  // 공통 헤더만 필요한 인증 불필요 (Public) 그룹
  {
    element: (
      <>
        <GlobalHeader />
        <Outlet />
      </>
    ),
    children: [
      { path: "/profile/:userId", element: <ProfilePage /> },
      { path: "/badge-tier-info", element: <BadgeTierInfoPage /> },
      { path: "/community", element: <CommunityPage /> },
      { path: "/community/ranking", element: <RankingPage /> },
      { path: "/community/post/:postId", element: <PostDetailPage /> },
    ]
  },

  // 인증 가드 + 공통 헤더가 필요한 인증 필수 (Private) 그룹
  {
    element: (
      <ProtectedRoute>
        <GlobalHeader />
        <Outlet />
      </ProtectedRoute>
    ),
    children: [
      { path: "/notifications", element: <NotificationPage /> },
      { path: "/mypage", element: <MyPage /> },
      { path: "/messages", element: <MessageListPage /> },
      { path: "/community/post/create", element: <CreatePostPage /> },
      { path: "/community/post/edit/:postId", element: <PostEditPage /> },
      { path: "/friend/requests", element: <FriendRequestPage /> },
      { path: "/schedule", element: <SchedulePage /> },
      { path: "/exercise", element: <ExercisePage /> },
      { path: "/study", element: <StudyRedirector /> },
      { path: "/study/studio", element: <StudyRedirector /> },
      { path: "/main/settings", element: <UnderConstructionPage /> },

      // 인증 가드 + 공통 헤더 + 스터디 전용 사이드바가 모두 필요한 그룹 
      {
        element: (
          <StudySidebarLayout>
            <Outlet />
          </StudySidebarLayout>
        ),
        children: [
          { path: "/study/empty", element: <StudyEmptyPage /> },
          { path: "/study/:studyId", element: <StudyStudioPage /> },
          { path: "/study/invitation", element: <StudyInvitationPage /> },
          { path: "/study/plan/create", element: <CreateStudyPage /> },
          { path: "/study/notes/write/:studyId", element: <NotesWritePage /> },
          { path: "/study/notes/list/:studyId", element: <StudyNotesListPage /> },
          { path: "/study/notes/:noteId", element: <NotesDetailPage /> },
          { path: "/study/notes/edit/:noteId", element: <NotesEditPage /> },
          { path: "/study/quiz/:quizId", element: <QuizSolvePage /> },
          { path: "/study/quiz/history/:quizHistoryId", element: <QuizResultPage /> },
          { path: "/study/quiz/history/list/:studyQuizId", element: <QuizHistoryListPage /> },
          { path: "/study/quiz/list/:studyId", element: <StudyQuizListPage /> },
          { path: "/study/feedback/list/:studyId", element: <StudyFeedbackListPage /> },
        ]
      }
    ]
  }
];
