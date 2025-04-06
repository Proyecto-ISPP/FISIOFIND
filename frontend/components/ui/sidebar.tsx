"use client";
import { cn } from "@/lib/utils";
import Link, { LinkProps } from "next/link";
import React, { useState, createContext, useContext, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconMenu2, IconX } from "@tabler/icons-react";

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  // Update main content margin when sidebar opens/closes - only on desktop
  useEffect(() => {
    const mainContent = document.querySelector('main');
    if (mainContent) {
      // Only apply margin on desktop screens
      const isMobile = window.innerWidth < 768;
      if (!isMobile) {
        if (open) {
          mainContent.style.marginLeft = '240px';
        } else {
          mainContent.style.marginLeft = '80px';
        }
      } else {
        // Reset margin on mobile
        mainContent.style.marginLeft = '0';
      }
    }
  }, [open]);

  // Add resize listener to adjust margins when screen size changes
  useEffect(() => {
    const handleResize = () => {
      const mainContent = document.querySelector('main');
      if (mainContent) {
        if (window.innerWidth < 768) {
          mainContent.style.marginLeft = '0';
        } else {
          mainContent.style.marginLeft = open ? '240px' : '80px';
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [open]);

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <>
      <motion.div
        className={cn(
          "h-full px-6 py-8 hidden md:flex md:flex-col bg-neutral-100 dark:bg-neutral-600 w-[90px] flex-shrink-0 fixed left-0 top-0 z-50 border-r border-gray-200 dark:border-neutral-800",
          className
        )}
        animate={{
          width: animate ? (open ? "250px" : "95px") : "260px",
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        {...props}
      >
        {children}
      </motion.div>
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
  props?: LinkProps;
}) => {
  const { open, animate } = useSidebar();
  return (
    <Link
      href={link.href}
      className={cn(
        "flex items-center gap-4 group/sidebar py-3 px-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all duration-200",
        className
      )}
      {...props}
    >
      <div className="min-w-[24px] flex items-center justify-center">
        {link.icon}
      </div>
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        transition={{
          duration: 0.2,
          ease: "easeInOut",
        }}
        className="text-[#253240] font-semibold text-sm whitespace-pre"
      >
        {link.label}
      </motion.span>
    </Link>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <div
        className={cn(
          "h-10 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-neutral-100 dark:bg-neutral-800 w-full"
        )}
        {...props}
      >
        <div className="flex justify-end z-100 w-full">
          <IconMenu2
            className="text-[#05668D] dark:text-[#05668D]"
            onClick={() => setOpen(!open)}
          />
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ y: "-100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className={cn(
                "fixed top-0 left-0 right-0 bg-white dark:bg-neutral-900 p-6 z-[100] flex flex-col shadow-md",
                className
              )}
            >
              <div
                className="absolute left-6 top-6 z-100 text-[#05668D] dark:text-[#05668D]"
                onClick={() => setOpen(!open)}
              >
                <IconX />
              </div>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
