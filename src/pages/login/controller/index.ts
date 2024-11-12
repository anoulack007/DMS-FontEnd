// import axios from "axios";
import { FormEvent, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../../../store/authenticationSlice";
// import axiosInstance from "../../../configs/axios";
// import { LOGIN_END_POINT } from "../../../configs/endPoint/login";
import { LoginService } from "../../../service/Login";
import { ErrorModel } from "../../../models/Error";
import { ErrorResponse } from "../../../utils/functions/Error";
import { MANAGE_DOC_PATH } from "../../../routes/paths";

const UseMainController = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const email = useRef<HTMLInputElement>(null!);
  const password = useRef<HTMLInputElement>(null!);


  const handleClickShowPassword = () => setShowPassword((show) => !show);

  // const handleLogin = async (email: string, password: string) => {
  //   try {
  //     setLoading(true);
  //     const res = await axiosInstance.post(
  //       'https://dms-backend-khlo.onrender.com' + LOGIN_END_POINT,
  //       { emailOrUsername: email, password }
  //     );

  //     // Access the tokens from the nested data object
  //     const token = `Bearer ${res?.data?.data?.access_token}`;
  //     const refreshToken = `Bearer ${res?.data?.data?.refresh_token}`;

  //     if (!res.data.data.access_token) {
  //       throw new Error("Access token not received from server");
  //     }

  //     axios.defaults.headers.common["Authorization"] = token;

  //     localStorage.setItem(
  //       "authToken",
  //       JSON.stringify({
  //         accessToken: token,
  //         refreshToken: refreshToken,
  //       })
  //     );

  //     const userRes = await axiosInstance.get(
  //       LOGIN_END_POINT
  //     );
  //     const userData = userRes.data;
  //     // Combine all user data into a single object
  //     const combinedUserData = {
  //       ...res.data,
  //       ...userData,
  //       token,
  //       refreshToken,
  //     };

  //     dispatch(loginSuccess(combinedUserData));
  //     navigate(HOME_PATH);
  //   } catch (err: any) {
  //     console.error("Login error:", err);
  //     setError(
  //       err?.response?.data?.message ?? "Server error, please try again later"
  //     );
  //   } finally {
  //     setLoading(false);
  //   }

  //   return { loading, error };
  // };

  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   handleLogin(email, password);
  // };

  const handleLogin = async (): Promise<void> => {
    try {
      setLoading(true);
      const userInput = email.current.value;
      const passwordInput = password.current.value;
      const resUserLogin = await LoginService(userInput, passwordInput);
      dispatch(loginSuccess(resUserLogin));
      navigate(MANAGE_DOC_PATH);
    } catch (error) {
      console.log(error);

      ErrorResponse(error as ErrorModel);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleLogin();
  };
  return {
    loading,
    showPassword,
    password,
    email,
    handleClickShowPassword,
    handleSubmit
  };
};

export default UseMainController;
