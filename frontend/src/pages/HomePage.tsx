import {
  Button,
  Flex,
  HStack,
  Link,
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  PinInput,
  PinInputField,
  useDisclosure,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useState } from "react";
import EnterRoomPage from "./student/EnterRoomPage";

export default function HomePage() {
  const [input, setInput] = useState<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleJoinRoom = async () => {
    if (!input) return;
    onOpen();
  };

  return (
    <>
      <Flex direction="column" align="center" justify="center">
        <div className="Quizzy text-center text-2xl mt-10 font-extrabold">
          QUIZZY
        </div>
        <div className="EnterTheRoomIdToJoin text-center text-4xl mt-12 font-bold">
          Enter the Room ID to join
        </div>
        <HStack className="DigitField w-20 h-28 ml-[-275px] mt-[75px] relative">
          <PinInput value={input} onChange={setInput} size="lg" placeholder="0">
            <div>
              <PinInputField className="Bkg w-20 h-28 top-0 relative rounded-xl border-4 border-black text-center text-7xl font-medium font-mono" />
            </div>
            <div>
              <PinInputField className="Bkg w-20 h-28 top-0 relative rounded-xl border-4 border-black text-center text-7xl font-medium font-mono" />
            </div>
            <div>
              <PinInputField className="Bkg w-20 h-28 top-0 relative rounded-xl border-4 border-black text-center text-7xl font-medium font-mono" />
            </div>
            <div>
              <PinInputField className="Bkg w-20 h-28 top-0 relative rounded-xl border-4 border-black text-center text-7xl font-medium font-mono" />
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
            backgroundColor="black"
            textColor="white"
            size={"lg"}
            _hover={{ bg: "gray.700" }}
          >
            Join
          </Button>
        </Stack>
        <Stack fontWeight="regular" textDecoration="underline" mt="40px">
          <Link as={RouterLink} to="/signin">
            Sign-in as Instructor
          </Link>
        </Stack>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <EnterRoomPage roomId={parseInt(input)} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
