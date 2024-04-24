import { Button, Flex, HStack, Heading, Link } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { PinInput, PinInputField } from "@chakra-ui/react";
import { useState } from "react";
export default function HomePage() {
  const [input, setInput] = useState<string>();
 
  const handleJoinRoom = async () => {
    console.log(input);
    // api call to submit => response
    // if response is success, navigate to waiting room
    // else show error message
    // const { data } = await joinRoom(input);
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
      <Link as={RouterLink} to="/signin">
        Sign-in as Instructor
      </Link>
    </Flex>
  );
}
