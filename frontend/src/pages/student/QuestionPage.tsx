import { useState } from "react";
import { Box, Button, Progress, Text, VStack } from "@chakra-ui/react";

const QuestionPage = () => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerLocked, setAnswerLocked] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setAnswerLocked(true);
  };

  return (
    <Box p={4} width="33%" mx="auto">
      <Progress value={25} mb={4} />

      <VStack spacing={4} align="stretch">
        <Text style={{ fontSize: "1.5em" }}>
          <strong>Question 1: What is the capital of France?</strong>
        </Text>
        <Button
          w="100%"
          h="24"
          p="5"
          borderRadius="3xl"
          borderWidth="4px"
          borderColor={selectedAnswer === 0 ? "blue.500" : "blue.500"}
          bg={selectedAnswer === 0 ? "blue.500" : "transparent"}
          color={selectedAnswer === 0 ? "white" : "blue.500"}
          fontSize="2xl"
          fontWeight="extrabold"
          fontFamily="Public Sans"
          _hover={{
            bg: selectedAnswer === 0 ? "blue.500" : "blue.500",
            color: "white",
          }}
          onClick={() => handleAnswerSelect(0)}
          disabled={answerLocked}
        >
          Deoxyribonucleic Acid
        </Button>
        <Button
          w="100%"
          h="24"
          p="5"
          borderRadius="3xl"
          borderWidth="4px"
          borderColor={selectedAnswer === 1 ? "red.500" : "red.500"}
          bg={selectedAnswer === 1 ? "red.500" : "transparent"}
          color={selectedAnswer === 1 ? "white" : "red.500"}
          fontSize="2xl"
          fontWeight="extrabold"
          fontFamily="Public Sans"
          _hover={{
            bg: selectedAnswer === 1 ? "red.500" : "red.500",
            color: "white",
          }}
          onClick={() => handleAnswerSelect(1)}
          disabled={answerLocked}
        >
          Dehydrogenated Acid
        </Button>
        <Button
          w="100%"
          h="24"
          p="5"
          borderRadius="3xl"
          borderWidth="4px"
          borderColor={selectedAnswer === 2 ? "yellow.500" : "yellow.500"}
          bg={selectedAnswer === 2 ? "yellow.500" : "transparent"}
          color={selectedAnswer === 2 ? "white" : "yellow.500"}
          fontSize="2xl"
          fontWeight="extrabold"
          fontFamily="Public Sans"
          _hover={{
            bg: selectedAnswer === 2 ? "yellow.500" : "yellow.500",
            color: "white",
          }}
          onClick={() => handleAnswerSelect(2)}
          disabled={answerLocked}
        >
          Dinitroamylose
        </Button>
        <Button
          w="100%"
          h="24"
          p="5"
          borderRadius="3xl"
          borderWidth="4px"
          borderColor={selectedAnswer === 3 ? "green.500" : "green.500"}
          bg={selectedAnswer === 3 ? "green.500" : "transparent"}
          color={selectedAnswer === 3 ? "white" : "green.500"}
          fontSize="2xl"
          fontWeight="extrabold"
          fontFamily="Public Sans"
          _hover={{
            bg: selectedAnswer === 3 ? "green.500" : "green.500",
            color: "white",
          }}
          onClick={() => handleAnswerSelect(3)}
          disabled={answerLocked}
        >
          Denaturedamylase
        </Button>
      </VStack>

      {answerLocked && (
        <Text mt={4} color="black" textAlign="center">
          <strong>Answer locked in</strong>
        </Text>
      )}
    </Box>
  );
};

export default QuestionPage;
