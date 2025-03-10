'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { get_id_from_url } from "@/app/gestion-admin/util";

interface terminoInterface {
  id: string;
  content: string;
  version: string;
  updated_at: string;
  created_at: string;
}

export default function EliminarTermino() {
  const id = get_id_from_url()

  const [termino, setTermino] = useState<terminoInterface | null>(null);
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
    axios.get('http://localhost:8000/api/terminos/list/'+id+'/', {
      headers : {
        "Authorization": "Bearer "+token
      }
    }
    ).then(response => {
        setTermino(response.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  function deleteTermino() {
    axios.delete('http://localhost:8000/api/terminos/delete/'+id+'/', {
      headers : {
        "Authorization": "Bearer "+token
      }
    }
    ).then(() => {
        location.href="/gestion-admin/terminos/"
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }

  return (
    <>
      <div className="admin-header">
        <a href="/gestion-admin/terminos/"><button className="btn-admin">Volver</button></a>
        <h1>Eliminar término</h1>
      </div>
      <div className="terminos-container">
        {termino && <>
          <p style={{fontSize:"1.5rem"}}>¿Quieres borrar el término {termino.id}?</p>
          <div >

            <button className="btn-admin-red" onClick={deleteTermino}>Sí</button>
            <button className="btn-admin-green" onClick={() => location.href="/gestion-admin/terminos/"}>No</button>
          </div>
          </>
        }
        {!termino && <h1>Término no encontrado</h1>
        }    
      </div>

    </>
  );
}
