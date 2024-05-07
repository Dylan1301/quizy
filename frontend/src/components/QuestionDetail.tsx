import { Box, ListItem, OrderedList, ListProps } from "@chakra-ui/react";
import { LoaderQuestionData } from "../api/model";
import { COLORS } from "../utils/constants";

export default function QuestionDetail({
  question,
  ...props
}: ListProps & {
  question: LoaderQuestionData;
}) {
  return (
    <OrderedList
      ml={0}
      listStyleType={"none"}
      display={"grid"}
      gap={2}
      className="grid-cols-2"
      {...props}
    >
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
  );
}
