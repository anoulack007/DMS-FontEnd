import { UserRole } from "../../enums/role";
import { ADMIN, HR, PROJECT_MANAGER, USER } from "../../routes/permission/permission";

export const checkPermission = (role: string, path: string): boolean => {
  switch (role) {
    case UserRole.ADMIN:
      return ADMIN.includes(path);
    case UserRole.PROJECT_MANAGER:
      return PROJECT_MANAGER.includes(path);
    case UserRole.USER:
      return USER.includes(path);
    case UserRole.HR:
      return HR.includes(path);
    default:
      return false;
  }
};