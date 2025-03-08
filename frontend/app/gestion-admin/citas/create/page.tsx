'use client';

import { useEffect, useState } from "react";
import axios from "axios";

export default function editarCitas() {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFinal, setFechaFinal] = useState("");
  const [esOnline, setEsOnline] = useState(true);
  const [servicios, setServicios] = useState("");
  const [paciente, setPaciente] = useState("");
  const [fisio, setFisio] = useState("");
  const [estado, setEstado] = useState("finished")
  
  function handleSubmit(event) {
    event.preventDefault();

    axios.post('http://localhost:8000/api/app_appointment/appointment/admin/create/',{
      start_time: fechaInicio,
      end_time: fechaFinal,
      is_online: esOnline,
      service: JSON.parse(servicios),
      patient: paciente,
      physiotherapist: fisio,
      status: estado
    }).then( () => {
        location.href="/gestion-admin/citas/"
      })
      .catch(error => {
        console.error("Error fetching data:", error);
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
            <label htmlFor="fecha-inicio">Fecha y hora inicio: </label>
            <input type="datetime-local" id="fecha-inicio" onChange={fechaIn => setFechaInicio(fechaIn.target.value)}/>
          </div>
          <div>
            <label htmlFor="fecha-final">Ficha y hora final: </label>
            <input type="datetime-local" id="fecha-final" onChange={fechaFin => setFechaFinal(fechaFin.target.value)}/>
          </div> 

          <div>
            <label htmlFor="es-online">¿Es la cita online?: </label>
            <select name="es-online" id="es-online" onChange={online => setEsOnline(online == "true" ? true : false)} >
              <option value="true">Sí</option>
              <option value="false">No</option>
            </select>
          </div>

          <div>
            <label htmlFor="paciente">ID Paciente: </label>
            <input type="text" id="paciente"  onChange={paciente => setPaciente(paciente.target.value)} />
          </div>

          <div>
            <label htmlFor="fisio">ID Fisioterapeuta: </label>
            <input type="text" id="fisio"  onChange={fisio => setFisio(fisio.target.value)} />
          </div>

          <div className="json-service">
            <label htmlFor="servicios">Servicios:</label>
            <textarea id="servicios" onChange={serv => setServicios(serv.target.value)}></textarea>
          </div>

          <div>
            <label htmlFor="estado-cita">Estado de la cita: </label>
            <select name="estado-cita" id="estado-cita" onChange={estado_cita => setEstado(estado_cita.target.value)} >
              <option value="finished">Finalizada</option>
              <option value="confirmed">Confirmada</option>
              <option value="canceled">Cancelada</option>
              <option value="booked">Reservada</option>
            </select>
          </div>

          <input type="submit" value="Submit" className="btn-admin" />
        </form>
      </div>

    </>
  );
}
