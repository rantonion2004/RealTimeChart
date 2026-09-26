import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react'
import {useAuth} from '../hooks/useAuth';
import {NavBar} from '../components/NavBar';
import { useAuthActions } from '../hooks/useAuthActions';
//import { useNavigate } from 'react-router-dom';


export function ProtectedRoute({children}: {children: ReactNode}){
    const {isAuthenticated, displayName} = useAuth();
    //const navigate = useNavigate();
    const {logoutUser} = useAuthActions();

    async function handleLogout(){
        await logoutUser();
        //navigate('/login');
    }

    
    return !isAuthenticated ? <Navigate to="/login" replace />: 
    <>
        <NavBar onLogout={handleLogout} dispName={displayName} />
        {children}
    </>;
}