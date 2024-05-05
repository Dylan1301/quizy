import { Flex, Heading, Button } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";

export default function WaitingRoomPage() {
  const location = useLocation();
  const { state } = location;

  return (
    <Flex direction="column" align="center" justify="center" h="100vh" gap={10}>
      <Heading>Waiting For Host To Start Quiz</Heading>
      <p>Your Name: {state && state.name}</p>
      <p>Avatar: {state && state.selectedIcon}</p>
      {/* Add your Quiz information here if you have */}
      <Button mt={4} variant="outline" isLoading>
        Loading Room...
      </Button>
    </Flex>
  );
}
