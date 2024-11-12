import { useEffect } from "react";
import "./App.css";
import RoutesComponent from "./routes";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store";
import { AUTH_TOKEN } from "./utils/constant/value";
import { loginFailed, loginSuccess } from "./store/authenticationSlice";
import { ErrorModel } from "./models/Error";
import LoginPage from "./pages/login";
import { LinearProgress } from "@mui/material";
import { LoginWithTokenService, RefreshTokenService } from "./service/Login";

function App() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(
    (state: RootState) => state?.authentication?.loggedIn
  );
  const isAuth = useSelector((state: RootState) => state?.authentication?.data);

  const handleLoginWithToken = async (): Promise<void> => {
    try {
      const authToken = JSON.parse(localStorage.getItem(AUTH_TOKEN) || "");
      if (authToken) {
        const token: string = authToken?.access_token;
        const getAdmin = await LoginWithTokenService(token);
        dispatch(loginSuccess(getAdmin));
      }
    } catch (error) {
      const err = error as ErrorModel;
      console.log(err);

      if (err.response?.data?.message === "jwt expired") {
        const storedTokens = JSON.parse(localStorage.getItem(AUTH_TOKEN) || "");
        console.log(storedTokens);

        const getRefreshToken: string = storedTokens?.refresh_token;
        if (getRefreshToken) {
          RefreshTokenService(getRefreshToken);
        }
      } else {
        dispatch(loginFailed());
      }
    }
  };

  useEffect(() => {
    handleLoginWithToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {!isLoggedIn ? (
        <LinearProgress />
      ) : isAuth ? (
        <RoutesComponent />
      ) : (
        <LoginPage />
      )}

      {/* <RoutesComponent /> */}
    </>
  );
}

export default App;
