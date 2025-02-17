import axiosInstance from "../configs/axios";
import { GET_ALL_USER } from "../configs/endPoint/login";

export const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get(GET_ALL_USER);
    return response.data;
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
}