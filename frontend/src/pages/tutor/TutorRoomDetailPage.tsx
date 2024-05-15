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
  Code,
  HStack,
  Heading,
  Stack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  useDisclosure,
} from "@chakra-ui/react";
import { CheckCircle } from "lucide-react";
import {
  endRoomRoomRoomIdEndSessionPost,
  startRoomQuizRoomRoomIdStartQuizPost,
} from "../../api/session/session";
import { FirebaseRoomInfo } from "../../utils/types";
import { toDigits } from "../../utils/functions";
import { getFirebaseRoomActions } from "../../utils/firebase";
import TutorQuestionPresenation from "../../components/TutorQuestionPresentation";
import QuizStatistic from "../../components/QuizStatistic";
import StudentAvatars from "../../components/StudentAvatars";

const TutorRoomDetailPage = () => {
  const roomId = parseInt(useParams().roomId || "");
  const { isOpen, onClose } = useDisclosure({
    defaultIsOpen: true,
  });
  const { data: response, mutate } = useStudentRoomDetailRoomStudentRoomIdGet(roomId);
  const [publishing, setPublishing] = useState(false);
  const [starting, setStarting] = useState(false);
  const room = response?.data;
  const [roomFromFirebase, setRoomFromFirebase] = useState<FirebaseRoomInfo>();
  const roomActions = useMemo(() => getFirebaseRoomActions(roomId), [roomId]);
  const isStarted = roomFromFirebase && roomFromFirebase.status === "started";

  useEffect(
    () => roomActions.watch(setRoomFromFirebase),
    [roomActions, setRoomFromFirebase]
  );

  const publishRoom = async () => {
    setPublishing(true);
    if (room) {
      await roomPublishRoomRoomIdPublishPost(roomId);
      await roomActions.publish(room.quiz.questions);
      mutate();
    }
    setPublishing(false);
  };

  const startRoom = async () => {
    setStarting(true);
    try {
      await startRoomQuizRoomRoomIdStartQuizPost(roomId);
    } catch (error) {
      console.log(error);
    }

    await roomActions.start();
    setStarting(false);
  };

  if (!room) return null;

  const onEndRoom = async () => {
    await roomActions.end();
    const info = await roomActions.get();
    await endRoomRoomRoomIdEndSessionPost(roomId, info);
    onClose();
  };

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

      {roomFromFirebase && roomFromFirebase.status === "ended" ? (
        <QuizStatistic room={room} roomFromFirebase={roomFromFirebase} />
      ) : (
        <>
          <Card w={"12rem"} textAlign="center">
            <CardBody>
              <QRCode
                value={`${location.origin}/${room.id}`}
                className="inline-block p-3 bg-white rounded-lg"
              />
              <Text mt={4}>Or via PIN:</Text>
              <Code fontSize="xl">{toDigits(room.id)}</Code>
              <Heading
                size={"md"}
                mt={2}
                color={"blue.500"}
                className="capitalize"
              >
                {roomFromFirebase?.status}
              </Heading>
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
                <>
                  <Button
                    colorScheme={"blue"}
                    disabled={!room.is_published}
                    isLoading={starting}
                    onClick={startRoom}
                  >
                    Start Room
                  </Button>
                  <Stack>
                    <StudentAvatars />
                  </Stack>
                  <Text>are waiting</Text>
                </>
              )
            )}
          </HStack>
        </>
      )}

      {isStarted && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent w={"95%"} maxW={"unset"}>
            {roomFromFirebase.activeQuestionIndex ===
            roomFromFirebase.questionOrder.length ? (
              <>
                <QuizStatistic
                  room={room}
                  roomFromFirebase={roomFromFirebase}
                />
                <Stack p={2}>
                  <Button colorScheme="blue" onClick={onEndRoom}>
                    End room
                  </Button>
                </Stack>
              </>
            ) : (
              <TutorQuestionPresenation
                room={room}
                roomFromFirebase={roomFromFirebase}
                nextLabel={
                  roomFromFirebase.activeQuestionIndex ===
                  roomFromFirebase.questionOrder.length - 1
                    ? "Show Leaderboard"
                    : "Next Question"
                }
                onClickNext={() => roomActions.nextQuestion()}
              />
            )}
          </ModalContent>
        </Modal>
      )}
    </Stack>
  );
};

export default TutorRoomDetailPage;
