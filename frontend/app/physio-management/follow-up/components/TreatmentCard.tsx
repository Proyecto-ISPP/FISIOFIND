interface Patient {
    user: {
      first_name: string;
      last_name: string;
      email: string;
    };
    gender: string;
    birth_date: string;
  }
  
  interface Treatment {
    id: number;
    patient: Patient;
    start_time: string;
    end_time: string;
    homework: string;
    is_active: boolean;
  }
  
  interface TreatmentCardProps {
    treatment: Treatment;
    onClick: () => void;
  }
  
  const TreatmentCard = ({ treatment, onClick }: TreatmentCardProps) => {
    // Calcular el tiempo restante o días desde finalización
    const calculateTimeStatus = () => {
      const now = new Date();
      const endDate = new Date(treatment.end_time);
      const diffTime = endDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (treatment.is_active) {
        if (diffDays < 0) {
          return { text: "Finalizado", color: "text-red-500" };
        } else if (diffDays === 0) {
          return { text: "Finaliza hoy", color: "text-orange-500" };
        } else if (diffDays === 1) {
          return { text: "Finaliza mañana", color: "text-yellow-500" };
        } else {
          return { text: `${diffDays} días restantes`, color: "text-green-500" };
        }
      } else {
        return { text: "Tratamiento inactivo", color: "text-gray-500" };
      }
    };
  
    const timeStatus = calculateTimeStatus();
    const startDate = new Date(treatment.start_time).toLocaleDateString('es-ES');
    const endDate = new Date(treatment.end_time).toLocaleDateString('es-ES');
  
    return (
      <div 
        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
        onClick={onClick}
      >
        <div className={`p-1 text-center text-white ${treatment.is_active ? 'bg-green-500' : 'bg-gray-500'}`}>
          {treatment.is_active ? 'Activo' : 'Histórico'}
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2">{treatment.patient.user.first_name} {treatment.patient.user.last_name}</h3>
          
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-gray-600">Inicio:</span>
              <span>{startDate}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-600">Fin:</span>
              <span>{endDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estado:</span>
              <span className={timeStatus.color}>{timeStatus.text}</span>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-2">Deberes asignados:</h4>
            <p className="text-gray-700 text-sm line-clamp-2">{treatment.homework}</p>
          </div>
        </div>
        
        <div className="bg-gray-50 px-6 py-3 flex justify-center">
          <button className="text-primary hover:underline">
            Ver detalles
          </button>
        </div>
      </div>
    );
  };
  
  export default TreatmentCard;