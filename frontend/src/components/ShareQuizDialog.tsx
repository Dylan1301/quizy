import { Button, Heading, Text } from "@chakra-ui/react";
import QRCode from "qrcode.react";
import { Link as RouterLink } from "react-router-dom";

export default function ShareQuizDialog({ pin }: { pin: string }) {
  return (
    <div>
      <Heading>Teacher Lobby</Heading>
      <QRCode value={pin} />
      <Text>PIN: {pin}</Text>
      <Button as={RouterLink} to="question/:questionId">
        Start Room
      </Button>
    </div>
  );
}
