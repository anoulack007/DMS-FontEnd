import axiosInstance from '../configs/axios';
import { GET_PROFILE_BY_TOKEN, LOGIN_END_POINT, REFRESH_TOKEN } from '../configs/endPoint/login';
import { AdminModel } from '../models/Admin';
import { AUTH_TOKEN } from '../utils/constant/value';
import { decode, encode } from '../utils/functions/HashString';

export const LoginService = async (emailOrUsername: string, password: string): Promise<AdminModel> => {
  try {
    // Login request
    const res = await axiosInstance.post(LOGIN_END_POINT, {
      emailOrUsername,
      password,
    });
    const accessToken: string = res?.data?.data?.access_token;
    const refreshToken: string = res?.data?.data?.refresh_token;

    localStorage.setItem(
      AUTH_TOKEN,
      JSON.stringify({
        accessToken: encode(accessToken),
        refreshToken: encode(refreshToken),
      })
    );
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    console.log((axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`));

    const getProfile = await axiosInstance.get(GET_PROFILE_BY_TOKEN);

    // Return the profile data
    return getProfile?.data?.data;
  } catch (error) {
    console.error('LoginService error:', error);
    throw error;
  }
};

export const LoginWithTokenService = async (token: string) => {
  const decodeToken = decode(token);
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${decodeToken}`;
  try {
    const getProfile = await axiosInstance.get(GET_PROFILE_BY_TOKEN);
    return getProfile?.data?.data;
  } catch (error) {
    console.error('LoginWithTokenService error:', error);
    throw error;
  }
};

export const RefreshTokenService = async (token: string) => {
  const decodeToken = decode(token);
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${decodeToken}`;
  const res = await axiosInstance.post(REFRESH_TOKEN);
  const newAccessToken: string = res?.data?.data?.access_token;
  const newRefreshToken: string = res?.data?.data?.access_token;
  axiosInstance.defaults.headers.common['Authorization'] = newAccessToken;
  localStorage.setItem(
    AUTH_TOKEN,
    JSON.stringify({
      accessToken: encode(newAccessToken),
      refreshToken: encode(newRefreshToken),
    })
  );
};
