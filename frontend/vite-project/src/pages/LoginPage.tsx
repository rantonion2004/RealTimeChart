import {useState, type FormEvent} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { useAuthActions } from '../hooks/useAuthActions';

export function LoginPage(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { loginWithPassword, loginWithGoogle } = useAuthActions();
    const navigate = useNavigate();

    async function handleSubmit(e: FormEvent){
        e.preventDefault();
        setError(null);
        setLoading(true);

        try{
            await loginWithPassword(email, password);
            navigate('/home');
        } catch(err){
            setError(err instanceof Error ? err.message : 'Error al iniciar sesion');
        } finally{
            setLoading(false);
        }

    }

    async function handleGoogleSuccess(credentialResponse: CredentialResponse){

        const idToken = credentialResponse.credential;
        //console.log(idToken)
        if(!idToken) {
            setError('IdToken Invalido')
            return;
        }
        //console.log(idToken)
        setError(null);
        setLoading(true);
        try{
            await loginWithGoogle(idToken);
            //console.log(idToken);
            navigate('/home');
        } catch(err){
            setError(err instanceof Error ? err.message: 'Error al iniciar sesion con google');

        }finally{
            setLoading(false);
        }
    }

    return(
        <div>
            <h1>Iniciar sesion</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor='email'>Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor='password'>Password</label>
                    <input 
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e)=> setPassword(e.target.value)}
                        required
                    />
                </div>

                {error && <p role="alert">{error}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? "Entrando...": "Entrar"}
                </button>
            </form>

            <p>No tienes cuenta? 
                <Link to="/register">Registrate</Link>
            </p>
            <p>Proveedores Externos </p>
            <div>
                {loading ? (
                    <span aria-live="polite">Iniciando sesión...</span>
                ) : (
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => setError('Inicio de Google inválido')}
                    />
                )}
            </div>

        </div>
    );

}