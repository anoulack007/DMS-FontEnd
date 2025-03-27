import { useState, useRef } from "react";
import axiosInstance from "../../../configs/axios";
import { useNavigate } from "react-router-dom";
import { USER_CREATE } from "../../../configs/endPoint/user";
import { UserRole } from "../../../enums/role";
import { MANAGE_USER_PATH } from "../../../routes/paths";
import Swal from "sweetalert2";

const UseCreateController = () => {
  const navigate = useNavigate();
  const [auth, _setAuth] = useState(true);
  const [anchorElProfile, setAnchorElProfile] = useState<null | HTMLElement>(
    null
  );
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [openBackdrop, setOpenBackdrop] = useState<boolean>(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const surnameRef = useRef<HTMLInputElement>(null);
  const phoneNumberRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const companyRef = useRef<HTMLInputElement>(null);
  const roleRef = useRef<HTMLInputElement>(null);

  const roles: UserRole[] = Object.values(UserRole);
  const [showPassword, setShowPassword] = useState(false);

  // Profile menu
  const handleProfileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElProfile(event.currentTarget);
  };

  const handleCloseProfileMenu = () => {
    setAnchorElProfile(null);
  };

  // Add user button
  const handleSwitchPageClick = (path: string) => {
    navigate(path);
  };

  // Handle avatar upload
  const handleAvatarChange = (file: File) => {
    setAvatarFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const phoneNumber = phoneNumberRef.current?.value || "";

    const phoneRegex = /^(020|030|20)\d{7,8}$/;

    if (!phoneRegex.test(phoneNumber)) {
      Swal.fire({
        title: "ຜິດພາດ!",
        text: "ກະລຸນາໃສ່ເບີໂທລະສັບໃຫ້ຖືກຕ້ອງ (020, 030) 8 - 11 ໂຕເລກ",
        icon: "error",
        confirmButtonText: "ຕົກລົງ",
        confirmButtonColor: "#d33",
      });
      return;
    }

    const confirmResult = await Swal.fire({
      title: "ທ່ານແນ່ໃຈບໍ່ ?",
      text: "ທ່ານຕ້ອງການເພິ່ມຜູ້ໃຊ້ນີ້ບໍ່ ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "ຕົກລົງ",
      cancelButtonText: "ຍົກເລີກ",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    });

    if (!confirmResult.isConfirmed) {
      return;
    }

    try {
      setLoading(true);
      setOpenBackdrop(true);

      const formData = new FormData();
      formData.append("name", nameRef.current?.value || "");
      formData.append("surname", surnameRef.current?.value || "");
      formData.append("phoneNumber", phoneNumber);
      formData.append("email", emailRef.current?.value || "");
      formData.append("username", usernameRef.current?.value || "");
      formData.append("password", passwordRef.current?.value || "");
      formData.append("company", companyRef.current?.value || "");
      formData.append("role", roleRef.current?.value || "");
      if (avatarFile) formData.append("image", avatarFile);

      const res = await axiosInstance.post(USER_CREATE, formData);
      console.log(res)

      Swal.fire({
        title: "Success!",
        text: "User updated successfully",
        icon: "success",
        showCancelButton: false,
        timer: 1500,
      });

      navigate(MANAGE_USER_PATH);
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error instanceof Error ? error.message : "Failed to update user",
        icon: "error",
        confirmButtonText: "Try Again",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
      setOpenBackdrop(false);
    }
  };

  return {
    showPassword,
    setShowPassword,
    openBackdrop,
    loading,
    roles,
    avatarFile,
    auth,
    anchorElProfile,
    handleSwitchPageClick,
    handleCloseProfileMenu,
    handleProfileMenu,
    handleSubmit,
    nameRef,
    surnameRef,
    phoneNumberRef,
    emailRef,
    usernameRef,
    passwordRef,
    companyRef,
    roleRef,
    avatarPreview,
    handleAvatarChange,
  };
};

export default UseCreateController;
