'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { print_time } from "../util";
import { getApiBaseUrl } from "@/utils/api";

interface treatmentInterface {
  id: string;
  physiotherapist: string;
  patient: string;
  start_time: string;
  end_time: string;
  homework: string;
  is_active: string;
  created_at: string;
  updated_at: string;
}

export default function ManageTreatments() {
  const [treatments, setTreatments] = useState<[treatmentInterface] | null>(null);

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
        setTreatments(response.data.results);
      })
      .catch(error => {
        console.log("Error fetching data:", error);
      });
  }, [token, url]);



  return (
    <>
      <div className="admin-header">
        <a href="/admin-management/"><button className="btn-admin">Volver</button></a>
        <h1>Página de administración de tratamientos</h1>
      </div>
      <div className="terminos-container gap-3">
        <a href="/admin-management/treatments/create"><button className="btn-admin">Crear</button></a>
        <div>
          {treatments && 
            treatments.map(function(treatment,key) {
              return <div key={key} className="termino-list-view">
                <p>Inicio tratamiento: {print_time(treatment.start_time)}</p>
                <p>Final tratamiento: {print_time(treatment.end_time)}</p>
                <p>Está activo: {treatment.is_active ? "Sí" : "No"}</p>
                <p>Fisio: {treatment.physiotherapist}</p>
                <p>Paciente: {treatment.patient}</p>
                <p>Homework: {treatment.homework}</p>
                <p>Fecha de reación del tratamiento: {print_time(treatment.created_at)}</p>
                <p>Última actualización del tratamiento: {print_time(treatment.updated_at)}</p>

                <a href={"/admin-management/treatments/view/"+treatment.id}><button className="btn-admin-green">Ver</button></a>
                <a href={"/admin-management/treatments/edit/"+treatment.id}><button className="btn-admin-yellow">Editar</button></a>
                <a href={"/admin-management/treatments/delete/"+treatment.id}><button className="btn-admin-red">Eliminar</button></a>
                <a href={"/admin-management/treatments/sessions/"+treatment.id}><button className="btn-admin-red">Sesiones</button></a>
              </div>
            })
          }
        </div>
      </div>
    </>
  );
}
