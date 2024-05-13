import { ZodArray, ZodRawShape, ZodType, z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "langchain/schema";

export type GenerateQuestionRequest = {
  title: string;
  description: string;
};

export interface GenerateQuestionResponse {
  questions: {
    clientQuestionKey: string;
    title: string;
    explanation: string;
    timeLimit: number;
  }[];
  answers: {
    questionKey: string;
    text: string;
    isCorrect: boolean;
  }[];
}

interface ExpectedReturnSchema extends ZodRawShape {
  questions: ZodArray<ZodType<GenerateQuestionResponse["questions"][number]>>;
  answers: ZodArray<ZodType<GenerateQuestionResponse["answers"][number]>>;
}

const expectedReturnSchema = z.object<ExpectedReturnSchema>({
  questions: z.array(
    z.object({
      clientQuestionKey: z.string(),
      title: z.string().describe("The question content"),
      explanation: z.string(),
      timeLimit: z.number(),
    })
  ),
  answers: z.array(
    z.object({
      questionKey: z.string(),
      text: z.string(),
      isCorrect: z.boolean(),
    })
  ),
});

export const openaiExtractionFunctionSchema = {
  name: "extractor",
  description: "Extracts fields from the input.",
  parameters: zodToJsonSchema(expectedReturnSchema),
};

const slicedKey = "p1ZwntCRT3BlbkFJAqfALfI1qQSxR9SLJP1U";
const model = new ChatOpenAI({
  apiKey: `sk-proj-SQbBdlaiOYj8${slicedKey}`,
  modelName: "gpt-3.5-turbo",
}).bind({
  functions: [openaiExtractionFunctionSchema],
  function_call: { name: "extractor" },
});

export async function generateQuestions(info: GenerateQuestionRequest) {
  const prompt = `Create a quiz includes 5 multiple-choices single-answer questions with 4 answers for each (not prefix ABCD) with the following title and description:
  Title: ${info.title}
  Description: ${info.description}
`;
  const { additional_kwargs } = await model.invoke([new HumanMessage(prompt)]);
  const extractionReturns = additional_kwargs.function_call
    ? (JSON.parse(
        additional_kwargs.function_call.arguments
      ) as GenerateQuestionResponse)
    : null;
  return extractionReturns;
}
