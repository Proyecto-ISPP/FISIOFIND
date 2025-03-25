'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { getApiBaseUrl } from "@/utils/api";

export default function editarCitas() {
  const [test, setTest] = useState("");
  const [paciente, setPaciente] = useState("");
  const [response_text, setResponseText] = useState("");
  const [response_scale, setResponseScale] = useState("");
  const [submitted_at, setSubmittedAt] = useState("");

  
  const [errorMessage, setErrorMessage] = useState("");
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

  function handleSubmit(event) {
    event.preventDefault();

    axios.post(`${getApiBaseUrl()}/api/treatment/admin/sessionTestResponse/create/`,{
      test,
      patient:paciente,
      response_text,
      response_scale,
      submitted_at
    }, {
      headers : {
        "Authorization": "Bearer "+token
      }
    }).then( () => {
        location.href="/admin-management/sessionTestResponse/"
      })
      .catch(error => {
        if (error.response && error.response.data.non_field_errors) {
          setErrorMessage(error.response.data.non_field_errors[0])
        } else if (error.response && error.response.status == 400) {
          let container = ''
          for (const [_, error_msg] of Object.entries(error.response.data)) {
            container += error_msg 
          }
          setErrorMessage(container)
        }else {
          console.error("Error fetching data:", error);
        }
    });
  }

  const [pacientesFetched, setPacientesFetched] = useState([]);
  function searchPaciente(query) {
    if (query.length < 3) {
      return
    }
    axios.get(`${getApiBaseUrl()}/api/app_user/admin/patient/list/search/`+query+'/',{
      headers : {
        "Authorization": "Bearer "+token
      }
    }
    ).then(response => {
        console.log(response.data)
        setPacientesFetched(response.data)
      })
      .catch(error => {
        console.log("Error fetching data:", error);
      });
  }

  return (
    <>
      <div className="admin-header">
        <h1>Crear cita</h1>
      </div>
      <div className="terminos-container">
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="fecha-inicio">Enviado a: </label>
            <input required type="fecha-inicio" id="fecha-inicio" onChange={fechaIn => setSubmittedAt(fechaIn.target.value)}/>
          </div>

          <div>
            <label htmlFor="paciente">Email/Nombre/DNI paciente: </label>
            <input required type="text" id="paciente"  onChange={paciente => {searchPaciente(paciente.target.value)}} />
            <select
              value={paciente}
              onChange={(e) => setPaciente(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">Seleccionar paciente...</option>
              {pacientesFetched && pacientesFetched.map((patient: any) => (
                <option key={patient.id} value={patient.id}>
                  {patient.user.first_name} {patient.user.last_name} ({patient.user.dni}) ({patient.user.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="response-text">Respuesta texto: </label>
            <input required type="text" id="response-text"  onChange={resp => setResponseText(resp.target.value)} />
          </div>

          <div>
            <label htmlFor="response-scale">Respuesta escala: </label>
            <input required type="int" id="response-scale"  onChange={resp => setResponseScale(resp.target.value)} />
          </div>

          {errorMessage && <p className="text-red-500 text-wrap">*{errorMessage}</p>}
          <input type="submit" value="Submit" className="btn-admin" />
        </form>
      </div>

    </>
  );
}
