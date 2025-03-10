'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { print_time, get_id_from_url } from "@/app/gestion-admin/util";


interface terminoInterface {
  content: string;
  version: string;
  updated_at: string;
  created_at: string;
  modifier:string;
}

export default function VerTermino() {
  const id = get_id_from_url()

  const [termino, setTermino] = useState<terminoInterface | null>(null);
  const token = localStorage.getItem("token")
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

  return (
    <>
      <div className="admin-header">
        <a href="/gestion-admin/terminos"><button className="btn-admin">Volver</button></a>
        <h1>Vista de término</h1>
      </div>
      <div className="terminos-container">
        {termino && <>
          <div className="border-b-2 terminos-container">

            <p><strong>Creado en:</strong> {print_time(termino.created_at)}</p>
            <p><strong>Editado en: </strong>{print_time(termino.updated_at)}</p>
            <p><strong>Último editor:</strong> {termino.modifier} </p>
            <p><strong>Versión:</strong> {termino.version} </p>
          </div>
          <p>{termino.content}</p>
          </>
        }
        {!termino && <h1>Término no encontrado</h1>
        }    
      </div>

    </>
  );
}
