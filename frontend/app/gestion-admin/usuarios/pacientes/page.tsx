'use client';

import { useEffect, useState } from "react";
import axios from "axios";

interface pacienteInterface {
  user: string,
  gender: string,
  birth_date: string,
}


export default function GestionarPacientes() {
  const [pacientes, setPacientes] = useState<[pacienteInterface] | null>(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/app_user/admin/patient/list/'
    ).then(response => {
        setPacientes(response.data)
        console.log(response.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <>
      <div className="admin-header">
        <a href="/gestion-admin/"><button className="btn-admin">Volver</button></a>
        <h1>Página de administración de pacientes</h1>
      </div>
      <div className="terminos-container">
        <a href="/gestion-admin/citas/create"><button className="btn-admin">Crear</button></a>
        <div>
          {pacientes && 
            pacientes.map(function(paciente,key) {
              return (
                <div key={key} className="termino-list-view">
                  <p>Nombre de usuario: {paciente.user.username}</p>
                  <p>Nombre: {paciente.user.first_name}</p>
                  <p>Apellidos: {paciente.user.last_name}</p>
                  <p>Genero paciente: {paciente.user.last_name}</p>
                  
                  <a href={"/gestion-admin/usuarios/pacientes/view/"+paciente.id}><button className="btn-admin-green">Ver</button></a>
                  <a href={"/gestion-admin/usuarios/pacientes/edit/"+paciente.id}><button className="btn-admin-yellow">Editar</button></a>
                  <a href={"/gestion-admin/usuarios/pacientes/delete/"+paciente.id}><button className="btn-admin-red">Eliminar</button></a>
                </div>
            )
            })
          }
        </div>
      </div>
    </>
  );
}
