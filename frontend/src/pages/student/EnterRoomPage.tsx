import { useEffect, useMemo, useState } from "react";
import {
  Heading,
  Input,
  Button,
  Box,
  Stack,
  FormLabel,
  FormControl,
  HStack,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { studentJoinRoomRoomRoomIdJoinPost } from "../../api/session/session";
import { getFirebaseRoomActions } from "../../utils/firebase";

const icons = ["👩‍🎓", "🎁", "👩‍💻", "👨‍💻", "👩‍🔬", "🎃", "👩‍🚀", "🇻🇳"];

export default function EnterRoomPage({ roomId }: { roomId?: number }) {
  const navigate = useNavigate();
  const toast = useToast();
  const params = useParams();
  const [name, setName] = useState("");
  const [joining, setJoining] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState("");
  const [activeRoomId, setActiveRoomId] = useState<number>();
  const roomActions = useMemo(
    () => (activeRoomId ? getFirebaseRoomActions(activeRoomId) : undefined),
    [activeRoomId]
  );

  useEffect(() => {
    const id = roomId || parseInt(params.roomId || "");
    if (id) setActiveRoomId(id);
    else navigate("/");
  }, [roomId, params.roomId, navigate]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }
    if (!selectedIcon) {
      alert("Please select an avatar.");
      return;
    }

    if (!activeRoomId) return;
    try {
      setJoining(true);
      const { data } = await studentJoinRoomRoomRoomIdJoinPost(activeRoomId, {
        name,
        icon: selectedIcon,
        room_id: activeRoomId,
      });
      await roomActions?.join(data.id, name, selectedIcon);
      navigate(`/${activeRoomId}/waiting?studentId=${data.id}`);
      setJoining(false);
    } catch (e) {
      toast({ title: "The room has not been published yet", status: "error" });
    }
  };

  return (
    <Stack spacing={4} p={8} textAlign={"center"}>
      <Heading size={"lg"}>Choose Name and Avatar</Heading>
      <FormControl>
        <FormLabel htmlFor="name" size={"md"}>
          Your Name
        </FormLabel>
        <Input
          id="name"
          size={"lg"}
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="name" size={"md"}>
          Your Avatar
        </FormLabel>
        <HStack flexWrap={"wrap"} mt={2}>
          {icons.map((icon) => (
            <Box
              key={icon}
              as="button"
              px={2}
              fontSize="5xl"
              onClick={() => setSelectedIcon(icon)}
              bg={selectedIcon === icon ? "gray.200" : "transparent"}
              borderRadius="md"
              _hover={{ cursor: "pointer", bg: "gray.200" }}
            >
              {icon}
            </Box>
          ))}
        </HStack>
      </FormControl>
      <Button
        mt={4}
        colorScheme="blue"
        isLoading={joining}
        onClick={handleSubmit}
      >
        Lets go
      </Button>
    </Stack>
  );
}
