import React, { createContext, ReactNode, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
import { Student } from "../interfaces/Student";

interface AuthGuardProps {
    children: ReactNode;
}

interface AuthContextType<T> {
    user: T | null;
    login: (data: T, redirectPath: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType<Student> | null>(null);

export const AuthProvider: React.FC<AuthGuardProps> = ({ children }) => {
    const [user, setUser, removeUser] = useLocalStorage<Student | null>("user", null);
    const navigate = useNavigate();

    const login = (data: Student, redirectPath: string) => {
        setUser(data);
        navigate(redirectPath, { replace: true });
    };

    const logout = () => {
        removeUser();
        localStorage.clear(); // BAD
        navigate("/login", { replace: true });
    };

    // These user, login and logout proerties could be passed direcctly to the value prop but, it passes new values each time when the component is re-rendered
    // THUS IT KEEPS MEMORY AND NEW VALUES ARE PASSED ONLY WHEN THE DEPENDANCY CHANGES
    const value = useMemo(() => ({ user, login, logout }), [user]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType<Student> => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
