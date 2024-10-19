import { useEffect, useState } from "react"
import { UserModel } from "../../../models/user"
import axiosInstance from "../../../configs/axios"
import { GET_ALL_USER } from "../../../configs/endPoint/login"

const UseMainController = () => {

    const [data, setData] = useState<UserModel[]>([])

    const handleGetData = async () => {
        try {
            const res = await axiosInstance.get(GET_ALL_USER);
            setData(res?.data?.data)
            console.log(res?.data?.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        handleGetData();
    }, []);

    return {
        data,
    }
}

export default UseMainController