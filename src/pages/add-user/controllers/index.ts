import { useState } from "react"
import { UserModel } from "../../../models/user"
import axiosInstance from "../../../configs/axios"
import { CREATE_USER } from "../../../configs/endPoint/login"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"

const UseMainController = () => {

  const [data, setData] = useState<UserModel[]>([])
  const [loading, setLoading] = useState<boolean>(false);

  const [ProfileImg, setProfileImg] = useState<File | null>(null);
  const [previewProfile, setPreviewProfile] = useState<string>(null!);
  const [_imageLink, setImageLink] = useState<string>('');

  const [name, setName] = useState<string>(null!)
  const [surname, setSurname] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [phoneNumber, setPhonenumber] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [role, setRole] = useState<string>('TeamLeader');

  const navigate = useNavigate();

  const roles = ['TeamLeader', 'UXUI', 'FrontEnd', 'BackEnd', 'Tester', 'CheifTechnologyOfficer'];

  // Add user button
  const handleSwitchPageClick = (path: string) => {
    navigate(path);
  };

  // แสดงรูปตัวอย่างเมื่อเลือกไฟล์
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfileImg(file);
      const previewURL = URL.createObjectURL(file);
      setPreviewProfile(previewURL);

      // Cleanup
      return () => URL.revokeObjectURL(previewURL);
    }
  };

  // ฟังก์ชันจัดการการส่งฟอร์ม
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to submit the form?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, submit it!",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("surname", surname);
      formData.append("phoneNumber", phoneNumber);
      formData.append("email", email);
      formData.append("username", username);
      formData.append("password", password);
      formData.append("company", company);
      formData.append("role", role);

      // Append image if exists
      if (ProfileImg) {
        formData.append('image', ProfileImg);
      }

      // const config = { headers: { "Content-Type": "multipart/form-data" } };
      const res = await axiosInstance.post(CREATE_USER, formData);

      setData(res?.data?.data);

      if (res.data?.data?.imageLink) {
        setImageLink(res.data.data.imageLink);

        if (previewProfile) {
          URL.revokeObjectURL(previewProfile);
        }
      }

      // Show success message
      Swal.fire({
        title: "Success!",
        text: "Your form has been submitted successfully.",
        icon: "success",
        confirmButtonText: "Okay",
      });

    } catch (error: any) {
      if (error.response) {
        console.error("Error response from API:", error.response);
        Swal.fire({
          title: "Error",
          text: error.response.data.message || "Something went wrong.",
          icon: "error",
          confirmButtonText: "Okay",
        });
      } else {
        console.error("Error:", error.message);
        Swal.fire({
          title: "Error",
          text: error.message,
          icon: "error",
          confirmButtonText: "Okay",
        });
    }
    }
  };

  return {
    data,
    name,
    surname,
    email,
    password,
    username,
    phoneNumber,
    company,
    role,
    roles,
    loading,
    setName,
    setSurname,
    setEmail,
    setPassword,
    setUsername,
    setPhonenumber,
    setCompany,
    setRole,
    handleSwitchPageClick,
    handleSubmit,
    handleImageUpload,
    previewProfile,
  }
}

export default UseMainController
