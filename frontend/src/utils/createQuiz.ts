import * as z from "zod";
import { QuizQuestionsCreate } from "../api/model";

export const quizDetailFormSchema = z.object({
  title: z.string().min(2).max(50),
  description: z.string().min(2).max(200),
  questions: z.array(
    z.object({
      clientQuestionKey: z.string().optional(),
      title: z.string().max(200),
      explanation: z.string().max(300),
      timeLimit: z.number().max(60),
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

export interface QuizDetailFormSimplified {
  title: string;
  description: string;
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

export type QuizDetailForm = z.infer<typeof quizDetailFormSchema>;

export function convertQuizDetailFormToApiModel(
  values: QuizDetailForm
): QuizQuestionsCreate {
  console.log(values.answers);
  
  return {
    tilte: values.title,
    description: values.description,
    questions: values.questions.map((q) => ({
      explaination: q.explanation,
      tilte: q.title,
      time_limit: q.timeLimit,
      type: "multiple_choice",
      answers: values.answers
        .filter((a) => a.questionKey === q.clientQuestionKey)
        .map((a) => ({
          content: a.text,
          is_correct: a.isCorrect,
        })),
    })),
  };
}
