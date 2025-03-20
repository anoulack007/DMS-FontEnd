import { UserRole } from "../../enums/role";
import { HR, PROJECT_MANAGER, USER } from "../../routes/permission/permission";

export const checkPermission = (
  roleType: string,
  pathRoute: string
): boolean => {
  // return true;
  if (roleType === UserRole.ADMIN) {
    return true;
  } else if (roleType === UserRole.PROJECT_MANAGER) {
    return PROJECT_MANAGER.includes(pathRoute);
  } else if (roleType === UserRole.USER) {
    return USER.includes(pathRoute);
  } else if (roleType === UserRole.HR) {
    return HR.includes(pathRoute);
  } else {
    return false;
  }
};
