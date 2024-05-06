import {
  Box,
  Heading,
  ListItem,
  OrderedList,
  Stack,
  Text,
  AvatarGroup,
  Avatar,
  Tooltip,
} from "@chakra-ui/react";
import { LoaderQuestionData } from "../api/model";
import { RoomStudent } from "../utils/types";
import { COLORS } from "../utils/constants";

export default function QuestionDetail({
  question,
  answeredStudents,
}: {
  question: LoaderQuestionData;
  answeredStudents: RoomStudent[];
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
        <AvatarGroup size="md" max={12} mx={"auto"}>
          {answeredStudents.length === 0 && (
            <Text color={"gray.500"}>No one answered yet</Text>
          )}
          {answeredStudents.map((stu) => (
            <Avatar
              bg={"gray.100"}
              icon={
                <Tooltip label={stu.name} key={stu.id}>
                  <Text fontSize={"x-large"} cursor={"default"}>
                    {stu.icon || "🍀"}
                  </Text>
                </Tooltip>
              }
            />
          ))}
        </AvatarGroup>
      </Stack>
    </>
  );
}
