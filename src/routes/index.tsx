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
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { UserRole } from "../enums/role";

// Route Guard Component that checks role-specific access
const RouteGuard = ({
  element,
  allowedRoles,
}: {
  element: React.ReactNode;
  allowedRoles: UserRole[];
}) => {
  const authData = useSelector((state: RootState) => state?.auth?.data);
  const userRole = authData?.role as UserRole | undefined;

  // If user role is in allowed roles, render the element
  return userRole && allowedRoles.includes(userRole) ? (
    <>{element}</>
  ) : (
    <NotFoundPage />
  );
};

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
          element: (
            <RouteGuard
              element={<ManageUserPage />}
              allowedRoles={[UserRole.ADMIN, UserRole.HR]}
            />
          ),
        },
        {
          path: `${DOCUMENT_DETAIL_PATH}/:id`,
          element: <DocumentDetailPage />,
        },
        {
          path: CREATE_USER_PATH,
          element: (
            <RouteGuard
              element={<FormCreateUserPage />}
              allowedRoles={[UserRole.ADMIN, UserRole.HR]}
            />
          ),
        },
        {
          path: `${USER_DETAIL_PATH}/:id`,
          element: (
            <RouteGuard
              element={<UserDetailPage />}
              allowedRoles={[UserRole.ADMIN, UserRole.HR]}
            />
          ),
        },
        {
          path: FOLLOW_DOCUMENT_PATH,
          element: (
            <RouteGuard
              element={<FollowDocumentPage />}
              allowedRoles={[UserRole.ADMIN, UserRole.PROJECT_MANAGER]}
            />
          ),
        },
        {
          path: REPORT_UPLOAD_DOC_PATH,
          element: (
            <RouteGuard
              element={<ReportUploadPage />}
              allowedRoles={[UserRole.ADMIN, UserRole.PROJECT_MANAGER]}
            />
          ),
        },
        {
          path: REPORT_RECYCLE_PATH,
          element: (
            <RouteGuard
              element={<ReportRecycleBinPage />}
              allowedRoles={[UserRole.ADMIN, UserRole.PROJECT_MANAGER]}
            />
          ),
        },
        {
          path: REPORT_DELETE_PATH,
          element: (
            <RouteGuard
              element={<ReportDeletePage />}
              allowedRoles={[UserRole.ADMIN, UserRole.PROJECT_MANAGER]}
            />
          ),
        },
        {
          path: REPORT_UPDATE_DOC_PATH,
          element: (
            <RouteGuard
              element={<ReportUpdatePage />}
              allowedRoles={[UserRole.ADMIN, UserRole.PROJECT_MANAGER]}
            />
          ),
        },
        {
          path: REPORT_VERSION_DOC_PATH,
          element: (
            <RouteGuard
              element={<ReportVersionPage />}
              allowedRoles={[UserRole.ADMIN, UserRole.PROJECT_MANAGER]}
            />
          ),
        },
        {
          path: `${RESET_PASSWORD_PATH}/:id`,
          element: (
            <RouteGuard
              element={<ResetPasswordPage />}
              allowedRoles={[UserRole.ADMIN, UserRole.HR]}
            />
          ),
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
