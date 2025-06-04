import { UserRole } from "../enums/role";

export interface UserModel {
  id: string;
  userId: string;
  username: string;
  name: string;
  surname: string;
  password: string;
  email: string;
  phoneNumber: string;
  image: {
    url: string;
    filename: string;
    mimetype: string;
    path: string;
  };
  company: string;
  role: UserRole;
}
