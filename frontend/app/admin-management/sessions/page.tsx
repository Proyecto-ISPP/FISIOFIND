'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { getApiBaseUrl } from "@/utils/api";

interface sessionInterface {
  id: string;
  name: string;
  treatment: string;
  day_of_week: string;
}

const days_of_the_week = {
  "Monday": "Lunes",
  "Tuesday": "Martes",
  "Wednesday": "Miércoles",
  "Thursday": "Jueves",
  "Friday": "Viernes",
  "Saturday": "Sábado",
  "Sunday": "Domingo",
}


export default function ManageSessions() {
  const [sessions, setSession] = useState<[sessionInterface] | null>(null);

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

  const [url, setUrl] = useState(`${getApiBaseUrl()}/api/appointment/admin/list/`);
  useEffect(() => {
 
    axios.get(url, {
      headers : {
        "Authorization": "Bearer "+token
      }
    }
    ).then(response => {
        setSession(response.data.results);
      })
      .catch(error => {
        console.log("Error fetching data:", error);
      });
  }, [token, url]);



  return (
    <>
      <div className="admin-header">
        <a href="/admin-management/"><button className="btn-admin">Volver</button></a>
        <h1>Página de administración de sesiones</h1>
      </div>
      <div className="terminos-container gap-3">
        <a href="/admin-management/appointments/create"><button className="btn-admin">Crear</button></a>
        <div>
          {sessions && 
            sessions.map(function(session,key) {
              return <div key={key} className="termino-list-view">
                <p>Nombre: {session.name}</p>
                <p>Día: {days_of_the_week[session.day_of_week]}</p>
                <p>Tratamiento: {session.treatment}</p>
                
                <a href={"/admin-management/sessions/view/"+session.id}><button className="btn-admin-green">Ver</button></a>
                <a href={"/admin-management/sessions/edit/"+session.id}><button className="btn-admin-yellow">Editar</button></a>
                <a href={"/admin-management/sessions/delete/"+session.id}><button className="btn-admin-red">Eliminar</button></a>
              </div>
            })
          }
        </div>
      </div>
    </>
  );
}
