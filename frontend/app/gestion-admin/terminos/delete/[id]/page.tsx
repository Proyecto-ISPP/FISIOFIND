'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { get_id_from_url } from "@/app/gestion-admin/util";

interface terminoInterface {
  id: string;
  content: string;
  version: string;
  updated_at: string;
  created_at: string;
}

export default function VerTerminos() {
  const id = get_id_from_url()

  const [termino, setTermino] = useState<terminoInterface | null>(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/terminos/list/'+id+'/'
    ).then(response => {
        setTermino(response.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  function deleteTermino() {
    axios.delete('http://localhost:8000/api/terminos/delete/'+id+'/'
    ).then(() => {
        location.href="/gestion-admin/terminos/"
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }

  return (
    <>
      <div className="admin-header">
        <a href="/gestion-admin/terminos/"><button className="btn-admin">Volver</button></a>
        <h1>Eliminar término</h1>
      </div>
      <div className="admin-header">
        {termino && <>
          <p>¿Quieres borrar el término {termino.id}?</p>
          <button className="btn-admin-red" onClick={deleteTermino}>Sí</button>
          <button className="btn-admin-green" onClick={() => location.href="/gestion-admin/terminos/"}>No</button>
          </>
        }
        {!termino && <h1>Término no encontrado</h1>}
      </div>
    </>
);
}
