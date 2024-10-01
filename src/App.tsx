
import { Box } from '@mui/material'
import RoutesComponent from './routes'
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { clearUserData, loginSuccess } from './store/slices/userSlice';

interface AuthToken {
  accessToken: string;
  refreshToken: string;
}

function App() {

  const dispatch= useDispatch();

  const handleTokenRefresh = async () => {
    try {
      const authTokenString = localStorage.getItem("authToken");
      if (!authTokenString) {
        throw new Error("No auth token found for refresh");
      }

      const authToken: AuthToken = JSON.parse(authTokenString);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${authToken.refreshToken}`;

      const res = await axios.post("/contact/refreshToken");
      const newAccessToken = res.data.access_token;

      const newAuthToken: AuthToken = {
        accessToken: newAccessToken,
        refreshToken: authToken.refreshToken,
      };

      localStorage.setItem("authToken", JSON.stringify(newAuthToken));
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${newAccessToken}`;

      // Retry the original request
      const resGetData = await axios.get("/auth/login");
      dispatch(loginSuccess(resGetData.data));
    } catch (err) {
      console.error("Token refresh failed:", err);
      dispatch(clearUserData());
    }
  };


  return (
    <Box>
      <RoutesComponent />
    </Box>
  )
}

export default App
