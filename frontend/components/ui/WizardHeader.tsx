// components/WizardHeader.tsx
"use client";
import React from "react";
import { Step } from "@/lib/definitions";
import clsx from "clsx";

interface WizardHeaderProps {
  steps: Step[];
  currentStep: number;
}

const WizardHeader: React.FC<WizardHeaderProps> = ({ steps, currentStep }) => {
  const getBgColorClass = (step: number): string => {
    if (step < currentStep) return "bg-logo2"; // paso completado
    if (step === currentStep) return "bg-azulOscuroTitulos"; // paso actual
    return "bg-navBar1"; // pasos futuros
  };

  return (
    <>
      {/* Versión Desktop: chevrons */}
      <div className="hidden lg:flex items-center justify-center space-x-[-12px] w-full">
        {steps.map((s) => (
          <div
            key={s.step}
            className={clsx(
              "relative flex flex-col items-center justify-center text-white px-8 h-24 min-w-[200px]",
              getBgColorClass(s.step)
            )}
            style={{
              clipPath:
                "polygon(90% 0%, 100% 50%, 90% 100%, 0% 100%, 10% 50%, 0% 0%)",
            }}
          >
            <div className="flex flex-col items-center justify-center w-full h-full">
              <span className="font-semibold text-base whitespace-nowrap">
                Paso {s.step}
              </span>
              <span className="text-sm text-center px-2 whitespace-normal line-clamp-2">
                {s.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Versión Mobile: bolitas */}
      <div className="flex lg:hidden items-center justify-center w-full px-4 py-6">
        {steps.map((s) => (
          <div key={s.step} className="flex flex-col items-center flex-1 max-w-[120px]">
            <div className="h-[60px] flex items-start justify-center">
              <div
                className={clsx(
                  "w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-medium shadow-md transition-all duration-300",
                  getBgColorClass(s.step),
                  s.step < currentStep && "scale-95",
                  s.step === currentStep && "ring-4 ring-offset-2 ring-azulOscuroTitulos/30"
                )}
              >
                {s.step < currentStep ? (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  s.step
                )}
              </div>
            </div>
            <span className="text-sm text-gray-700 text-center font-medium line-clamp-2 h-[40px] hidden sm:block">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </>
  );
};

export default WizardHeader;
