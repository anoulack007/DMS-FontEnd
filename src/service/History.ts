import axiosInstance from "../configs/axios";
import { GET_FILE_HISTORY_END_POINT } from "../configs/endPoint/files-endpoint";
import { GET_FOLDER_HISTORY_END_POINT } from "../configs/endPoint/folder-endpoint";

export const getFileHistory = async () => {
  try {
    const response = await axiosInstance.get(GET_FILE_HISTORY_END_POINT);
    return response.data;
  } catch (error) {
    console.error("Error fetching file history:", error);
    throw error;
  }
};

export const getFolderHistory = async () => {
  try {
    const response = await axiosInstance.get(GET_FOLDER_HISTORY_END_POINT);
    return response.data;
  } catch (error) {
    console.error("Error fetching folder history:", error);
    throw error;
  }
};
