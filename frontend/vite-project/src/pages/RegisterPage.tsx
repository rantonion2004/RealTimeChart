import { useState, type FormEvent } from "react";
import { useNavigate} from "react-router-dom";
import {register} from "../api/auth"


export function RegisterPage(){
    
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error , setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e : FormEvent){

        e.preventDefault();
        setError(null);
        setLoading(true);

        try{
            await register(displayName,email,password);
            navigate('/home')
        }catch(err) {
            setError(err instanceof Error ? err.message : "No se pudo hacer el registro")
        }finally{
            setLoading(false);
        }
   
    }

    return(
        <div>
            <h1>Registrate</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="displayName">Display Name</label>
                    <input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange = {(dn) => setDisplayName(dn.target.value) }
                    required
                    />
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                    id="email"
                    type="email"
                    value={email}
                    onChange = {(e) => setEmail(e.target.value)}
                    required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(p) => setPassword(p.target.value)}
                    required
                    />
                </div>

                <div>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(cp) => setConfirmPassword(cp.target.value)}
                    required
                    />
                </div>
                {error && <p role="alert">{error}</p>}

                <button type="submit" disabled={loading || password != confirmPassword}>
                    {loading ? "Cargando..." : "Enviar Registro"}
                </button>

            </form>




        </div>
    );

}