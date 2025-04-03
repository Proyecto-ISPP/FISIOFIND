"use client";
import React, { useEffect, useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconSearch,
  IconStethoscope,
  IconCalendar,
  IconUser,
  IconPhone,
} from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import axios from "axios";
import { getApiBaseUrl } from "@/utils/api";

export function SidebarDemo() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const [urlPerfil, setUrlPerfil] = useState<string>("");
  const [isClient, setIsClient] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Add logout handler function
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/"; // Redirect to home and refresh the page
  };

  // Cada vez que cambia la ruta, revalidamos la existencia del token en localStorage
  useEffect(() => {
    if (isClient) {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
      setIsAuthenticated(!!token);
      if (token) {
        axios
          .get(`${getApiBaseUrl()}/api/app_user/check-role/`, {
            headers: {
              Authorization: "Bearer " + token,
            },
          })
          .then((response) => {
            const role = response.data.user_role;
            if (role === "patient") {
              setUrlPerfil("/patient-management/profile/");
            } else if (role === "physiotherapist") {
              setUrlPerfil("/physio-management/profile/");
            }
          });
      }
    }
  }, [pathname, isClient, token]);

  // Update the icon sizes and colors in the links array
  // Update the links array to separate public and private links
  const publicLinks = [
    {
      label: "Buscar",
      href: "/",
      icon: (
        <IconSearch className="text-[#05668D] h-5 w-5 flex-shrink-0 mx-auto" />
      ),
    },
    {
      label: "Mis citas",
      href: isAuthenticated ? "/my-appointments" : "/register",
      icon: (
        <IconCalendar className="text-[#0A7487] h-5 w-5 flex-shrink-0 mx-auto" />
      ),
    },
    {
      label: "Tratamientos",
      href: isAuthenticated? "/physio-management/follow-up" : "/login",
      icon: (
        <IconStethoscope className="text-[#05918F] h-5 w-5 flex-shrink-0 mx-auto" />
      ),
    },
    {
      label: "Videollamadas",
      href: "/videocalls",
      icon: (
        <IconPhone className="text-[#1E5ACD] h-5 w-5 flex-shrink-0 mx-auto" />
      ),
    }
  ];

  const privateLinks = [
    {
      label: "Mi perfil",
      href: urlPerfil ? urlPerfil : "/",
      icon: (
        <IconUser className="text-[#05AC9C] h-5 w-5 flex-shrink-0 mx-auto" />
      ),
    }
  ];

  return (
    <div className="h-screen">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="flex flex-col h-full justify-between py-8">
          <div className="flex flex-col flex-1 overflow-y-auto scrollbar-hide overflow-x-hidden">
            <div className="mb-8 hidden md:block">{open ? <Logo /> : <LogoIcon />}</div>
            <div className="flex flex-col gap-8">
              {publicLinks.map((link, idx) => (
                <SidebarLink key={`public-${idx}`} link={link} />
              ))}
              {isAuthenticated && urlPerfil && // Only show profile if authenticated and urlPerfil exists (not admin)
                privateLinks.map((link, idx) => (
                  <SidebarLink key={`private-${idx}`} link={link} />
                ))
              }
            </div>
          </div>
          {isAuthenticated && (
            <div className="pt-2 pb-1 mt-auto cursor-pointer" onClick={handleLogout}>
              <SidebarLink
                link={{
                  label: "Cerrar Sesión",
                  href: "#",
                  icon: (
                    <div className="w-8 h-8 min-w-[2rem] min-h-[2rem] rounded-full border-2 border-[#FA5C2B] flex items-center justify-center">
                      <IconArrowLeft className="text-[#FA5C2B] h-4 w-4 flex-shrink-0" />
                    </div>
                  ),
                }}
                className="hover:bg-red-50"
              />
            </div>
          )}
        </SidebarBody>
      </Sidebar>
    </div>
  );
}

const Logo = () => {
  return (
    <a
      href="/"
      className="font-normal flex items-center justify-center text-sm text-[#253240] py-1 relative z-300 w-full"
    >
      <img
        src="/static/logo_fisio_find_smaller.webp"
        alt="Logo"
        className="h-16 w-auto flex-shrink-0"
      />
    </a>
  );
};

export const LogoIcon = () => {
  return (
    <a
      href="/"
      className="font-normal flex justify-center items-center text-base text-[#253240] py-2 relative z-300 w-full"
    >
      <div className="h-12 w-12 overflow-hidden flex items-center justify-center">
        <img
          src="/static/logo_fisio_find_smaller.webp"
          alt="Fisio Find logo"
          className="h-12 w-auto flex-shrink-0 object-contain"
        />
      </div>
    </a>
  );
};
