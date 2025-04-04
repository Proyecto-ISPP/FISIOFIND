import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { getApiBaseUrl } from "@/utils/api";

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
  addChatMessage,
  onCallEndedMessage
}) => {
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle user leaving the call temporarily
  const leaveCall = useCallback(() => {
    closeConnection();
    cleanupMedia();
    addChatMessage('Sistema', 'Has salido de la llamada');

    // Notify other participants that this user has left
    sendWebSocketMessage({
      action: 'user-left',
      message: { role: userRole }
    });

    setModalMessage("Has salido de la llamada. Puedes volver a entrar en cualquier momento.");
    setShowModal(true);

    // Redirect to videocalls page
    setTimeout(() => {
      window.location.href = '/videocalls';
    }, 2000);
  }, [userRole, addChatMessage, sendWebSocketMessage, closeConnection, cleanupMedia]);

  // Handle when another user leaves the call
  const handleUserLeft = useCallback((userInfo) => {
    const role = userInfo.role === 'physio' ? 'fisioterapeuta' : 'paciente';
    addChatMessage('Sistema', `El ${role} ha salido de la llamada temporalmente`);
  }, [addChatMessage]);

  // Handle when another user joins the call
  const handleUserJoined = useCallback((userInfo) => {
    const role = userInfo.role === 'physio' ? 'fisioterapeuta' : 'paciente';
    addChatMessage('Sistema', `El ${role} se ha unido a la llamada`);
  }, [addChatMessage]);

  // Handle when a call ended message is received
  useEffect(() => {
    if (onCallEndedMessage) {
      closeConnection();
      cleanupMedia();
      setModalMessage("La videollamada ha sido finalizada por el fisioterapeuta.");
      setShowModal(true);
      
      setTimeout(() => {
        window.location.href = '/videocalls/end';
      }, 2000);
    }
  }, [onCallEndedMessage, closeConnection, cleanupMedia]);

  // Close the modal
  const closeModal = useCallback(() => {
    setShowModal(false);
  }, []);

  return {
    showModal,
    modalMessage,
    setShowModal,
    setModalMessage,
    leaveCall,   // New function for physio to end call for all
    closeModal,      // Renamed from cancelDelete
    handleUserLeft,  // New function to handle when another user leaves
    handleUserJoined // New function to handle when another user joins
  };
};

export default useRoomManagement;