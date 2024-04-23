import { Button, Flex, Text, Heading, IconButton } from "@chakra-ui/react";
import { useGetAllQuizQuizzesGet } from "../../api/quiz/quiz";
import { Link as RouterLink } from "react-router-dom";
import { Edit, Trash2 } from "lucide-react";

export default function QuizzesPage() {
  const { data: response } = useGetAllQuizQuizzesGet();
  const quizzes = response?.data.data;

  return (
    <>
      <header className="mb-8 relative">
        <Heading>Quizzes</Heading>
        <Text>Here are all the quizzes you have created</Text>

        <Button
          as={RouterLink}
          to="/quiz/create"
          colorScheme="blue"
          pos={"absolute"}
          right={0}
          top={4}
        >
          Create Quiz
        </Button>
      </header>

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
                as={RouterLink}
                variant={"outline"}
                to={`/quiz/${quiz.id}/edit`}
                aria-label="Edit"
              >
                <Edit />
              </IconButton>
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
    </>
  );
}
