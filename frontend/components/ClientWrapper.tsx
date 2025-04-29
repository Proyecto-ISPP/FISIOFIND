'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';
import { getApiBaseUrl } from '@/utils/api';

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname(); // Obtiene la URL actual

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          const response = await axios.get(`${getApiBaseUrl()}/api/app_user/current-user/`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.status === 200) {
            console.log('Token válido');
          }
        } catch (error: any) {
          if (error.response?.status === 401) {
            localStorage.removeItem('token');
            alert('Su sesión ha expirado. Por favor, inicie sesión nuevamente.');

            // Redirige al login con la URL actual como parámetro
            router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
          }
        }
      }
    };

    checkToken();
  }, [router, pathname]);

  return <>{children}</>;
}
