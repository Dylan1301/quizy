import { Button, Flex, HStack, Link, Stack, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { PinInput, PinInputField } from "@chakra-ui/react";
import { useState } from "react";

export default function HomePage() {
  const [input, setInput] = useState<string>("");
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);

  const handleJoinRoom = async () => {
    // Assuming '0000' is the correct PIN to join the room
    if (input === "0000") {
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
    <Flex direction="column" align="center" justify="center">
      <div className="Quizzy text-center text-black text-2xl mt-10 font-extrabold font-['Public Sans']">
        QUIZZY
      </div>
      <div className="EnterTheRoomIdToJoin text-center text-black text-4xl mt-[125px] font-bold">
        Enter the Room ID to join
      </div>
      <HStack className="DigitField w-20 h-28 ml-[-275px] mt-[75px] relative">
        <PinInput value={input} onChange={setInput} size="lg" placeholder="0">
          <div>
            <PinInputField className="Bkg w-20 h-28 top-0 relative rounded-xl border-4 border-black text-center text-black text-7xl font-medium font-mono" />
          </div>
          <div>
            <PinInputField className="Bkg w-20 h-28 top-0 relative rounded-xl border-4 border-black text-center text-black text-7xl font-medium font-mono" />
          </div>
          <div>
            <PinInputField className="Bkg w-20 h-28 top-0 relative rounded-xl border-4 border-black text-center text-black text-7xl font-medium font-mono" />
          </div>
          <div>
            <PinInputField className="Bkg w-20 h-28 top-0 relative rounded-xl border-4 border-black text-center text-black text-7xl font-medium font-mono" />
          </div>
        </PinInput>
      </HStack>
      <Stack
        direction="row"
        justify="center"
        align="center"
        spacing="10px"
        mt="80px"
      >
        <Button
          onClick={handleJoinRoom}
          width="180px"
          height="50px"
          overflow="hidden"
          backgroundColor="black"
          textColor="white"
          _hover={{ bg: "#474747" }}
        >
          Join
        </Button>
      </Stack>
      {isRedirecting && <Text>Redirecting to Waiting Room...</Text>}
      <Stack fontWeight="regular" textDecoration="underline" mt="40px">
        <Link as={RouterLink} to="/signin">
          Sign-in as Instructor
        </Link>
      </Stack>
    </Flex>
  );
}
