import React, { useEffect, useState } from "react";
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
  Divider,
  HStack,
  Heading,
  ListItem,
  OrderedList,
  Stack,
  Text,
} from "@chakra-ui/react";
import { BarChartBig, CheckCircle } from "lucide-react";
import {
  getRoomInfoRoomRoomIdInfoGet,
  startRoomQuizRoomRoomIdStartQuizPost,
} from "../../api/session/session";
import { LoaderQuizData } from "../../api/model";
import { COLORS, firebaseFirestore } from "../../utils/constants";
import CountDown from "../../components/CountDown";
import { addDoc, collection, count, doc, setDoc } from "firebase/firestore";

const TutorRoomDetailPage: React.FC = () => {
  const roomId = parseInt(useParams().roomId || "");
  const { data: response } = useRoomDetailRoomRoomIdGet(roomId);
  const [publishing, setPublishing] = useState(false);
  const [starting, setStarting] = useState(false);
  const [startedQuizData, setStartedQuizData] = useState<LoaderQuizData>();
  const [roomFromFirebase, setRoomFromFirebase] = useState();
  const room = response?.data;

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getRoomInfoRoomRoomIdInfoGet(roomId);
        setStartedQuizData(data);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [roomId, setStartedQuizData]);

  const publishRoom = async () => {
    setPublishing(true);
    await roomPublishRoomRoomIdPublishPost(roomId);
    setPublishing(false);
  };

  const startRoom = async () => {
    setStarting(true);
    const { data } = await startRoomQuizRoomRoomIdStartQuizPost(roomId);
    const roomDoc = doc(firebaseFirestore, "room", `${roomId}`);
    await setDoc(roomDoc, {
      questions: data.questions.map((q) => ({
        answers: q.answers.reduce((pre, cur) => ({ id: a.id, count: {} }), {}),
        correctedAnswerId: q.answers.find((a) => a.is_correct)?.id,
      })),
    });

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

      <HStack alignItems={"start"}>
        <Card w={"15rem"} textAlign="center">
          <CardBody>
            <QRCode
              value={`${location.origin}/${room.id}`}
              className="inline-block"
            />
            <Text mt={4}>Or via PIN:</Text>
            <Code fontSize="xl">{room.id}</Code>
            {startedQuizData && (
              <Heading size={"md"} mt={2} color={"green.500"}>
                STARTED
              </Heading>
            )}
          </CardBody>
        </Card>
        <HStack>
          {!room.is_published && (
            <Button
              colorScheme="blue"
              isLoading={publishing}
              onClick={publishRoom}
            >
              Publish
            </Button>
          )}
          {!startedQuizData && (
            <Button
              colorScheme={"blue"}
              disabled={!room.is_published}
              isLoading={starting}
              onClick={startRoom}
            >
              Start Room
            </Button>
          )}
        </HStack>
        {startedQuizData && (
          <>
            <Divider orientation="vertical" />
            <QuestionPresenation loadedQuizData={startedQuizData} />
          </>
        )}
      </HStack>
    </Stack>
  );
};

function QuestionPresenation({
  loadedQuizData,
}: {
  loadedQuizData: LoaderQuizData;
}) {
  const [isTimeUp, setTimeUp] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const question = loadedQuizData.questions[currentQuestionIndex];

  useEffect(() => {
    if (question?.id) {
      // fetchQuestionFromFirebase(question.id).then(setQuestionFromFirebase);
    }
  }, [question]);

  const nextQuestion = () => {
    if (currentQuestionIndex + 1 < loadedQuizData.questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeUp(false);
    }
  };

  return (
    <Card w={"full"} h={"full"} textAlign={"center"}>
      <CardBody>
        <Heading mb={6}>{question.tilte}</Heading>
        <OrderedList className="!list-none !grid grid-cols-2 gap-4">
          {question.answers.map((answer, index) => (
            <ListItem key={answer.id}>
              <Box
                bgColor={`${COLORS[index]}.700`}
                color={"white"}
                p={4}
                rounded={"lg"}
                fontSize={"xl"}
                fontWeight={"semibold"}
              >
                {answer.content}
              </Box>
            </ListItem>
          ))}
        </OrderedList>
      </CardBody>
      <CardFooter gap={4} justifyContent={"flex-end"}>
        {question.time_limit && (
          <CountDown
            timeInSeconds={question.time_limit}
            fontSize={"2xl"}
            fontWeight={"bold"}
            timeUp={() => setTimeUp(true)}
          />
        )}
        {isTimeUp && (
          <Button colorScheme="blue" gap={2} onClick={nextQuestion}>
            <BarChartBig /> Show statistic
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

function QuestionStatistic({}) {
  return (
    <Card w={"full"} textAlign={"center"}>
      <CardBody>
        <Heading mb={6}>Statistic</Heading>
        <Stack spacing={4}>
          <Text>Answered: 20</Text>
          <Text>Correct: 10</Text>
          <Text>Wrong: 10</Text>
        </Stack>
      </CardBody>
    </Card>
  );
}

export default TutorRoomDetailPage;
