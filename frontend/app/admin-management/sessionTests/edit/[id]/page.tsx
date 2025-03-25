'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import {get_id_from_url } from "@/app/admin-management/util";
import { getApiBaseUrl } from "@/utils/api";

interface sessionTestInterface {
  id: string;
  session: string;
  question: string;
  test_type: string;
  scale_labels: string;
}

const test_types = {
  "text": "Text",
  "scale": "Scale"
}
export default function EditarCitas() {

  const id = get_id_from_url()

  const [errorMessage, setErrorMessage] = useState("");

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


  const [sessionTest, setSessionTest] = useState<sessionTestInterface | null>(null);

  const [session, setSession] = useState("");
  const [question, setQuestion] = useState("");
  const [test_type, setTestType] = useState("text");
  const [scale_labels, setScaleLabels] = useState("");

  useEffect(() => {
    axios.get(`${getApiBaseUrl()}/api/treatment/admin/sessionTest/list/`+id+'/',{
      headers : {
        "Authorization": "Bearer "+token
      }
    }
    ).then(response => {
        setSessionTest(response.data);
        console.log(response.data)
        setSession(response.data.session)
        setQuestion(response.data.question)
        setTestType(response.data.test_type)
        setScaleLabels(JSON.stringify(response.data.scale_labels))

      }, {
        headers : {
          "Authorization": "Bearer "+token
        }
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  function handleSubmit(event) {
    event.preventDefault();

    let labe = {}
    try {
      labe = JSON.parse(scale_labels);
    } catch (error) {
      setErrorMessage("JSON de servicios inválido")
      return
    }

    axios.put(`${getApiBaseUrl()}/api/treatment/admin/sessionTest/edit/`+id+'/',{
      scale_labels:labe,
      session,
      question,
      test_type
    },{
      headers : {
        "Authorization": "Bearer "+token
      }
    }
  ).then(() => {
        location.href="/admin-management/sessionTests/"
      })
      .catch(error => {
        if (error.response && error.response.data.non_field_errors) {
          setErrorMessage(error.response.data.non_field_errors[0])
        } else if (error.response && error.response.status == 400) {
          let container = ''
          for (const [_, error_msg] of Object.entries(error.response.data)) {
            container += error_msg 
          }
          setErrorMessage(container)
        }else {
          console.error("Error fetching data:", error);
        }
    });
  }



  return (
    <>
      <div className="admin-header">
        <a href="/admin-management/sessionTests/"><button className="btn-admin">Volver</button></a>
        <h1>Editar prueba de sesión</h1>
      </div>
      <div className="terminos-container">
        {sessionTest && <>
          <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="tipo-test">Tipo de test: </label>
            <select value={test_type} name="tipo-test" id="tipo-test" onChange={te => setTestType(te.target.value)} >
              <option value="text">Text</option>
              <option value="scale">Scale</option>
            </select>
          </div>

          <div>
            <label htmlFor="sesion">Sesión: </label>
            <input required type="text" id="sesion"  onChange={sess => {setSession(sess.target.value)}} />
          </div>

          <div>
            <label htmlFor="pregunta">Pregunta: </label>
            <input required type="text" id="pregunta"  onChange={preg => setQuestion(preg.target.value)} />
          </div>

          <div className="json-service">
            <label htmlFor="scale_labels">Escalas:</label>
            <textarea required id="scale_labels" onChange={scl => setScaleLabels(scl.target.value)}></textarea>
          </div>

            {errorMessage && <p className="text-red-500">*{errorMessage}</p>}
            <input type="submit" value="Submit" className="btn-admin" />
          </form>
          </>
        }
        {!cita && <h1>Cita no encontrada</h1>
        }   
      </div>
    </>
  );
}
