'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { getApiBaseUrl } from '@/utils/api';
import Cookies from 'js-cookie';

const PROTECTED_ROUTES_REQUIRING_VERIFICATION = [
  '/advanced-search',
  '/my-appointments',
  '/patient-management/follow-up',
  '/patient-management/profile',
  '/videocalls',
];

interface ErrorResponse {
  response?: {
    status?: number;
  };
}

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname(); 

  useEffect(() => {
    const checkTokenAndVerification = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          const response = await axios.get(`${getApiBaseUrl()}/api/app_user/current-user/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const status = response.data?.patient?.user?.account_status;
          const isProtectedRoute = PROTECTED_ROUTES_REQUIRING_VERIFICATION.some(route => pathname.startsWith(route));

          if (isProtectedRoute && status === 'UNVERIFIED') {
             router.push('/verificar-correo');
             return;
          }
          if (status === 'UNVERIFIED') {
            Cookies.set('userVerificationStatus', status, {
              path: '/',
              sameSite: 'strict',
              secure: process.env.NODE_ENV === 'production'
            });
          } else {
            Cookies.remove('userVerificationStatus', { path: '/' });
          }

        } catch (error: unknown) {
          console.error('Error al verificar el token:', error);
          const axiosError = error as AxiosError<ErrorResponse>;

          if (axiosError.response?.status === 401) {
            localStorage.removeItem('token');
            Cookies.remove('userVerificationStatus', { path: '/' });
            alert('Su sesión ha expirado. Por favor, inicie sesión nuevamente.');
            router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
          } else {
             console.error('Otro error al verificar token:', axiosError.message);
             Cookies.remove('userVerificationStatus', { path: '/' });
          }
        }
      } else {

        localStorage.removeItem('token');
        Cookies.remove('userVerificationStatus', { path: '/' });
         const isProtectedRoute = PROTECTED_ROUTES_REQUIRING_VERIFICATION.some(route => pathname.startsWith(route));
         if (isProtectedRoute) {
            console.log(`ClientWrapper: Redirigiendo desde ${pathname} a /login porque no hay token.`);
            router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
            return;
         }
      }
    };

    checkTokenAndVerification();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        checkTokenAndVerification();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
    
  }, [router, pathname]);

  return <>{children}</>;
}