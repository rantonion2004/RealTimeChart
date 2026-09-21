// /api/auth.ts
// file to call all the auth endpoints 
import { publicFetch, extractErrorMessage, apiFetch} from "./client";
import { tokenStorage } from "../auth/tokenStorage";

export interface AuthResponse{
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAt: string;
}

//funcion para hacer el request de Auth endpoints publicos
async function handleAuthRequest(path: string, body: object, fallbackError: string): Promise<AuthResponse>{
    //obtener el response(method post y el body )
    const response = await publicFetch(path, {
        method: 'POST',
        body: JSON.stringify(body)
    })

    //si no es correcto el result, retorna un Error obtenido mediante extractErrorMessage
    if(!response.ok)
        throw new Error(await extractErrorMessage(response, fallbackError));

    //si no falla, devuelve un auth response
    // 
    const data: AuthResponse = await response.json();
    tokenStorage.setTokens(data.accessToken, data.refreshToken)
    return data
}

export async function register(displayName: string, email: string, password: string): Promise<AuthResponse> {
    return handleAuthRequest('/api/auth/register', {displayName, email, password}, "No se pudo registrar");
}

export async function login(email: string, password: string): Promise<AuthResponse>{
    return handleAuthRequest('/api/auth/login', {email, password}, "No se pudo hacer login");
}

export async function external(provider: string, idToken: string): Promise<AuthResponse>{
    return handleAuthRequest('/api/auth/external', {provider, idToken}, "No se pudo identificar con proveedor externo");
}

export async function logout(): Promise<void>{
    //obtener el token desde el storage
    const refreshToken = tokenStorage.getRefreshToken();
    
    if(!refreshToken){
        tokenStorage.clear();
        return;
    }

    //si falla el logout, de todos modos te saca de la sesion
    //ya que en finally hay un tokenStorage.clear.
    try {
        if(refreshToken){
            await apiFetch('/api/auth/logout', 
            {
                method: 'POST',
                body: JSON.stringify({
                    refreshToken
                })
            });
        }
    }
    finally {
        tokenStorage.clear();
    }

}
