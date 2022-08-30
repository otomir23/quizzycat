import {Quiz} from "../types";
import {SupabaseClient} from "@supabase/supabase-js";

const serverSupabaseClient = new SupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SECRET || ""
);

export async function getQuizzes(): Promise<Quiz[]> {
    return (await serverSupabaseClient
            .from("quizzes")
            .select('*, questions (*, answers (*))'))?.data || [];
}

export async function getQuiz(slug: string): Promise<Quiz | undefined> {
    return (await getQuizzes()).find(quiz => quiz.slug === slug);
}

export async function getQuizById(id: number): Promise<Quiz | undefined> {
    return (await getQuizzes()).find(quiz => quiz.id === id);
}

export function hideAnswersFromQuiz(quiz: Quiz): Quiz {
    return {
        ...quiz,
        questions: quiz.questions.map(question => ({
            ...question,
            answers: question.answers.map(answer => ({
                ...answer,
                correct: undefined
            }))
        }))
    };
}

export function hideAnswersFromQuizzes(quizzes: Quiz[]): Quiz[] {
    return quizzes.map(hideAnswersFromQuiz);
}