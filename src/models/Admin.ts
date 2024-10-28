import { ImageModel } from "./image";

export interface AdminModel {
  id: string;
  username: string;
  email: string;
  password: string;
  name: string;
  surname: string;
  phoneNumber: string;
  company: string;
  image: ImageModel;
}
