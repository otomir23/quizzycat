export type Quiz = {
    id: number;
    title: string;
    description: string;
    slug: string;
    public: boolean;
    questions: {
        question: string;
        multiple_choice: boolean;
        answers: {
            answer: string;
            correct?: boolean;
        }[];
    }[];
}

export type QuizResults = {
    quiz: Quiz;
    score: number;
    maxScore: number;
    answers: {
        question: number;
        answer: number[];
        your_answer: number[];
    }[];
}
