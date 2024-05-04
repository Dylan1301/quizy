import { Link as RouterLink, useParams } from "react-router-dom";
import { useRoomListRoomListGet } from "../../api/room/room";
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
} from "@chakra-ui/react";
import { useRef } from "react";

export default function TutorQuizDetailPage() {
  const quizId = parseInt(useParams().quizId || "");
  const { data: response } = useGetQuizQuestionsQuizQuizIdGet(quizId);
  const { data: roomsResponse } = useRoomListRoomListGet({ quiz_id: quizId });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef(null);
  const quiz = response?.data;
  if (!quizId) return <div>Invalid quiz id</div>;

  return (
    <>
      <Box>
        <Heading>{quiz?.tilte}</Heading>
        <Text mb={4}>{quiz?.description}</Text>
        <Button ref={btnRef} colorScheme="teal" onClick={onOpen}>
          View question list
        </Button>
        <Button colorScheme="teal" as={RouterLink} to={`/quiz/${quizId}/room/create`} marginLeft="5px">
          Create Room
        </Button>
      </Box>

      <OrderedList listStyleType="none" className="flex">
        {roomsResponse?.data.data.map((room) => (
          <ListItem
            as={RouterLink}
            to={`quiz/${room.quiz_id}/room/${room.id}`}
            key={room.id}
          >
            <Card>
              <CardBody>
                <Heading size="md">{room.name}</Heading>
                {room.is_randomized && (
                  <Badge color={"gray.600"} mb={2}>
                    Randomized
                  </Badge>
                )}
                <Button>View here</Button>
              </CardBody>
            </Card>
          </ListItem>
        ))}
      </OrderedList>

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

          <DrawerBody>
            <OrderedList>
              {quiz?.questions.map((question) => (
                <ListItem key={question.id}>
                  <Heading as="h3" size="md">
                    {question.tilte}
                  </Heading>
                  <Text>{question.tilte}</Text>
                  {question.answers.map((answer) => (
                    <Box key={answer.id}>
                      <Text>{answer.content}</Text>
                    </Box>
                  ))}
                </ListItem>
              ))}
            </OrderedList>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
