'use client';
import { useEffect } from "react";
import axios from "axios";
import { getApiBaseUrl } from "@/utils/api";

const GestionUsuarios = () => {

  const [isClient, setIsClient] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
      if (token) {
        axios
          .get(`${getApiBaseUrl()}/api/app_user/check-role/`, {
            headers: {
              Authorization: "Bearer " + token,
            },
          })
          .then((response) => {
            const role = response.data.user_role;
            if (role != "admin") {
              location.href = "..";
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            location.href = "..";
          });
      } else {
        location.href = "..";
      }
    }
  }, [isClient, token]);

  return (
    <>
        <div className="admin-header">
          <h1 className="text-3xl font-bold text-center">Panel de gestión de usuarios</h1>
        </div>
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex flex-wrap text-wrap items-center justify-center mb-8">
              <p className="text-xl max-w-2xl">Panel de gestión pacientes</p>
              <a href="/admin-management/users/patients/"><button className="btn-admin-green">Acceder</button></a>
          </div>
          <div className="flex flex-wrap items-center justify-center mb-8">
              <p className="text-xl max-w-2xl">Panel de gestión de fisioterapeutas</p>
              <a href="/admin-management/users/physios/"><button className="btn-admin-green">Acceder</button></a>
          </div>
        </div>
    </>
  );
}

export default function Main() {
  return <GestionUsuarios />;
}