import Home from "../pages/Home";
import SignupPage from "../pages/auth/Signup";
import LoginPage from "../pages/auth/Login";
import CreateStudy from "../pages/study/CreateStudy";

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
    path : "/study/plan/create",
    element : <CreateStudy />
  }
];