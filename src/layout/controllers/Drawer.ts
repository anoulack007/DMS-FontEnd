import { useState } from "react";
import axiosInstance from "../../configs/axios";
import { CREATE_FOLDER_END_POINT } from "../../configs/endPoint/folder-endpoint";
import Swal from "sweetalert2";
import eventBus from "../../utils/functions/eventBus";
import { useNavigate } from "react-router-dom";

const UseDrawerController = () => {
  const navigate = useNavigate();
  const [openUploadDialog, setOpenUploadDialog] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [open, _setOpen] = useState<boolean>(true);

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [folderName, setFolderName] = useState<string>(null!);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const [anchorEl, setAnchorEl] = useState<null>(null!);
  const opening = Boolean(anchorEl);

  const handleNavigateToMain = (path: string) => {
    navigate(path);

    localStorage.removeItem("currentFolderPath");
    localStorage.removeItem("currentFolderId");
  };

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
    handleClose();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFolderName("");
  };

  const handleCreateFolder = async () => {
    try {
      setLoading(true);

      // Get the parent folder ID from local storage
      const parentFolderPath = localStorage.getItem("currentFolderPath");

      const data = {
        name: folderName,
        path: parentFolderPath || null,
        inviteUsername: selectedUsers || null,
      };

      const res = await axiosInstance.post(CREATE_FOLDER_END_POINT, data);
      console.log(res?.data?.data);

      // On success, show SweetAlert2 success alert
      Swal.fire({
        title: "ສຳເລັດ!",
        text: "ສ້າງໂຟເດີ້ສຳເລັດແລ້ວ.",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });

      eventBus.publish("FOLDERS_UPDATED", true);

      handleCloseDialog();
    } catch (error: any) {
      handleCloseDialog();
      let errorMessage = "Failed to create folder. Please try again.";

      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        errorMessage = "No response from server. Please check your network.";
      } else {
        errorMessage = error.message;
      }

      // Show SweetAlert2 with the extracted error message
      Swal.fire({
        title: "ຜິດຜາດ!",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "ຕົກລົງ",
      });

      console.error("Error creating folder:", error);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenUploadDialog = () => {
    handleClose();
    setOpenUploadDialog(true);
  };

  const handleCloseUploadDialog = () => {
    setOpenUploadDialog(false);
  };

  return {
    setSelectedUsers,
    selectedUsers,
    anchorEl,
    folderName,
    openDialog,
    open,
    loading,
    opening,
    setFolderName,
    handleClick,
    handleClose,
    openUploadDialog,
    handleCloseUploadDialog,
    handleOpenUploadDialog,
    handleCreateFolder,
    handleOpenDialog,
    handleCloseDialog,
    handleNavigateToMain,
  };
};

export default UseDrawerController;
