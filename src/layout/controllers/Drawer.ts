import { useState } from "react";
import axiosInstance from "../../configs/axios";
import { CREATE_FOLDER_END_POINT } from "../../configs/endPoint/folder-endpoint";
import Swal from "sweetalert2";

const UseDrawerController = () => {
  const [openUploadDialog, setOpenUploadDialog] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [open, _setOpen] = useState<boolean>(true);

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [folderName, setFolderName] = useState<string>(null!);

  const [anchorEl, setAnchorEl] = useState<null>(null!);
  const opening = Boolean(anchorEl);

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
      const data = {
        name: folderName,
      };

      const res = await axiosInstance.post(CREATE_FOLDER_END_POINT, data);
      console.log(res?.data?.data)

      // On success, show SweetAlert2 success alert
      Swal.fire({
        title: "Success!",
        text: "Folder created successfully.",
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "your-custom-button-class", // You can add custom styles here if needed
        },
      });

      handleCloseDialog();
    } catch (error) {
      // On error, show SweetAlert2 error alert
      Swal.fire({
        title: "Error!",
        text: "Failed to create folder. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "your-custom-button-class",
        },
      });
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
  };
};

export default UseDrawerController;
