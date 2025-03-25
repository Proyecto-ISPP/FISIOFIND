'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { print_time, get_id_from_url } from "@/app/admin-management/util";
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

export default function ViewTreatment() {
  const id = get_id_from_url()

  const [treatment, setTreatment] = useState<treatmentInterface | null>(null);

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
        setTreatment(response.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    if (treatment) {
      searchFisio(treatment.physiotherapist)
      searchPaciente(treatment.patient)
    }
  },[treatment])
  return (
    <>
      <div className="admin-header">
        <a href="/admin-management/treatments/"><button className="btn-admin">Volver</button></a>
        <h1>Vista de tratamiento</h1>
      </div>
      <div className="terminos-container text-left">
        {treatment && <>

          <p>Inicio tratamiento: {print_time(treatment.start_time)}</p>
          <p>Final tratamiento: {print_time(treatment.end_time)}</p>
          <p>Está activo: {treatment.is_active ? "Sí" : "No"}</p>
          <p>Fisio: {treatment.physiotherapist}</p>
          <p>Nombre del fisioterapeuta: {fisioFetched && fisioFetched.first_name + ' ' + fisioFetched.last_name}</p>
          <p>Id del paciente: {treatment.patient}</p>
          <p>Nombre del paciente: {pacienteFetched && pacienteFetched.first_name + ' ' + pacienteFetched.last_name}</p>
          <p>Homework: {treatment.homework}</p>
          <p>Fecha de reación del tratamiento: {print_time(treatment.created_at)}</p>
          <p>Última actualización del tratamiento: {print_time(treatment.updated_at)}</p>
          </>
        }
        {!treatment && <h1>Tratamiento no encontrada</h1>
        }    
      </div>

    </>
  );
}
