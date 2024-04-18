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
import { API_URL } from "./utils/constants";
import axios from "axios";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import { SWRConfig } from "swr";
import { useRef } from "react";

axios.defaults.baseURL = API_URL;
axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});
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

function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);

  return (
    <SWRConfig
      value={{
        errorRetryCount: 1,
        onError: () => {
          localStorage.removeItem("token");
          onOpen();
        },
      }}
    >
      <RouterProvider router={router} />
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        closeOnEsc={false}
        closeOnOverlayClick={false}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Authentication failed
            </AlertDialogHeader>
            <AlertDialogBody>
              Your session is timeout. Please sign in again.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                as="a"
                href="/signin"
                colorScheme="red"
                onClick={onClose}
                ml={3}
              >
                Go sign in
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </SWRConfig>
  );
}

export default App;
