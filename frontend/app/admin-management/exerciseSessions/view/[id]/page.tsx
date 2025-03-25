'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { print_time, get_id_from_url } from "@/app/admin-management/util";
import { getApiBaseUrl } from "@/utils/api";

interface citaInterface {
  id: string;
  start_time: string;
  end_time: string;
  is_online: string;
  service: string;
  patient: string;
  physiotherapist: string;
  status: string;
  alternatives: string;
}

const estados_cita = {
  "finished": "Finalizada",
  "confirmed": "Confirmada",
  "canceled": "Cancelada",
  "booked": "Reservada",
  "Finished": "Finalizada",
  "Confirmed": "Confirmada",
  "Canceled": "Cancelada",
  "Booked": "Reservada",
}

export default function VerCita() {
  const id = get_id_from_url()

  const [cita, setCita] = useState<citaInterface | null>(null);

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
          setPacienteFetched({"first_name":"No","last_name":"encontrado"})
        }
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
  function searchFisio(id) {
    axios.get(`${getApiBaseUrl()}/api/app_user/admin/physio/list/`+id+'/',{
      headers : {
        "Authorization": "Bearer "+token
      }
    }
    ).then(response => {
        if (response.data.user) {
          setFisioFetched(response.data.user)
        } else {
          setFisioFetched({user:{"first_name":"No","last_name":"encontrado"}})
        }
      })
      .catch(error => {
        if (error.response && error.response.status == 404) {
          setFisioFetched({user:{"first_name":"No","last_name":"encontrado"}})
        } else {

          console.error("Error fetching data:", error);
        }
      });
  }

  useEffect(() => {
    axios.get(`${getApiBaseUrl()}/api/appointment/admin/list/`+id+'/', {
      headers : {
        "Authorization": "Bearer "+token
      }
    }
    ).then(response => {
        setCita(response.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    if (cita) {
      searchFisio(cita.physiotherapist)
      searchPaciente(cita.patient)
    }
  },[cita])
  return (
    <>
      <div className="admin-header">
        <a href="/admin-management/appointments/"><button className="btn-admin">Volver</button></a>
        <h1>Vista de cita</h1>
      </div>
      <div className="terminos-container text-left">
        {cita && <>
          <p>Inicio cita: {print_time(cita.start_time)}</p>
          <p>Final cita: {print_time(cita.end_time)}</p>
          <p>Es online: {cita.is_online ? "Sí" : "No"}</p>
          <p>Estado: {estados_cita[cita.status]}</p>
          <p>Id del paciente: {cita.patient} </p>
          <p>Nombre del paciente: {pacienteFetched && pacienteFetched.first_name + ' ' + pacienteFetched.last_name}</p>
          <p>Id del fisioterapeuta: {cita.physiotherapist} </p>
          <p>Nombre del fisioterapeuta: {fisioFetched && fisioFetched.first_name + ' ' + fisioFetched.last_name}</p>
          <p>Servicios: {JSON.stringify(cita.service)} </p>
          <p>Alternativas: {JSON.stringify(cita.alternatives)} </p>
          </>
        }
        {!cita && <h1>Cita no encontrada</h1>
        }    
      </div>

    </>
  );
}
