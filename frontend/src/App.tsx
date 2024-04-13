import "./App.css";
import HomePage from "./pages/HomePage";
import UserPage from "./pages/tutor/UserPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import TutorLayout from "./layout/TutorLayout";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DashboardPage from "./pages/tutor/DashboardPage";
import CreateQuizPage from "./pages/tutor/CreateQuizPage";
import CreateRoomPage from "./pages/tutor/CreateRoomPage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    { path: "/signin", element: <SignInPage /> },
    { path: "/signup", element: <SignUpPage /> },
    {
      element: <TutorLayout />,
      children: [
        {
          path: "/dashboard",
          element: <DashboardPage />,
        },
        {
          path: "/quiz/create",
          element: <CreateQuizPage />,
        },
        {
          path: "/room/create",
          element: <CreateRoomPage />,
        },
        {
          path: "/users",
          element: <UserPage />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
