import { LOGIN_END_POINT } from "../configs/endPoint/login";
import { UserModel } from "../models/user";
import axiosInstance from "../configs/axios";

interface LoginResponse {
  message: string;
  data: {
    access_token: string;
    refresh_token: string;
  };
  duration: string;
  statusCode: number;
}

export const login = async (
  emailOrUsername: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await axiosInstance.post<LoginResponse>(LOGIN_END_POINT, {
      emailOrUsername,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

export const getUserByToken = async (): Promise<UserModel> => {
  try {
    const response = await axiosInstance.get('/auth/user-profile');
    
    // Assuming the user data is part of the response 
    const userData: UserModel = response?.data?.data;
    return userData;
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};

export const refreshAuthToken = async (refreshToken: string) => {
  try {
    const response = await axiosInstance.post('/auth/refresh', {
      refresh_token: refreshToken
    });
    
    if (response.data && response.data.access_token) {
      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token || refreshToken // Use new refresh token if provided, otherwise keep the old one
      };
    }
    return null;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
};
