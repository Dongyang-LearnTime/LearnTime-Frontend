<<<<<<< Updated upstream
import { createBrowserRouter } from "react-router";
import { LandingPage } from "../pages/home/Home";
import { MainPage } from "../pages/main/ModePage";
import { SignupPage } from "../pages/auth/Signup";
import { LoginPage } from "../pages/auth/Login";
import { TabPage } from "../pages/main/Tab";

=======
import Home from "../pages/Home";
import { SignupPage } from "../pages/auth/Signup";
import { LoginPage } from "../pages/auth/Login";
import type { RouteObject } from "react-router-dom";
>>>>>>> Stashed changes

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    path: "/main",
    element: <MainPage />,
  },
  {
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
<<<<<<< Updated upstream
<<<<<<< Updated upstream
  },
  {
    path: "/tab",
    element: <TabPage />,
  }
]);
=======
  }
]
>>>>>>> Stashed changes
=======
  }
]
>>>>>>> Stashed changes
