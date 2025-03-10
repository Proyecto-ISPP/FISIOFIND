import { useState, useCallback } from 'react';
import axios from 'axios';

/**
 * Custom hook for managing room lifecycle
 * @param {Object} options - Configuration options
 * @param {string} options.roomCode - Room ID/code
 * @param {string} options.userRole - User role (physio or patient)
 * @param {Function} options.closeConnection - Function to close WebRTC connection
 * @param {Function} options.cleanupMedia - Function to clean up media resources
 * @param {Function} options.sendWebSocketMessage - Function to send WebSocket messages
 * @param {Function} options.addChatMessage - Function to add a chat message
 * @returns {Object} Room management utilities and state
 */
const useRoomManagement = ({
  roomCode,
  userRole,
  closeConnection,
  cleanupMedia,
  sendWebSocketMessage,
  addChatMessage
}) => {
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showDeleteButtons, setShowDeleteButtons] = useState(false);
  const [waitingForDeletion, setWaitingForDeletion] = useState(false);

  // End call
  const endCall = useCallback(async () => {
    closeConnection();
    cleanupMedia();
    addChatMessage('Sistema', 'Has finalizado la llamada');

    // If physio, show action buttons
    if (userRole === 'physio') {
      setModalMessage("¿Deseas eliminar la sala de la videollamada?");
      setShowDeleteButtons(true);
      setShowModal(true);
    } else {
      // If patient, wait for physio confirmation
      window.location.href = '/videollamadas';
    }
  }, [userRole, closeConnection, cleanupMedia, addChatMessage]);

  // Confirm room deletion (physio only)
  const confirmDeleteRoom = useCallback(async () => {
    try {
      const response = await axios.delete(`http://localhost:8000/api/videocall/delete-room/${roomCode}/`);
      if (response.status === 204) {
        console.log('Sala eliminada correctamente');
        await sendWebSocketMessage({
          action: 'call-ended',
          message: { text: 'La llamada ha sido eliminada.' }
        });

        // Now show modal to patient
        setModalMessage("La llamada ha finalizado");
        setShowDeleteButtons(false);
        setShowModal(true);
        setWaitingForDeletion(true);
      }
    } catch (error) {
      console.error('Error eliminando la sala:', error);
    }
  }, [roomCode, sendWebSocketMessage]);

  // Cancel deletion
  const cancelDelete = useCallback(() => {
    setShowModal(false);
  }, []);

  // Handle call ended message
  const handleCallEnded = useCallback(() => {
    setModalMessage("La reunión ha finalizado.");
    setShowModal(true);

    setTimeout(() => {
      closeConnection();
      cleanupMedia();
      window.location.href = '/videollamadas';
    }, 5000);
  }, [closeConnection, cleanupMedia]);

  return {
    showModal,
    modalMessage,
    showDeleteButtons,
    waitingForDeletion,
    setShowModal,
    setModalMessage,
    setShowDeleteButtons,
    setWaitingForDeletion,
    endCall,
    confirmDeleteRoom,
    cancelDelete,
    handleCallEnded
  };
};

export default useRoomManagement;