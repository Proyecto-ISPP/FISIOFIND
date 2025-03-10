'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import {get_id_from_url } from "@/app/gestion-admin/util";

interface citaInterface {
  id: string;
  start_time: string;
  end_time: string;
  is_online: string;
  service: string;
  physiotherapist: string;
  patient: string;
  status: string;
}

export default function EditarCitas() {

  const id = get_id_from_url()

  const [errorMessage, setErrorMessage] = useState("");

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

  const [cita, setCita] = useState<citaInterface | null>(null);

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFinal, setFechaFinal] = useState("");
  const [esOnline, setEsOnline] = useState(true);
  const [servicios, setServicios] = useState("");
  const [paciente, setPaciente] = useState("");
  const [fisio, setFisio] = useState("");
  const [estado, setEstado] = useState("")

  useEffect(() => {
    axios.get('http://localhost:8000/api/app_appointment/appointment/admin/list/'+id+'/',{
      headers : {
        "Authorization": "Bearer "+token
      }
    }
    ).then(response => {
        setCita(response.data);
        setFechaInicio(response.data.start_time.replace("Z",""))
        setFechaFinal(response.data.end_time.replace("Z",""))
        setEsOnline(response.data.is_online)
        setServicios(JSON.stringify(response.data.service))
        setPaciente(response.data.patient)
        setFisio(response.data.physiotherapist)
        setEstado(response.data.status)
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

    let service = {}
    try {
      service = JSON.parse(servicios);
    } catch (error) {
      setErrorMessage("JSON de servicios inválido")
      return
    }

    axios.put('http://localhost:8000/api/app_appointment/appointment/admin/edit/'+id+'/',{
      start_time: fechaInicio,
      end_time: fechaFinal,
      is_online: esOnline,
      service: service,
      patient: paciente,
      physiotherapist: fisio,
      patient_id: paciente,
      physiotherapist_id: fisio,
      status: estado
    },{
      headers : {
        "Authorization": "Bearer "+token
      }
    }
  ).then(() => {
        location.href="/gestion-admin/citas/"
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

  const [pacienteFetched, setPacienteFetched] = useState(null);
  function searchPaciente(id) {
    axios.get('http://localhost:8000/api/app_user/admin/user/list/'+id+'/',{
      headers : {
        "Authorization": "Bearer "+token
      }
    }
    ).then(response => {
        setPacienteFetched(response.data)
      })
      .catch(error => {
        if (error.response && error.response.status == 404) {
          setPacienteFetched({"first_name":"No","last_name":"encontrado"})
        } else {

          console.error("Error fetching data:", error);
        }
      });
  }

  const [fisioFetched, setFisioFetched] = useState(null);
  function searcFisio(id) {
    axios.get('http://localhost:8000/api/app_user/admin/user/list/'+id+'/',{
      headers : {
        "Authorization": "Bearer "+token
      }
    }
    ).then(response => {
        setFisioFetched(response.data)
      })
      .catch(error => {
        if (error.response && error.response.status == 404) {
          setFisioFetched({"first_name":"No","last_name":"encontrado"})
        } else {

          console.error("Error fetching data:", error);
        }
      });
  }

  return (
    <>
      <div className="admin-header">
        <a href="/gestion-admin/citas"><button className="btn-admin">Volver</button></a>
        <h1>Editar cita</h1>
      </div>
      <div className="terminos-container">
        {cita && <>
          <form onSubmit={handleSubmit}>
              <div>
              <label htmlFor="fecha-inicio">Fecha y hora inicio: </label>
              <input required value={fechaInicio} type="datetime-local" id="fecha-inicio" onChange={fechaIn => setFechaInicio(fechaIn.target.value)}/>
            </div>
            <div>
              <label htmlFor="fecha-final">Ficha y hora final: </label>
              <input required value={fechaFinal} type="datetime-local" id="fecha-final" onChange={fechaFin => setFechaFinal(fechaFin.target.value)}/>
            </div> 

            <div>
              <label htmlFor="es-online">¿Es la cita online?: </label>
              <select value={esOnline ? "true" : "false"} name="es-online" id="es-online" onChange={online => setEsOnline(online == "true" ? true : false)} >
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            </div>

            <div>
              <label htmlFor="paciente">ID Paciente: </label>
              <input required value={paciente} type="text" id="paciente"  onChange={paciente => {setPaciente(paciente.target.value); searchPaciente(paciente.target.value)}} />
              {pacienteFetched && <p>Paciente seleccionado: {pacienteFetched.first_name + ' ' + pacienteFetched.last_name}</p>}
            </div>

            <div>
              <label htmlFor="fisio">ID Fisioterapeuta: </label>
              <input required value={fisio} type="text" id="fisio"  onChange={fisio => {setFisio(fisio.target.value); searcFisio(fisio.target.value)}} />
              {fisioFetched && <p>Fisioterapeuta seleccionado: {fisioFetched.first_name + ' ' + fisioFetched.last_name}</p>}
            </div>

            <div className="json-service">
              <label htmlFor="servicios">Servicios:</label>
              <textarea required value={servicios} id="servicios" onChange={serv => setServicios(serv.target.value)}></textarea>
            </div>

            <div>
              <label htmlFor="estado-cita">Estado de la cita: </label>
              <select  value={estado} name="estado-cita" id="estado-cita" onChange={estado_cita => setEstado(estado_cita.target.value)} >
                <option value="finished">Finalizada</option>
                <option value="confirmed">Confirmada</option>
                <option value="canceled">Cancelada</option>
                <option value="booked">Reservada</option>
              </select>
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
