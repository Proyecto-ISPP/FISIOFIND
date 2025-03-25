'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { print_time } from "../util";
import { getApiBaseUrl } from "@/utils/api";

interface seriesInterface {
  id: string;
  exercise_session: string;
  series_number: string;
  repetitions: string;
  weight: string;
  physiotherapist: string;
  time: string;
  distance: string;
}


export default function ManageTreatments() {
  const [series, setSeries] = useState<[seriesInterface] | null>(null);

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
    let payload = !url.includes("?") ? "?" : ""

    axios.get(url+payload, {
      headers : {
        "Authorization": "Bearer "+token
      }
    }
    ).then(response => {
        setSeries(response.data.results);
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
          {series && 
            series.map(function(serie,key) {
              return <div key={key} className="termino-list-view">
                <p>Sesión de ejercicio: {serie.exercise_session}</p>
                <p>Número de series: {serie.series_number}</p>
                <p>Repeticiones: {serie.repetitions}</p>
                <p>Peso: {serie.weight}</p>
                <p>Tiempo: {serie.time}</p>
                <p>Distancia: {serie.weight}</p>
                
                <a href={"/admin-management/series/view/"+serie.id}><button className="btn-admin-green">Ver</button></a>
                <a href={"/admin-management/series/edit/"+serie.id}><button className="btn-admin-yellow">Editar</button></a>
                <a href={"/admin-management/series/delete/"+serie.id}><button className="btn-admin-red">Eliminar</button></a>
              </div>
            })
          }
        </div>
      </div>
    </>
  );
}
