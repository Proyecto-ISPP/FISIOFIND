'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { getApiBaseUrl } from "@/utils/api";

export default function EditTreatment() {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFinal, setFechaFinal] = useState("");
  const [homework, setHomework] = useState("");
  const [isActive, setIsActive] = useState("true");
  const [paciente, setPaciente] = useState("0");
  const [fisio, setFisio] = useState("0");
  
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

    axios.post(`${getApiBaseUrl()}/api/treatment/admin/treatment/create/`,{
      start_time: fechaInicio, 
      end_time: fechaFinal, 
      homework,
      is_active: isActive, 
      patient: paciente,
      physiotherapist: fisio,
    }, {
      headers : {
        "Authorization": "Bearer "+token
      }
    }).then( () => {
        location.href="/admin-management/treatment/"
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

  const [fisiosFetched, setFisiosFetched] = useState([]);
  function searcFisio(query) {
    if (query.length < 3) {
      return
    }
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
        <h1>Crear tratamiento</h1>
      </div>
      <div className="terminos-container">
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="fecha-inicio">Fecha y hora inicio: </label>
            <input required type="datetime-local" id="fecha-inicio" onChange={fechaIn => setFechaInicio(fechaIn.target.value)}/>
          </div>
          <div>
            <label htmlFor="fecha-final">Ficha y hora final: </label>
            <input required type="datetime-local" id="fecha-final" onChange={fechaFin => setFechaFinal(fechaFin.target.value)}/>
          </div> 

          <div>
            <label htmlFor="esta-activo">¿Está el tratamiento activo?: </label>
            <select name="esta-activo" id="esta-activo" onChange={actv => setIsActive(actv == "true" ? true : false)} >
              <option value="true">Sí</option>
              <option value="false">No</option>
            </select>
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
            <label htmlFor="fisio">Email/Nombre/DNI fisioterapeuta: </label>
            <input required type="text" id="fisio"  onChange={fisio => {searcFisio(fisio.target.value)}} />
            <select
              value={fisio}
              onChange={(e) => setFisio(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">Seleccionar fisioterapeuta...</option>
              {fisiosFetched && fisiosFetched.map((physio: any) => (
                <option key={physio.id} value={physio.id}>
                  {physio.user.first_name} {physio.user.last_name} ({physio.user.dni}) ({physio.user.email})
                </option>
              ))}
            </select>
          </div>

          <div className="json-service">
            <label htmlFor="deberes">Deberes:</label>
            <textarea  value={homework} required id="deberes" onChange={home => setHomework(home.target.value)}></textarea>
          </div>

          {errorMessage && <p className="text-red-500 text-wrap">*{errorMessage}</p>}
          <input type="submit" value="Submit" className="btn-admin" />
        </form>
      </div>

    </>
  );
}
