import "./App.css";
import HomePage from "./pages/HomePage";
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
import EnterRoomPage from "./pages/student/EnterRoomPage";
import WaitingRoomPage from "./pages/student/WaitingRoomPage";
import QuestionPage from "./pages/student/QuestionPage";
import QuestionStatisticPage from "./pages/student/QuestionStatisticPage";
import QuizStatisticPage from "./pages/student/QuizStatisticPage";
import TutorQuestionPage from "./pages/tutor/TutorQuestionPage";
import TutorQuestionStatisticPage from "./pages/tutor/TutorQuizStatisticPage";
import TutorQuizStatisticPage from "./pages/tutor/TutorQuizStatisticPage";
import QuizzesPage from "./pages/tutor/QuizzesPage";
import RoomsPage from "./pages/tutor/RoomsPage";
import TutorQuizDetailPage from "./pages/tutor/TutorQuizDetailPage";
import TutorRoomDetailPage from "./pages/tutor/TutorRoomDetailPage";

axios.defaults.baseURL = API_URL;
axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem("token");
  if (token) config.headers["Authorization"] = `Bearer ${token}`;
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
      { path: "/quizzes", element: <QuizzesPage /> },
      { path: "/quiz/create", element: <CreateQuizPage /> },
      { path: "/quiz/:quizId", element: <TutorQuizDetailPage /> },
      { path: "/quiz/:quizId/statistic", element: <TutorQuizStatisticPage /> },
      { path: "/quiz/:quizId/rooms", element: <RoomsPage /> },
      { path: "/quiz/:quizId/room/create", element: <CreateRoomPage /> },
      { path: "/quiz/:quizId/room/:roomId", element: <TutorRoomDetailPage /> },
      {
        path: "/quiz/:quizId/room/:roomId/:questionId",
        element: <TutorQuestionPage />,
      },
      {
        path: "/quiz/:quizId/room/:roomId/question/statistic",
        element: <TutorQuestionStatisticPage />,
      },
    ],
  },
  {
    path: "/:roomId",
    children: [
      { path: "enter", element: <EnterRoomPage /> },
      { path: "waiting", element: <WaitingRoomPage /> },
      { path: "question", element: <QuestionPage /> },
      {
        path: "question/:questionId/statistic",
        element: <QuestionStatisticPage />,
      },
      {
        path: "statistic",
        element: <QuizStatisticPage />,
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
        onError: (error) => {
          if ([401, 403].includes(error.response?.status)) {
            localStorage.removeItem("token");
            onOpen();
          }
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
