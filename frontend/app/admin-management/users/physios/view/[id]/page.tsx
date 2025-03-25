'use client';

import { useEffect, useState } from "react";
import axios from "axios";

interface fisioterapeutaInterface {
  foto: string;
  dni: string;
  telefono: string;
  codigoPostal: string;
  fechaNacimiento: string;
  genero: string;
  estadoCuenta: string;
  comunidadAutonoma: string;
}

export default function verFisioterapeuta() {
  const [fisioterapeuta, setFisio] = useState<fisioterapeutaInterface | null>(null);
  
  useEffect(() => {
    // TODO: poner url
    axios.get('',
    ).then(response => {
        setFisio(response.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <>
      <div className="admin-header">
        <a href="/admin-management/users/physios/"><button className="btn-admin">Volver</button></a>
        <h1>Ver fisioterapeuta</h1>
      </div>
      <div className="terminos-container">
        {fisioterapeuta && <>
          <p>{fisioterapeuta.dni}</p>
          <p>{fisioterapeuta.phone_number}</p>
          <p>{fisioterapeuta.postal_code}</p>
          <p>{fisioterapeuta.account_status}</p>
          <p>{fisioterapeuta.gender}</p>
          <p>{fisioterapeuta.birth_date}</p>
          <p>{fisioterapeuta.autonomic_community}</p>
          <p>{fisioterapeuta.collegiate_number}</p>
          <p>{fisioterapeuta.bio}</p>
        </>
        }

        {!fisioterapeuta && <h1>Fisioterapeuta no encontrado</h1>} 
      </div>

    </>
  );
}
