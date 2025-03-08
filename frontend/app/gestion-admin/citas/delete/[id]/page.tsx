'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { get_id_from_url } from "@/app/gestion-admin/util";

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
export default function EliminarCitas() {
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

  function deleteCita() {
    axios.delete('http://localhost:8000/api/app_appointment/appointment/admin/delete/'+id+'/'
    ).then(() => {
        location.href="/gestion-admin/citas/"
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }

  return (
    <>
      <div className="admin-header">
        <a href="/gestion-admin/citas/"><button className="btn-admin">Volver</button></a>
        <h1>Eliminar cita</h1>
      </div>
      <div className="admin-header">
        {cita && <>
          <p>¿Quieres borrar la cita {cita.id}?</p>
          <button className="btn-admin-red" onClick={deleteCita}>Sí</button>
          <button className="btn-admin-green" onClick={() => location.href="/gestion-admin/citas/"}>No</button>
          </>
        }
        {!cita && <h1>Cita no encontrada</h1>
        }    
      </div>

    </>
  );
}
