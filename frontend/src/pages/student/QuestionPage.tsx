import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Heading,
  Progress,
  Stack,
  Text,
  Step,
  StepIcon,
  StepIndicator,
  StepStatus,
  Stepper,
  useSteps,
  Box,
} from "@chakra-ui/react";
import { RoomWithQuiz } from "../../api/model";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { getFirebaseRoomActions } from "../../utils/firebase";
import { FirebaseRoomInfo } from "../../utils/types";
import { COLORS } from "../../utils/constants";
import QuizStatistic from "../../components/QuizStatistic";

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
  const { activeStep, setActiveStep } = useSteps({
    index: 1,
    count: roomFromFirebase.questionOrder.length,
  });
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
          setActiveStep(info.activeQuestionIndex);
        }
        setRoomFromFirebase(info);
      }),
    [roomActions, activeQuesId, setRoomFromFirebase, setActiveStep]
  );

  return (
    <Stack spacing={10} p={4} maxW={"md"} mx="auto">
      {roomFromFirebase.activeQuestionIndex ===
      roomFromFirebase.questionOrder.length ? (
        <>
          <Heading size={"md"} textAlign={"center"}>
            Congrats! You've done it 🎉
          </Heading>
          <QuizStatistic room={roomData} roomFromFirebase={roomFromFirebase} />
        </>
      ) : (
        <>
          <Box position="relative">
            <Stepper size="sm" index={activeStep} gap="0">
              {roomFromFirebase.questionOrder.map((_, index) => (
                <Step key={index}>
                  <StepIndicator bg="white">
                    <StepStatus complete={<StepIcon />} />
                  </StepIndicator>
                </Step>
              ))}
            </Stepper>
            <Progress
              value={
                (roomFromFirebase.activeQuestionIndex +
                  1 / roomFromFirebase.questionOrder.length) *
                100
              }
              position="absolute"
              height="3px"
              width="full"
              top="10px"
              zIndex={-1}
            />
          </Box>
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
        </>
      )}
    </Stack>
  );
};

export default QuestionPage;
