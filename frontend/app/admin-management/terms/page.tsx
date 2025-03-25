"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { print_time } from "../util";
import { getApiBaseUrl } from "@/utils/api";

interface terminoInterface {
  id: string;
  content: string;
  version: string;
  updated_at: string;
  created_at: string;
}

export default function GestionarTerminos() {
  const [terminos, setTerminos] = useState<[terminoInterface] | null>(null);

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
    axios
      .get(`${getApiBaseUrl()}/api/terms/list/`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        setTerminos(response.data);

      })
      .catch(error => {
        console.log("Error fetching data:", error);
      });
  }, [token]);

  return (
    <>
      <div className="admin-header">
        <a href="/admin-management/">
          <button className="btn-admin">Volver</button>
        </a>
        <h1>Página de administración de términos</h1>
      </div>
      <div className="terminos-container">
        <a href="/admin-management/terms/create">
          <button className="btn-admin">Crear</button>
        </a>
        <div>
          {terminos && 
            terminos.map(function(termino,key) {
              return <div key={key} className="termino-list-view">
                {
                  termino.content && 
                  <h3>{termino.content.substring(0,10)}</h3>
                }
                {termino.version && 
                  <p>Versión: {termino.version.substring(0,10)} </p>
                }
                {
                  termino.updated_at && 
                  <p>Editado en: {print_time(termino.updated_at)}</p>
                }
                {
                  termino.created_at && 
                  <p>Creado en: {print_time(termino.created_at)}</p>
                }
                <a href={"/admin-management/terms/view/"+termino.id}><button className="btn-admin-green">Ver</button></a>
                <a href={"/admin-management/terms/edit/"+termino.id}><button className="btn-admin-yellow">Editar</button></a>
                <a href={"/admin-management/terms/delete/"+termino.id}><button className="btn-admin-red">Eliminar</button></a>
              </div>
            })
          }
        </div>
      </div>
    </>
  );
}
