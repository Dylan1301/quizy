import { QuizQuestions } from "../api/model";
import { Heading, ListItem, OrderedList, Text } from "@chakra-ui/react";

export default function QuizQuestionsList({ quiz }: { quiz: QuizQuestions }) {
  return (
    <OrderedList spacing={6}>
      {quiz?.questions.map((question) => (
        <ListItem key={question.id}>
          <Heading as="h3" size="md">
            {question.tilte}
          </Heading>
          <OrderedList listStyleType={"lower-alpha"}>
            {question.answers.map((answer) => (
              <ListItem key={answer.id}>
                <Text>{answer.content}</Text>
              </ListItem>
            ))}
          </OrderedList>
        </ListItem>
      ))}
    </OrderedList>
  );
}
