//api/base.ts
// endpoint basico para probar si el backend esta
// corriendo, aun no checa si el usuario es admin, unicamente
// es para que, al entrar a home, sea llamado y verificar si el
// JWT esta funcionando.

import { apiFetch } from "./client";
import { extractErrorMessage } from "./client";

export async function base(): Promise<string> {
    const response = await apiFetch("/api/basic/ereadmin", {
        method: "GET",
    });

    if (!response.ok) {
        throw new Error(await extractErrorMessage(response, "No autorizado"));
    }

    return response.text(); // o response.json() si el endpoint devuelve JSON
}