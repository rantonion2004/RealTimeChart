import { Routes, Route } from 'react-router-dom';
import App from '../App';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { ProtectedRoute } from '../routes/ProtectedRoute';
import { RegisterPage } from '../pages/RegisterPage';

export function AppRouter(){
    return (
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/register" element={<RegisterPage/>} />
            <Route
                path="/home"
                element={
                    <ProtectedRoute>
                        <HomePage/>
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}