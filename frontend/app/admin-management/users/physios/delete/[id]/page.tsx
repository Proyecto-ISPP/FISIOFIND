'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { get_id_from_url } from "@/app/admin-management/util";

interface fisioterapeutaInterface {
  foto: string;
  dni: string;
  telefono: string;
  codigoPostal: string;
  fechaNacimiento: string;
  genero: string;
  estadoCuenta: string;
}

export default function EliminarFisioterapeuta() {
  const id = get_id_from_url()

  const [fisioterapeuta, setFisio] = useState<fisioterapeutaInterface | null>(null);

  useEffect(() => {
    // TODO: set url
    axios.get(
    ).then(response => {
        setFisio(response.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  function deleteFisio() {
    // TODO: PUT URL
    axios.delete(''
    ).then(() => {
        location.href="/admin-management/users/physios/"
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }

  return (
    <>
      <div className="admin-header">
        <a href="/admin-management/users/physios/"><button className="btn-admin">Volver</button></a>
        <h1>Eliminar fisioterapeuta</h1>
      </div>
      <div className="admin-header">
        {fisioterapeuta && <>
          <p>¿Quieres borrar el fisioterapeuta? ten en cuenta de que no se puede borrar a un fisioterapeuta, sino que solo se puede "desactivar" su cuenta. El borrado de datos se tiene que hacer manualmente accediendo a la base de datos.</p>
          <button className="btn-admin-red" onClick={deleteFisio}>Sí</button>
          <button className="btn-admin-green" onClick={() => location.href="/admin-management/users/physios/"}>No</button>
          </>
        }
        {!fisioterapeuta && <h1>Fisioterapeuta no encontrado</h1>
        }    
      </div>

    </>
  );
}
