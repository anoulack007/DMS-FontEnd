import { useRoutes } from "react-router-dom";
import {
  DOCUMENT_DETAIL_PATH,
  LOGIN_PATH,
  MANAGE_DOC_PATH,
  MANAGE_USER_PATH,
  RECYCLE_PATH,
  REPORT_RECYCLE_PATH,
  REPORT_SHARE_PATH,
  SEARCH_DOC_PATH,
  ADD_USER_PATH,
  USER_DETAIL_PATH,
  FOLLOW_DOCUMENT_PATH,
} from "./paths";
import MainLayout from "../layout";
import LoginPage from "../pages/login";
import NotFoundPage from "../404";
import SearchDocumentPage from "../pages/search_document";
import ManageDocumentPage from "../pages/manage-document";
import RecyclePage from "../pages/recycle";
import ReportSharePage from "../pages/report-share";
import ReportRecyclePage from "../pages/report";
import ManageUserPage from "../pages/manage-user";
import DocumentDetailPage from "../pages/document-detail";
import ProtectedRoutes from "./ProtectedRoute";
import UserDetailPage from "../pages/user-detail";
import AddUserPage from "../pages/add-user";
import FollowDocumentPage from "../pages/follow-document";

const RoutesComponent = () => {
  return useRoutes([
    {
      path: "/",
      element: (
        <ProtectedRoutes>
          <MainLayout />
        </ProtectedRoutes>
      ),
      children: [
        {
          path: MANAGE_DOC_PATH,
          element: <ManageDocumentPage />,
        },
        {
          path: REPORT_RECYCLE_PATH,
          element: <ReportRecyclePage />,
        },
        {
          path: REPORT_SHARE_PATH,
          element: <ReportSharePage />,
        },
        {
          path: RECYCLE_PATH,
          element: <RecyclePage />,
        },
        {
          path: SEARCH_DOC_PATH,
          element: <SearchDocumentPage />,
        },
        {
          path: MANAGE_USER_PATH,
          element: <ManageUserPage />,
        },
        {
          path: `${DOCUMENT_DETAIL_PATH}/:id`,
          element: <DocumentDetailPage />,
        },
        {
          path: ADD_USER_PATH,
          element: <AddUserPage />,
        },
        {
          path: USER_DETAIL_PATH,
          element: <UserDetailPage />
        },
        {
          path: FOLLOW_DOCUMENT_PATH,
          element: <FollowDocumentPage />
        }
      ],
    },

    {
      path: LOGIN_PATH,
      element: <LoginPage />,
    },

    {
      path: "*",
      element: <NotFoundPage />,
    },
  ]);
};

export default RoutesComponent;
