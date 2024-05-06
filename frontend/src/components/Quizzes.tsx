import { Text, Heading, Link } from "@chakra-ui/react";
import { useGetAllQuizQuizzesGet } from "../api/quiz/quiz";
import { Link as RouterLink, useParams } from "react-router-dom";

export default function Quizzes() {
  const quizId = parseInt(useParams().quizId || "");
  const { data: response } = useGetAllQuizQuizzesGet();
  const quizzes = response?.data.data;

  return quizzes?.map((quiz) => (
    <Link
      as={RouterLink}
      to={`/quiz/${quiz.id}`}
      key={quiz.id}
      p="3"
      borderWidth="1px"
      borderRadius="md"
      bg={quizId === quiz.id ? "blue.50" : "white"}
      borderColor={quizId === quiz.id ? "blue.200" : "gray.200"}
      _hover={{ textDecoration: "none", bg: "gray.50" }}
    >
      <Heading size={"sm"}>{quiz.tilte}</Heading>
      <Text fontSize="sm" color="gray.600">
        {quiz.description}
      </Text>
    </Link>
  ));
}
