import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Navigate } from "react-router-dom";
import { LOGIN_PATH } from "./paths";
import { AdminModel } from "../models/Admin";

interface Props {
    children: React.ReactNode
}

const ProtectedRoutes = ({ children }: Props) => {
    const authData: AdminModel = useSelector((state: RootState) => state?.authentication?.data) || null!;

    if (!authData) {
        return <Navigate to={LOGIN_PATH} />
    }

    return <>{children}</>
}
export default ProtectedRoutes