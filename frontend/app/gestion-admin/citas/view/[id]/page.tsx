'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { print_time, get_id_from_url } from "@/app/gestion-admin/util";


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

export default function VerCita() {
  const id = get_id_from_url()

  const [cita, setCita] = useState<citaInterface | null>(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/app_appointment/appointment/admin/list/'+id+'/'
    ).then(response => {
        setCita(response.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <>
      <div className="admin-header">
        <a href="/gestion-admin/citas"><button className="btn-admin">Volver</button></a>
        <h1>Vista de cita</h1>
      </div>
      <div className="terminos-container">
        {cita && <>
          <p>Inicio cita: {print_time(cita.start_time)}</p>
          <p>Final cita: {print_time(cita.end_time)}</p>
          <p>Es online: {cita.is_online ? "Sí" : "No"}</p>
          <p>Estado: {estados_cita[cita.status]}</p>
          <p>Id del paciente: {cita.patient} </p>
          <p>Id del fisioterapeuta: {cita.physiotherapist} </p>
          <p>Servicios: {JSON.stringify(cita.service)} </p>
          </>
        }
        {!cita && <h1>Cita no encontrada</h1>
        }    
      </div>

    </>
  );
}
