import { useMemo, useState } from "react";
import { RoomWithQuiz } from "../api/model";
import { FirebaseRoomInfo } from "../utils/types";
import { nonNullable } from "../utils/functions";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  HStack,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import StudentAvatars from "./StudentAvatars";
import QuestionDetail from "./QuestionDetail";
import { QuestionStats } from "./QuestionStats";
import { ArrowRightCircle, BarChartBig } from "lucide-react";
import CountDown from "./CountDown";

export default function TutorQuestionPresenation({
  room: { quiz },
  roomFromFirebase,
  nextLabel,
  onClickNext,
}: {
  room: RoomWithQuiz;
  roomFromFirebase: FirebaseRoomInfo;
  nextLabel: string;
  onClickNext: () => void;
}) {
  const [isTimeUp, setTimeUp] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const currentQuestionIndex = roomFromFirebase.activeQuestionIndex || 0;
  const questionId = roomFromFirebase.questionOrder[currentQuestionIndex];
  const firebaseQuestion = roomFromFirebase.questions[questionId];
  const question = quiz.questions.find((q) => q.id === questionId);
  const answerCounts = useMemo(() => {
    if (firebaseQuestion === undefined) return [];
    return Object.entries(firebaseQuestion.answers).map(([id, answer]) => ({
      id,
      ...answer,
      students:
        answer.studentIds
          .map((id) => roomFromFirebase.students[id])
          .filter(nonNullable) || [],
    }));
  }, [firebaseQuestion, roomFromFirebase.students]);
  const totalStudentsCount = Object.keys(
    roomFromFirebase.students || {}
  ).length;
  const answeredStudentIds = answerCounts
    .map((answer) => answer.students)
    .flat()
    .map((s) => s.id);

  const nextQuestion = () => {
    setTimeUp(false);
    setShowStats(false);
    onClickNext();
  };

  if (!question || !firebaseQuestion) return null;

  return (
    <Card w={"full"} h={"full"} textAlign={"center"} pt={8}>
      <CardBody>
        <Heading mb={8}>{question.tilte}</Heading>

        {showStats ? (
          <QuestionStats
            answerCounts={firebaseQuestion?.answers || {}}
            answers={question.answers}
          />
        ) : (
          <>
            <QuestionDetail question={question} />
            <Stack mt={8}>
              <Heading size={"sm"}>Looks who replied</Heading>
              <StudentAvatars studentIds={answeredStudentIds} />
            </Stack>
          </>
        )}
      </CardBody>
      <CardFooter gap={4} justifyContent={"space-between"}>
        <Text>
          Total joined student: <strong>{totalStudentsCount}</strong>
        </Text>

        <HStack>
          {!showStats && question.time_limit && (
            <CountDown
              key={question.id}
              timeInSeconds={question.time_limit}
              fontSize={"2xl"}
              fontWeight={"bold"}
              timeUp={() => setTimeUp(true)}
            />
          )}
          {!showStats && isTimeUp && (
            <Button
              colorScheme="blue"
              gap={2}
              onClick={() => setShowStats(true)}
            >
              <BarChartBig /> Show statistic
            </Button>
          )}
          {showStats && (
            <Button colorScheme="blue" gap={2} onClick={nextQuestion}>
              {nextLabel} <ArrowRightCircle />
            </Button>
          )}
        </HStack>
      </CardFooter>
    </Card>
  );
}
