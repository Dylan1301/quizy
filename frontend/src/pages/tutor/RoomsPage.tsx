import { Button, Flex, Heading } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

export default function RoomsPage() {

  return (
    <Flex>
      <Heading>Available Rooms</Heading>
      <Button as={RouterLink} to="/room/create">
        Create Room
      </Button>
      <Button as={RouterLink} to="/rooms/lobby">
        Launch Room
      </Button>
    </Flex>  
  );
}
