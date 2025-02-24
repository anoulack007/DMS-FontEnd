import { useEffect } from "react";
import "./App.css";
import RoutesComponent from "./routes";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store";
import { loginFailed, loginSuccess } from "./store/authenticationSlice";
import LoginPage from "./pages/login";
import { LinearProgress } from "@mui/material";
import { getUserByToken } from "./service/Login";
import axiosInstance from "./configs/axios";

function App() {
  const auth = useSelector((state: RootState) => state?.auth);
  const dispatch = useDispatch();

  // handleLoginByToken in App.tsx
const handleLoginByToken = async () => {
  try {
    const authString = localStorage.getItem("auth");
    if (!authString) {
      dispatch(loginFailed());
      return;
    }

    const authData = JSON.parse(authString);
    const accessToken = authData.accessToken;
    const refreshToken = authData.refreshToken;

    if (!accessToken || !refreshToken) {
      dispatch(loginFailed());
      return;
    }

    try {
      // First try using the existing access token
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      const user = await getUserByToken();
      dispatch(loginSuccess(user));
    } catch (error) {
      // If that fails, try refreshing the token
      const newTokens = await refreshAuthToken(refreshToken);
      if (newTokens) {
        // Update the stored auth data with new tokens
        authData.accessToken = newTokens.accessToken;
        authData.refreshToken = newTokens.refreshToken;
        localStorage.setItem('auth', JSON.stringify(authData));
        
        // Set the new access token for API calls
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newTokens.accessToken}`;
        
        // Fetch user data with new token
        const user = await getUserByToken();
        dispatch(loginSuccess(user));
      } else {
        dispatch(loginFailed());
      }
    }
  } catch (err) {
    console.error("Error in handleLoginByToken:", err);
    dispatch(loginFailed());
  }
};

  useEffect(() => {
    handleLoginByToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {!auth.loggedIn ? (
        <LinearProgress />
      ) : auth ? (
        <RoutesComponent />
      ) : (
        <LoginPage />
      )}
    </>
  );
}

export default App;