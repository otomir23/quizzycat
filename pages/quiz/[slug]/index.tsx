import {Layout} from "../../../components";
import {NextPage} from "next";
import {useEffect, useState} from "react";
import {Quiz, QuizResults} from "../../../types";
import {useRouter} from "next/router";

const Question = (props: {
                      question: string,
                      answers: string[],
                      onAnswer: (answer: number | number[]) => void,
                      onNext: () => void,
                      isMultipleChoice: boolean,
                      savedAnswer: number | number[] | undefined,
                  }
) => {
    const {
        question,
        answers,
        onAnswer,
        onNext,
        isMultipleChoice,
        savedAnswer
    } = props;

    const [selected, setSelected] = useState<number | number[] | undefined>(savedAnswer);
    useEffect(() => {
        if (isMultipleChoice) {
            setSelected(Array.isArray(savedAnswer) ? savedAnswer : []);
        } else {
            setSelected(isNaN(Number(savedAnswer)) ? undefined : Number(savedAnswer));
        }
    }, [props]);
    useEffect(() => {
        if (selected !== undefined) {
            onAnswer(selected);
        }
    }, [selected]);

    return (
        <div className="flex flex-col">
            <div className="text-xl font-bold">{question}</div>
            <div className="flex flex-col">
                {answers.map((answer, i) => (
                    <div key={`${question} ${answer}`} className="my-2">
                        <label className="flex items-center">
                            <input type="checkbox" onChange={() => {
                                if (isMultipleChoice) {
                                    const s = selected as number[];
                                    if (s.includes(i)) {
                                        setSelected(s.filter(a => a !== i));
                                    } else {
                                        setSelected([...s, i]);
                                    }
                                } else {
                                    setSelected(i);
                                }
                            }} checked={Array.isArray(selected) ? selected.includes(i) : selected === i}/>
                            <span className="ml-2">{answer}</span>
                        </label>
                    </div>
                ))}
                <button className="my-2 disabled:text-gray-400" onClick={onNext}>
                    Next
                </button>
            </div>
        </div>
    )
}

const Selection = (
    {
        text,
        onSelect,
        type = "todo"
    }: {
        text: string,
        onSelect: () => void,
        type: 'todo' | 'done' | 'selected'
    }
) => {
    const styles = {
        todo: "border-gray-600 hover:bg-gray-600 hover:text-white",
        done: "border-green-600 bg-green-600 text-white",
        selected: "border-sky-600 bg-sky-600 text-white"
    }
    return (
        <div
            className={`flex flex-col justify-center items-center w-8 h-8 rounded border border-solid cursor-pointer aspect-square rounded-full transition-colors ${styles[type]}`}
            onClick={onSelect}>
            {text}
        </div>
    )
}

const Quiz: NextPage = () => {
    const router = useRouter();
    const [currentQuestion, setCurrentQuestion] = useState(-1);
    const [answers, setAnswers] = useState<{
        question: number,
        answer: number | number[]
    }[]>([]);
    const [quiz, setQuiz] = useState<Quiz>();


    useEffect(() => {
        if (!router || !router.query || !router.query.slug) return;

        const {slug} = router.query as { slug: string };
        fetch(`/api/quizzes/${slug}`)
            .then(res => {
                if (res.status === 200) {
                    return res.json()
                } else {
                    router.push("/404");
                    return null;
                }
            })
            .then(data => setQuiz(data));
    }, [router]);

    return (
        <Layout title={quiz?.title || "Loading quiz"}>
            <div className="w-96 rounded-lg border-gray-200 border p-6">
                {quiz ? (
                    <>
                        <div className="flex flex-row items-center gap-2 mb-4">
                            {
                                [...Array(quiz.questions.length + 2)].map((_, i) => {
                                    const name = i === 0 ? "📃" : i === quiz.questions.length + 1 ? "🏁" : `${i}`;
                                    const questionIndex = i - 1;
                                    const isSelected = questionIndex === currentQuestion;
                                    const isDone = answers.some(a => a.question === questionIndex);
                                    return (
                                        <Selection type={isSelected ? "selected" : isDone ? "done" : "todo"}
                                                   key={"Select q" + questionIndex}
                                                   text={name} onSelect={() => setCurrentQuestion(questionIndex)}/>
                                    )
                                })
                            }
                        </div>

                        {currentQuestion === -1 ? (
                            <>
                                <h1 className="text-xl font-bold">{quiz.title}</h1>
                                <p className="text-sm text-gray-800">{quiz.description}</p>
                                <button className="my-2" onClick={() => setCurrentQuestion(0)}>
                                    🚀 Start
                                </button>
                            </>
                        ) : (
                            currentQuestion >= quiz.questions.length ? (
                                <>
                                    <div className="text-2xl font-bold my-2">Are you ready to submit?</div>
                                    <div className="flex flex-col gap-2">
                                        <button className="w-fit"
                                                onClick={() => {
                                                    fetch('/api/quizzes/submit', {
                                                        method: 'POST',
                                                        headers: {
                                                            'Content-Type': 'application/json'
                                                        },
                                                        body: JSON.stringify({
                                                            id: quiz.id,
                                                            answers
                                                        })
                                                    }).then(res => {
                                                        if (res.status === 200) {
                                                            res.json().then((results: QuizResults) => {
                                                                router.push(`/quiz/${quiz.slug}/results?results=${Buffer.from(encodeURIComponent(JSON.stringify(results))).toString('base64')}`);
                                                            })
                                                        }
                                                    })
                                                }}>
                                            ✅ Submit
                                        </button>
                                        <button className="w-fit" onClick={() => setCurrentQuestion(0)}>
                                            🤔 Double check
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <Question
                                    question={quiz.questions[currentQuestion].question}
                                    answers={quiz.questions[currentQuestion].answers.map(a => a.answer)}
                                    onAnswer={(answer: number | number[]) => {
                                        const newAnswers = answers.filter(a => a.question !== currentQuestion);
                                        newAnswers.push({question: currentQuestion, answer: answer});
                                        setAnswers(newAnswers);

                                    }}
                                    onNext={() => setCurrentQuestion(currentQuestion + 1)}
                                    isMultipleChoice={quiz.questions[currentQuestion].multiple_choice}
                                    savedAnswer={answers.find(a => a.question === currentQuestion)?.answer}
                                />
                            )
                        )}
                    </>
                ) : (
                    <div
                        className="flex justify-center items-center w-full h-64 animate-pulse rounded">
                        <span className="text-xl">Loading...</span>
                    </div>
                )}
            </div>
        </Layout>
    )
}

export default Quiz;