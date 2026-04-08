import Home from "../pages/Home";
import SignupPage from "../pages/auth/Signup";
import LoginPage from "../pages/auth/Login";
import UploadTestPage from "../pages/UploadTestPage";

// App.tsx에서 사용할 라우트 설정 배열
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
    path : "/test",
    element : <UploadTestPage />
  }
];