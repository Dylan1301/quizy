import { useEffect, useMemo, useState } from "react";
import { Button, Heading, Progress, Stack, Text } from "@chakra-ui/react";
import { getRoomInfoRoomRoomIdInfoGet } from "../../api/session/session";
import { LoaderQuizData } from "../../api/model";
import { useParams } from "react-router-dom";
import { getFirebaseRoomActions } from "../../utils/firebase";
import { FirebaseRoomInfo } from "../../utils/types";
import { COLORS } from "../../utils/constants";

const QuestionPage = () => {
  const roomId = parseInt(useParams().roomId || "");
  const [selectedAnswer, setSelectedAnswer] = useState<number>();
  const roomActions = useMemo(() => getFirebaseRoomActions(roomId), [roomId]);
  const [startedQuizData, setStartedQuizData] = useState<LoaderQuizData>();
  const [roomFromFirebase, setRoomFromFirebase] = useState<FirebaseRoomInfo>();
  const question =
    roomFromFirebase &&
    startedQuizData?.questions[roomFromFirebase.activeQuestionIndex];

  const onSelectAnswer = (answerId: number) => {
    if (!question) return;
    if (selectedAnswer !== undefined) return;
    setSelectedAnswer(answerId);
    const studentId = parseInt(localStorage.getItem("studentId") || "0");
    roomActions.answer({ answerId, questionId: question.id, studentId });
  };

  useEffect(() => {
    if (!roomId) return;
    getRoomInfoRoomRoomIdInfoGet(roomId).then(({ data }) => {
      setStartedQuizData(data);
    });
  }, [roomId]);

  useEffect(
    () => roomActions.watch(setRoomFromFirebase),
    [roomActions, setRoomFromFirebase]
  );

  return (
    <Stack spacing={10} p={4} maxW={"md"} mx="auto">
      <Progress value={25} />

      <Stack spacing={4}>
        <Heading fontSize={"2xl"} textAlign={"center"}>
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
