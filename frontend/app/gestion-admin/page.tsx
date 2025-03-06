'use client';

export default function GestionAdmin() {

  return (
    <>
      <div className="admin-header">
        <h1>Panel de administración</h1>
      </div>
      <div className="container">
        <div>
          <p>Panel de gestión de términos y condiciones</p>
          <a href="/gestion-admin/terminos"><button className="btn-admin-green">Acceder</button></a>
        </div>
      </div>
    </>
);
}
