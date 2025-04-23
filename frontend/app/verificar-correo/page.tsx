'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function VerificarCorreo() {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  // Obtener el email del usuario del localStorage al cargar la página
  useEffect(() => {
    const userDataStr = localStorage.getItem('userData');
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        if (userData.email) {
          setEmail(userData.email);
        }
      } catch (error) {
        console.error('Error al parsear datos de usuario:', error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Verifica tu correo electrónico</h2>
          <p className="mt-2 text-sm text-gray-600">
            Para continuar usando FisioFind, necesitas verificar tu dirección de correo electrónico.
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="p-4 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-700">
                Hemos enviado un correo de verificación a <span className="font-medium">{email || 'tu dirección de correo'}</span>.
                Por favor, revisa tu bandeja de entrada y haz clic en el enlace de verificación.
              </p>
            </div>
          </div>

          {message && (
            <div className="p-4 bg-green-50 rounded-md">
              <p className="text-sm text-green-700">{message}</p>
            </div>
          )}

          <div className="flex flex-col space-y-4">
            <div className="text-center">
              <Link href="/logout" className="text-sm text-blue-600 hover:text-blue-500">
                Cerrar sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
