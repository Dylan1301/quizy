import { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  HStack,
  Heading,
  Text,
  useToast,
  Card,
  CardHeader,
  CardBody,
  VStack,
  Tooltip,
  Radio,
  RadioGroup,
  FormErrorMessage,
  ListItem,
  OrderedList,
  Circle,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { Plus, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";

const quizDetailFormSchema = z.object({
  title: z.string().min(2).max(50),
  description: z.string().min(2).max(200),
  questions: z.array(
    z.object({
      title: z.string().max(200),
      explanation: z.string().max(300),
      correctAnswerId: z.string().nullable(),
    })
  ),
  answers: z.array(
    z.object({
      questionKey: z.string(),
      text: z.string().max(100),
      isCorrect: z.boolean(),
    })
  ),
});

export default function CreateQuizPage() {
  const [loading, setLoading] = useState(false);
  const quizForm = useForm<z.infer<typeof quizDetailFormSchema>>({
    resolver: zodResolver(quizDetailFormSchema),
    defaultValues: {
      title: "Fundamental Programming with Python",
      description: "Questions on Python syntax, if-else, and for loop.",
      questions: [],
      answers: [],
    },
  });
  const toast = useToast();
  const navigate = useNavigate();

  const questionsField = useFieldArray({
    control: quizForm.control,
    name: "questions",
    keyName: "key",
  });

  const answersField = useFieldArray({
    control: quizForm.control,
    name: "answers",
  });

  function handleRemoveQuestion(index: number, questionKey: string) {
    questionsField.remove(index);
    const answerIndexes = quizForm
      .getValues("answers")
      .map((answer, index) => (answer.questionKey === questionKey ? index : -1))
      .filter((index) => index !== -1);
    answersField.remove(answerIndexes);
  }

  async function onSubmit(values: z.infer<typeof quizDetailFormSchema>) {
    setLoading(true);
    console.log(values);
    toast({ description: JSON.stringify(values) });

    // const request: CreateQuizRequest = {
    //   quiz: { title: values.title, description: values.description },
    //   questions: questionsField.fields.map((q) => ({
    //     question: { title: q.title, explanation: q.explanation, type: q.type },
    //     answers: values.answers
    //       .filter((a) => a.questionKey === q.key)
    //       .map((a) => ({
    //         text: a.text,
    //         isCorrect: a.isCorrect,
    //       })),
    //   })),
    // };

    // const { data: quiz } = await axios.post<
    //   CreateQuizRequest,
    //   AxiosResponse<CreateQuizResponse>
    // >("/quiz/api", request);

    // setLoading(false);
    // toast({
    //   title: `Created quiz "${quiz.title}"`,
    //   description: `Quiz with ${quiz.title} created successfully`,
    // });
  }
  return (
    <Box p={4}>
      <form onSubmit={quizForm.handleSubmit(onSubmit)} className="mb-4">
        <HStack justify="space-between">
          <Heading size="lg">Create Quiz</Heading>
          <Button
            isLoading={loading}
            loadingText="Saving"
            colorScheme="teal"
            type="submit"
          >
            Save Quiz
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
                    <RadioGroup>
                      <HStack gap={1} px={10}>
                        {answersField.fields.map(
                          (answer, answerIndex) =>
                            answer.questionKey === question.key && (
                              <HStack key={answer.id}>
                                <Radio
                                  {...quizForm.register(
                                    `questions.${index}.correctAnswerId`
                                  )}
                                  value={answer.id}
                                  title="Is correct answer?"
                                />
                                <Input
                                  placeholder="Answer Text"
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
                        {answersField.fields.length < 4 && (
                          <Button
                            onClick={() =>
                              answersField.append({
                                questionKey: question.key,
                                text: "",
                                isCorrect: false,
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
                    correctAnswerId: null,
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

// import GenerateQuestion, {
//   GenerateQuestionProps,
//   questionTypes,
// } from "../components/GenerateQuestion";
// import { GenerateQuestionResponse } from "@/app/question/api/generate/type";
// import { CreateQuizRequest, CreateQuizResponse } from "../api/type";
// import { QuestionType } from "@prisma/client";
// import { useToast } from "@/components/ui/use-toast";
// import { ToastAction } from "@/components/ui/toast";
// import { useRouter } from "next/navigation";
// import LoadingButton from "@/components/molecules/LoadingButton";

// export default function CreateQuizPage() {

//   return (
//     <main className="p-4">
//       <Form {...quizForm}>

//       </Form>

//       <GenerateQuestion
//         quizTitle={quizForm.watch("title")}
//         onGenerate={onGenerateQuestion}
//       />
//     </main>
//   );
// }

// Convert this component to using React, Chakra UI, and react-hook-form, just change JSX to appropriate Chakra UI components, keep all code logic
