import { useParams } from "react-router-dom";
import { useGetQuizQuestionsQuizQuizIdGet } from "../../api/quiz/quiz";
import { Box, Heading, ListItem, OrderedList, Text } from "@chakra-ui/react";

export default function TutorQuizDetailPage() {
  const { quizId } = useParams();
  const { data: response } = useGetQuizQuestionsQuizQuizIdGet(
    parseInt(quizId || "0")
  );
  const quiz = response?.data;
  if (!quizId) return <div>Invalid quiz id</div>;

  return (
    <Box>
      <Heading>{quiz?.tilte}</Heading>
      <Text mb={4}>{quiz?.description}</Text>
      <OrderedList>
        {quiz?.questions.map((question) => (
          <ListItem key={question.id}>
            <Heading as="h3" size="md">
              {question.tilte}
            </Heading>
            <Text>{question.tilte}</Text>
            {question.answers.map((answer) => (
              <Box key={answer.id}>
                <Text>{answer.content}</Text>
              </Box>
            ))}
          </ListItem>
        ))}
      </OrderedList>
    </Box>
  );
}
