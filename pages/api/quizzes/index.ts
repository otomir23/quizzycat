import {Quiz} from "../../../types";
import type { NextApiRequest, NextApiResponse } from 'next'
import {getQuizzes, hideAnswersFromQuizzes} from "../../../utils/quizzes";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Quiz[]>
) {
    res.status(200).json(hideAnswersFromQuizzes((await getQuizzes()).filter(quiz => quiz.public)));
}
