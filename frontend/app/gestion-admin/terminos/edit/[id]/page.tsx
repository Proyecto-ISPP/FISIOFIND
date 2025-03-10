'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { print_time, get_id_from_url } from "@/app/gestion-admin/util";
import { p } from "framer-motion/client";


interface terminoInterface {
  content: string;
  version: string;
  updated_at: string;
  created_at: string;
  modifier: string;
}

export default function EditarTermino() {

  const id = get_id_from_url()
  const [termino, setTermino] = useState<terminoInterface | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const [content, setContent] = useState("");
  const [version, setVersion] = useState("");
  const token = localStorage.getItem("token")
  useEffect(() => {    
    if (token) {
      axios.get("http://127.0.0.1:8000/api/app_user/check-role/", {
        headers : {
          "Authorization": "Bearer "+token
        }
      }
      ).then(response => {
          const role = response.data.user_role;
          if (role != "admin") {
            location.href = ".."
          }
        })
        .catch(error => {
          console.error("Error fetching data:", error);
          location.href = ".."
        });
    } else {
      location.href = ".."
    }
  },[])


  useEffect(() => {
    axios.get('http://localhost:8000/api/terminos/list/'+id+'/', {
      headers : {
        "Authorization": "Bearer "+token
      }
    }
    ).then(response => {
        setTermino(response.data);
        setContent(response.data.content)
        setVersion(response.data.version)
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  function handleSubmit(event) {
    event.preventDefault();

    axios.put('http://localhost:8000/api/terminos/update/'+id+'/',{
      id,
      content,
      version
    }, {
      headers : {
        "Authorization": "Bearer "+token
      }
    }).then(() => {
        location.href="/gestion-admin/terminos/"
      })
      .catch(error => {
        if (error.response && error.response.data.required) {
          setErrorMessage(error.response.data.required)
        } else {

          console.error("Error fetching data:", error);
        }
    });
  }

  return (
    <>
      <div className="admin-header">
        <a href="/gestion-admin/terminos"><button className="btn-admin">Volver</button></a>
        <h1>Editar término</h1>
      </div>
      <div className="terminos-container">
        {termino && <>
          <div className="border-b-2 terminos-container">

            <p><strong>Creado en:</strong> {print_time(termino.created_at)}</p>
            <p><strong>Editado en: </strong>{print_time(termino.updated_at)}</p>
            <p><strong>Último editor:</strong> {termino.modifier} </p>
            <p><strong>Versión:</strong> {termino.version} </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="version">Versión: </label>
              <input maxLength={100} required type="text" id="version" value={version} onChange={vers => setVersion(vers.target.value)}/>
            </div>
            <div className="terminos-container">
              <label htmlFor="content">Contenido</label>
              <textarea required value={content} id="content" onChange={cont => setContent(cont.target.value)}></textarea>
            </div>
            {errorMessage && <p className="text-red-500">*{errorMessage}</p>}
            <input type="submit" value="Submit" className="btn-admin" />
          </form>
          </>
        }
        {!termino && <h1>Término no encontrado</h1>
        }   
      </div>
    </>
  );
}
