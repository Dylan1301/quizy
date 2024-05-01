import { Button, Checkbox, Flex, Heading, Input } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

export default function CreateRoomPage() {
  return (
    <Flex direction="column" align="center" justify="center" h="100vh">
      <Heading>Create Room</Heading>
      <Input placeholder="Room Name" />
      <Checkbox>Randomise Question Order</Checkbox>
      <Button as={RouterLink} to="/rooms">Publish</Button>
    </Flex>
  ); 
}

// Look into further options if available.