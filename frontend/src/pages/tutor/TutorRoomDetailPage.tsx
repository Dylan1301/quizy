import React from "react";
import QRCode from "qrcode.react";
import { useRoomDetailRoomRoomIdGet } from "../../api/room/room";
import { Link as RouterLink, useParams } from "react-router-dom";
import { Button } from "@chakra-ui/react";

const TutorRoomDetailPage: React.FC = () => {
  const roomId = parseInt(useParams().roomId || "");
  const { data: response } = useRoomDetailRoomRoomIdGet(roomId);
  const room = response?.data;

  const roomLink = `${location.href}/room/${roomId}`;

  return (
    <div>
      <h1>Teacher Lobby</h1>
      <QRCode value={roomLink} />
      <p>PIN: {room?.id}</p>
      <Button as={RouterLink} to="question/:questionId">
        Start Room
      </Button>
    </div>
  );
};

export default TutorRoomDetailPage;
