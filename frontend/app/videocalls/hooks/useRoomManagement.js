import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { getApiBaseUrl } from "@/utils/api";

const useRoomManagement = ({
  roomCode,
  userRole,
  closeConnection,
  cleanupMedia,
  sendWebSocketMessage,
  addChatMessage,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showDeleteButtons, setShowDeleteButtons] = useState(false);
  const [waitingForDeletion, setWaitingForDeletion] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const redirectToHome = () => {
    window.location.href = '/';
  };

  const endCall = useCallback(async () => {
    closeConnection();
    cleanupMedia();
    addChatMessage('Sistema', 'Has finalizado la llamada');

    if (userRole === 'physio') {
      setModalMessage("¿Deseas eliminar la sala de la videollamada?");
      setShowDeleteButtons(true);
      setShowModal(true);
    } else {
      sendWebSocketMessage({
        action: 'user-left',
        message: { role: 'patient' }
      });

      setTimeout(redirectToHome, 1000);
    }
  }, [userRole, addChatMessage, sendWebSocketMessage, closeConnection, cleanupMedia]);

  const confirmDeleteRoom = useCallback(async () => {
    if (!isClient) return;

    const storedToken = localStorage.getItem('token');

    try {
      await sendWebSocketMessage({
        action: 'call-ended',
        message: { text: 'La videollamada ha sido finalizada por el fisioterapeuta.' }
      });

      setTimeout(async () => {
        const response = await axios.delete(
          `${getApiBaseUrl()}/api/videocall/delete-room/${roomCode}/`,
          {
            headers: {
              Authorization: `Bearer ${storedToken}`
            }
          }
        );

        if (response.status === 204) {
          setModalMessage("La llamada ha finalizado");
          setShowDeleteButtons(false);
          setShowModal(true);

          closeConnection();
          cleanupMedia();

          setTimeout(redirectToHome, 2000);
        }
      }, 1000);
    } catch (error) {
      console.error('Error eliminando la sala:', error);
      setModalMessage("Error eliminando la sala, intenta nuevamente.");
    }
  }, [roomCode, sendWebSocketMessage, closeConnection, cleanupMedia, isClient]);

  const cancelDelete = useCallback(() => {
    setShowModal(false);
  }, []);

  const handleCallEnded = useCallback(() => {
    setModalMessage("La reunión ha finalizado.");
    setShowModal(true);

    setTimeout(() => {
      closeConnection();
      cleanupMedia();
      redirectToHome();
    }, 2000);
  }, [closeConnection, cleanupMedia]);

  return {
    showModal,
    modalMessage,
    showDeleteButtons,
    endCall,
    confirmDeleteRoom,
    cancelDelete,
    handleCallEnded,
    setShowModal,
    setModalMessage,
    setShowDeleteButtons,
    setWaitingForDeletion
  };
};

export default useRoomManagement;
