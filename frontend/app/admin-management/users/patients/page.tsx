'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { getApiBaseUrl } from "@/utils/api";

interface pacienteInterface {
  user: string,
  gender: string,
  birth_date: string,
}


export default function GestionarPacientes() {

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

  const [pacientes, setPacientes] = useState<[pacienteInterface] | null>(null);

  useEffect(() => {
    axios.get(`${getApiBaseUrl()}/api/app_user/admin/patient/list/`
    ).then(response => {
        setPacientes(response.data)
        console.log(response.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <>
      <div className="admin-header">
        <a href="/admin-management/"><button className="btn-admin">Volver</button></a>
        <h1>Página de administración de pacientes</h1>
      </div>
      <div className="terminos-container">
        <a href="/admin-management/users/patients/create/"><button className="btn-admin">Crear</button></a>
        <div>
          {pacientes && 
            pacientes.map(function(paciente,key) {
              return (
                <div key={key} className="termino-list-view">
                  <p>Nombre de usuario: {paciente.user.username}</p>
                  <p>Nombre: {paciente.user.first_name}</p>
                  <p>Apellidos: {paciente.user.last_name}</p>
                  <p>Genero paciente: {paciente.user.last_name}</p>
                  
                  <a href={"/admin-management/users/patients/view/"+paciente.id}><button className="btn-admin-green">Ver</button></a>
                  <a href={"/admin-management/users/patients/edit/"+paciente.id}><button className="btn-admin-yellow">Editar</button></a>
                  <a href={"/admin-management/users/patients/delete/"+paciente.id}><button className="btn-admin-red">Eliminar</button></a>
                </div>
            )
            })
          }
        </div>
      </div>
    </>
  );
}
