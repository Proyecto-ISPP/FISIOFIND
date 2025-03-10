'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { get_id_from_url } from "@/app/gestion-admin/util";

interface pacienteInterface {
  foto: string;
  dni: string;
  telefono: string;
  codigoPostal: string;
  fechaNacimiento: string;
  genero: string;
  estadoCuenta: string;
}

export default function EliminarPaciente() {
  const id = get_id_from_url()

  const [paciente, setPaciente] = useState<pacienteInterface | null>(null);

  useEffect(() => {
    // TODO: set url
    axios.get(
    ).then(response => {
        setPaciente(response.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  function deletePaciente() {
    // TODO: PUT URL
    axios.delete(''
    ).then(() => {
        location.href="/gestion-admin/usuarios/paciente"
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }

  return (
    <>
      <div className="admin-header">
        <a href="/gestion-admin/usuarios/paciente"><button className="btn-admin">Volver</button></a>
        <h1>Eliminar paciente</h1>
      </div>
      <div className="admin-header">
        {paciente && <>
          <p>¿Quieres borrar el paciente? ten en cuenta de que no se puede borrar a un paciente, sino que solo se puede "desactivar" su cuenta. El borrado de datos se tiene que hacer manualmente accediendo a la base de datos.</p>
          <button className="btn-admin-red" onClick={deletePaciente}>Sí</button>
          <button className="btn-admin-green" onClick={() => location.href="/gestion-admin/usuarios/paciente"}>No</button>
          </>
        }
        {!paciente && <h1>Paciente no encontrado</h1>
        }    
      </div>

    </>
  );
}
