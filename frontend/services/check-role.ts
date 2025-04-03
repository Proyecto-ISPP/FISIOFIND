// services/check-role.ts
import axios from "axios";

export interface RoleResponse {
  role: string;
}

let cachedRole: string | null = null;

/**
 * Obtiene el rol del usuario usando el token almacenado en localStorage.
 * Si ya se obtuvo previamente, lo retorna desde la cache.
 */
export async function getRole(): Promise<string | null> {
  const token = localStorage.getItem("token");
  if (!token) return null;

  if (cachedRole !== null) {
    return cachedRole;
  }

  try {
    const response = await axios.get<RoleResponse>(
      "http://${getApiBaseUrl()}/api/app_user/check-role/",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    cachedRole = response.data.role;
    return cachedRole;
  } catch (error) {
    console.error("Error al obtener el rol:", error);
    return null;
  }
}

/**
 * Limpia el rol cacheado, por ejemplo, al hacer logout.
 */
export function clearCachedRole() {
  cachedRole = null;
}
