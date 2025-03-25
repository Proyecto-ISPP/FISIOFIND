'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { print_time } from "../util";
import { getApiBaseUrl } from "@/utils/api";

interface exerciseLogInterface {
  id: string;
  series: string;
  patient: string;
  date: string;
  repetitions_done: string;
  weight_done: string;
  time_done: string;
  distance_done:string;
  notes: string;
}


export default function ManageTreatments() {
  const [exerciseLogs, setExerciseLogs] = useState<[exerciseLogInterface] | null>(null);

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
        setExerciseLogs(response.data.results);
      })
      .catch(error => {
        console.log("Error fetching data:", error);
      });
  }, [token, url]);



  return (
    <>
      <div className="admin-header">
        <a href="/admin-management/"><button className="btn-admin">Volver</button></a>
        <h1>Página de administración de citas</h1>
      </div>
      <div className="terminos-container gap-3">
        <a href="/admin-management/appointments/create"><button className="btn-admin">Crear</button></a>
        <div>
          {exerciseLogs && 
            exerciseLogs.map(function(exerciseL,key) {
              return <div key={key} className="termino-list-view">
                <p>Series: {exerciseL.series}</p>
                <p>Fecha {print_time(exerciseL.date)}</p>
                <p>Paciente: {exerciseL.patient}</p>
                <p>Repeticiones hechas: {exerciseL.repetitions_done}</p>
                <p>Peso hecho: {exerciseL.weight_done}</p>
                <p>Distancia hecha: {exerciseL.distance_done}</p>
                <p>Notas: {exerciseL.notes}</p>
                
                <a href={"/admin-management/exerciseLogs/view/"+exerciseL.id}><button className="btn-admin-green">Ver</button></a>
                <a href={"/admin-management/exerciseLogs/edit/"+exerciseL.id}><button className="btn-admin-yellow">Editar</button></a>
                <a href={"/admin-management/exerciseLogs/delete/"+exerciseL.id}><button className="btn-admin-red">Eliminar</button></a>
              </div>
            })
          }
        </div>
        <div>
          {
            citas && citas.length > 0 && <>
              <div className="flex flex-row gap-4 mt-8"> 
                {
                  previusUrl && <button onClick={() => {setLengthCounter(lengthCounter-lastLength);setUrl(previusUrl)}} className="btn-admin">Anterior</button>
                }
                <p>Viendo {lengthCounter+citas.length} elementos de {totalLength} elementos </p>
                {
                  nextUrl &&  <button onClick={() => {setLastLength(citas?.length);setLengthCounter(lengthCounter+citas?.length);setUrl(nextUrl)}} className="btn-admin">Siguiente</button>
                }
              </div>
            </>
          }
          {
            (!citas || !citas.length) && <p> No se encontraron citas</p>
          }
        </div>
      </div>
    </>
  );
}
