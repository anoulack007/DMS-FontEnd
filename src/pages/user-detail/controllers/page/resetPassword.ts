import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import axiosInstance from "../../../../configs/axios";
import { MANAGE_USER_PATH, USER_DETAIL_PATH } from "../../../../routes/paths";
import { RESET_PASSWORD } from "../../../../configs/endPoint/user";

const useResetPasswordController = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const passwordRef = useRef<HTMLInputElement>(null);

  const [openBackdrop, setOpenBackdrop] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleResetPassword = async (event: React.FormEvent) => {
    event.preventDefault();

    const confirmResult = await Swal.fire({
      title: "ທ່ານແນ່ໃຈບໍ່ ?",
      text: "ທ່ານຕ້ອງການປ່ຽນລະຫັດຜ່ານໃໝ່ບໍ່ ?",
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
      setOpenBackdrop(true);

      const data = {
        newPassword: passwordRef.current?.value || "",
        userId: id || "",
      }


      const res = await axiosInstance.post(RESET_PASSWORD, data);

      setOpenBackdrop(false);

      await Swal.fire({
        title: "ສຳເລັດ!",
        text: "ປ່ຽນລະຫັດສໍາເລັດ",
        icon: "success",
        showCancelButton: false,
        timer: 1500,
      });

      navigate(`${USER_DETAIL_PATH}/${id}`);
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error instanceof Error ? error.message : "Failed to update user",
        icon: "error",
        confirmButtonText: "Try Again",
        confirmButtonColor: "#d33",
      });
    } finally {
      setOpenBackdrop(false);
    }
  };

  return {
    showPassword,
    handleTogglePassword,
    navigate,
    openBackdrop,
    handleResetPassword,
    passwordRef,
  };
};

export default useResetPasswordController;
