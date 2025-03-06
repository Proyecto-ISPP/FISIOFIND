'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { print_time, get_id_from_url } from "@/app/gestion-admin/util";


interface terminoInterface {
  content: string;
  version: string;
  updated_at: string;
  created_at: string;
}

export default function VerTerminos() {

  const id = get_id_from_url()
  const [termino, setTermino] = useState<terminoInterface | null>(null);

  const [content, setContent] = useState("");
  const [version, setVersion] = useState("");

  useEffect(() => {
    axios.get('http://localhost:8000/api/terminos/list/'+id+'/'
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
    }).then(() => {
        location.href="/gestion-admin/terminos/"
      })
      .catch(error => {
        console.error("Error fetching data:", error);
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
          <p>Creado en: {print_time(termino.created_at)}</p>
          <p>Versión actual: {termino.version} </p>
          <p>Última edición: {print_time(termino.updated_at)}</p>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="version">Version: </label>
              <input type="text" id="version" value={version} onChange={vers => setVersion(vers.target.value)}/>
            </div>
            <div className="terminos-container">
              <label htmlFor="content">Contenido</label>
              <textarea value={content} id="content" onChange={cont => setContent(cont.target.value)}></textarea>
            </div>
            <input type="submit" value="Submit" className="btn-admin" />
          </form>
          </>
        }
        {!termino && <h1>Término no encontrado</h1>}
      </div>
    </>
);
}
