'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import {get_id_from_url } from "@/app/admin-management/util";
import { getApiBaseUrl } from "@/utils/api";

interface sessionTestResponseInterface {
  id: string;
  test:string;
  patient:string;
  response_text:string;
  response_scale:string;
  submitted_at:string;
}


export default function EditSessionTestResponse() {

  const id = get_id_from_url()

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
          setPacienteFetched({user:{"first_name":"No","last_name":"encontrado"}})
        }
      })
      .catch(error => {
        if (error.response && error.response.status == 404) {
          setPacienteFetched({user:{"first_name":"No","last_name":"encontrado"}})
        } else {

          console.error("Error fetching data:", error);
        }
      });
  }


  useEffect(() => {
    if (pacienteFetched && pacienteFetched.email){
      searchPacientes(pacienteFetched.email)
    }
  },[ pacienteFetched])

  const [sessionTestResponse, SetSessionTestResponse] = useState<sessionTestResponseInterface | null>(null);

  const [test, setTest] = useState("");
  const [paciente, setPaciente] = useState("");
  const [response_text, setResponseText] = useState("");
  const [response_scale, setResponseScale] = useState("");
  const [submitted_at, setSubmittedAt] = useState("");


  useEffect(() => {
    axios.get(`${getApiBaseUrl()}/api/appointment/admin/list/`+id+'/',{
      headers : {
        "Authorization": "Bearer "+token
      }
    }
    ).then(response => {
        SetSessionTestResponse(response.data);
        console.log(response.data)
        setTest(response.data.test)
        setResponseText(response.data.response_text)
        setResponseScale(response.data.response_scale)
        setSubmittedAt(response.data.submitted_at)
      }, {
        headers : {
          "Authorization": "Bearer "+token
        }
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  function handleSubmit(event) {
    event.preventDefault();

    axios.put(`${getApiBaseUrl()}/api/treatment/admin/edit/`+id+'/',{
      test,
      patient:paciente,
      response_text,
      response_scale,
      submitted_at
    },{
      headers : {
        "Authorization": "Bearer "+token
      }
    }
  ).then(() => {
        location.href="/admin-management/appointments/"
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
  function searchPacientes(query) {
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

  const [fisiosFetched, setFisiosFetched] = useState([]);
  function searchFisios(query) {
    axios.get(`${getApiBaseUrl()}/api/app_user/admin/physio/list/search/`+query+'/',{
      headers : {
        "Authorization": "Bearer "+token
      }
    }
    ).then(response => {
        setFisiosFetched(response.data)
      })
      .catch(error => {
        console.log("Error fetching data:", error);
      });
  }

  return (
    <>
      <div className="admin-header">
        <a href="/admin-management/appointments/"><button className="btn-admin">Volver</button></a>
        <h1>Editar cita</h1>
      </div>
      <div className="terminos-container">
        {sessionTestResponse && <>
          <form onSubmit={handleSubmit}>

            <div>
              <label htmlFor="es-online">¿Es la cita online?: </label>
              <select value={esOnline ? "true" : "false"} name="es-online" id="es-online" onChange={online => setEsOnline(online == "true" ? true : false)} >
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            </div>

            <div>
              <label htmlFor="paciente">Email/Nombre/DNI paciente: </label>
              <input type="text" id="paciente"  onChange={paciente => {searchPacientes(paciente.target.value)}} />
              <select
                value={paciente}
                onChange={(e) => setPaciente(e.target.value)}
                className="border p-2 rounded"
              >
                <option value={-1}>Seleccionar paciente...</option>
                {pacientesFetched && pacientesFetched.map((patient: any) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.user.first_name} {patient.user.last_name} ({patient.user.dni}) ({patient.user.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="fisio">Respuesta texta: </label>
              <input type="text" id="fisio"  onChange={fisio => {searchFisios(fisio.target.value)}} />
            </div>

            <div className="json-service">
              <label htmlFor="respuesta">Respuesta texto:</label>
              <textarea required id="respuesta" onChange={text => setResponseText(text.target.value)}></textarea>
            </div>

            <div>
              <label htmlFor="estado-cita">Estado de la cita: </label>
              <select  name="estado-cita" id="estado-cita" onChange={estado_cita => setEstado(estado_cita.target.value)} >
                <option value="finished">Finalizada</option>
                <option value="confirmed">Confirmada</option>
                <option value="canceled">Cancelada</option>
                <option value="booked">Reservada</option>
              </select>
            </div>  

            <div className="json-service">
              <label htmlFor="alternativas">Alternativas:</label>
              <textarea  value={alternativas} id="alternativas" onChange={altr => setAlternativas(altr.target.value)}></textarea>
            </div>

            {errorMessage && <p className="text-red-500">*{errorMessage}</p>}
            <input type="submit" value="Submit" className="btn-admin" />
          </form>
          </>
        }
        {!cita && <h1>Cita no encontrada</h1>
        }   
      </div>
    </>
  );
}
