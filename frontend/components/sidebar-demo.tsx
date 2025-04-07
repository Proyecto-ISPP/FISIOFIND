"use client";
import React, { useEffect, useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit
} from '@fortawesome/free-solid-svg-icons';
import {
  IconArrowLeft,
  IconSearch,
  IconStethoscope,
  IconCalendar,
  IconUser,
  IconPhone,
  IconHome,
  IconX,
  IconMenu2,
} from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import axios from "axios";
import { getApiBaseUrl } from "@/utils/api";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

export function SidebarDemo() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [isPinned, setIsPinned] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const [urlPerfil, setUrlPerfil] = useState<string>("");
  const [isClient, setIsClient] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Add logout handler function
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/"; // Redirect to home and refresh the page
  };

  // Load pinned state from localStorage on initial render
  useEffect(() => {
    if (isClient) {
      const storedPinnedState = localStorage.getItem("sidebarPinned");
      if (storedPinnedState) {
        setIsPinned(storedPinnedState === "true");
      }
    }
  }, [isClient]);

  // Handle pinning the sidebar
  const handlePinToggle = () => {
    const newPinnedState = !isPinned;
    setIsPinned(newPinnedState);
    localStorage.setItem("sidebarPinned", newPinnedState.toString());
  };

  // Modify sidebar behavior based on pinned state
  useEffect(() => {
    if (isPinned) {
      setOpen(true);
    }
  }, [isPinned]);

  // Cada vez que cambia la ruta, revalidamos la existencia del token en localStorage
  useEffect(() => {
    if (isClient) {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
      setIsAuthenticated(!!storedToken);
      
      if (storedToken) {
        axios
          .get(`${getApiBaseUrl()}/api/app_user/check-role/`, {
            headers: {
              Authorization: "Bearer " + storedToken,
            },
          })
          .then((response) => {
            const role = response.data.user_role;
            setUserRole(role);
            
            if (role === "patient") {
              setUrlPerfil("/patient-management/profile/");
            } else if (role === "physiotherapist") {
              setUrlPerfil("/physio-management/profile/");
            }
            
            if (role !== "physiotherapist" && pathname === "/questionnaires") {
              window.location.href = "/";
            }
          });
      } else if (pathname === "/questionnaires") {
        window.location.href = "/";
        }
      }
  }, [pathname, isClient, token]);

  // Update the links array to separate public and private links
  const publicLinks = [
    {
      label: "Inicio",
      href: "/",
      icon: (
        <IconHome className="text-[#05668D] h-5 w-5 flex-shrink-0 mx-auto" />
      ),
    },
    {
      label: "Buscar",
      href: "/advanced-search",
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
      href: urlPerfil.includes("patient") 
           ? "/patient-management/follow-up" 
           : "/physio-management/follow-up",
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
    },
    ...(userRole === "physiotherapist" ? [
      {
        label: "Cuestionarios",
        href: "/questionnaires",
        icon: (
          <FontAwesomeIcon icon={faEdit} className="text-[#8C4482] h-5 w-5 flex-shrink-0 mx-auto" />
        ),
      }
    ] : []),
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

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <Sidebar open={open} setOpen={isPinned ? () => {} : setOpen}>
    {/* Mobile Menu Button - Only visible on mobile when menu is closed */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        {!isMobileMenuOpen && (
          <button 
            onClick={toggleMobileMenu}
            className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-all duration-300"
          >
            <IconMenu2 className="h-6 w-6 text-[#1E5ACD]" />
          </button>
        )}
      </div>
      
      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 left-0 right-0 bg-neutral-100 z-40 md:hidden p-4 shadow-md"
          >
            <div className="absolute top-4 left-4">
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-full hover:bg-neutral-200 transition-all duration-300"
              >
                <IconX className="h-6 w-6 text-[#1E5ACD]" />
              </button>
            </div>
            
            <div className="flex flex-col pt-10 pb-4">
              {/* Removed the logo div that was here */}
              <div className="grid grid-cols-3 gap-3">
                {publicLinks.map((link, idx) => (
                  <div key={`mobile-public-${idx}`} className="w-full">
                    <Link
                      href={link.href}
                      className="flex flex-col items-center gap-2 py-3 px-2 rounded-lg hover:bg-neutral-200 transition-all duration-200 w-full"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex items-center justify-center">
                        {link.icon}
                      </div>
                      <span className="text-[#253240] font-semibold text-xs text-center">
                        {link.label}
                      </span>
                    </Link>
                  </div>
                ))}
                
                {isAuthenticated && urlPerfil && 
                  privateLinks.map((link, idx) => (
                    <div key={`mobile-private-${idx}`} className="w-full">
                      <Link
                        href={link.href}
                        className="flex flex-col items-center gap-2 py-3 px-2 rounded-lg hover:bg-neutral-200 transition-all duration-200 w-full"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="flex items-center justify-center">
                          {link.icon}
                        </div>
                        <span className="text-[#253240] font-semibold text-xs text-center">
                          {link.label}
                        </span>
                      </Link>
                    </div>
                  ))
                }
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Desktop Sidebar */}
      <SidebarBody className="flex flex-col h-full justify-between py-8 hidden md:flex">
        <div className="flex flex-col flex-1 overflow-y-auto scrollbar-hide overflow-x-hidden">
          <div className="mb-8">{open ? <Logo /> : <LogoIcon />}</div>
          <div className="flex flex-col gap-8">
            {publicLinks.map((link, idx) => (
              <SidebarLink key={`public-${idx}`} link={link} />
            ))}
            {isAuthenticated && urlPerfil && 
              privateLinks.map((link, idx) => (
                <SidebarLink key={`private-${idx}`} link={link} />
              ))
            }
          </div>
        </div>
        
        {/* Pin Sidebar Toggle - Only visible when sidebar is open */}
        {open && (
          <div className="mt-auto mb-4 px-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 font-medium">Fijar menú</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isPinned} 
                  onChange={handlePinToggle} 
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
              </label>
            </div>
          </div>
        )}
        
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
