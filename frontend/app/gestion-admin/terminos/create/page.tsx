'use client';

import { useEffect, useState } from "react";
import axios from "axios";

export default function editarTerminos() {
  const [content, setContent] = useState("");
  const [version, setVersion] = useState("");
  
  function handleSubmit(event) {
    event.preventDefault();

    axios.post('http://localhost:8000/api/terminos/create/',{
      content,
      version
    }).then( () => {
        location.href="/gestion-admin/terminos/"
      })
      .catch(error => {
        console.error("Error fetching data:", error);
    });
  }

return (
    <>
      <div className="admin-header">
        <h1>Crear término</h1>
      </div>
      <div className="terminos-container">
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="version">Version: </label>
            <input type="text" id="version" onChange={vers => setVersion(vers.target.value)}/>
          </div>
          <div className="terminos-container">
            <label htmlFor="content">Contenido</label>
            <textarea id="content" onChange={(cont) => setContent(cont.target.value)}></textarea>
          </div>
          <input type="submit" value="Submit" className="btn-admin" />
        </form>
      </div>
    </>
);
}
