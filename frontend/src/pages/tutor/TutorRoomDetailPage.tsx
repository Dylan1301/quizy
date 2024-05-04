// TutorRoomDetailPage.js

import React from "react";
import QRCode from "qrcode.react";
import { useRoomDetailRoomRoomIdGet } from "../../api/room/room";
import { useParams } from "react-router-dom";
import { Button, Flex } from "@chakra-ui/react";
import { Room } from "../../api/model/room";

const TutorRoomDetailPage: React.FC = () => {
  const roomId = parseInt(useParams().roomId || "");
  const { data: response } = useRoomDetailRoomRoomIdGet(roomId);
  const room = response?.data as Room; // Add type assertion here
  const { quizId } = useParams(); // Get quizId from URL params

  const roomLink = `${location.href}/room/${roomId}`;

  // Function to handle starting the room
  const handleStartRoom = () => {
    // Assuming the first question ID is available in your questions data
    const firstQuestionId = room?.questions[0]?.id;
    // Navigate to the first question page
    window.location.href = `/quiz/${quizId}/room/${roomId}/${firstQuestionId}`;
  };

  return (
    <Flex direction="column" align="center" justify="center" h="100vh" gap={10}>
      <h1>Teacher Lobby</h1>
      <QRCode value={roomLink} />
      <p>PIN: {room?.id}</p>
      <Button onClick={handleStartRoom}>Start Room</Button> {/* On click, navigate to the first question page */}
    </Flex>
  );
};

export default TutorRoomDetailPage;
