import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getApiBaseUrl } from "@/utils/api";

interface Physiotherapist {
  id: string;
  name: string;
  specializations: string;
  gender: string;
  rating: number;
  price: number;
  postalCode: string;
  image?: string;
}

interface PhysiotherapistModalProps {
  physio: Physiotherapist | null;
  isOpen: boolean;
  onClose: () => void;
  renderStars: (rating: number) => JSX.Element;
}

const PhysiotherapistModal = ({ physio, isOpen, onClose, renderStars }: PhysiotherapistModalProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Pequeño retraso para que la transición sea visible después de que el DOM se actualice
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      // Esperar a que termine la animación antes de ocultar completamente
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleCloseModal = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!isVisible || !physio) return null;

  const getPhysioPhotoUrl = (physio: Physiotherapist | undefined) => {
    if (physio?.image) {
      
      return `${physio.image}`;
    }
    return "/static/fisioterapeuta_sample.webp"; 
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isAnimating ? "opacity-100" : "opacity-0"
      } bg-black/50`}
      onClick={handleCloseModal}
    >
      <div 
        className={`bg-white rounded-2xl shadow-2xl max-w-xl w-4/5 h-auto p-6 relative transition-all duration-300 ${
          isAnimating ? "translate-y-0 scale-100" : "translate-y-8 scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón de cerrar con transición y color rojo en hover */}
        <button
          onClick={handleCloseModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-all duration-200 hover:rotate-90 hover:bg-red-50 p-1 rounded-full"
        >
          <X size={24} />
        </button>

        {/* Contenido del modal con transiciones mejoradas */}
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32 mb-4 overflow-hidden rounded-full ring-4 ring-[#65C2C9]/20 transition-transform duration-300 hover:scale-105">
              <img
                src={getPhysioPhotoUrl(physio)}
                alt={"Physiotherapist's photo"}
                className="object-cover"
              />
          </div>

          <h3 className="text-xl font-bold text-gray-800 mb-2">{physio.name}</h3>
          
          <div className="text-center space-y-3 w-full">
            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
              <span className="font-medium">Especialidad:</span> {physio.specializations}
            </p>
            <div className="flex justify-center">
              {renderStars(physio.rating || 4.5)}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                <span className="font-medium block">Precio medio:</span> 
                {physio.price ? `${physio.price}€` : "Consultar"}
              </p>
              <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                <span className="font-medium block">Código Postal:</span> 
                {physio.postalCode || "No especificado"}
              </p>
            </div>
            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
              <span className="font-medium">Género:</span> {physio.gender === "male" ? "Hombre" : physio.gender === "female" ? "Mujer" : "No especificado"}
            </p>
          </div>

          {/* Botón de confirmación - manteniendo colores pero con efecto de hover mejorado */}
          <button
            onClick={() => {
              router.push(`/appointments/create/${physio.id}`);
              handleCloseModal();
            }}
            className="mt-6 w-full py-3 bg-gradient-to-r from-[#65C2C9] to-[#65C2C9] hover:from-[#05918F] hover:to-[#05918F] text-white rounded-full font-medium shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
          >
            Confirmar cita
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhysiotherapistModal;