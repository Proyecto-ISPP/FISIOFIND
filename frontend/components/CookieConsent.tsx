"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Modal from './ui/Modal';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const cookieChoice = localStorage.getItem('cookie-consent');
    // Only hide if explicitly accepted, show for rejected or no choice
    if (cookieChoice !== 'accepted') {
      setShowConsent(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShowConsent(false);
  };

  const rejectCookies = () => {
    // Don't store rejection in localStorage so it reappears on reload
    setShowConsent(false);
  };

  const handleCookiesPolicyClick = () => {
    localStorage.setItem('open-cookies-policy', 'true');
    // After viewing the policy, redirect back to home
    setTimeout(() => {
      router.push('/');
    }, 100);
  };

  if (!showConsent) return null;

  return (
    <Modal onClose={() => {}}>
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-lg text-center">
        <div className="mb-6">
          <Image
            src="/cookie-icon.webp"
            alt="Cookies"
            width={120}
            height={120}
            className="mx-auto mb-4"
          />
          <h2 className="text-3xl font-bold mb-3 text-[#253240]">¡Cookies!</h2>
          <p className="text-gray-600 mb-6">
            Utilizamos cookies para mejorar tu experiencia
          </p>
        </div>
        <div className="space-y-3">
          <button
            onClick={acceptCookies}
            className="w-full px-6 py-3 bg-[#05668D] text-white rounded-xl hover:bg-[#05918F] transition-colors font-semibold"
          >
            Aceptar
          </button>
          <div className="flex justify-center items-center gap-2">
            <Link 
              href="/terms" 
              onClick={handleCookiesPolicyClick}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#05668D] hover:text-[#05918F] text-sm font-medium"
            >
              Política de Cookies
            </Link>
            <span className="text-gray-400">•</span>
            <button
              onClick={rejectCookies}
              className="text-[#05668D] hover:text-[#05918F] text-sm font-medium"
            >
              Rechazar
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}