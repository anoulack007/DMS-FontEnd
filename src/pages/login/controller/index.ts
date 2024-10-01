import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../../store/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { HOME_PATH } from "../../../routes/paths";

const UseMainController = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>(null!);
  const [password, setPassword] = useState<string>(null!);
  const [error, setError] = useState<string>(null!);

  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      const res = await axios.post(
        "https://capstone-project-backend-e586.onrender.com/auth/login",
        { emailOrUsername: email, password }
      );

      console.log("Login response:", res.data);

      // Access the tokens from the nested data object
      const token = `Bearer ${res.data.data.access_token}`;
      const refreshToken = `Bearer ${res.data.data.refresh_token}`;

      console.log("Token:", token);
      console.log("Refresh Token:", refreshToken);

      if (!res.data.data.access_token) {
        throw new Error("Access token not received from server");
      }

      axios.defaults.headers.common["Authorization"] = token;

      localStorage.setItem(
        "authToken",
        JSON.stringify({
          accessToken: token,
          refreshToken: refreshToken,
        })
      );

      const userRes = await axios.get(
        "https://capstone-project-backend-e586.onrender.com/user/get-one"
      );
      const userData = userRes.data;
      console.log("User data:", userData);

      // Combine all user data into a single object
      const combinedUserData = {
        ...res.data,
        ...userData,
        token,
        refreshToken,
      };

      dispatch(loginSuccess(combinedUserData));
      navigate(HOME_PATH);
    } catch (err: any) {
      console.error("Login error:", err);
      setError(
        err?.response?.data?.message ?? "Server error, please try again later"
      );
    } finally {
      setLoading(false);
    }

    return { loading, error };
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleLogin(email, password);
  };
  return {
    loading,
    showPassword,
    password,
    email,
    handleChangeEmail,
    handleChangePassword,
    handleClickShowPassword,
    handleSubmit,
  };
};

export default UseMainController;
