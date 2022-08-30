import {Quiz} from "../../../types";
import type { NextApiRequest, NextApiResponse } from 'next'
import {getQuiz, hideAnswersFromQuiz} from "../../../utils/quizzes";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Quiz>
) {
    const quiz = await getQuiz((req.query.slug || "") as string);
    if (!quiz) {
        res.status(404)
        res.end()
        return
    }

    res.status(200).json(hideAnswersFromQuiz(quiz));
}
