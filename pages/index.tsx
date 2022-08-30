import type { NextPage } from 'next'
import {Layout} from "../components";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <Layout title="Dashboard">
        <Link href="/quiz/test">Take Quiz</Link>
    </Layout>
  )
}

export default Home
