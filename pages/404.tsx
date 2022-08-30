import {NextPage} from "next";
import {Layout} from "../components";

const ErrorPage: NextPage = () => {
    return (
        <Layout title="Page not found">
            <h1 className="text-2xl">404</h1>
            <p className="text-sm">Page not found</p>
        </Layout>
    );
}

export default ErrorPage;