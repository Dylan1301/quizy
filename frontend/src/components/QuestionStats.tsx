import { Box, HStack, Stack, Text } from "@chakra-ui/react";
import { FirebaseRoomInfo } from "../utils/types";
import { Answer } from "../api/model";

export function QuestionStats({
  answerCounts,
  answers,
}: {
  answerCounts: FirebaseRoomInfo["questions"][number]["answers"];
  answers: Answer[];
}) {
  const totalAnswersCount = Object.values(answerCounts).reduce(
    (pre, cur) => pre + cur.count,
    0
  );

  return (
    <Stack spacing={3} w={"50%"} mx={"auto"}>
      {answers.map((answer) => (
        <HStack
          justifyContent={"space-between"}
          key={answer.id}
          p={4}
          rounded={"xl"}
          borderWidth={answer.is_correct ? 3 : 1}
          borderColor={answer.is_correct ? "gray.900" : "gray.500"}
          fontWeight={answer.is_correct ? "bold" : "semibold"}
          position={"relative"}
          overflow={"hidden"}
          color={answer.is_correct ? "gray.900" : "gray.500"}
          bgColor={answer.is_correct ? "green.100" : "white"}
        >
          <Box
            pos={"absolute"}
            top={0}
            right={0}
            bgColor={answer.is_correct ? "green.200" : "gray.200"}
            w={`${(answerCounts[answer.id]?.count / totalAnswersCount) * 100}%`}
            h={"full"}
            roundedLeft={"xl"}
          />
          <Text pos={"relative"}>{answer.content}</Text>
          <Text pos={"relative"}>{answerCounts[answer.id]?.count}</Text>
        </HStack>
      ))}
    </Stack>
  );
}
