import { useEffect, useState, useRef } from "react";
import { UserModel } from "../../../models/user";
import axiosInstance from "../../../configs/axios";
import { useNavigate, useParams } from "react-router-dom";
import { GET_ONE_USER, UPADTE_USER } from "../../../configs/endPoint/user";
import { UserRole } from "../../../enums/role";
import { MANAGE_USER_PATH } from "../../../routes/paths";
import Swal from "sweetalert2";

const UseMainController = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<UserModel | null>(null);
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

  const handleGetData = async () => {
    try {
      const res = await axiosInstance.get(`${GET_ONE_USER}/${id}`);
      setData(res?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

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

    // Show confirmation dialog before submitting
    const confirmResult = await Swal.fire({
      title: "ທ່ານແນ່ໃຈບໍ່ ?",
      text: "ທ່ານຕ້ອງການແກ້ໄຂຂໍ້ມູນບໍ່ ?",
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
      formData.append("phoneNumber", phoneNumberRef.current?.value || "");
      formData.append("email", emailRef.current?.value || "");
      formData.append("username", usernameRef.current?.value || "");
      formData.append("password", passwordRef.current?.value || "");
      formData.append("company", companyRef.current?.value || "");
      formData.append("role", roleRef.current?.value || "");
      if (avatarFile) formData.append("image", avatarFile);

      const res = await axiosInstance.patch(`${UPADTE_USER}/${id}`, formData);
      if (res.status === 200) {
        Swal.fire({
          title: "Success!",
          text: "User updated successfully",
          icon: "success",
          showCancelButton: false,
          timer: 1500,
        }).then((result) => {
          if (result.isConfirmed) {
            navigate(MANAGE_USER_PATH);
          }
        });
      }
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

  useEffect(() => {
    handleGetData();
  }, []);

  useEffect(() => {
    if (data) {
      if (nameRef.current) nameRef.current.value = data.name || "";
      if (surnameRef.current) surnameRef.current.value = data.surname || "";
      if (phoneNumberRef.current)
        phoneNumberRef.current.value = data.phoneNumber || "";
      if (emailRef.current) emailRef.current.value = data.email || "";
      if (usernameRef.current) usernameRef.current.value = data.username || "";
      if (companyRef.current) companyRef.current.value = data.company || "";
      if (roleRef.current) roleRef.current.value = data.role || "User";
    }
  }, [data]);

  return {
    setData,
    openBackdrop,
    loading,
    roles,
    avatarFile,
    data,
    auth,
    anchorElProfile,
    handleSwitchPageClick,
    handleCloseProfileMenu,
    handleGetData,
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

export default UseMainController;
