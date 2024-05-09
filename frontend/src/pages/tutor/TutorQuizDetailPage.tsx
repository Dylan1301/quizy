import { Link as RouterLink, useParams } from "react-router-dom";
import {
  roomCreateRoomPost,
  useRoomListRoomListGet,
} from "../../api/room/room";
import { useGetQuizQuestionsQuizQuizIdGet } from "../../api/quiz/quiz";
import {
  Box,
  Button,
  Heading,
  ListItem,
  OrderedList,
  Text,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Card,
  CardBody,
  useDisclosure,
  Badge,
  Checkbox,
  Input,
  Stack,
  FormLabel,
  FormControl,
  useToast,
  CardFooter,
  IconButton,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Code,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Share } from "lucide-react";
import QRCode from "qrcode.react";
import { Room } from "../../api/model";
import { COLORS } from "../../utils/constants";
import { toSixDigits } from "../../utils/functions";
import QuizQuestionsList from "../../components/QuizQuestionsList";

const roomFormSchema = z.object({
  name: z.string().min(2).max(50),
  is_randomized: z.boolean().default(false),
  is_published: z.boolean().default(false),
});

export default function TutorQuizDetailPage() {
  const quizId = parseInt(useParams().quizId || "");
  const { data: response } = useGetQuizQuestionsQuizQuizIdGet(quizId);
  const { data: roomsResponse } = useRoomListRoomListGet({ quiz_id: quizId });
  const toast = useToast();
  const roomForm = useForm<z.infer<typeof roomFormSchema>>({
    resolver: zodResolver(roomFormSchema),
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const shareModal = useDisclosure();
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const btnRef = useRef(null);
  const quiz = response?.data;
  if (!quizId) return <div>Invalid quiz id</div>;

  async function onSubmit(values: z.infer<typeof roomFormSchema>) {
    if (!quiz) return;
    const { data: room } = await roomCreateRoomPost({
      ...values,
      quiz_id: quiz.id,
    });
    toast({
      title: `Your room has been created!`,
      description: `Room "${room.name}" created successfully.`,
    });
  }

  function onClickShare(room: Room) {
    setSelectedRoom(room);
    shareModal.onOpen();
  }

  return (
    <>
      <Box>
        <Heading>{quiz?.tilte}</Heading>
        <Text mb={4}>{quiz?.description}</Text>
        <Button ref={btnRef} colorScheme="teal" onClick={onOpen}>
          View question list
        </Button>
        <Button
          colorScheme="teal"
          as={RouterLink}
          to={`/quiz/${quizId}/room/create`}
          marginLeft="5px"
        >
          Create Room
        </Button>
      </Box>

      <HStack mt={4} alignItems={"flex-start"}>
        <Card minW={"15rem"}>
          <CardBody>
            <form onSubmit={roomForm.handleSubmit(onSubmit)}>
              <Stack>
                <Heading size="md">Create new room</Heading>
                <FormControl>
                  <FormLabel>Room name</FormLabel>
                  <Input {...roomForm.register("name")} placeholder="Name" />
                </FormControl>
                <FormControl>
                  <Checkbox {...roomForm.register("is_randomized")}>
                    Will randomize?
                  </Checkbox>
                </FormControl>
                <FormControl>
                  <Checkbox {...roomForm.register("is_published")}>
                    Publish now?
                  </Checkbox>
                </FormControl>
                <Button type="submit" mt={2}>
                  Create
                </Button>
              </Stack>
            </form>
          </CardBody>
        </Card>
        <OrderedList
          listStyleType="none"
          display="flex"
          flexWrap={"wrap"}
          gap={4}
        >
          {roomsResponse?.data.data.map((room, index) => (
            <RoomDetail
              key={room.id}
              room={room}
              index={index}
              onClickShare={() => onClickShare(room)}
            />
          ))}
        </OrderedList>
      </HStack>

      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent w="50%" maxW="35rem">
          <DrawerCloseButton />
          <DrawerHeader>Question List</DrawerHeader>

          <DrawerBody>{quiz && <QuizQuestionsList quiz={quiz} />}</DrawerBody>
        </DrawerContent>
      </Drawer>

      <Modal isOpen={shareModal.isOpen} onClose={shareModal.onClose}>
        <ModalOverlay />
        <ModalContent pb={6}>
          <ModalHeader textAlign="center">
            Scan QR Code to join the room
          </ModalHeader>
          <ModalCloseButton />
          {selectedRoom && (
            <ModalBody textAlign="center">
              <QRCode
                value={`${location.origin}/${selectedRoom.id}`}
                className="inline-block"
              />
              <Text mt={4}>Or via PIN:</Text>
              <Code fontSize="xl">{toSixDigits(selectedRoom.id)}</Code>
            </ModalBody>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

function RoomDetail({
  room,
  index,
  onClickShare,
}: {
  room: Room;
  index: number;
  onClickShare: () => void;
}) {
  return (
    <ListItem>
      <Card
        w={"15rem"}
        aspectRatio={2}
        border={"solid"}
        borderWidth={1}
        borderColor={`${COLORS[index]}.200`}
        bg={`${COLORS[index]}.50`}
      >
        <CardBody pb={0} minW={200}>
          <Stack alignItems={"flex-start"}>
            <Heading size="md">{room.name}</Heading>
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
          </Stack>
        </CardBody>
        <CardFooter gap={2}>
          <Button
            as={RouterLink}
            to={`/quiz/${room.quiz_id}/room/${room.id}`}
            size={"sm"}
            colorScheme="blue"
            variant={"outline"}
            w={"full"}
          >
            Detail
          </Button>
          <IconButton
            size="sm"
            aria-label="Share"
            colorScheme="black"
            variant={"outline"}
            icon={<Share size={16} />}
            onClick={onClickShare}
          />
        </CardFooter>
      </Card>
    </ListItem>
  );
}
