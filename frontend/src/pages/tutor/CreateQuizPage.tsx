import { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  HStack,
  Heading,
  Text,
  useToast,
  VStack,
  Radio,
  RadioGroup,
  ListItem,
  OrderedList,
  Circle,
  Alert,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { Plus, Trash, Wand2 } from "lucide-react";
import {
  createQuizQuestionsApiQuizVer2Post,
  useGetAllQuizQuizzesGet,
} from "../../api/quiz/quiz";
import { useNavigate } from "react-router-dom";
import {
  QuizDetailForm,
  convertQuizDetailFormToApiModel,
  quizDetailFormSchema,
} from "../../utils/createQuiz";
import {
  GenerateQuestionResponse,
  generateQuestions,
} from "../../utils/openai";

export default function CreateQuizPage() {
  const navigate = useNavigate();
  const { mutate } = useGetAllQuizQuizzesGet();
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [willSetCorrectKey, setWillSetCorrectKey] = useState(false);
  const [generatedAnswersPayload, setGeneratedAnswersPayload] = useState<{
    previousQuestionKeys: string[];
    generatedQuestions: GenerateQuestionResponse;
  } | null>(null);
  const quizForm = useForm<QuizDetailForm>({
    resolver: zodResolver(quizDetailFormSchema),
    defaultValues: {
      // title: "",
      // description: "",
      title: "Introduction to Data Science",
      description:
        "Questions on Python syntax, pandas functions, dataframe, numpy.",
      questions: [],
      answers: [],
    },
  });
  const toast = useToast();

  const questionsField = useFieldArray({
    control: quizForm.control,
    name: "questions",
    keyName: "key",
  });

  const answersField = useFieldArray({
    control: quizForm.control,
    name: "answers",
    keyName: "clientKey",
  });

  // This will run twice because of getting generated keys from useFromArray. First for adding answers, second for setting question correct answer key.
  useEffect(() => {
    if (!generatedAnswersPayload) return;
    const { generatedQuestions, previousQuestionKeys } =
      generatedAnswersPayload;
    const newQuestionFields = questionsField.fields.filter(
      (q) => !previousQuestionKeys.includes(q.key)
    );

    if (willSetCorrectKey) {
      for (let i = 0; i < generatedQuestions.answers.length; i++) {
        const answer = generatedQuestions.answers[i];
        if (!answer.isCorrect) continue;
        const questionIndex = generatedQuestions.questions.findIndex(
          (q) => q.clientQuestionKey === answer.questionKey
        );

        if (questionIndex === -1) continue;

        questionsField.fields[questionIndex].correctAnswerKey =
          answersField.fields[i].clientKey;
      }
      setWillSetCorrectKey(false);
      setGeneratedAnswersPayload(null);
      return;
    }

    for (const question of generatedQuestions.questions) {
      const questionField = newQuestionFields.find(
        (q) => q.title === question.title
      );
      if (!questionField) continue;

      answersField.append(
        generatedQuestions.answers
          .filter((a) => a.questionKey === question.clientQuestionKey)
          .map((a) => ({
            ...a,
            questionKey: questionField.key,
          })),
        { shouldFocus: false }
      );
    }
    setWillSetCorrectKey(true);
  }, [
    answersField,
    generatedAnswersPayload,
    questionsField.fields,
    willSetCorrectKey,
    setWillSetCorrectKey,
    questionsField,
  ]);

  function handleRemoveQuestion(index: number, questionKey: string) {
    questionsField.remove(index);
    const answerIndexes = quizForm
      .getValues("answers")
      .map((answer, index) => (answer.questionKey === questionKey ? index : -1))
      .filter((index) => index !== -1);
    answersField.remove(answerIndexes);
  }

  async function onClickGenerate() {
    const values = quizForm.getValues();
    setGenerating(true);
    const response = await generateQuestions({
      title: values.title,
      description: values.description,
    });
    if (response) {
      if (!response.questions) return;

      questionsField.append(response.questions);
      setGeneratedAnswersPayload({
        generatedQuestions: response,
        previousQuestionKeys: questionsField.fields.map((f) => f.key),
      });
    }
    setGenerating(false);
  }

  async function onSubmit(values: QuizDetailForm) {
    setLoading(true);
    const questions: QuizDetailForm["questions"] = questionsField.fields.map(
      (q) => ({
        ...q,
        clientQuestionKey: q.key,
      })
    );
    const answers: QuizDetailForm["answers"] = answersField.fields;

    const { data: quiz } = await createQuizQuestionsApiQuizVer2Post(
      convertQuizDetailFormToApiModel(values, questions, answers)
    );

    await mutate();
    setLoading(false);
    toast({
      title: `Your quiz has been created!`,
      description: `Quiz "${quiz.tilte}" created successfully.`,
    });
    navigate(`/quiz/${quiz.id}`);
  }
  return (
    <Box p={4}>
      <form onSubmit={quizForm.handleSubmit(onSubmit)} className="mb-4">
        <HStack justify="space-between">
          <Heading size="lg">Create Quiz</Heading>

          <Button
            isLoading={loading}
            loadingText="Saving"
            colorScheme="blue"
            type="submit"
            disabled={questionsField.fields.length === 0}
          >
            Create
          </Button>
        </HStack>

        <VStack gap={2}>
          <FormControl id="title">
            <FormLabel>Title</FormLabel>
            <Input {...quizForm.register("title")} />
          </FormControl>

          <FormControl id="description">
            <FormLabel>Description</FormLabel>
            <Input {...quizForm.register("description")} />
          </FormControl>

          {questionsField.fields.length === 0 && (
            <Alert
              status="info"
              rounded={"lg"}
              mt={4}
              w={"fit-content"}
              alignSelf={"flex-start"}
              gap={2}
            >
              <Text maxW={"30rem"}>
                By typing the title and description, try generate 10 questions
                using OpenAI now instead of manually adding them.
              </Text>
              <Button
                type="button"
                onClick={onClickGenerate}
                gap={1}
                isLoading={generating}
                flexShrink={0}
                className="!bg-gradient-to-br !text-white !from-pink-500 !to-indigo-600 hover:!from-pink-600 hover:!to-indigo-700 hover:shadow-2xl hover:-translate-y-1"
              >
                <Wand2 />
                Generate Questions
              </Button>
            </Alert>
          )}

          <VStack w={"100%"} alignItems={"start"} mt={4} gap={0}>
            <Heading size="md">Questions</Heading>
            <Text as={"p"}>Enter the details of the questions.</Text>
            <OrderedList className="!ml-0 w-full gap-4">
              {/* Dynamic Form Array for Questions and Answers */}
              {questionsField.fields.map((question, index) => (
                <ListItem
                  key={question.key}
                  py={4}
                  className="flex items-start gap-6 pb-4 border-b border-dashed border-gray-200"
                >
                  <Box w={"100%"}>
                    <HStack mb={2} alignItems={"flex-end"}>
                      <Circle
                        size={8}
                        border={1}
                        borderColor={"GrayText"}
                        borderStyle={"solid"}
                        mb={1}
                      >
                        <Heading as="h3" size="sm" fontWeight={600}>
                          {index + 1}
                        </Heading>
                      </Circle>
                      <FormControl>
                        <Text
                          as={"label"}
                          fontSize="sm"
                          fontWeight={500}
                          htmlFor={`questions.${index}.title`}
                        >
                          Question Text
                        </Text>
                        <Input
                          placeholder="Question Text"
                          {...quizForm.register(`questions.${index}.title`)}
                          id={`questions.${index}.title`}
                        />
                      </FormControl>
                      <FormControl>
                        <Text
                          as={"label"}
                          fontSize="sm"
                          fontWeight={500}
                          htmlFor={`questions.${index}.explanation`}
                        >
                          Explanation (optional)
                        </Text>
                        <Input
                          placeholder="Answer explanation: why the answer is 'ABC'?"
                          {...quizForm.register(
                            `questions.${index}.explanation`
                          )}
                          id={`questions.${index}.explanation`}
                          flexGrow={1}
                        />
                      </FormControl>
                      <FormControl w="20rem">
                        <Text
                          as={"label"}
                          fontSize="sm"
                          fontWeight={500}
                          htmlFor={`questions.${index}.timeLimit`}
                        >
                          Time limit
                        </Text>
                        <Input
                          type="number"
                          placeholder="Time in secs"
                          {...quizForm.register(
                            `questions.${index}.timeLimit`,
                            { valueAsNumber: true }
                          )}
                          id={`questions.${index}.timeLimit`}
                        />
                      </FormControl>
                      <Button
                        size={"icon"}
                        type="button"
                        colorScheme="red"
                        variant="outline"
                        p={1}
                        mb={1}
                        onClick={() =>
                          handleRemoveQuestion(index, question.key)
                        }
                      >
                        <Trash />
                      </Button>
                    </HStack>
                    {/* Dynamic Form Array for Answers */}
                    <RadioGroup
                      value={question.correctAnswerKey}
                      onChange={(event) => {
                        quizForm.setValue(
                          `questions.${index}.correctAnswerKey`,
                          event
                        );
                      }}
                    >
                      <HStack gap={2} px={10}>
                        {answersField.fields.map(
                          (answer, answerIndex) =>
                            answer.questionKey === question.key && (
                              <HStack key={answer.clientKey}>
                                <Radio
                                  value={answer.clientKey}
                                  title="Is correct answer?"
                                />
                                <Input
                                  placeholder={`Answer text`}
                                  size="sm"
                                  rounded={"md"}
                                  {...quizForm.register(
                                    `answers.${answerIndex}.text`
                                  )}
                                />
                              </HStack>
                            )
                        )}

                        {/* Add Answer Button */}
                        {answersField.fields.filter(
                          (a) => a.questionKey === question.key
                        ).length < 4 && (
                          <Button
                            onClick={() =>
                              answersField.append({
                                questionKey: question.key,
                                text: "",
                              })
                            }
                            variant={"secondary"}
                            size={"sm"}
                            className="gap-1"
                            type="button"
                          >
                            <Plus size={20} /> Add Answer
                          </Button>
                        )}
                      </HStack>
                    </RadioGroup>
                  </Box>
                </ListItem>
              ))}

              {/* Add Question Button */}
              <Button
                type="button"
                onClick={() =>
                  questionsField.append({
                    title: "",
                    explanation: "",
                    timeLimit: 30,
                  })
                }
                className="mt-6 w-fit gap-1"
              >
                <Plus /> Add Question
              </Button>
            </OrderedList>
          </VStack>
        </VStack>
      </form>
    </Box>
  );
}
