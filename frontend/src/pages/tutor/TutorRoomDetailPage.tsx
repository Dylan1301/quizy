import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode.react";
import {
  roomPublishRoomRoomIdPublishPost,
  useStudentRoomDetailRoomStudentRoomIdGet,
} from "../../api/room/room";
import { useParams } from "react-router-dom";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  Code,
  HStack,
  Heading,
  Stack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
} from "@chakra-ui/react";
import { ArrowRightCircle, BarChartBig, CheckCircle } from "lucide-react";
import { startRoomQuizRoomRoomIdStartQuizPost } from "../../api/session/session";
import { RoomWithQuiz } from "../../api/model";
import CountDown from "../../components/CountDown";
import { FirebaseRoomInfo } from "../../utils/types";
import { nonNullable, toSixDigits } from "../../utils/functions";
import { QuestionStats } from "../../components/QuestionStats";
import QuestionDetail from "../../components/QuestionDetail";
import { getFirebaseRoomActions } from "../../utils/firebase";
import StudentAvatars from "../../components/StudentAvatars";

const TutorRoomDetailPage = () => {
  const roomId = parseInt(useParams().roomId || "");
  const { data: response } = useStudentRoomDetailRoomStudentRoomIdGet(roomId);
  const [publishing, setPublishing] = useState(false);
  const [starting, setStarting] = useState(false);
  const room = response?.data;
  const [roomFromFirebase, setRoomFromFirebase] = useState<FirebaseRoomInfo>();
  const roomActions = useMemo(() => getFirebaseRoomActions(roomId), [roomId]);
  const isStarted =
    roomFromFirebase && roomFromFirebase.activeQuestionIndex > -1;

  useEffect(
    () => roomActions.watch(setRoomFromFirebase),
    [roomActions, setRoomFromFirebase]
  );

  const publishRoom = async () => {
    setPublishing(true);
    if (room) {
      await roomPublishRoomRoomIdPublishPost(roomId);
      await roomActions.publish(room.quiz.questions);
    }
    setPublishing(false);
  };

  const startRoom = async () => {
    setStarting(true);
    await startRoomQuizRoomRoomIdStartQuizPost(roomId);
    await roomActions.start();
    setStarting(false);
  };

  if (!room) return null;

  return (
    <Stack>
      <Heading>{room.name}</Heading>
      <HStack>
        {room.is_randomized && (
          <Badge colorScheme="blue" mb={2}>
            Randomized
          </Badge>
        )}
        {room.is_published && (
          <Badge
            mb={2}
            display="flex"
            alignItems="center"
            colorScheme="green"
            gap={1}
          >
            <CheckCircle size={12} /> Published
          </Badge>
        )}
      </HStack>

      <Card w={"12rem"} textAlign="center">
        <CardBody>
          <QRCode
            value={`${location.origin}/${room.id}`}
            className="inline-block"
          />
          <Text mt={4}>Or via PIN:</Text>
          <Code fontSize="xl">{toSixDigits(room.id)}</Code>
          {isStarted && (
            <Heading size={"md"} mt={2} color={"green.500"}>
              STARTED
            </Heading>
          )}
        </CardBody>
      </Card>
      <HStack>
        {!room.is_published ? (
          <Button
            colorScheme="blue"
            isLoading={publishing}
            onClick={publishRoom}
          >
            Publish
          </Button>
        ) : (
          !isStarted && (
            <Button
              colorScheme={"blue"}
              disabled={!room.is_published}
              isLoading={starting}
              onClick={startRoom}
            >
              Start Room
            </Button>
          )
        )}
      </HStack>

      {isStarted && (
        <Modal isOpen={true} onClose={() => {}}>
          <ModalOverlay />
          <ModalContent w={"95%"} maxW={"unset"}>
            <QuestionPresenation
              room={room}
              roomFromFirebase={roomFromFirebase}
              nextLabel={
                roomFromFirebase.activeQuestionIndex ===
                roomFromFirebase.questionOrder.length - 1
                  ? "Sum up"
                  : "Next Question"
              }
              onClickNext={() => roomActions.nextQuestion()}
            />
          </ModalContent>
        </Modal>
      )}
    </Stack>
  );
};

function QuestionPresenation({
  room: { quiz },
  roomFromFirebase,
  nextLabel,
  onClickNext,
}: {
  room: RoomWithQuiz;
  roomFromFirebase?: FirebaseRoomInfo;
  nextLabel: string;
  onClickNext: () => void;
}) {
  const [isTimeUp, setTimeUp] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const question = quiz.questions[currentQuestionIndex];
  const firebaseQuestion = roomFromFirebase?.questions[question.id];
  const answerCounts = useMemo(() => {
    if (firebaseQuestion === undefined) return [];
    return Object.entries(firebaseQuestion.answers).map(([id, answer]) => ({
      id,
      ...answer,
      students:
        answer.studentIds
          .map((id) => roomFromFirebase?.students[id])
          .filter(nonNullable) || [],
    }));
  }, [firebaseQuestion, roomFromFirebase?.students]);
  const totalStudentsCount = Object.keys(
    roomFromFirebase?.students || {}
  ).length;
  const answeredStudentIds = answerCounts
    .map((answer) => answer.students)
    .flat()
    .map((s) => s.id);

  const nextQuestion = () => {
    if (currentQuestionIndex + 1 < quiz.questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeUp(false);
      setShowStats(false);
      onClickNext();
    }
  };

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

export default TutorRoomDetailPage;
