import { useEffect, useState } from "react"
import { UserModel } from "../../models/user"
import { Box, Typography } from "@mui/material"
import axiosInstance from "../../configs/axios"

const ManageUserPage = () => {

  const [data,setData] = useState<UserModel[]>([]);

  const GET_ALL_USER: string = '/user/get-all'

  const handleGetData = async () => {
    try {
      const res = await axiosInstance.get(GET_ALL_USER);
      setData(res?.data?.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    handleGetData();
  }, []);


  return (
    
    <Box>
      {data?.map((item, index) => (
        <Box key={index}>
          <Typography>{item?.username}</Typography>
          <Typography>{item?.email}</Typography>
        </Box>
      ))}
    </Box>


  )
}

export default ManageUserPage