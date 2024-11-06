import { useEffect, useState } from "react"
import { UserModel } from "../../../models/user"
import axiosInstance from "../../../configs/axios"
import { CREATE_USER } from "../../../configs/endPoint/login"
import { useNavigate } from "react-router-dom"
import { ImageModel } from "../../../models/image"

const UseMainController = () => {

  const [data, setData] = useState<UserModel[]>([])
  const [anchorElProfile, setAnchorElProfile] = useState<null | HTMLElement>(null);  //

  const navigate = useNavigate();

  const roles = ['TeamLeader', 'UXUI', 'FrontEnd', 'BackEnd', 'Tester', 'CheifTechnologyOfficer'];

  const [formDataUser, setFormDataUser] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
    surname: '',
    phoneNumber: '',
    company: '',
    role: '',
    image: { url: '', path: '', fileName: '', mimetype: '' } as ImageModel,
  });

  // Post Data
  const handlePostData = async () => {
    try {
      const res = await axiosInstance.post(CREATE_USER, formDataUser)
      setData(res?.data?.data)
      setFormDataUser({
        username: '',
        email: '',
        password: '',
        name: '',
        surname: '',
        phoneNumber: '',
        company: '',
        role: '',
        image: { url: '', path: '', fileName: '', mimetype: '' },
      });

    } catch (error: any) {
      if (error.response) {
        console.error("API Error:", error.response.data); // แสดงรายละเอียดข้อผิดพลาดจากเซิร์ฟเวอร์
      } else {
        console.error("Error:", error.message);
      }
    }
  }
  useEffect(() => {
    handlePostData()
  }, [])
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const image: ImageModel = {
          url: reader.result as string,  // แปลงเป็น Base64
          path: `images/profile/${file.name}`,  // เก็บ path ของไฟล์
          fileName: file.name,                // ชื่อไฟล์
          mimetype: file.type,                // ชนิดของไฟล์
        };
        setFormDataUser({
          ...formDataUser,
          image: image,  // อัปเดตข้อมูลภาพ
        });
      };
      reader.readAsDataURL(file); // อ่านไฟล์เป็น Base64
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

  // จัดการการเปลี่ยนแปลงข้อมูลในฟอร์ม
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormDataUser({ ...formDataUser, [event.target.name]: event.target.value });
  };

  const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormDataUser({ ...formDataUser, role: event.target.value });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Form Data:", formDataUser); // เพิ่มเพื่อตรวจสอบข้อมูล
    handlePostData();
  };

  return {
    data,
    anchorElProfile,
    handleSwitchPageClick,
    handleCloseProfileMenu,
    handlePostData,
    handleProfileMenu,
    roles,
    handleRoleChange,
    handleSubmit,
    handleChange,
    formDataUser,
    handleImageUpload
  }
}

export default UseMainController