'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { getApiBaseUrl } from "@/utils/api";

interface sessionTestInterface {
  id: string;
  session: string;
  question: string;
  test_type: string;
  scale_labels: string;
}

const test_types = {
  "text": "Text",
  "scale": "Scale"
}


export default function ManageTreatments() {
  const [sessionTests, setSessionTests] = useState<[sessionTestInterface] | null>(null);

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

  const [url, setUrl] = useState(`${getApiBaseUrl()}/api/appointment/admin/list/`);
  useEffect(() => {

    axios.get(url, {
      headers : {
        "Authorization": "Bearer "+token
      }
    }
    ).then(response => {
        setSessionTests(response.data.results);
      })
      .catch(error => {
        console.log("Error fetching data:", error);
      });
  }, [token, url]);

  return (
    <>
      <div className="admin-header">
        <a href="/admin-management/"><button className="btn-admin">Volver</button></a>
        <h1>Página de administración de tests de sesiones</h1>
      </div>
      <div className="terminos-container gap-3">
        <a href="/admin-management/appointments/create"><button className="btn-admin">Crear</button></a>
        <div>
          {sessionTests && 
            sessionTests.map(function(sessionT,key) {
              return <div key={key} className="termino-list-view">
                <p>Sesión: {sessionT.session}</p>
                <p>Pregunta: {sessionT.session}</p>
                <p>Tipo test: {test_types[sessionT.test_type]}</p>
                <p>Escala: {sessionT.scale_labels}</p>
                
                <a href={"/admin-management/sessionTests/view/"+sessionT.id}><button className="btn-admin-green">Ver</button></a>
                <a href={"/admin-management/sessionTests/edit/"+sessionT.id}><button className="btn-admin-yellow">Editar</button></a>
                <a href={"/admin-management/sessionTests/delete/"+sessionT.id}><button className="btn-admin-red">Eliminar</button></a>
              </div>
            })
          }
        </div>
      </div>
    </>
  );
}
