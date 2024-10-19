import axios from 'axios';
import { AUTH_TOKEN } from '../utils/constant/value';
import { REFRESH_TOKEN } from './endPoint/login';
import { LOGIN_PATH } from '../routes/paths';
import { jwtDecode } from 'jwt-decode';
import moment from 'moment';
import { decode, encode } from '../utils/functions/HashString';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_KEY,
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error?.response?.message === 'jwt expired' && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const storedTokens = JSON.parse(localStorage.getItem(AUTH_TOKEN) || '{}');
        const refreshToken = decode(storedTokens?.refresh_token);
        const accessToken = decode(storedTokens?.access_token);

        const decodedAccessToken = jwtDecode(accessToken);

        // Check if the access token will expire in less than 5 minutes (300 seconds)
        if (decodedAccessToken?.exp && moment.unix(decodedAccessToken.exp).isBefore(moment().add(5, 'minutes'))) {
          // If the token is expired or about to expire in less than 5 minutes
          axios.defaults.headers.common['Authorization'] = `Bearer ${refreshToken}`;

          const res = await axios.post(import.meta.env.VITE_API_KEY + REFRESH_TOKEN);

          const newAccessToken = 'Bearer ' + res?.data?.data?.access_token;
          const newRefreshToken = 'Bearer ' + res?.data?.data?.refresh_token;
          localStorage.setItem(
            AUTH_TOKEN,
            JSON.stringify({
              accessToken: encode(newAccessToken),
              refreshToken: encode(newRefreshToken),
            })
          );
          originalRequest.headers.Authorization = newAccessToken;
          axiosInstance.defaults.headers.common['Authorization'] = newAccessToken;

          return axiosInstance(originalRequest); // Retry the original request with the new token
        } else {
          // If token is still valid for more than 5 minutes
          axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        }

        // If no refresh token available, prompt for login
        if (!refreshToken) {
          throw new Error('Refresh token not found');
        }

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.log(refreshError);
        if (window.confirm('Session Expired, you need to log in again')) {
          localStorage.clear();
          window.location.href = LOGIN_PATH;
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;



