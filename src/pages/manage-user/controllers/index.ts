import { useEffect, useState } from "react"
import { UserModel } from "../../../models/user"
import axiosInstance from "../../../configs/axios"
import { DELETE_USER, GET_ALL_USER } from "../../../configs/endPoint/login"
import { useNavigate } from "react-router-dom"

const UseMainController = () => {

    const [data, setData] = useState<UserModel[]>([])
    const [auth, _setAuth] = useState(true);
    const [anchorElProfile, setAnchorElProfile] = useState<null | HTMLElement>(null);  // แยกตัวแปรสำหรับโปรไฟล์
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // แยกตัวแปรสำหรับแต่ละ Action Menu
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const open = Boolean(anchorEl);
    const [openDialog, setOpenDialog] = useState(false); // เปิด/ปิด dialog
    const [userToDelete, setUserToDelete] = useState<UserModel | null>(null); // กำหนดผู้ใช้ที่จะลบ




    const navigate = useNavigate();

    // User Data
    const handleGetData = async () => {
        try {
            const res = await axiosInstance.get(GET_ALL_USER)
            console.log('data=>', res?.data?.data)

            setData(res?.data?.data)

        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        handleGetData()
    }, [])

    // ฟังก์ชันลบข้อมูลผู้ใช้ตาม userId
    const handleConfirmDelete = async () => {
        if (userToDelete) {
            try {
                await axiosInstance.delete(`${DELETE_USER}${userToDelete.id}`);  // ลบผู้ใช้จากฐานข้อมูล
                setData((prevData) => prevData.filter((user) => user?.id !== userToDelete?.id)); // อัปเดตข้อมูลใน state ให้แสดงผลลัพธ์ที่ลบแล้ว
            } catch (error) {
                console.error("Error deleting user:", error); // แสดงข้อผิดพลาดหากการลบไม่สำเร็จ
            }
            setOpenDialog(false); // ปิด dialog
            setUserToDelete(null); // เคลียร์ข้อมูลผู้ใช้ที่ถูกเลือก
        }
    };
    


    // ChangeTablePage
    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };
    // ChangeRowsPerPage
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Profile menu
    const handleProfileMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElProfile(event.currentTarget);
    };
    const handleCloseProfileMenu = () => {
        setAnchorElProfile(null);
    };

    // checkbox
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const handleCheckboxChange = (id: number) => {
        setSelectedIds((prev) => {
            if (prev.includes(id)) {
                return prev.filter((prevId) => prevId !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    // Add user button
    const handleAddUserClick = (path: string) => {
        navigate(path);
    };

    // Action on Table
    const handleActionClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseActionMenu = () => {
        setAnchorEl(null);
    };
    // Edit User Button
    const handleEditUserClick = (path: string) => {
        navigate(path);
    };
    // Delete User Button -> เปิด Dialog และเก็บข้อมูลผู้ใช้ที่ต้องการลบ
    const handleDeleteUserClick = (user: UserModel) => {
        setUserToDelete(user); // เก็บผู้ใช้ที่เลือกไว้ใน state userToDelete
        setOpenDialog(true);   // เปิด dialog เพื่อให้ผู้ใช้ยืนยันการลบ
    };
    

    // Close Dialog
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setUserToDelete(null); // เคลียร์ข้อมูลหลังปิด dialog
    };

    // Select
    const isSelected = (id: string) => selectedItems.includes(id);
    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setSelectedItems(data.map((user) => user.userId));
        } else {
            setSelectedItems([]);
        }
    };



    return {
        data,
        open,
        auth,
        anchorEl,
        anchorElProfile,
        rowsPerPage,
        page,
        selectedIds,
        selectedItems,
        setSelectedIds,
        isSelected,
        handleActionClick,
        handleAddUserClick,
        handleChangePage,
        handleChangeRowsPerPage,
        handleCheckboxChange,
        handleCloseActionMenu,
        handleCloseProfileMenu,
        handleGetData,
        handleProfileMenu,
        handleEditUserClick,
        handleDeleteUserClick,
        handleSelectAll,
        handleCloseDialog,
        handleConfirmDelete,
        openDialog,
        userToDelete
    }
}

export default UseMainController