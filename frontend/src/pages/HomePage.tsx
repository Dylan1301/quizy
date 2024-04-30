import { Button, Flex, HStack, Heading, Link, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { PinInput, PinInputField } from "@chakra-ui/react";
import { useState } from "react";

export default function HomePage() {
  const [input, setInput] = useState<string>('');
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);
 
  const handleJoinRoom = async () => {
    // Assuming '0000' is the correct PIN to join the room
    if (input === '0000') {
      setIsRedirecting(true);
      setTimeout(() => {
        window.location.href = "/enter"; // Redirect to "/enter"
      }, 3000); // 3 seconds
    } else {
      // Show error message for incorrect PIN
      console.log("Incorrect PIN. Please try again.");
    }
  };
 
  return (
    <Flex direction="column" align="center" justify="center" h="100vh" gap={10}>
      <Heading size="2xl">Quizzy</Heading>
      <Heading size="lg">Enter the Room ID to join</Heading>
      <HStack>
        <PinInput value={input} onChange={setInput} size="lg">
          <PinInputField />
          <PinInputField />
          <PinInputField />
          <PinInputField />
        </PinInput>
      </HStack>
      <Button w="12rem" colorScheme="gray" onClick={handleJoinRoom}>
        Join
      </Button>
      {isRedirecting && (
        <Text>Redirecting to Waiting Room...</Text>
      )}
      <Link as={RouterLink} to="/signin">
        Sign-in as Instructor
      </Link>
    </Flex>
  );
}
