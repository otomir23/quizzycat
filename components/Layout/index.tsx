import Head from "next/head";
import Link from "next/link";

export type LayoutProps = {
    children: React.ReactNode;
    title: string;
}

const Layout = ({children, title}: LayoutProps) => {
    return (
        <div className="flex flex-col min-h-screen items-center">
            <Head>
                <title>{`${title} | quizzycat`}</title>
            </Head>
            <header className="my-12">
                <Link href="/">
                    <a className="font-bold text-4xl">quizzycat</a>
                </Link>
            </header>
            <main className="min-h-full w-full flex flex-col items-center">{children}</main>
        </div>
    );
}

export default Layout;