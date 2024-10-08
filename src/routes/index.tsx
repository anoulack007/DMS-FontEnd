import { useRoutes } from "react-router-dom";
import { HOME_PATH, LOGIN_PATH, MAIL_PATH, REPORT_PATH, USER_PATH } from "./paths";
import MainLayout from "../layout";
import HomePage from "../pages/home";
import ReportPage from "../pages/report";
import MailPage from "../pages/mail";
import LoginPage from "../pages/login";
import NotFoundPage from "../404";
import UserPage from "../pages/users";

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
                },
                {
                    path: USER_PATH,
                    element: <UserPage />
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