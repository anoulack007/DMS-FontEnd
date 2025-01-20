import { useEffect, useState } from "react"
import { UserModel } from "../../../models/user"
import axiosInstance from "../../../configs/axios"
import { GET_ALL_USER } from "../../../configs/endPoint/login"
import { useNavigate } from "react-router-dom"

const UseMainController = () => {

    const [data, setData] = useState<UserModel[]>([])
    const [auth, _setAuth] = useState(true);
    const [anchorElProfile, setAnchorElProfile] = useState<null | HTMLElement>(null);  //

    const navigate = useNavigate();

    // Get Data
    const handleGetData = async () => {
        try {
            const res = await axiosInstance.get(GET_ALL_USER)
            setData(res?.data?.data)

        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        handleGetData()
    }, [])


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

    // สไตล์ AvatarUpload ที่ใช้จัดการการอัพโหลดรูปภาพโปรไฟล์
  
  const roles = ['Admin', 'User'];

  const [formDataUser, setFormDataUser] = useState({
    name: '',
    surname: '',
    phoneNumber: '',
    email: '',
    username: '',
    password: '',
    company: '',
    role: 'Admin',
    image: ''
  });

  // จัดการการเปลี่ยนแปลงข้อมูลในฟอร์ม
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormDataUser({ ...formDataUser, [event.target.name]: event.target.value });
  };

  const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormDataUser({ ...formDataUser, role: event.target.value });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Form Data Submitted:', formDataUser);
  };

    return {
        data,
        open,
        auth,
        anchorElProfile,
        handleSwitchPageClick,
        handleCloseProfileMenu,
        handleGetData,
        handleProfileMenu,

        roles,
        handleRoleChange,
        handleSubmit,
        handleChange,
        formDataUser
    }
}

export default UseMainController