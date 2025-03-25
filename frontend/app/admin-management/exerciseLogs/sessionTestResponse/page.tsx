'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { print_time } from "../../../../util";
import { getApiBaseUrl } from "@/utils/api";

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


export default function ManageTreatments() {
  const [citas, setCitas] = useState<[citaInterface] | null>(null);

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

  // Parametros de busqueda
  const [fisio, setFisio] = useState("")
  const [paciente, setPaciente] = useState("")
  const [online, setOnline] = useState("-")
  const [fecha, setFecha] = useState("")

  const [nextUrl, setNextUrl] = useState(null);
  const [previusUrl, setPreviusUrl] = useState(null);
  const [url, setUrl] = useState(`${getApiBaseUrl()}/api/appointment/admin/list/`);
  const [lengthCounter, setLengthCounter] = useState(0);
  const [lastLength, setLastLength] = useState(0);
  const [totalLength, setTotalLength] = useState(null);
  useEffect(() => {
    let payload = !url.includes("?") ? "?" : ""

    if (fisio.length > 3) {
      payload += 'physiotherapist='+fisio
    } 

    if (paciente.length > 3) {
      payload += '&patient='+paciente
    } 

    if (online !== "-") {
      payload += "&is_online="+online
    }

    if (fecha.length > 3) {
      payload += "&date="+fecha
    }
    axios.get(url+payload, {
      headers : {
        "Authorization": "Bearer "+token
      }
    }
    ).then(response => {
        setNextUrl(response.data.next)
        setPreviusUrl(response.data.previous)
        setTotalLength(response.data.count)
        setCitas(response.data.results);
      })
      .catch(error => {
        console.log("Error fetching data:", error);
      });
  }, [token, url, fisio, paciente, online, fecha]);



  return (
    <>
      <div className="admin-header">
        <a href="/admin-management/"><button className="btn-admin">Volver</button></a>
        <h1>Página de administración de citas</h1>
      </div>
      <div className="terminos-container gap-3">
        <a href="/admin-management/appointments/create"><button className="btn-admin">Crear</button></a>
        <div className="flex flex-col">
          <label htmlFor="fisio">Nombre,email o DNI del fisioterapeuta:</label>
          <input onChange={fi => setFisio(fi.target.value)} name="fisio" className="border-2 border-solid border-black" type="text" />
        </div>
        <div className="flex flex-col">
          <label htmlFor="paciente">Nombre,email o DNI del paciente:</label>
          <input onChange={pa => setPaciente(pa.target.value)} name="paciente" className="border-2 border-solid border-black" type="text" />
        </div>
        <div className="flex flex-row gap-4">
          <label htmlFor="fisio mr-3">Cita online:</label>
          <select onChange={onl => setOnline(onl.target.value)} name="fisio" className="border-2 border-solid border-black" >
            <option value="-">---</option>
            <option value="si">Sí</option>
            <option value="no">No</option>
          </select>
        </div>
        <div className="flex flex-row gap-4">
          <label htmlFor="fecha">Fecha:</label>
          <input onChange={fe => {setFecha(fe.target.value)}} name="fecha" className="border-2 border-solid border-black" type="date" />
        </div>
        <div>
          {citas && 
            citas.map(function(cita,key) {
              return <div key={key} className="termino-list-view">
                <p>Inicio cita: {print_time(cita.start_time)}</p>
                <p>Final cita: {print_time(cita.end_time)}</p>
                <p>Es online: {cita.is_online ? "Sí" : "No"}</p>
                <p>Estado: {estados_cita[cita.status]}</p>
                
                <a href={"/admin-management/appointments/view/"+cita.id}><button className="btn-admin-green">Ver</button></a>
                <a href={"/admin-management/appointments/edit/"+cita.id}><button className="btn-admin-yellow">Editar</button></a>
                <a href={"/admin-management/appointments/delete/"+cita.id}><button className="btn-admin-red">Eliminar</button></a>
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
