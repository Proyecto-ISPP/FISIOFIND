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
  comunidadAutonoma: string;
}

export default function EditarFisioterapeuta() {

  const id = get_id_from_url()
  const [fisioterapeuta, setFisio] = useState<fisioterapeutaInterface | null>(null);

  const [foto, setFoto] = useState("");
  const [dni, setDNI] = useState("");
  const [telefono, setTelefono] = useState("");
  const [codigoPostal, setCodigoPostal] = useState("");
  const [bio, setBio] = useState("");
  const [numeroColegiado, setNumeroColegiado] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [genero, setGenero] = useState("");
  const [estadoCuenta, setEstadoCuenta] = useState("");
  const [comunidadAutonoma, setComunidadAutonoma] = useState("");
  

  useEffect(() => {
    //TODO: put url
    axios.get(''
    ).then(response => {
        setFisio(response.data);
        setDNI(response.data.dni)
        setTelefono(response.data.phone_number)
        setCodigoPostal(response.data.postal_code)
        setEstadoCuenta(response.data.account_status)
        setGenero(response.data.gender)
        setFechaNacimiento(response.data.birth_date)
        setComunidadAutonoma(response.data.autonomic_community)
        setNumeroColegiado(response.data.collegiate_number)
        setBio(response.data.bio)
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  function handleSubmit(event) {
    event.preventDefault();

    // TODO: PUT URL
    axios.put('',{ 
      photo: foto,
      dni,
      phone_number: telefono,
      postal_code: codigoPostal,
      account_status: estadoCuenta,
      gender: genero,
      birth_date: fechaNacimiento,
      bio,
      collegiate_number: numeroColegiado,
      autonomic_community: comunidadAutonoma,
    }).then( () => {
        location.href="/admin-management/users/"
      })
      .catch(error => {
        console.error("Error fetching data:", error);
    });
  }

  return (
    <>
      <div className="admin-header">
        <a href="/admin-management/users/physios/"><button className="btn-admin">Volver</button></a>
        <h1>Editar fisioterapeuta</h1>
      </div>
      <div className="terminos-container">
        {fisioterapeuta && <>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="foto">Foto de perfil: </label>
              <input type="file" id="foto" onChange={fot => setFoto(fot.target.value)}/>
            </div>
            <div>
              <label htmlFor="dni">DNI: </label>
              <input type="text" id="dni" value={dni} maxLength={9} onChange={dn => setDNI(dn.target.value)}/>
            </div>
            <div>
              <label htmlFor="telefono">Número de telefono: </label>
              <input type="number" id="telefono" value={telefono} maxLength={9} onChange={telf => setTelefono(telf.target.value)}/>
            </div>
            <div>
              <label htmlFor="codigo-postal">Código postal: </label>
              <input type="number" id="codigo-postal" value={codigoPostal} maxLength={10} onChange={cod => setCodigoPostal(cod.target.value)}/>
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

            <div>
              <label htmlFor="bio">Bio</label>
              <textarea id="bio" value={bio} onChange={biography => setBio(biography.target.value)}></textarea>
            </div>

            <div>
              <label htmlFor="num-colegiado">Número de colegiado: </label>
              <input type="text" id="num-colegiado" value={numeroColegiado} onChange={numCol => setNumeroColegiado(numCol.target.value)}/>
            </div>

            <div>
            <label htmlFor="comunidad-autonoma">Comunidad autónoma: </label>
              <select name="comunidad-autonoma" value={comunidadAutonoma} id="comunidad-autonoma" onChange={com => setComunidadAutonoma(com.target.value)}>
                <option value="Andalucía">Andalucía</option>
                <option value="Aragón">Aragón</option>
                <option value="Asturias">Asturias</option>
                <option value="Baleares">Baleares</option>
                <option value="Canarias">Canarias</option>
                <option value="Cantabria">Cantabria</option>
                <option value="Castilla y León">Castilla y León</option>
                <option value="Castilla-La Mancha">Castilla-La Mancha</option>
                <option value="Cataluña">Cataluña</option>
                <option value="Extremadura">Extremadura</option>
                <option value="Galicia">Galicia</option>
                <option value="Madrid">Madrid</option>
                <option value="Murcia">Murcia</option>
                <option value="Navarra">Navarra</option>
                <option value="País Vasco">País Vasco</option>
                <option value="La Rioja">La Rioja</option>
                <option value="Comunidad Valenciana">Comunidad Valenciana</option>
              </select>
            </div>
            <input type="submit" value="Submit" className="btn-admin" />
          </form>
        </>
        }

        {!fisioterapeuta && <h1>Fisioterapeuta no encontrado</h1>} 
      </div>

    </>
  );
}
