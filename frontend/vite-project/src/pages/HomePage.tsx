import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {base} from '../api/base'
import { useAuthActions } from "../hooks/useAuthActions";

export function HomePage(){

    const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const {logoutUser} = useAuthActions();
    async function handleLogout(){
        await logoutUser();
        navigate('/login');
    }

    useEffect(
        () => {
            base()
                .then((result) => {
                    setStatus('ok');
                    setMessage(result);
                })
            .catch( (err) =>{
                setStatus('error');
                setMessage(err instanceof Error ? err.message : 'error Desconocido')
            });
        }, []);
    


    return(
        <div>
            <h1>Home</h1>
            {status == 'loading' && <p>Verificando...</p>}
            {status == 'error' && <p role="alert">{message}</p>}
            {status == 'ok' && <p>Conectando = respuesta del backend: {message}</p>}
            <button onClick={handleLogout}>Cerrar Sesion</button>
        </div>
    );
}