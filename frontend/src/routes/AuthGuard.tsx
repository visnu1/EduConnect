import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthProvider";
import { FC, ReactNode } from "react";

const AuthGuard: FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuth();

    if (!user)
        return <Navigate to="/login" />;

    return <>{children}</>;
};

export default AuthGuard;
