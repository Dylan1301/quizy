import { Info } from "lucide-react";
import { RoomWithQuiz } from "../api/model";
import { FirebaseRoomInfo } from "../utils/types";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Tooltip,
  Heading,
  Avatar,
  Text,
  Stack,
} from "@chakra-ui/react";
import QuizQuestionsList from "./QuizQuestionsList";

export default function QuizStatistic({
  room: { quiz },
  roomFromFirebase,
}: {
  room: RoomWithQuiz;
  roomFromFirebase: FirebaseRoomInfo;
}) {
  const totalAnswersEach = Object.keys(roomFromFirebase.students).length;
  const correctCounts = roomFromFirebase.questionOrder.map((questionId) => {
    const question = roomFromFirebase.questions[questionId];
    const correctStudentIds = Object.entries(question.answers).find(
      ([id]) => parseInt(id) === question.correctedAnswerId
    )?.[1].studentIds;

    return {
      questionId,
      correctStudentIds,
      totalCorrect: correctStudentIds?.length,
    };
  });
  const overallCorrectness =
    Math.round(
      (correctCounts.reduce((cur, pre) => cur + (pre.totalCorrect || 0), 0) /
        (totalAnswersEach * roomFromFirebase.questionOrder.length)) *
        10000
    ) / 100;
  const studentRanking = Object.entries(roomFromFirebase.students)
    .map(([id, student]) => {
      const totalCorrect = correctCounts
        .map(
          ({ correctStudentIds }) =>
            correctStudentIds?.includes(parseInt(id) || 0) || false
        )
        .filter(Boolean).length;
      return {
        ...student,
        id,
        icon: student.icon,
        name: student.name,
        correctness:
          Math.round(
            (totalCorrect / roomFromFirebase.questionOrder.length) * 10000
          ) / 100,
      };
    })
    .sort((a, b) => b.correctness - a.correctness);

  return (
    <Stack p={4} pt={8}>
      <Heading mb={8} textAlign={"center"}>
        Quiz Statistic
      </Heading>

      {/* Ranking table */}
      <TableContainer mb={8}>
        <Heading size={"lg"}>Leaderboard</Heading>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Rank</Th>
              <Th>Name</Th>
              <Th isNumeric>
                Correctness{" "}
                <Tooltip label={"Total correct / total answer"}>
                  <Info size={16} className="inline-block mb-1" />
                </Tooltip>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {studentRanking.map((rank, index) => (
              <Tr
                key={rank.id}
                bgColor={`green.${index < 5 ? 5 - index : 0}00`}
              >
                <Td>{index + 1}</Td>
                <Td>
                  <Avatar
                    size={"sm"}
                    bg={"gray.100"}
                    icon={
                      <Text fontSize={"x-large"} cursor={"default"}>
                        {rank.icon || "🍀"}
                      </Text>
                    }
                  />
                  <strong className="mt-1.5 ml-2 inline-block">
                    {rank.name}
                  </strong>
                </Td>
                <Td isNumeric>{rank.correctness}%</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      {/* Question stats */}

      <Heading size={"lg"} mb={2}>
        Stats
      </Heading>
      <StatGroup
        borderWidth={1}
        rounded={"xl"}
        borderColor={"gray.400"}
        p={4}
        mb={4}
      >
        <Stat>
          <StatLabel>Students</StatLabel>
          <StatNumber>
            {Object.keys(roomFromFirebase.students).length}
          </StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Questions</StatLabel>
          <StatNumber>{roomFromFirebase.questionOrder.length}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Correctness</StatLabel>
          <StatNumber>{overallCorrectness}%</StatNumber>
        </Stat>
      </StatGroup>
      {/* Question list for reviews answers */}
      <Heading size={"lg"} mb={2}>
        Question List
      </Heading>
      <QuizQuestionsList quiz={quiz} />
    </Stack>
  );
}
