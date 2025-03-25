'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { print_time } from "../util";
import { getApiBaseUrl } from "@/utils/api";

interface sessionTestResponseInterface {
  id: string;
  test:string;
  patient:string;
  response_text:string;
  response_scale:string;
  submitted_at:string;
}


export default function ManageSessionTestResponse() {
  const [sessionTestResponses, SetSessionTestResponses] = useState<[sessionTestResponseInterface] | null>(null);

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

  // Parametros de busqueda

  const [url, setUrl] = useState(`${getApiBaseUrl()}/api/appointment/admin/list/`);

  useEffect(() => {
    axios.get(url, {
      headers : {
        "Authorization": "Bearer "+token
      }
    }
    ).then(response => {
        SetSessionTestResponses(response.data.results);
      })
      .catch(error => {
        console.log("Error fetching data:", error);
      });
  }, [token]);



  return (
    <>
      <div className="admin-header">
        <a href="/admin-management/"><button className="btn-admin">Volver</button></a>
        <h1>Página de administración de citas</h1>
      </div>
      <div className="terminos-container gap-3">
        <a href="/admin-management/appointments/create"><button className="btn-admin">Crear</button></a>
       <div>
          {sessionTestResponses && 
            sessionTestResponses.map(function(sessionTestR,key) {
              return <div key={key} className="termino-list-view">
                <p>Enviado a: {print_time(sessionTestR.submitted_at)}</p>
                <p>Test: {sessionTestR.test}</p>
                <p>Paciente: {sessionTestR.patient}</p>
                <p>Respuesta: {sessionTestR.response_text}</p>
                <p>Respuesta escala: {sessionTestR.response_scale}</p>

                <a href={"/admin-management/sessionTestsResponses/view/"+sessionTestR.id}><button className="btn-admin-green">Ver</button></a>
                <a href={"/admin-management/sessionTestsResponses/edit/"+sessionTestR.id}><button className="btn-admin-yellow">Editar</button></a>
                <a href={"/admin-management/sessionTestsResponses/delete/"+sessionTestR.id}><button className="btn-admin-red">Eliminar</button></a>
              </div>
            })
          }
        </div>
        <div>
          {
            citas && citas.length > 0 && <>
              <div className="flex flex-row gap-4 mt-8"> 
                {
                  previusUrl && <button onClick={() => {setLengthCounter(lengthCounter-lastLength);setUrl(previusUrl)}} className="btn-admin">Anterior</button>
                }
                <p>Viendo {lengthCounter+citas.length} elementos de {totalLength} elementos </p>
                {
                  nextUrl &&  <button onClick={() => {setLastLength(citas?.length);setLengthCounter(lengthCounter+citas?.length);setUrl(nextUrl)}} className="btn-admin">Siguiente</button>
                }
              </div>
            </>
          }
          {
            (!citas || !citas.length) && <p> No se encontraron citas</p>
          }
        </div>
      </div>
    </>
  );
}
