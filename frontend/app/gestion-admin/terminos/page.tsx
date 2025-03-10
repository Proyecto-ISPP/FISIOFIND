'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { print_time } from "../util";

interface terminoInterface {
  id: string;
  content: string;
  version: string;
  updated_at: string;
  created_at: string;
}

export default function GestionarTerminos() {
  const [terminos, setTerminos] = useState<[terminoInterface] | null>(null);

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
    axios.get('http://localhost:8000/api/terminos/list/', {
      headers : {
        "Authorization": "Bearer "+token
      }
    }
    ).then(response => {
        setTerminos(response.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <>
      <div className="admin-header">
        <a href="/gestion-admin/"><button className="btn-admin">Volver</button></a>
        <h1>Página de administración de términos</h1>
      </div>
      <div className="terminos-container">
        <a href="/gestion-admin/terminos/create"><button className="btn-admin">Crear</button></a>
        <div>
          {terminos && 
            terminos.map(function(termino,key) {
              return <div key={key} className="termino-list-view">
                <h3>{termino.content.substring(0,10)}</h3>
                <p>Versión: {termino.version} </p>
                <p>Editado en: {print_time(termino.updated_at)}</p>
                <p>Creado en: {print_time(termino.created_at)}</p>
                <a href={"/gestion-admin/terminos/view/"+termino.id}><button className="btn-admin-green">Ver</button></a>
                <a href={"/gestion-admin/terminos/edit/"+termino.id}><button className="btn-admin-yellow">Editar</button></a>
                <a href={"/gestion-admin/terminos/delete/"+termino.id}><button className="btn-admin-red">Eliminar</button></a>
              </div>
            })
          }
        </div>
      </div>
    </>
  );
}
