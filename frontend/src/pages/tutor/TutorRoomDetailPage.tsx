import React, { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode.react";
import {
  roomPublishRoomRoomIdPublishPost,
  useRoomDetailRoomRoomIdGet,
} from "../../api/room/room";
import { useParams } from "react-router-dom";
import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Code,
  HStack,
  Heading,
  ListItem,
  OrderedList,
  Stack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  AvatarGroup,
  Avatar,
  Tooltip,
} from "@chakra-ui/react";
import { ArrowRightCircle, BarChartBig, CheckCircle } from "lucide-react";
import {
  getRoomInfoRoomRoomIdInfoGet,
  startRoomQuizRoomRoomIdStartQuizPost,
} from "../../api/session/session";
import { LoaderQuizData } from "../../api/model";
import { COLORS, firebaseFirestore } from "../../utils/constants";
import CountDown from "../../components/CountDown";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { FirebaseRoomInfo } from "../../utils/types";
import { nonNullable, toSixDigits } from "../../utils/functions";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ChartOptions,
  ChartData,
} from "chart.js";
import "chart.js/auto";
import { Bar } from "react-chartjs-2";

const TutorRoomDetailPage: React.FC = () => {
  const roomId = parseInt(useParams().roomId || "");
  const { data: response } = useRoomDetailRoomRoomIdGet(roomId);
  const [publishing, setPublishing] = useState(false);
  const [starting, setStarting] = useState(false);
  const [startedQuizData, setStartedQuizData] = useState<LoaderQuizData>();
  const room = response?.data;
  const [roomFromFirebase, setRoomFromFirebase] = useState<FirebaseRoomInfo>();
  const roomDoc = useMemo(
    () => doc(firebaseFirestore, "room", `${roomId}`),
    [roomId]
  );

  useEffect(() => {
    getRoomInfoRoomRoomIdInfoGet(roomId).then(({ data }) => {
      setStartedQuizData(data);
    });
  }, [roomId]);

  useEffect(() => {
    onSnapshot(roomDoc, (d) =>
      setRoomFromFirebase(d.data() as FirebaseRoomInfo)
    );
  }, [roomDoc]);

  const publishRoom = async () => {
    setPublishing(true);
    await roomPublishRoomRoomIdPublishPost(roomId);
    setPublishing(false);
  };

  const startRoom = async () => {
    setStarting(true);
    const { data } = await startRoomQuizRoomRoomIdStartQuizPost(roomId);

    const content: FirebaseRoomInfo = {
      questionOrder: data.questions.map((q) => q.id),
      questions: data.questions.reduce(
        (preQ, curQ) => ({
          ...preQ,
          [curQ.id]: {
            answers: curQ.answers.reduce(
              (pre, cur) => ({
                ...pre,
                [cur.id]: { count: 0, studentIds: [] },
              }),
              {}
            ),
            correctedAnswerId: curQ.answers.find((a) => a.is_correct)?.id,
          },
        }),
        {}
      ),
      students: {},
    };
    await setDoc(roomDoc, content);

    setStartedQuizData(data);
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
          {startedQuizData && (
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
          !startedQuizData && (
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

      {startedQuizData && (
        <Modal isOpen={true} onClose={() => {}}>
          <ModalOverlay />
          <ModalContent w={"95%"} maxW={"unset"}>
            <QuestionPresenation
              loadedQuizData={startedQuizData}
              roomFromFirebase={roomFromFirebase}
            />
          </ModalContent>
        </Modal>
      )}
    </Stack>
  );
};

function QuestionPresenation({
  loadedQuizData,
  roomFromFirebase,
}: {
  loadedQuizData: LoaderQuizData;
  roomFromFirebase?: FirebaseRoomInfo;
}) {
  const [isTimeUp, setTimeUp] = useState(false);
  const [willShowStats, setShowStats] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const question = loadedQuizData.questions[currentQuestionIndex];
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
  const answeredStudents = answerCounts.map((answer) => answer.students).flat();

  const nextQuestion = () => {
    if (currentQuestionIndex + 1 < loadedQuizData.questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeUp(false);
    }
  };

  return (
    <Card w={"full"} h={"full"} textAlign={"center"} pt={8}>
      <CardBody>
        <Heading mb={8}>{question.tilte}</Heading>

        {willShowStats ? (
          <QuestionStatistic answerCounts={firebaseQuestion?.answers || {}} />
        ) : (
          <>
            <OrderedList ml={0} className="!list-none !grid grid-cols-2 gap-4">
              {question.answers.map((answer, index) => (
                <ListItem key={answer.id}>
                  <Box
                    bgColor={`${COLORS[index]}.600`}
                    color={"white"}
                    p={8}
                    rounded={"lg"}
                    fontSize={"xl"}
                    fontWeight={"semibold"}
                  >
                    {answer.content}
                  </Box>
                </ListItem>
              ))}
            </OrderedList>
            <Stack mt={8}>
              <Heading size={"sm"}>Looks who replied</Heading>
              <AvatarGroup size="md" max={12} mx={"auto"}>
                {answeredStudents.length === 0 && (
                  <Text color={"gray.500"}>No one answered yet</Text>
                )}
                {answeredStudents.map((stu) => (
                  <Tooltip label={stu.name} key={stu.id}>
                    <Avatar
                      bg={"gray.200"}
                      icon={
                        <Text fontSize={"x-large"}>{stu.icon || "🍀"}</Text>
                      }
                    />
                  </Tooltip>
                ))}
              </AvatarGroup>
            </Stack>
          </>
        )}
      </CardBody>
      <CardFooter gap={4} justifyContent={"space-between"}>
        <Text>
          Total joined student: <strong>{totalStudentsCount}</strong>
        </Text>

        <HStack>
          {!willShowStats && question.time_limit && (
            <CountDown
              key={question.id}
              timeInSeconds={question.time_limit}
              fontSize={"2xl"}
              fontWeight={"bold"}
              timeUp={() => setTimeUp(true)}
            />
          )}
          {!willShowStats && isTimeUp && (
            <Button
              colorScheme="blue"
              gap={2}
              onClick={() => setShowStats(true)}
            >
              <BarChartBig /> Show statistic
            </Button>
          )}
          {willShowStats && (
            <Button colorScheme="blue" gap={2} onClick={nextQuestion}>
              Next Question <ArrowRightCircle />
            </Button>
          )}
        </HStack>
      </CardFooter>
    </Card>
  );
}

ChartJS.register(BarElement, Title, ChartTooltip);
const options: ChartOptions<"bar"> = {
  responsive: true,
  plugins: {
    legend: { display: false },
    title: { display: false },
  },
  scales: {
    x: {
      border: { display: false },
      grid: { display: false },
    },
    y: {
      beginAtZero: true,
      border: { display: false },
      grid: { display: false },
    },
  },
};
function QuestionStatistic({
  answerCounts,
}: {
  answerCounts: FirebaseRoomInfo["questions"][number]["answers"];
}) {
  const data: ChartData<"bar"> = {
    labels: Object.keys(answerCounts),
    datasets: [
      {
        label: "Answer count",
        data: Object.values(answerCounts).map((a) => a.count),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderRadius: Number.MAX_VALUE,
        borderSkipped: false,
      },
    ],
  };

  return (
    <Stack spacing={4} w={"50%"} mx={"auto"}>
      <Bar options={options} data={data} />
    </Stack>
  );
}

export default TutorRoomDetailPage;
