import React from 'react';

/**
 * Modal component for displaying messages and confirmation options
 * @param {Object} props - Component props
 * @param {boolean} props.show - Whether to show the modal
 * @param {string} props.message - Modal message
 * @param {boolean} props.showButtons - Whether to show confirmation buttons
 * @param {string} props.userRole - User role (physio or patient)
 * @param {Function} props.onConfirm - Function to call on confirm
 * @param {Function} props.onCancel - Function to call on cancel
 * @param {Function} props.onClose - Function to call on close
 * @returns {JSX.Element} Modal component
 */
const RoomModal = ({
  show,
  message,
  showButtons = false,
  userRole,
  onConfirm,
  onCancel,
  onClose
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h3 className="text-lg font-semibold mb-4">Aviso</h3>
        <p className="mb-4">{message}</p>
        {showButtons && userRole === 'physio' ? (
          <div className="flex justify-between">
            <button
              onClick={onConfirm}
              className="bg-red-600 hover:bg-red-700 text-black py-2 px-4 rounded"
            >
              Sí
            </button>
            <button
              onClick={onCancel}
              className="bg-gray-600 hover:bg-gray-700 text-black py-2 px-4 rounded"
            >
              No
            </button>
          </div>
        ) : (
          <button
            onClick={onClose || (() => window.location.href = '/videocalls/')}
            className="bg-gray-600 hover:bg-gray-700 text-black py-2 px-4 rounded"
          >
            Cerrar
          </button>
        )}
      </div>
    </div>
  );
};

export default RoomModal;