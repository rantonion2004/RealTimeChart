import { Navigate } from "react-router-dom";

import { type ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";

export function PublicOnlyRoute({children}: {children: ReactNode}){
    const{isAuthenticated} = useAuth();
    return isAuthenticated ? <Navigate to="/home" replace /> : <>{children}</>
}