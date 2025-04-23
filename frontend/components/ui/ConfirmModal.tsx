const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
        <h3 className="text-xl font-bold text-[#1E5ACD] mb-4">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-300"
          >
            Cancelar
          </button>
          <button 
            onClick={onConfirm} 
            className="px-4 py-2 bg-[#1E5ACD] text-white rounded-xl hover:bg-[#0A7487] transition-all duration-300"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;