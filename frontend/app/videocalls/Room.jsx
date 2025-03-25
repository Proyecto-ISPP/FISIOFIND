'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './Room.module.css';

import RoomHeader from './RoomHeader';
import VideoGrid from './VideoGrid';
import Controls from './Controls';
import ChatPanel from './ChatPanel';
import SettingsPanel from './SettingsPanel';
import ToolsContainer from './ToolsContainer';
import ToolPanel from './ToolPanel';
import RoomModal from './RoomModal';

import useWebSocket from './hooks/useWebSocket';
import useWebRTC from './hooks/useWebRTC';
import useMediaControls from './hooks/useMediaControls';
import useChat from './hooks/useChat';
import useRoomManagement from './hooks/useRoomManagement';
import MapaDolor from './tools/MapaDolor';

import { faCancel } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import axios from 'axios';
import { getApiBaseUrl } from '@/utils/api';

const Room = ({ roomCode }) => {
  const [userRole, setUserRole] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);

  const [showSettings, setShowSettings] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);
  const [activePainMap, setActivePainMap] = useState(null);
  const [partsColored, setPartsColored] = useState([]);

  // Inicializamos los hooks SIEMPRE
  const webSocket = useWebSocket(roomCode, userRole, () => {});
  const chat = useChat({ userRole, sendWebSocketMessage: webSocket.sendWebSocketMessage });
  const webRTC = useWebRTC({
    localStreamRef,
    localVideoRef,
    remoteVideoRef,
    userRole,
    addChatMessage: chat.addChatMessage,
    sendWebSocketMessage: webSocket.sendWebSocketMessage,
  });
  const mediaControls = useMediaControls({
    localStreamRef,
    localVideoRef,
    peerConnectionRef: webRTC.peerConnectionRef,
    addChatMessage: chat.addChatMessage,
    setErrorMessage: webRTC.setErrorMessage,
    setConnecting: webRTC.setConnecting,
  });
  const roomManagement = useRoomManagement({
    roomCode,
    userRole,
    closeConnection: () => {
      webRTC.closeConnection();
      webSocket.closeWebSocket();
      mediaControls.cleanupMedia();
    },
    cleanupMedia: mediaControls.cleanupMedia,
    sendWebSocketMessage: webSocket.sendWebSocketMessage,
    addChatMessage: chat.addChatMessage,
  });

  // Cargar token y rol desde backend
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      axios
        .get(`${getApiBaseUrl()}/api/app_user/check-role/`, {
          headers: {
            Authorization: 'Bearer ' + storedToken,
          },
        })
        .then((response) => {
          const role = response.data.user_role;
          if (role === 'physiotherapist') {
            setUserRole('physio');
          } else if (role === 'patient') {
            setUserRole('patient');
          } else {
            setUserRole(null);
          }
        })
        .catch((err) => {
          console.error('Error al obtener el rol del usuario:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  // Esperar a tener el rol antes de inicializar lógica pesada
  useEffect(() => {
    if (!loading && userRole) {
      console.log(`Inicializando sala ${roomCode} como ${userRole}`);

      const initAll = async () => {
        try {
          await mediaControls.initLocalMedia();
          chat.addChatMessage('Sistema', 'Cámara y micrófono inicializados correctamente');
          webSocket.connectWebSocket();
        } catch (err) {
          console.error('Error durante la inicialización:', err);
          webRTC.setErrorMessage(`Error de inicialización: ${err.message}`);
        }
      };

      initAll();
    }

    return () => {
      webRTC.closeConnection();
      webSocket.closeWebSocket();
      mediaControls.cleanupMedia();
    };
  }, [loading, userRole]);

  // WebSocket message handling
  useEffect(() => {
    const handleWebSocketMessage = (data) => {
      if (data.action && data.message) {
        switch (data.action) {
          case 'chat-message':
            chat.handleChatMessage(data.message);
            break;
          case 'call-ended':
          case 'user-disconnected':
            roomManagement.handleCallEnded();
            break;
          case 'pain-map':
            if (data.message.mapId) {
              setActivePainMap(data.message.mapId === 'quit' ? null : data.message.mapId);
            } else if (data.message.partsSelected) {
              setPartsColored(data.message.partsSelected);
            }
            break;
          default:
            webRTC.handleWebSocketMessage(data);
        }
      }
    };

    webSocket.setMessageHandler(handleWebSocketMessage);
  }, [chat, webRTC, webSocket, roomManagement]);

  const handlePainMapSelect = (mapId) => {
    setActivePainMap(mapId);
  };

  const sendPainMapToPatient = (specific) => {
    if (activePainMap) {
      webSocket.sendWebSocketMessage({
        action: 'pain-map',
        message: {
          mapId: specific || activePainMap,
        },
      });

      chat.addChatMessage('Sistema', `Mapa de dolor "${activePainMap}" enviado al paciente.`);
    }
  };

  const showTools = userRole === 'physio';

  if (loading) {
    return (
      <div className={styles.roomContainer}>
        <p>Cargando sala...</p>
      </div>
    );
  }
  if (!token || !userRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Acceso restringido</h2>
          <p className="text-gray-700 mb-4">
            🔒 Necesitas iniciar sesión para acceder a las videollamadas.
          </p>
          <button
            onClick={() => (window.location.href = '/login')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className={styles.roomContainer}>
      <RoomHeader
        roomCode={roomCode}
        errorMessage={webRTC.errorMessage || webSocket.errorMessage}
      />

      <RoomModal
        show={roomManagement.showModal}
        message={roomManagement.modalMessage}
        showButtons={roomManagement.showDeleteButtons}
        userRole={userRole}
        onConfirm={roomManagement.confirmDeleteRoom}
        onCancel={roomManagement.cancelDelete}
        onClose={() => (window.location.href = '/videocalls/')}
      />

      <VideoGrid
        localVideoRef={localVideoRef}
        remoteVideoRef={remoteVideoRef}
        cameraActive={mediaControls.cameraActive}
        connected={webRTC.connected}
        isSharing={mediaControls.isSharing}
        userRole={userRole}
      />

      <Controls
        micActive={mediaControls.micActive}
        cameraActive={mediaControls.cameraActive}
        toggleMic={mediaControls.toggleMic}
        toggleCamera={mediaControls.toggleCamera}
        toggleScreenShare={mediaControls.toggleScreenShare}
        showChat={chat.showChat}
        setShowChat={chat.setShowChat}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        endCall={roomManagement.endCall}
      />

      <ChatPanel
        showChat={chat.showChat}
        chatMessages={chat.chatMessages}
        chatMessagesRef={chat.chatMessagesRef}
        messageInput={chat.messageInput}
        setMessageInput={chat.setMessageInput}
        handleKeyPress={chat.handleKeyPress}
        sendChatMessage={chat.sendChatMessage}
        messageInputRef={chat.messageInputRef}
      />

      <SettingsPanel showSettings={showSettings} setShowSettings={setShowSettings} />

      {!showTools && activePainMap && (
        <>
          <button
            className={`${styles.actionButton} ${styles.primaryAction}`}
            onClick={() => sendPainMapToPatient('quit')}
          >
            <FontAwesomeIcon icon={faCancel} /> Dejar de compartir
          </button>
          <MapaDolor
            scale={1.3}
            gender={activePainMap}
            partsColored={partsColored}
            sendWebSocketMessage={webSocket.sendWebSocketMessage}
          />
        </>
      )}

      {showTools && (
        <>
          <ToolsContainer
            selectedTool={selectedTool}
            setSelectedTool={setSelectedTool}
            toggleScreenShare={mediaControls.toggleScreenShare}
          />
          {selectedTool && (
            <ToolPanel
              selectedTool={selectedTool}
              activePainMap={activePainMap}
              handlePainMapSelect={handlePainMapSelect}
              sendPainMapToPatient={sendPainMapToPatient}
              userRole={userRole}
              partsColored={partsColored}
              sendWebSocketMessage={webSocket.sendWebSocketMessage}
            />
          )}
        </>
      )}

      {!webRTC.connected && !webRTC.connecting && (
        <div className={styles.reconnectContainer}>
          <button
            className={styles.reconnectButton}
            onClick={() => {
              if (userRole === 'physio') {
                webRTC.initConnection(webRTC.remoteUserChannelRef.current);
              }
            }}
          >
            Reconectar
          </button>
        </div>
      )}
    </div>
  );
};

export default Room;
