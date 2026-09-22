// /api/client.ts
//File to call refresh token endpoint and a general
//api URL for the other functions that call backend endpoint
import { tokenStorage } from "../auth/tokenStorage";

const API_URL = import.meta.env.VITE_API_URL;

let refreshPromise: Promise<boolean> | null = null;

async function refreshTokens() : Promise<boolean>{
    //get RT from storage
    const refreshToken = tokenStorage.getRefreshToken();
    if(!refreshToken) return false;

    //fetch reponse with RT
    const response = await fetch(`${API_URL}/api/auth/refresh` ,{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({refreshToken}),
    });

    if(!response.ok) return false;

    //assign new tokens to storage using the response
    const data = await response.json();
    tokenStorage.setTokens(data.accessToken, data.refreshToken);
    return true;
    

}

//funcion para endpoints publicos del backend
export async function publicFetch(path: string, options: RequestInit = {}):Promise<Response> {
    return fetch(`${API_URL}${path}`, {
        ...options,
        headers:{
            'Content-Type' : 'application/json',
            ...options.headers,
        },
    });
}

//funcion para obtener errores
//si si logra obtener el error y el detail, lo obteiene, sino, agarra un fallback message
export async function extractErrorMessage(response: Response, fallback: string) : Promise<string>{
    try{
        const problem = await response.json();
        return problem.detail ?? fallback;
    }
    catch{
        return fallback;
    }
}

//Method to fetch any endpoint with bearer auth
export async function apiFetch(path: string, options: RequestInit = {}):Promise<Response>{

    //get the AT from the storage
    const accessToken = tokenStorage.getAccessToken();

    //basic function for a fetch
    const doFetch = (token: string | null) =>
        fetch(`${API_URL}${path}`, {
            ...options,
            headers: {
                'Content-Type' : 'application/json',
                ...(token ? {Authorization: `Bearer ${token}`}: {}),
                ...options.headers,
            },
        });
    
    //obtain the response
    let response = await doFetch(accessToken);
    
    //En caso de que el AT justo haya expirado se necesita hacer refresh del token
    if(response.status == 401){
        //Si hay mas de una llamada intentando hacer request con un AT expirado,
        //Se debe de verificar que solo se haga refresh una vez.
        //Si el refreshPromise es null: aun nadie ha intentado obtener un nuevo token
        if (!refreshPromise) {
            //el primero en hacer la request, cambia el valor de refreshPromise a un promise
            //que finalmente da null despues de intentar pedir el refresh token.
            refreshPromise = refreshTokens().finally(() => {
            refreshPromise = null;
            });
        }

        //se espera el valor del refreshPromise
        //si varias llamadas hacen la misma promise (await Promise X)
        //dada por el request en pedir un promise, 
        //al terminar la promesa todas reciben el mismo resultado
        //(true si si se obtiene el token.)
        //entonces, refreshPromise cambia a null y refreshed obtiene un booleano
        //no se crean multiples estancias, esperan el mismo objeto
        //Promise x a que termine.
        const refreshed = await refreshPromise;

        //al obtener refreshed, cada request:
        //1: termina haciendo el fetch al endpoint con el AT
        //2: termina haciendole clear al token storage y mandando error
        if (refreshed) {
            response = await doFetch(tokenStorage.getAccessToken());
        } else {
            //si falla el intento de hacer refresh token, eso significa
            //que el refresh expiro y avento un 401 
            tokenStorage.clear();
            window.location.href = "/login";
            throw new Error("Sesion expirada");
        }
    }

    return response;
}
