export interface UserModel {
  id: number;
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
  role: string;
}
