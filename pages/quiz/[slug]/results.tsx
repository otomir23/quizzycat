import {GetServerSideProps, NextPage} from "next";
import {Layout} from "../../../components";
import {useEffect, useState} from "react";
import {QuizResults} from "../../../types";
import {useRouter} from "next/router";

const QuizResults: NextPage = () => {
    const [results, setResults] = useState<QuizResults | undefined>(undefined);
    const router = useRouter();

    useEffect(() => {
        if (!router || !router.query || !router.query.results) return;

        const {results} = router.query;
        const jsonString = Buffer.from(String(results), 'base64').toString('utf-8');
        const quizResults = JSON.parse(jsonString);
        setResults(quizResults);
    }, [router]);

    return (
        <Layout title={""}>
            <h1 className="text-3xl font-bold mb-8">Results</h1>
            {results && (
                <div>
                    <div>You got {results.score} out of {results.maxScore}</div>
                    <div>This is {results.score / results.maxScore * 100}%</div>

                    <div className="flex flex-col gap-4">
                    {results.answers.map((answer, i) => (
                        <div key={`Answers for ${answer.question}`} className="my-2 rounded-lg border-gray-200 border p-6">
                            <div className="text-xl font-bold">{results.quiz.questions[answer.question].question}</div>
                            {results.quiz.questions[answer.question].answers.map((a, j) => (
                                <div key={`${answer.question} ${a}`} className={`my-2 ${answer.your_answer.includes(j) ? 'font-bold' : ''}`}>
                                    {a.correct ? "✅" : "❌"} {a.answer}
                                </div>
                            ))}
                            {answer.your_answer.length === 0 && (
                                <div className="text-sm text-gray-800">You didn't answer this question</div>
                            )}
                        </div>
                    ))}
                    </div>
                </div>
            )}
        </Layout>
    );
}

export default QuizResults;