'use client';

export default function GestionAdmin() {

  return (
    <>
      <div className="admin-header">
        <h1>Panel de administración</h1>
      </div>
      <div className="container">
        <div>
            <p>Panel de gestión de términos y condiciones
              <a href="/gestion-admin/terminos"><button className="btn-admin-green">Acceder</button></a>
            </p>
        </div>
        <div>
            <p>Panel de gestión de citas
              <a href="/gestion-admin/citas"><button className="btn-admin-green">Acceder</button></a>
            </p>
        </div>
      </div>
    </>
  );
}
