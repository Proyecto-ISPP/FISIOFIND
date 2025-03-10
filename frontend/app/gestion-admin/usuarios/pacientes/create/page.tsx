'use client';

import { useEffect, useState } from "react";
import axios from "axios";

export default function crearPaciente() {
  const [foto, setFoto] = useState("");
  const [dni, setDNI] = useState("");
  const [telefono, setTelefono] = useState("");
  const [codigoPostal, setCodigoPostal] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [genero, setGenero] = useState("");
  const [estadoCuenta, setEstadoCuenta] = useState("");
  
  function handleSubmit(event) {
    event.preventDefault();

    // TODO: PUT URL
    axios.post('',{ 
      photo: foto,
      dni,
      phone_number: telefono,
      postal_code: codigoPostal,
      account_status: estadoCuenta,
      gender: genero,
      birth_date: fechaNacimiento
    }).then( () => {
        location.href="/gestion-admin/usuarios/"
      })
      .catch(error => {
        console.error("Error fetching data:", error);
    });
  }

  return (
    <>
      <div className="admin-header">
        <a href="/gestion-admin/usuarios/paciente"><button className="btn-admin">Volver</button></a>
        <h1>Crear término</h1>
      </div>
      <div className="terminos-container">
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="foto">Foto de perfil: </label>
            <input type="file" id="foto" onChange={fot => setFoto(fot.target.value)}/>
          </div>
          <div>
            <label htmlFor="dni">DNI: </label>
            <input type="text" id="dni" maxLength={9} onChange={dn => setDNI(dn.target.value)}/>
          </div>
          <div>
            <label htmlFor="telefono">Número de telefono: </label>
            <input type="number" id="telefono" maxLength={9} onChange={telf => setTelefono(telf.target.value)}/>
          </div>
          <div>
            <label htmlFor="codigo-postal">Código postal: </label>
            <input type="number" id="codigo-postal" maxLength={10} onChange={cod => setCodigoPostal(cod.target.value)}/>
          </div>
          <div>
            <label htmlFor="estado-cuenta">Estado de la cuenta: </label>
            <select name="estado-cuenta" id="estado-cuenta" onChange={estado => setEstadoCuenta(estado.target.value)}>
              <option value="Active">Activa</option>
              <option value="Banned">Baneada</option>
              <option value="Removed">Eliminada</option>
            </select>
          </div>
          <div>
            <label htmlFor="genero">Genero: </label>
            <select name="genero" id="genero" onChange={genr => setGenero(genr.target.value)}>
              <option value="Other">Otro</option>
              <option value="Female">Mujer</option>
              <option value="Male">Hombre</option>
            </select>
          </div>
          <div>
            <label htmlFor="fecha-nacimiento">Fecha de nacimiento: </label>
            <input type="date" id="fecha-nacimiento" onChange={fechaNac => setFechaNacimiento(fechaNac.target.value)}/>
          </div>
          <input type="submit" value="Submit" className="btn-admin" />
        </form>
      </div>

    </>
  );
}
