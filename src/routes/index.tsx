import { useRoutes } from "react-router-dom";
import {
  DOCUMENT_DETAIL_PATH,
  LOGIN_PATH,
  MANAGE_DOC_PATH,
  MANAGE_USER_PATH,
  RECYCLE_PATH,
  REPORT_RECYCLE_PATH,
  USER_DETAIL_PATH,
  FOLLOW_DOCUMENT_PATH,
  CREATE_USER_PATH,
  REPORT_UPLOAD_DOC_PATH,
  REPORT_DELETE_PATH,
  REPORT_UPDATE_DOC_PATH,
  REPORT_VERSION_DOC_PATH,
  RESET_PASSWORD_PATH,
} from "./paths";
import LoginPage from "../pages/login";
import NotFoundPage from "../404";
import ManageDocumentPage from "../pages/manage-document";
import RecyclePage from "../pages/recycle";
import DocumentDetailPage from "../pages/document-detail";
import UserDetailPage from "../pages/user-detail";
import FollowDocumentPage from "../pages/follow-document";
import { ProtectedRoute } from "./ProtectedRoute";
import MainLayout from "../layout";
import ManageUserPage from "../pages/manage-user";
import FormCreateUserPage from "../pages/manage-user/form";
import ReportUploadPage from "../pages/report-upload";
import ReportDeletePage from "../pages/report-delete";
import ReportRecycleBinPage from "../pages/report-recycle-bin";
import ReportUpdatePage from "../pages/report-update";
import ReportVersionPage from "../pages/report-version";
import ResetPasswordPage from "../pages/user-detail/components/Reset-password";

const RoutesComponent = () => {
  return useRoutes([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: MANAGE_DOC_PATH,
          element: <ManageDocumentPage />,
        },
        {
          path: RECYCLE_PATH,
          element: <RecyclePage />,
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
          path: CREATE_USER_PATH,
          element: <FormCreateUserPage />,
        },
        {
          path: `${USER_DETAIL_PATH}/:id`,
          element: <UserDetailPage />,
        },
        {
          path: FOLLOW_DOCUMENT_PATH,
          element: <FollowDocumentPage />,
        },  
        {
          path: REPORT_UPLOAD_DOC_PATH,
          element: <ReportUploadPage />,
        },
        {
          path: REPORT_RECYCLE_PATH,
          element: <ReportRecycleBinPage />,
        },
        {
          path: REPORT_DELETE_PATH,
          element: <ReportDeletePage />,
        },
        {
          path: REPORT_UPDATE_DOC_PATH,
          element: <ReportUpdatePage />,
        },
        {
          path: REPORT_VERSION_DOC_PATH,
          element: <ReportVersionPage />,
        },
        {
          path: `${RESET_PASSWORD_PATH}/:id`,
          element: <ResetPasswordPage />,
        },
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
