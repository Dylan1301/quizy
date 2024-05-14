import { Link as RouterLink, useParams } from "react-router-dom";
import {
  roomCreateRoomPost,
  roomDeleteRoomRoomIdDelete,
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
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Code,
  UnorderedList,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle,
  MoreVertical,
  PlusCircle,
  Share,
  Trash2,
} from "lucide-react";
import QRCode from "qrcode.react";
import { Room } from "../../api/model";
import { COLORS } from "../../utils/constants";
import { toSixDigits } from "../../utils/functions";
import QuizQuestionsList from "../../components/QuizQuestionsList";
import { getFirebaseRoomActions } from "../../utils/firebase";

const roomFormSchema = z.object({
  name: z.string().min(2).max(50),
  is_randomized: z.boolean().default(false),
  is_published: z.boolean().default(false),
});

export default function TutorQuizDetailPage() {
  const quizId = parseInt(useParams().quizId || "");
  const { data: response } = useGetQuizQuestionsQuizQuizIdGet(quizId);
  const { data: roomsResponse, mutate } = useRoomListRoomListGet({
    quiz_id: quizId,
  });
  const toast = useToast();
  const roomForm = useForm<z.infer<typeof roomFormSchema>>({
    resolver: zodResolver(roomFormSchema),
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const shareModal = useDisclosure();
  const deleteAlert = useDisclosure();
  const [creatingRoom, setCreatingRoom] = useState(false);
  const deleteCancelRef = useRef<HTMLButtonElement>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const btnRef = useRef(null);
  const quiz = response?.data;
  if (!quizId) return <div>Invalid quiz id</div>;

  async function onSubmit(values: z.infer<typeof roomFormSchema>) {
    if (!quiz) return;
    setCreatingRoom(true);
    const { data: room } = await roomCreateRoomPost({
      ...values,
      quiz_id: quiz.id,
    });
    toast({
      title: `Your room has been created!`,
      description: `Room "${room.name}" created successfully.`,
    });
    await getFirebaseRoomActions(room.id).publish(quiz.questions);
    await mutate();
    setCreatingRoom(false);
  }

  function onClickShare(room: Room) {
    setSelectedRoom(room);
    shareModal.onOpen();
  }
  function onClickDelete(room: Room) {
    setSelectedRoom(room);
    deleteAlert.onOpen();
  }
  async function onClickConfirmDelete() {
    deleteAlert.onClose();
    if (!selectedRoom) return;
    try {
      await roomDeleteRoomRoomIdDelete(selectedRoom.id);
      toast({ status: "success", description: "Delete room successfully" });
      mutate();
    } catch (error) {
      toast({
        status: "error",
        description: "Sorry, deletion has failed for unknown reason.",
      });
    }
  }

  return (
    <>
      <Box>
        <Heading>{quiz?.tilte}</Heading>
        <Text mb={4}>{quiz?.description}</Text>
        <Button ref={btnRef} colorScheme="blue" onClick={onOpen}>
          View question list
        </Button>
      </Box>

      <HStack mt={4} alignItems={"flex-start"}>
        <Card minW={"15rem"}>
          <CardBody>
            <form onSubmit={roomForm.handleSubmit(onSubmit)}>
              <Stack>
                <Heading size="md">
                  <PlusCircle className="inline-block mb-1 mr-1" />
                  Create new room
                </Heading>
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
                <Button
                  type="submit"
                  mt={2}
                  colorScheme="blue"
                  isLoading={creatingRoom}
                >
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
              onClickDelete={() => onClickDelete(room)}
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
                className="inline-block p-3 bg-white rounded-lg"
              />
              <Text mt={4}>Or via PIN:</Text>
              <Code fontSize="xl">{toSixDigits(selectedRoom.id)}</Code>
            </ModalBody>
          )}
        </ModalContent>
      </Modal>

      <AlertDialog
        isOpen={deleteAlert.isOpen}
        leastDestructiveRef={deleteCancelRef}
        onClose={deleteAlert.onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Room
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={deleteCancelRef} onClick={deleteAlert.onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={onClickConfirmDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

function RoomDetail({
  room,
  index,
  onClickShare,
  onClickDelete,
}: {
  room: Room;
  index: number;
  onClickShare: () => void;
  onClickDelete: () => void;
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
        _dark={{
          borderColor: `${COLORS[index]}.600`,
          bg: `${COLORS[index]}.900`,
        }}
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
          <Popover>
            <PopoverTrigger>
              <IconButton
                size="sm"
                aria-label="Share"
                colorScheme="blue"
                variant={"outline"}
                icon={<MoreVertical size={16} />}
              />
            </PopoverTrigger>
            <PopoverContent w={"8rem"}>
              <PopoverArrow />
              <UnorderedList listStyleType="none" ml={0} py={2} px={1}>
                {room.is_published && (
                  <ListItem>
                    <Button
                      variant={"ghost"}
                      w={"full"}
                      gap={2}
                      justifyContent={"flex-start"}
                      onClick={onClickShare}
                    >
                      <Share size={20} className="shrink-0" /> Share
                    </Button>
                  </ListItem>
                )}
                <ListItem>
                  <Button
                    colorScheme="red"
                    variant={"ghost"}
                    w={"full"}
                    gap={2}
                    justifyContent={"flex-start"}
                    onClick={onClickDelete}
                  >
                    <Trash2 size={20} className="shrink-0" />
                    Delete
                  </Button>
                </ListItem>
              </UnorderedList>
            </PopoverContent>
          </Popover>
        </CardFooter>
      </Card>
    </ListItem>
  );
}
