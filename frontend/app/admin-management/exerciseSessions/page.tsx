'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { print_time } from "../util";
import { getApiBaseUrl } from "@/utils/api";

interface exerciseSessionInterface {
  exercise:string;
  session:string;
}


export default function ManageTreatments() {
  const [exerciseSessions, setExerciseSessions] = useState<[exerciseSessionInterface] | null>(null);

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
            console.log("Error fetching data:", error);
            location.href = "..";
          });
      } else {
        location.href = "..";
      }
    }
  }, [isClient, token]);

  // Parametros de busqueda

  const [url, setUrl] = useState(`${getApiBaseUrl()}/api/appointment/admin/list/`);
  useEffect(() => {

    axios.get(url, {
      headers : {
        "Authorization": "Bearer "+token
      }
    }
    ).then(response => {
        setExerciseSessions(response.data.results);
      })
      .catch(error => {
        console.log("Error fetching data:", error);
      });
  }, [token, url]);



  return (
    <>
      <div className="admin-header">
        <a href="/admin-management/"><button className="btn-admin">Volver</button></a>
        <h1>Página de administración de citas</h1>
      </div>
      <div className="terminos-container gap-3">
        <a href="/admin-management/appointments/create"><button className="btn-admin">Crear</button></a>
        <div>
          {exerciseSessions && 
            exerciseSessions.map(function(exerciseS,key) {
              return <div key={key} className="termino-list-view">
                <p>Ejercicio: {exerciseS.exercise}</p>
                <p>Sesión: {exerciseS.session}</p>
                
                <a href={"/admin-management/exerciseSession/view/"+cita.id}><button className="btn-admin-green">Ver</button></a>
                <a href={"/admin-management/exerciseSession/edit/"+cita.id}><button className="btn-admin-yellow">Editar</button></a>
                <a href={"/admin-management/exerciseSession/delete/"+cita.id}><button className="btn-admin-red">Eliminar</button></a>
              </div>
            })
          }
        </div>
      </div>
    </>
  );
}
