import { useEffect, useMemo, useState } from "react";
import { Button, Heading, Progress, Stack, Text } from "@chakra-ui/react";
import { RoomWithQuiz } from "../../api/model";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { getFirebaseRoomActions } from "../../utils/firebase";
import { FirebaseRoomInfo } from "../../utils/types";
import { COLORS } from "../../utils/constants";

const QuestionPage = () => {
  const roomId = parseInt(useParams().roomId || "");
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [selectedAnswer, setSelectedAnswer] = useState<number>();
  const roomActions = useMemo(() => getFirebaseRoomActions(roomId), [roomId]);
  const roomData = location.state.room as RoomWithQuiz;
  const [roomFromFirebase, setRoomFromFirebase] = useState<FirebaseRoomInfo>(
    location.state.info
  );
  const activeQuesId =
    roomFromFirebase.questionOrder[roomFromFirebase.activeQuestionIndex];
  const question =
    roomFromFirebase &&
    roomData.quiz.questions.find((q) => q.id === activeQuesId);

  const onSelectAnswer = (answerId: number) => {
    if (!question) return;
    if (selectedAnswer !== undefined) return;
    setSelectedAnswer(answerId);
    const studentId = parseInt(searchParams.get("studentId") || "");
    roomActions.answer({ answerId, questionId: question.id, studentId });
  };

  useEffect(
    () =>
      roomActions.watch((info) => {
        if (activeQuesId !== info.questionOrder[info.activeQuestionIndex]) {
          setSelectedAnswer(undefined);
        }
        setRoomFromFirebase(info);
      }),
    [roomActions, activeQuesId, setRoomFromFirebase]
  );

  return (
    <Stack spacing={10} p={4} maxW={"md"} mx="auto">
      <Progress
        value={
          (roomFromFirebase.activeQuestionIndex /
            roomFromFirebase.questionOrder.length) *
          100
        }
      />

      <Stack spacing={4}>
        <Heading fontSize={"2xl"} textAlign={"center"}>
          <Text fontSize={"md"} color={"gray.500"}>
            [QUESTION {roomFromFirebase.activeQuestionIndex + 1} /{" "}
            {roomFromFirebase.questionOrder.length}]
          </Text>
          {question?.tilte}
        </Heading>
        {question?.answers.map((answer, index) => (
          <Button
            key={answer.id}
            h="24"
            p="5"
            borderRadius="3xl"
            bgColor={
              selectedAnswer === undefined || selectedAnswer === answer.id
                ? `${COLORS[index]}.600`
                : `${COLORS[index]}.100`
            }
            color={
              selectedAnswer === undefined || selectedAnswer === answer.id
                ? `white`
                : `${COLORS[index]}.200`
            }
            fontSize="2xl"
            fontWeight="bold"
            _hover={{ bg: `${COLORS[index]}.500` }}
            onClick={() => onSelectAnswer(answer.id)}
            pointerEvents={selectedAnswer !== undefined ? "none" : "auto"}
          >
            {answer.content}
          </Button>
        ))}
      </Stack>

      {selectedAnswer && (
        <Text textAlign="center">
          <strong>Your answer locked in</strong>
        </Text>
      )}
    </Stack>
  );
};

export default QuestionPage;
