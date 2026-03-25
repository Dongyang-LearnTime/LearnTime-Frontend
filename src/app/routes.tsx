import { LandingPage } from "../pages/home/Home";
import { MainPage } from "../pages/main/ModePage";
import { SignupPage } from "../pages/auth/Signup";
import { LoginPage } from "../pages/auth/Login";

// App.tsx에서 사용할 라우트 설정 배열
export const routes = [
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/main",
    element: <MainPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  }
];