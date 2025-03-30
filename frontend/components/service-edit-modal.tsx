import { useState, useEffect } from "react";
import { GradientButton } from "@/components/ui/gradient-button";

interface Service {
  titulo: string;
  descripcion: string;
  precio: string;
  frecuencia: string;
  duracion: string;
}

interface ServiceEditModalProps {
  service: Service;
  serviceName: string;
  onClose: () => void;
  onSave: (serviceName: string, updatedService: Service) => void;
  onDelete: (serviceName: string) => void;
}

const ServiceEditModal = ({ service, serviceName, onClose, onSave, onDelete }: ServiceEditModalProps) => {
  const [isClosing, setIsClosing] = useState(false);
  const [titulo, setTitulo] = useState(service.titulo);
  const [descripcion, setDescripcion] = useState(service.descripcion || "");
  const [precio, setPrecio] = useState(service.precio);
  const [frecuencia, setFrecuencia] = useState(service.frecuencia);
  const [duracion, setDuracion] = useState("");
  const [unidadDuracion, setUnidadDuracion] = useState("minutos");
  
  useEffect(() => {
    // Parse duration from format like "30 minutos"
    if (service.duracion) {
      const parts = service.duracion.split(" ");
      if (parts.length >= 2) {
        setDuracion(parts[0]);
        setUnidadDuracion(parts[1]);
      }
    }
  }, [service]);

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const handleSave = async () => {
    // Create the updated service object
    const updatedService = {
      titulo,
      descripcion,
      precio,
      frecuencia,
      duracion: `${duracion} ${unidadDuracion}`
    };
    
    try {
      // If title hasn't changed, simply update the service
      if (titulo === service.titulo) {
        await onSave(serviceName, updatedService);
      } else {
        // For title changes, we need to:
        // 1. Create a new service with the new title
        await onSave(titulo, updatedService);
        
        // 2. Delete the old service with the old title
        // Small delay to ensure the new service is saved first
        setTimeout(async () => {
          await onDelete(serviceName);
        }, 100);
      }

      // Close modal
      closeModal();
      
      // Reload page after a delay to show updated services
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };
  const handleDelete = () => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este servicio?")) {
      onDelete(serviceName);
      closeModal();
    }
  };

  return (
    <div
      className={`z-50 fixed inset-0 flex items-center justify-center ${isClosing ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300 ease-in-out`}
      onClick={closeModal}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      {/* Enhanced Backdrop */}
      <div className="absolute inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-md"></div>
      
      {/* Modal Card with Enhanced Design */}
      <div
        className={`relative bg-white rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 border border-gray-200 overflow-hidden group max-w-md w-full mx-4 
        ${isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}
        transform origin-center`}
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header section with gradient and refined styling */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 pb-3 border-b border-gray-200 flex justify-between items-center">
          <h3 
            className="font-extrabold text-2xl text-gray-800 tracking-tight group-hover:text-blue-700 transition-colors duration-300" 
            id="modal-title"
          >
            Editar servicio
          </h3>
          <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full shadow-sm">
            Servicio
          </span>
        </div>

        {/* Form fields with improved spacing and focus states */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Título:</label>
            <input 
              type="text" 
              value={titulo} 
              onChange={(e) => setTitulo(e.target.value)} 
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción:</label>
            <textarea 
              value={descripcion} 
              onChange={(e) => setDescripcion(e.target.value)} 
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-600 text-sm leading-relaxed"
              rows={3}
            />
          </div>

          {/* Details section with enhanced icon and input styling */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">Precio:</span>
              </div>
              <input 
                type="text" 
                value={precio} 
                onChange={(e) => setPrecio(e.target.value)}
                className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-semibold text-gray-800 text-right transition-all duration-300"
                placeholder="€ / consulta"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">Frecuencia:</span>
              </div>
              <select 
                value={frecuencia} 
                onChange={(e) => setFrecuencia(e.target.value)}
                className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 text-right appearance-none transition-all duration-300"
              >
                <option value="diaria">Diaria</option>
                <option value="semanal">Semanal</option>
                <option value="quincenal">Quincenal</option>
                <option value="mensual">Mensual</option>
                <option value="trimestral">Trimestral</option>
                <option value="semestral">Semestral</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">Duración:</span>
              </div>
              <div className="flex w-1/2 space-x-2">
                <input
                  type="number"
                  value={duracion}
                  onChange={(e) => setDuracion(e.target.value)}
                  className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 text-right transition-all duration-300"
                />
                <select 
                  value={unidadDuracion} 
                  onChange={(e) => setUnidadDuracion(e.target.value)}
                  className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 appearance-none transition-all duration-300"
                >
                  <option value="minutos">Minutos</option>
                  <option value="horas">Horas</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Action buttons with improved spacing and style */}
          <div className="flex justify-between pt-4 mt-2 border-t border-gray-200">
            <GradientButton variant="danger" onClick={handleDelete} className="hover:scale-105 transition-transform">
              Eliminar
            </GradientButton>
            <div className="flex space-x-3">
              <GradientButton variant="grey" onClick={closeModal} className="hover:scale-105 transition-transform">
                Cancelar
              </GradientButton>
              <GradientButton variant="create" onClick={handleSave} className="hover:scale-105 transition-transform">
                Guardar
              </GradientButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceEditModal;