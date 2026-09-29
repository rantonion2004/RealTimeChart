import { Routes, Route } from 'react-router-dom';
import App from '../App';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { ProtectedRoute } from '../routes/ProtectedRoute';
import { RegisterPage } from '../pages/RegisterPage';
import { PublicOnlyRoute } from './PublicOnlyRoute';
import { ProjectsPage } from '../pages/ProjectsPage';
import { DiagramEditorPage } from '../pages/DiagramEditorPage';
import { AppLayout } from '../layouts/AppLayout';
import { EditorLayout } from '../layouts/EditorLayout';

export function AppRouter(){
    return (
        <Routes>
            <Route path="/" element={<App />} />
            
            <Route element={<PublicOnlyRoute/>}>
                <Route path="/login" element={ <LoginPage /> } />
                <Route path="/register" element={ <RegisterPage /> } />
            </Route>

            <Route element={<ProtectedRoute/>}>
                
                <Route element={<AppLayout/>}>
                    
                    <Route
                        path="/home"
                        element={<HomePage/>}
                    />

                    <Route
                        path="/projects"
                        element={<ProjectsPage/>}
                    />

                </Route>

                <Route element={<EditorLayout/>}>
                    <Route
                        path="/projects/:projectId/diagrams/:diagramId"
                        element={
                            <DiagramEditorPage/>
                        }
                    
                    />
                </Route>    

            </Route>
            
        </Routes>
    );
}