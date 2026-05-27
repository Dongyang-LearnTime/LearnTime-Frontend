import { lazy } from 'react';
import ProtectedRoute from "./ProtectedRoute";
import { MainHeader } from "../components/layout/MainHeader";
import { StudySidebarLayout } from "../components/layout/StudySidebarLayout";

const StudyStudioPage = lazy(() => import("../pages/study/studio/StudyStudioPage"));
const StudyRedirector = lazy(() => import("../pages/study/studio/StudyRedirector"));
const StudyEmptyPage = lazy(() => import("../pages/study/studio/StudyEmptyPage"));

const HomePage = lazy(() => import("../pages/HomePage"));
const LearnTimeMainPage = lazy(() => import("../pages/LearnTimeMainPage"));
const NotFoundPage = lazy(() => import("./NotFoundPage"));
const SignupPage = lazy(() => import("../pages/auth/SignupPage"));
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
const NotificationPage = lazy(() => import("../pages/notification/notificationPage"));
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

export const routes = [
  {
    path: "/",
    noLayout: true,
    element: (
      <ProtectedRoute fallback={<HomePage />}>
        <MainHeader />
        <LearnTimeMainPage />
      </ProtectedRoute>
    )
  },
  {
    path: "*",
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
    element: (
      <ProtectedRoute>
        <MainHeader />
        <NotificationPage />
      </ProtectedRoute>
    )
  },
  {
    path: "/profile/:userId",
    element: (
      <>
        <MainHeader />
        <ProfilePage />
      </>
    )
  },
  {
    path: "/badge-tier-info",
    element: (
      <ProtectedRoute>
        <MainHeader />
        <BadgeTierInfoPage />
      </ProtectedRoute>
    )
  },
  {
    path: "/messages",
    element: (
      <ProtectedRoute>
        <MainHeader />
        <MessageListPage />
      </ProtectedRoute>
    )
  },
  {
    path: "/study",
    element: (
      <ProtectedRoute>
        <MainHeader />
        <StudyRedirector />
      </ProtectedRoute>
    )
  },
  {
    path: "/study/studio",
    element: (
      <ProtectedRoute>
        <MainHeader />
        <StudyRedirector />
      </ProtectedRoute>
    )
  },
  {
    path: "/study/empty",
    element: (
      <ProtectedRoute>
        <MainHeader />
        <StudySidebarLayout>
          <StudyEmptyPage />
        </StudySidebarLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/study/:studyId",
    element: (
      <ProtectedRoute>
        <MainHeader />
        <StudySidebarLayout>
          <StudyStudioPage />
        </StudySidebarLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/study/invitation",
    element: (
      <ProtectedRoute>
        <MainHeader />
        <StudySidebarLayout>
          <StudyInvitationPage />
        </StudySidebarLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/study/plan/create",
    element: (
      <ProtectedRoute>
        <MainHeader />
        <StudySidebarLayout>
          <CreateStudyPage />
        </StudySidebarLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/study/notes/write/:studyId",
    element: (
      <ProtectedRoute>
        <MainHeader />
        <StudySidebarLayout>
          <NotesWritePage />
        </StudySidebarLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/study/notes/list/:studyId",
    element: (
      <ProtectedRoute>
        <MainHeader />
        <StudySidebarLayout>
          <StudyNotesListPage />
        </StudySidebarLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/study/notes/:noteId",
    element: (
      <ProtectedRoute>
        <MainHeader />
        <StudySidebarLayout>
          <NotesDetailPage />
        </StudySidebarLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/study/notes/edit/:noteId",
    element: (
      <ProtectedRoute>
        <MainHeader />
        <StudySidebarLayout>
          <NotesEditPage />
        </StudySidebarLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/study/quiz/:quizId",
    element: (
      <ProtectedRoute>
        <MainHeader />
        <StudySidebarLayout>
          <QuizSolvePage />
        </StudySidebarLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/study/quiz/history/:quizHistoryId",
    element: (
      <ProtectedRoute>
        <MainHeader />
        <StudySidebarLayout>
          <QuizResultPage />
        </StudySidebarLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/study/quiz/history/list/:studyQuizId",
    element: (
      <ProtectedRoute>
        <MainHeader />
        <StudySidebarLayout>
          <QuizHistoryListPage />
        </StudySidebarLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/study/quiz/list/:studyId",
    element: (
      <ProtectedRoute>
        <MainHeader />
        <StudySidebarLayout>
          <StudyQuizListPage />
        </StudySidebarLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/study/feedback/list/:studyId",
    element: (
      <ProtectedRoute>
        <MainHeader />
        <StudySidebarLayout>
          <StudyFeedbackListPage />
        </StudySidebarLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/community",
    element: (
      <>
        <MainHeader />
        <CommunityPage />
      </>
    )
  },
  {
    path: "/community/ranking",
    element: (
      <>
        <MainHeader />
        <RankingPage />
      </>
    )
  },
  {
    path: "/community/post/create",
    element: (
      <ProtectedRoute>
        <MainHeader />
        <CreatePostPage />
      </ProtectedRoute>
    )
  },
  {
    path: "/community/post/:postId",
    element: (
      <>
        <MainHeader />
        <PostDetailPage />
      </>
    )
  },
  {
    path: "/community/post/edit/:postId",
    element: (
      <ProtectedRoute>
        <MainHeader />
        <PostEditPage />
      </ProtectedRoute>
    )
  },
  {
    path: "/friend/requests",
    element: (
      <ProtectedRoute>
        <MainHeader />
        <FriendRequestPage />
      </ProtectedRoute>
    )
  },
  {
    path: "/schedule",
    element: (
      <ProtectedRoute>
        <MainHeader />
        <SchedulePage />
      </ProtectedRoute>
    )
  },
  {
    path: "/exercise",
    element: (
      <ProtectedRoute>
        <MainHeader />
        <ExercisePage />
      </ProtectedRoute>
    )
  },
  {
    path: "/main/settings",
    element: (
      <ProtectedRoute>
        <UnderConstructionPage />
      </ProtectedRoute>
    )
  }
];
