'use client';

import { useEffect, useState } from "react";
import axios from "axios";

export default function crearTerminos() {
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


  const [errorMessage, setErrorMessage] = useState("");
  function handleSubmit(event) {
    event.preventDefault();

    axios.post('http://localhost:8000/api/terminos/create/',{
      content,
      version
    }, {
      headers : {
        "Authorization": "Bearer "+token
      }
    }).then( () => {
        location.href="/gestion-admin/terminos/"
      })
      .catch(error => {
        if (error.response.data.required) {
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
        <h1>Crear término</h1>
      </div>
      <div className="terminos-container">
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="version">Version: </label>
            <input maxLength={100} required type="text" id="version" onChange={vers => setVersion(vers.target.value)}/>
          </div>
          <div className="terminos-container">
            <label htmlFor="content">Contenido</label>
            <textarea required id="content" onChange={(cont) => setContent(cont.target.value)}></textarea>
          </div>
          {errorMessage && <p className="text-red-500">*{errorMessage}</p>}
          <input type="submit" value="Submit" className="btn-admin" />
        </form>
      </div>

    </>
  );
}
