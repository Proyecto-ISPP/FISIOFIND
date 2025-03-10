'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { print_time } from "../util";

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

  const token = localStorage.getItem("token")
  useEffect(() => {    
    if (token) {
      axios.get("http://127.0.0.1:8000/api/app_user/check-role/", {
        headers : {
          "Authorization": "Bearer "+token
        }
      }
      ).then(response => {
          const role = response.data.user_role;
          if (role != "admin") {
            location.href = ".."
          }
        })
        .catch(error => {
          console.error("Error fetching data:", error);
          location.href = ".."
        });
    } else {
      location.href = ".."
    }
  },[])

  useEffect(() => {
    axios.get('http://localhost:8000/api/app_appointment/appointment/admin/list/', {
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
  }, []);

  return (
    <>
      <div className="admin-header">
        <a href="/gestion-admin/"><button className="btn-admin">Volver</button></a>
        <h1>Página de administración de citas</h1>
      </div>
      <div className="terminos-container">
        <a href="/gestion-admin/citas/create"><button className="btn-admin">Crear</button></a>
        <div>
          {citas && 
            citas.map(function(cita,key) {
              return <div key={key} className="termino-list-view">
                <p>Inicio cita: {print_time(cita.start_time)}</p>
                <p>Final cita: {print_time(cita.end_time)}</p>
                <p>Es online: {cita.is_online ? "Sí" : "No"}</p>
                <p>Estado: {estados_cita[cita.status]}</p>
                
                <a href={"/gestion-admin/citas/view/"+cita.id}><button className="btn-admin-green">Ver</button></a>
                <a href={"/gestion-admin/citas/edit/"+cita.id}><button className="btn-admin-yellow">Editar</button></a>
                <a href={"/gestion-admin/citas/delete/"+cita.id}><button className="btn-admin-red">Eliminar</button></a>
              </div>
            })
          }
        </div>
      </div>
    </>
  );
}
