import { Flex, Heading, Text, Avatar, Stack } from "@chakra-ui/react";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFirebaseRoomActions } from "../../utils/firebase";
import { RoomStudent } from "../../utils/types";
import StudentAvatars from "../../components/StudentAvatars";

export default function WaitingRoomPage() {
  const { roomId } = useParams();
  const [student, setStudent] = useState<RoomStudent>();

  useEffect(() => {
    if (!roomId) return;
    const roomIdInt = parseInt(roomId);
    getFirebaseRoomActions(roomIdInt)
      .get()
      .then((info) => {
        const studentId = parseInt(localStorage.getItem("studentId") || "0");
        setStudent(info.students[studentId]);
      });
  }, [roomId]);

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      minH="100vh"
      textAlign={"center"}
      gap={6}
    >
      <Loader2 size={64} className="animate-spin" />
      <Stack>
        <Heading size={"md"}>Waiting For Host To Start Quiz</Heading>
        <Text color={"gray.500"} fontSize={"small"} w={"60%"} mx={"auto"}>
          Questions will be displayed automatically when your tutor starts the
          quiz
        </Text>
      </Stack>
      {student && (
        <Stack>
          <Avatar
            bg={"gray.100"}
            icon={
              <Text fontSize={"xxx-large"} cursor={"default"}>
                {student.icon || "🍀"}
              </Text>
            }
            size={"xl"}
          />
          <Text fontSize={"x-large"} fontWeight={"bold"}>
            {student.name}
          </Text>
        </Stack>
      )}
      <Stack>
        <Text color={"gray.700"}>See who are joining with you</Text>
        <StudentAvatars />
      </Stack>
    </Flex>
  );
}
