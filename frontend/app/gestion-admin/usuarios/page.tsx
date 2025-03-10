'use client';

const GestionUsuarios = () => {

  return (
    <>
        <div className="admin-header">
          <h1 className="text-3xl font-bold text-center">Panel de gestión de usuarios</h1>
        </div>
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex flex-wrap text-wrap items-center justify-center mb-8">
              <p className="text-xl max-w-2xl">Panel de gestión pacientes</p>
              <a href="/gestion-admin/usuarios/pacientes"><button className="btn-admin-green">Acceder</button></a>
          </div>
          <div className="flex flex-wrap items-center justify-center mb-8">
              <p className="text-xl max-w-2xl">Panel de gestión de fisioterapeutas</p>
              <a href="/gestion-admin/usuarios/fisioterapeutas"><button className="btn-admin-green">Acceder</button></a>
          </div>
        </div>
    </>
  );
}

export default function Main() {
  return <GestionUsuarios />;
}