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
    axios.get('http://localhost:8000/api/app_appointment/appointment/admin/list/'+id+'/', {
      headers : {
        "Authorization": "Bearer "+token
      }
    }
    ).then(response => {
        setCita(response.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  function deleteCita() {
    axios.delete('http://localhost:8000/api/app_appointment/appointment/admin/delete/'+id+'/', {
      headers : {
        "Authorization": "Bearer "+token
      }
    }
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
      <div className="terminos-container">
        {cita && <>
          <p style={{fontSize:"1.5rem"}}>¿Quieres borrar la cita {cita.id}?</p>
          <div>
            <button className="btn-admin-red" onClick={deleteCita}>Sí</button>
            <button className="btn-admin-green" onClick={() => location.href="/gestion-admin/citas/"}>No</button>
          </div>
          </>
        }
        {!cita && <h1>Cita no encontrada</h1>
        }    
      </div>

    </>
  );
}
