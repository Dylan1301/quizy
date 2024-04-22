import { Button, Flex, Text } from "@chakra-ui/react";
import { useGetAllQuizQuizzesGet } from "../../api/quiz/quiz";
import { Link as RouterLink } from "react-router-dom";

export default function QuizzesPage() {
  const { data: response } = useGetAllQuizQuizzesGet();
  const quizzes = response?.data.data;

  return (
    <Flex direction="column" gap={4}>
      {quizzes?.map((quiz) => (
        <Flex
          key={quiz.id}
          p="4"
          borderWidth="1px"
          borderRadius="md"
          boxShadow="md"
          justifyContent="space-between"
        >
          <Text>{quiz.tilte}</Text>
          <Button as={RouterLink} to={`/quiz/${quiz.id}/statistic`}>
            View
          </Button>
        </Flex>
      ))}
    </Flex>
  );
}
