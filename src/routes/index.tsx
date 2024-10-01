import { useRoutes } from "react-router-dom";
import { HOME_PATH, LOGIN_PATH, MAIL_PATH, REPORT_PATH } from "./paths";
import MainLayout from "../layout";
import HomePage from "../pages/home";
import ReportPage from "../pages/report";
import MailPage from "../pages/mail";
import LoginPage from "../pages/login";
import NotFoundPage from "../404";

const RoutesComponent = () => {
    return useRoutes([
        {
            path: '/',
            element: <MainLayout />,
            children: [
                {
                    path: HOME_PATH,
                    element: <HomePage />
                },
                {
                    path: REPORT_PATH,
                    element: <ReportPage />
                },
                {
                    path: MAIL_PATH,
                    element: <MailPage />
                }
            ],
        },

        {
            path: LOGIN_PATH,
            element: <LoginPage />
        },

        {
            path: '*',
            element: <NotFoundPage />
        }
    ]);
}

export default RoutesComponent