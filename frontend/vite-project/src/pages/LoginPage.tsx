import {useState, type FormEvent} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import {login} from '../api/auth'

export function LoginPage(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e: FormEvent){
        e.preventDefault();
        setError(null);
        setLoading(true);

        try{
            await login(email, password);
            navigate('/home');
        } catch(err){
            setError(err instanceof Error ? err.message : 'Error al iniciar sesion');
        } finally{
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
                        id="passowrd"
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

        </div>
    );

}