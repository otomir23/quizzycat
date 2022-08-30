import type {NextPage} from 'next'
import {Layout} from "../components";
import Link from "next/link";
import {Quiz} from "../types";
import {useEffect, useState} from "react";

const Home: NextPage = () => {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    useEffect(() => {
        fetch('/api/quizzes')
            .then(res => res.json())
            .then(data => setQuizzes(data));
    }, []);

    return (
        <Layout title="Dashboard">
            {
                quizzes.map(quiz => (
                    <div key={quiz.id} className="flex flex-col justify-center items-center w-full h-full">
                        <Link href={`/quiz/${quiz.slug}`}>
                            <a>{quiz.title}</a>
                        </Link>
                    </div>
                ))
            }
        </Layout>
    )
}

export default Home
