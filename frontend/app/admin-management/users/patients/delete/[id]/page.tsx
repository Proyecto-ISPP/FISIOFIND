'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { get_id_from_url } from "@/app/admin-management/util";
import { getApiBaseUrl } from "@/utils/api";

interface pacienteInterface {
  foto: string;
  dni: string;
  telefono: string;
  codigoPostal: string;
  fechaNacimiento: string;
  genero: string;
  estadoCuenta: string;
}

export default function EliminarPaciente() {
  const id = get_id_from_url()

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

  const [paciente, setPaciente] = useState<pacienteInterface | null>(null);

  useEffect(() => {
    // TODO: set url
    axios.get(
    ).then(response => {
        setPaciente(response.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  function deletePaciente() {
    // TODO: PUT URL
    axios.delete(''
    ).then(() => {
        location.href="/admin-management/users/patients/"
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }

  return (
    <>
      <div className="admin-header">
        <a href="/admin-management/users/patients/"><button className="btn-admin">Volver</button></a>
        <h1>Eliminar paciente</h1>
      </div>
      <div className="admin-header">
        {paciente && <>
          <p>¿Quieres borrar el paciente? ten en cuenta de que no se puede borrar a un paciente, sino que solo se puede "desactivar" su cuenta. El borrado de datos se tiene que hacer manualmente accediendo a la base de datos.</p>
          <button className="btn-admin-red" onClick={deletePaciente}>Sí</button>
          <button className="btn-admin-green" onClick={() => location.href="/admin-management/users/patients/"}>No</button>
          </>
        }
        {!paciente && <h1>Paciente no encontrado</h1>
        }    
      </div>

    </>
  );
}
