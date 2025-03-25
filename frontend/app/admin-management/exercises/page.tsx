'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { print_time } from "../../../util";
import { getApiBaseUrl } from "@/utils/api";

interface excerciseInterface {
  id: string;
  title: string;
  description: string;
  area: string;
  physiotherapist: string;
}

const areas = {
  "UPPER_BODY": "Parte Superior del Cuerpo",
  "LOWER_BODY": "Parte Inferior del Cuerpo",
  "CORE": "Zona Media/Core",
  "FULL_BODY": "Cuerpo Completo",
  "SHOULDER": "Hombros",
  "ARM": "Brazos (Bíceps, Tríceps)",
  "CHEST": "Pecho",
  "BACK": "Espalda",
  "QUADRICEPS": "Cuádriceps",
  "HAMSTRINGS": "Isquiotibiales",
  "GLUTES": "Glúteos",
  "CALVES": "Pantorrillas",
  "NECK": "Cuello",
  "LOWER_BACK": "Zona Lumbar",
  "HIP": "Caderas",
  "BALANCE": "Ejercicios de Equilibrio",
  "MOBILITY": "Movilidad",
  "STRETCHING": "Estiramientos",
  "PROPRIOCEPTION": "Propiocepción",
}


export default function ManageTreatments() {
  const [exercises, setExercises] = useState<[excerciseInterface] | null>(null);

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
        setExercises(response.data.results);
      })
      .catch(error => {
        console.log("Error fetching data:", error);
      });
  }, [token]);



  return (
    <>
      <div className="admin-header">
        <a href="/admin-management/"><button className="btn-admin">Volver</button></a>
        <h1>Página de administración de citas</h1>
      </div>
      <div className="terminos-container gap-3">
        <a href="/admin-management/appointments/create"><button className="btn-admin">Crear</button></a>
        <div>
          {exercises && 
            exercises.map(function(exercise,key) {
              return <div key={key} className="termino-list-view">
                <p>Título: {exercise.title}</p>
                <p>Descripción: {exercise.description}</p>
                <p>Área: {areas[exercise.area]}</p>
                <p>Fisioterapeuta: {exercise.physiotherapist}</p>
                
                <a href={"/admin-management/exercises/view/"+exercise.id}><button className="btn-admin-green">Ver</button></a>
                <a href={"/admin-management/exercises/edit/"+exercise.id}><button className="btn-admin-yellow">Editar</button></a>
                <a href={"/admin-management/exercises/delete/"+exercise.id}><button className="btn-admin-red">Eliminar</button></a>
              </div>
            })
          }
        </div>
      </div>
    </>
  );
}
