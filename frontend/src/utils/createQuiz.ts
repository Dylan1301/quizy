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
      correctAnswerKey: z.string().optional(),
    })
  ),
  answers: z.array(
    z.object({
      clientKey: z.string().optional(),
      questionKey: z.string(),
      text: z.string().max(100),
    })
  ),
});

export type QuizDetailForm = z.infer<typeof quizDetailFormSchema>;

export function convertQuizDetailFormToApiModel(
  values: QuizDetailForm,
  questions: QuizDetailForm["questions"],
  answers: QuizDetailForm["answers"]
): QuizQuestionsCreate {
  return {
    tilte: values.title,
    description: values.description,
    questions: questions.map((q) => ({
      explaination: q.explanation,
      tilte: q.title,
      time_limit: q.timeLimit,
      type: "multiple_choice",
      answers: answers
        .filter((a) => a.questionKey === q.clientQuestionKey)
        .map((a) => ({
          content: a.text,
          is_correct: a.clientKey === q.correctAnswerKey,
        })),
    })),
  };
}
