import { Box, Heading, ListItem, OrderedList, Stack } from "@chakra-ui/react";
import { LoaderQuestionData } from "../api/model";
import { COLORS } from "../utils/constants";
import StudentAvatars from "./StudentAvatars";

export default function QuestionDetail({
  question,
  answeredStudentIds,
}: {
  question: LoaderQuestionData;
  answeredStudentIds: number[];
}) {
  return (
    <>
      <OrderedList ml={0} className="!list-none !grid grid-cols-2 gap-4">
        {question.answers.map((answer, index) => (
          <ListItem key={answer.id}>
            <Box
              bgColor={`${COLORS[index]}.600`}
              color={"white"}
              p={8}
              rounded={"lg"}
              fontSize={"xl"}
              fontWeight={"semibold"}
            >
              {answer.content}
            </Box>
          </ListItem>
        ))}
      </OrderedList>
      <Stack mt={8}>
        <Heading size={"sm"}>Looks who replied</Heading>
        <StudentAvatars studentIds={answeredStudentIds} />
      </Stack>
    </>
  );
}
