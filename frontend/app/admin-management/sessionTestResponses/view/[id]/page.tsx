'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { print_time, get_id_from_url } from "@/app/admin-management/util";
import { getApiBaseUrl } from "@/utils/api";

interface sessionTestResponseInterface {
  id: string;
  test:string;
  patient:string;
  response_text:string;
  response_scale:string;
  submitted_at:string;
}

export default function ViewSessionTestResponse() {
  const id = get_id_from_url()

  const [sessionTestResponse, SetSessionTestResponse] = useState<sessionTestResponseInterface | null>(null);

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

  const [pacienteFetched, setPacienteFetched] = useState(null);
  function searchPaciente(id) {
    axios.get(`${getApiBaseUrl()}/api/app_user/admin/patient/list/`+id+'/',{
      headers : {
        "Authorization": "Bearer "+token
      }
    }
    ).then(response => {
        if (response.data.user) {
          setPacienteFetched(response.data.user)
        } else {
          setPacienteFetched({"first_name":"No","last_name":"encontrado"})
        }
      })
      .catch(error => {
        if (error.response && error.response.status == 404) {
          setPacienteFetched({"first_name":"No","last_name":"encontrado"})
        } else {

          console.error("Error fetching data:", error);
        }
      });
  }

  useEffect(() => {
    axios.get(`${getApiBaseUrl()}/api/treatment/admin/sessionTestResponse/list/`+id+'/', {
      headers : {
        "Authorization": "Bearer "+token
      }
    }
    ).then(response => {
        SetSessionTestResponse(response.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    if (sessionTestResponse) {
      searchPaciente(sessionTestResponse.patient)
    }
  },[sessionTestResponse])
  return (
    <>
      <div className="admin-header">
        <a href="/admin-management/sessionTestResponses/"><button className="btn-admin">Volver</button></a>
        <h1>Vista de respuesta de prueba de sesión</h1>
      </div>
      <div className="terminos-container text-left">
        {sessionTestResponse && <>
          <p>Test: {sessionTestResponse.test}</p>
          <p>Nombre del paciente: {pacienteFetched && pacienteFetched.first_name + ' ' + pacienteFetched.last_name}</p>
          <p>Respuesta texto: {sessionTestResponse.response_text} </p>
          <p>Respuesta escala: {sessionTestResponse.response_scale} </p>
          <p>Enviado a: {print_time(sessionTestResponse.submitted_at)}</p>
          </>
        }
        {!sessionTestResponse && <h1>Respuesta de prueba de sesión no encontrada</h1>
        }    
      </div>

    </>
  );
}
