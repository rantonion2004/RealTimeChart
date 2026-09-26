import { Routes, Route } from 'react-router-dom';
import App from '../App';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { ProtectedRoute } from '../routes/ProtectedRoute';
import { RegisterPage } from '../pages/RegisterPage';
import { PublicOnlyRoute } from './PublicOnlyRoute';
import { ProjectsPage } from '../pages/ProjectsPage';

export function AppRouter(){
    return (
        <Routes>
            <Route path="/" element={<App />} />
            
            <Route path="/login" element={
                <PublicOnlyRoute>
                    <LoginPage />
                </PublicOnlyRoute>} />

            <Route path="/register" element={
                <PublicOnlyRoute>
                    <RegisterPage />
                </PublicOnlyRoute>} />

            <Route
                path="/home"
                element={
                    <ProtectedRoute>
                        <HomePage/>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/projects"
                element={
                    <ProtectedRoute>
                        <ProjectsPage />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}