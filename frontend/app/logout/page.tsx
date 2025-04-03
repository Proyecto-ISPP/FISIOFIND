"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Importar desde next/navigation
import axios from "axios";
import { clearCachedRole } from "@/services/check-role";
import { getApiBaseUrl } from "@/utils/api";

const Logout = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    async function logout() {
      if (isClient) {
        const storedToken = localStorage.getItem("token");
        setToken(storedToken);
        if (token) {
          try {
            // Llama al endpoint /logout solo si hay token
            await axios.post(
              `${getApiBaseUrl()}/api/app_user/logout/`,
              {},
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
          } catch (error) {
            console.error("Error al desloguear:", error);
          }
          // Elimina el token y limpia la caché
          localStorage.removeItem("token");
          clearCachedRole();
        }
      }
      // Redirige a la página principal (o la que desees)
      router.push("/");
    }
    logout();
  }, [router, isClient, token]);

  return null;
};

export default Logout;
