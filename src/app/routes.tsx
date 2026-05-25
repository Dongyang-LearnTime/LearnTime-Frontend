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
import StudyNotesListPage from "../pages/study/notes/StudyNotesListPage";
import NotesEditPage from "../pages/study/notes/NotesEditPage";
import NotesDetailPage from "../pages/study/notes/NotesDetailPage";
import QuizSolvePage from "../pages/study/quiz/QuizSolvePage";
import QuizResultPage from "../pages/study/quiz/QuizResultPage";
import QuizHistoryListPage from "../pages/study/quiz/QuizHistoryListPage";
import CreatePostPage from "../pages/community/post/CreatePostPage";
import FriendRequestPage from "../pages/community/friend/FriendRequestPage";
import NotificationPage from "../pages/notification/NotificationPage";

import { MainHeader } from "../components/layout/MainHeader";
import { StudySidebarLayout } from "../components/layout/StudySidebarLayout";
import StudyRedirector from "../pages/study/studio/StudyRedirector";
import StudyEmptyPage from "../pages/study/studio/StudyEmptyPage";
import UnderConstructionPage from "../pages/UnderConstructionPage";
import StudyQuizListPage from "../pages/study/quiz/StudyQuizListPage";
import StudyFeedbackListPage from "../pages/study/feedback/StudyFeedbackListPage";
import CommunityPage from "../pages/community/CommunityPage";
import PostDetailPage from "../pages/community/post/PostDetailPage";
import PostEditPage from "../pages/community/post/PostEditPage";
import RankingPage from "../pages/community/RankingPage";
import ProfilePage from "../pages/profile/ProfilePage";
import MessageListPage from "../pages/message/MessageListPage";
import SchedulePage from "../pages/schedule/SchedulePage";
import ExercisePage from "../pages/exercise/ExercisePage";
import BadgeTierInfoPage from "../pages/community/tire/BadgeTierInfoPage";

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