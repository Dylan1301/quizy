import { Avatar, AvatarGroup, Text, Tooltip } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FirebaseRoomInfo } from "../utils/types";
import { getFirebaseRoomActions } from "../utils/firebase";
import { useParams } from "react-router-dom";

export default function StudentAvatars({
  studentIds,
}: {
  studentIds?: number[];
}) {
  const { roomId } = useParams();
  const [students, setStudents] =
    useState<Array<FirebaseRoomInfo["students"][number]>>();

  useEffect(() => {
    if (!roomId) return;
    getFirebaseRoomActions(roomId).watch((info) =>
      setStudents(
        Object.values(info.students).filter((stu) => {
          if (studentIds) return studentIds.includes(stu.id);
          return true;
        })
      )
    );
  }, [roomId, setStudents, studentIds]);

  if (!roomId) throw new Error("Room ID is required to render student avatars");

  return (
    <AvatarGroup size="md" max={12} mx={"auto"}>
      {students?.length === 0 && <Text color={"gray.500"}>No one yet</Text>}
      {students?.map((stu) => (
        <Avatar
          bg={"gray.100"}
          key={stu.id}
          icon={
            <Tooltip label={stu.name}>
              <Text fontSize={"x-large"} cursor={"default"}>
                {stu.icon || "🍀"}
              </Text>
            </Tooltip>
          }
        />
      ))}
    </AvatarGroup>
  );
}
