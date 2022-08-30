import type {NextApiRequest, NextApiResponse} from 'next'
import {getQuizById} from "../../../utils/quizzes";
import {QuizResults} from "../../../types";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<QuizResults>
) {
    const quiz = await getQuizById(req.body.id as number);
    if (!quiz) {
        res.status(404)
        res.end()
        return
    }
    const answers = req.body.answers as {
        question: number,
        answer: number | number[]
    }[];

    let score = 0;
    let maxScore = 0;
    quiz.questions.forEach((question, questionIndex) => {
        const questionMaxScore = question.answers.filter(answer => answer.correct).length;
        maxScore += questionMaxScore;
        const userAnswer = answers.find(answer => answer.question === questionIndex)?.answer
        if (userAnswer !== undefined) {
            if (Array.isArray(userAnswer)) {
                score += userAnswer.filter(answer => question.answers[answer].correct).length;
            } else {
                score += question.answers[userAnswer].correct ? maxScore : 0;
            }
        }
    });

    res.status(200).json({
        quiz,
        score,
        maxScore,
        answers: quiz.questions.map((question, id) => {
            const userAnswer = answers.find(answer => answer.question === id)?.answer;
            return {
                question: id,
                answer: question.answers.map((a, i) => ({
                    answer: i,
                    correct: a.correct,
                })).filter(({correct}) => correct).map(({answer}) => answer),
                your_answer: userAnswer !== undefined ? Array.isArray(userAnswer) ? userAnswer : [userAnswer] : [],
            }
        }),
    });
}
