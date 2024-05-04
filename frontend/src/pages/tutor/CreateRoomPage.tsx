import { useState } from "react";
import { Button, Checkbox, Flex, Heading, Input } from "@chakra-ui/react";
import { useParams } from "react-router-dom";

const CreateRoomPage = () => {
  const { quizId } = useParams();
  const [roomName, setRoomName] = useState(""); // State to store room name
  const [randomizeOrder, setRandomizeOrder] = useState(false); // State to store checkbox value

  // Function to generate random room ID
  const generateRandomRoomId = () => {
    return Math.floor(1000 + Math.random() * 9000);
  };

  // Function to handle room creation
  const handleCreateRoom = () => {
    const roomId = generateRandomRoomId();
    // Navigate to the room detail page with the quizId and roomId
    window.location.href = `/quiz/${quizId}/room/${roomId}`;
  };

  return (
    <Flex direction="column" align="center" justify="center" h="100vh">
      <Heading mb="10">Create Room</Heading>
      <Input
        mb="10"
        placeholder="Room Name"
        width="30%"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
      />
      <Checkbox mb="10" isChecked={randomizeOrder} onChange={() => setRandomizeOrder(!randomizeOrder)}>
        Randomise Question Order
      </Checkbox>
      <Button onClick={handleCreateRoom}>Publish</Button>
    </Flex>
  );
};

export default CreateRoomPage;


// Look into further options if available.
