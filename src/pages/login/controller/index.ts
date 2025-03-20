import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../../../store/authenticationSlice";
import { getUserByToken, login } from "../../../service/Login";
import { MANAGE_DOC_PATH, MANAGE_USER_PATH } from "../../../routes/paths";
import axiosInstance from "../../../configs/axios";
import Swal from "sweetalert2";

const UseMainController = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [ErrorMessage, setErrorMessage] = useState<string>(null!);

  const email = useRef<HTMLInputElement>(null!);
  const password = useRef<HTMLInputElement>(null!);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  // handleLogin in your login component
  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      const resLogin = await login(email.current.value, password.current.value);

      // Access the nested tokens in the data object
      const accessToken = resLogin.data.access_token;
      const refreshToken = resLogin.data.refresh_token;

      if (!accessToken) {
        throw new Error("No access token received");
      }

      // Set axios default header
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${accessToken}`;

      // Get user details
      const user = await getUserByToken();

      // Store all auth data in a single 'auth' key
      const authData = {
        accessToken,
        refreshToken,
        user,
        isAuthenticated: true,
      };

      localStorage.setItem("auth", JSON.stringify(authData));

      // Update global state
      dispatch(loginSuccess(user));

      const userRole = user?.role?.toLowerCase();
      let redirectPath = MANAGE_DOC_PATH;

      if (userRole === "hr") {
        redirectPath = MANAGE_USER_PATH;
      }

      navigate(redirectPath);
      setErrorMessage("");
    } catch (err: any) {
      console.error("Login error:", err);
      const errorMsg =
        err?.response?.data?.message || "Server error, Please try again";

      // Show SweetAlert error message
      Swal.fire({
        icon: "warning",
        title: "ເຂົ້າສູ່ລະບົບບໍ່ສຳເລັດ",
        text: errorMsg,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "ລອງອີກຄັ້ງ",
      });

      setErrorMessage(errorMsg);

      // Clear authentication data
      localStorage.removeItem("auth");
    } finally {
      setLoading(false);
    }
  };

  return {
    ErrorMessage,
    loading,
    showPassword,
    password,
    email,
    handleClickShowPassword,
    handleLogin,
  };
};

export default UseMainController;
