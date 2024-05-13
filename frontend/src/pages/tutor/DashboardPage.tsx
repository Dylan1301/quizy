import {
  Button,
  Flex,
  Text,
  Heading,
  IconButton,
  Stack,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { useReadTeacherMeInfoGet } from "../../api/user/user";
import { useGetAllQuizQuizzesGet } from "../../api/quiz/quiz";

export default function DashboardPage() {
  const { data } = useReadTeacherMeInfoGet();
  const { data: response } = useGetAllQuizQuizzesGet();
  const quizzes = response?.data.data;

  return (
    <Stack>
      <Heading>Welcome back, {data?.data.name}</Heading>
      {quizzes?.length === 0 ? (
        <Text>You have not created any quizzes yet</Text>
      ) : (
        <Text mb={4}>Here are all the quizzes you have created</Text>
      )}

      <Flex direction="column" gap={4}>
        {quizzes?.map((quiz) => (
          <Flex
            key={quiz.id}
            p="4"
            borderWidth="1px"
            borderRadius="md"
            justifyContent="space-between"
          >
            <div>
              <Heading size={"md"}>{quiz.tilte}</Heading>
              <Text color="gray.600">{quiz.description}</Text>
            </div>

            <Flex gap={2}>
              <Button as={RouterLink} to={`/quiz/${quiz.id}`}>
                View
              </Button>
              <IconButton
                colorScheme="red"
                variant="outline"
                aria-label="Delete"
              >
                <Trash2 />
              </IconButton>
            </Flex>
          </Flex>
        ))}
      </Flex>
    </Stack>
  );
}
