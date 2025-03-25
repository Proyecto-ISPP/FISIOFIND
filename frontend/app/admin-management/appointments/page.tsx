'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { print_time } from "../util";
import { getApiBaseUrl } from "@/utils/api";

interface citaInterface {
  id: string;
  start_time: string;
  end_time: string;
  is_online: string;
  service: string;
  physiotherapist: string;
  patient: string;
  status: string;
}

const estados_cita = {
  "finished": "Finalizada",
  "confirmed": "Confirmada",
  "canceled": "Cancelada",
  "booked": "Reservada",
  "Finished": "Finalizada",
  "Confirmed": "Confirmada",
  "Canceled": "Cancelada",
  "Booked": "Reservada",
}


export default function GestionarCitas() {
  const [citas, setCitas] = useState<[citaInterface] | null>(null);

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

  useEffect(() => {
    axios.get(`${getApiBaseUrl()}/api/appointment/admin/list/`, {
      headers : {
        "Authorization": "Bearer "+token
      }
    }
    ).then(response => {
        setCitas(response.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, [token]);

  return (
    <>
      <div className="admin-header">
        <a href="/admin-management/"><button className="btn-admin">Volver</button></a>
        <h1>Página de administración de citas</h1>
      </div>
      <div className="terminos-container">
        <a href="/admin-management/appointments/create"><button className="btn-admin">Crear</button></a>
        <div>
          {citas && 
            citas.map(function(cita,key) {
              return <div key={key} className="termino-list-view">
                <p>Inicio cita: {print_time(cita.start_time)}</p>
                <p>Final cita: {print_time(cita.end_time)}</p>
                <p>Es online: {cita.is_online ? "Sí" : "No"}</p>
                <p>Estado: {estados_cita[cita.status]}</p>
                
                <a href={"/admin-management/appointments/view/"+cita.id}><button className="btn-admin-green">Ver</button></a>
                <a href={"/admin-management/appointments/edit/"+cita.id}><button className="btn-admin-yellow">Editar</button></a>
                <a href={"/admin-management/appointments/delete/"+cita.id}><button className="btn-admin-red">Eliminar</button></a>
              </div>
            })
          }
        </div>
      </div>
    </>
  );
}
