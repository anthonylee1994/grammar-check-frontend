import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useAuthStore} from "../stores/authStore";
import React from "react";

interface AuthGuardProps {
    children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({children}) => {
    const navigate = useNavigate();
    const {isAuthenticated} = useAuthStore();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
        }
    }, [isAuthenticated, navigate]);

    if (!isAuthenticated) {
        return null;
    }

    return <React.Fragment>{children}</React.Fragment>;
};
