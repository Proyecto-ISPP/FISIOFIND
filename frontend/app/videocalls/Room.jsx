'use client';

import React, { useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable'; // Necesitarás instalar: npm install react-draggable
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
import useRemoteSpeechTranscription from './hooks/useRemoteSpeechTranscription';

import MapaDolor from './tools/MapaDolor';
import QuestionnaireResponseViewer from './tools/QuestionnaireResponseViewer';
import PatientQuestionnaire from './tools/PatientQuestionnaire';

import { faCancel } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import axios from 'axios';
import { getApiBaseUrl } from '@/utils/api';

import { useRouter } from 'next/navigation';

const Room = ({ roomCode }) => {
  const [userRole, setUserRole] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);

  // Subtítulos remotos
  const [showRemoteSubs, setShowRemoteSubs] = useState(false);
  const remoteStream = remoteVideoRef.current?.srcObject || null;
  const { transcripts } = useRemoteSpeechTranscription(showRemoteSubs, remoteStream);

  const subtitlesRef = useRef(null); // Añade esta línea cerca de tus otros useRefs

  const [showSettings, setShowSettings] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);
  const [activePainMap, setActivePainMap] = useState(null);
  const [partsColoredFront, setPartsColoredFront] = useState([]);
  const [partsColoredBack, setPartsColoredBack] = useState([]);
  const [subtitlesPosition, setSubtitlesPosition] = useState({ x: 0, y: 0 });
  const [questionnaires, setQuestionnaires] = useState([]);
  const [activeQuestionnaire, setActiveQuestionnaire] = useState(null);
  const [questionnaireResponse, setQuestionnaireResponse] = useState(null);
  const [responseQuestionnaire, setResponseQuestionnaire] = useState(null);

  // Inicializamos los hooks SIEMPRE
  const webSocket = useWebSocket(roomCode, userRole, () => { });
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
  const router = useRouter();

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
          console.log('Error al obtener el rol del usuario:', err);
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
    const validateAccess = async () => {
      try {
        const response = await axios.get(`${getApiBaseUrl()}/api/videocall/join-room/${roomCode}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("✅ Acceso validado con backend:", response.data);
      } catch (error) {
        console.log(" Acceso denegado por backend:", error.response?.data || error.message);
        alert("No tienes permiso para acceder a esta sala.");
        router.push('/videocalls');
        return;
      }
  
      try {
        console.log(`Inicializando sala ${roomCode} como ${userRole}`);
        await mediaControls.initLocalMedia();
        chat.addChatMessage('Sistema', 'Cámara y micrófono inicializados correctamente');
        webSocket.connectWebSocket();
      } catch (err) {
        //console.error('Error durante la inicialización:', err);
        //webRTC.setErrorMessage(`Error de inicialización: ${err.message}`);
        if (err.name === 'NotAllowedError') {
          webRTC.setErrorMessage('Permiso denegado para cámara o micrófono. Habilita los permisos en tu navegador.');
        } else if (err.name === 'NotFoundError') {
          console.log("Aqui estoy")
          webRTC.setErrorMessage('No se encontró cámara o micrófono. Verifica la conexión de tus dispositivos.');
        } else {
          webRTC.setErrorMessage(`Error: ${err.message}`);
        }
      }
    };
  
    if (!loading && userRole && token) {
      validateAccess();
    }
  
    return () => {
      webRTC.closeConnection();
      webSocket.closeWebSocket();
      mediaControls.cleanupMedia();
    };
  }, [loading, userRole, token]);

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
            break;
          case 'pain-map':
            if (data.message.mapId) {
              setActivePainMap(
                data.message.mapId === 'quit' ? null : data.message.mapId
              );
            } else if (data.message.partsSelected && data.message.side) {
              if (data.message.side === 'front') {
                setPartsColoredFront(data.message.partsSelected);
              } else if (data.message.side === 'back') {
                setPartsColoredBack(data.message.partsSelected);
              }
            }
            break;
          case 'send-questionnaire':
            if (userRole === 'patient') {
              setActiveQuestionnaire(data.message.questionnaire);
              chat.addChatMessage(
                'Sistema',
                `Has recibido el cuestionario: "${data.message.questionnaire.title}"`
              );
            }
            break;
          case 'submit-questionnaire':
            if (userRole === 'physio') {
              chat.addChatMessage(
                'Sistema',
                `El paciente ha respondido al cuestionario: "${data.message.questionnaireTitle}"`
              );

              const matchingQuestionnaire = questionnaires.find(
                (q) => q.id === data.message.questionnaireId
              );

              if (matchingQuestionnaire) {
                setResponseQuestionnaire(matchingQuestionnaire);
                setQuestionnaireResponse(data.message.responses);
              } else {
                setResponseQuestionnaire({
                  id: data.message.questionnaireId,
                  title: data.message.questionnaireTitle,
                  questions: [],
                });
                setQuestionnaireResponse(data.message.responses);
              }
            }
            break;
          default:
            webRTC.handleWebSocketMessage(data);
        }
      }
    };

    webSocket.setMessageHandler(handleWebSocketMessage);
  }, [chat, webRTC, webSocket, roomManagement]);

  // Efecto para cargar cuestionarios
  useEffect(() => {
    const fetchQuestionnaires = async () => {
      try {
        const response = await axios.get(
          `${getApiBaseUrl()}/api/questionnaires/list/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setQuestionnaires(response.data);
      } catch (error) {
        console.log('Error fetching questionnaires:', error);
      }
    };

    if (token && userRole === 'physio') {
      fetchQuestionnaires();
    }
  }, [token, userRole]);

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

      chat.addChatMessage(
        'Sistema',
        `Mapa de dolor "${activePainMap}" enviado al paciente.`
      );
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
          <h2 className="text-xl font-semibold mb-4 text-blue-600">
            Acceso restringido
          </h2>
          <p className="text-gray-700 mb-4">
            🔒 Necesitas iniciar sesión para acceder a las videollamadas.
          </p>
          <button
            onClick={() => (router.push('/login'))}
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
        onClose={() => (router.push('/videocalls'))}
      />

      <VideoGrid
        localVideoRef={localVideoRef}
        remoteVideoRef={remoteVideoRef}
        cameraActive={mediaControls.cameraActive}
        connected={webRTC.connected}
        isSharing={mediaControls.isSharing}
        userRole={userRole}
      />

      {/* SUBTÍTULOS MEJORADOS */}
      {showRemoteSubs && (
        <Draggable
          nodeRef={subtitlesRef} // Añade esta prop
          defaultPosition={subtitlesPosition}
          onStop={(e, data) => setSubtitlesPosition({ x: data.x, y: data.y })}
          bounds="parent"
        >
          <div ref={subtitlesRef} className={styles.subtitlesContainer}>
            <div className={styles.subtitlesHeader}>
              <span></span>
              <button
                className={styles.subtitlesClose}
                onClick={() => setShowRemoteSubs(false)}
              >
                ×
              </button>
            </div>
            <div className={styles.subtitlesContent}>
              {transcripts.slice(-2).map((t, i) => (
                <p
                  key={i}
                  className={`${styles.subtitleText} ${t.isFinal ? styles.subtitleFinal : styles.subtitlePartial}`}
                >
                  {t.text}
                </p>
              ))}
              {transcripts.length === 0 && (
                <p className={styles.subtitleEmpty}>Esperando voz...</p>
              )}
            </div>
          </div>
        </Draggable>
      )}

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
        leaveCall={roomManagement.leaveCall}
        showRemoteSubs={showRemoteSubs}
        setShowRemoteSubs={setShowRemoteSubs}
        webRTCConnected={webRTC.connected}
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
            partsColoredFront={partsColoredFront}
            partsColoredBack={partsColoredBack}
            sendWebSocketMessage={webSocket.sendWebSocketMessage}
          />
        </>
      )}

      {!showTools && activeQuestionnaire && (
        <>
          <div className={styles.modalOverlay} onClick={() => setActiveQuestionnaire(null)} />
          <PatientQuestionnaire
            questionnaire={activeQuestionnaire}
            sendWebSocketMessage={webSocket.sendWebSocketMessage}
            onClose={() => setActiveQuestionnaire(null)}
          />
        </>
      )}

      {showTools && (
        <>
          <ToolsContainer
            selectedTool={selectedTool}
            setSelectedTool={setSelectedTool}
            toggleScreenShare={mediaControls.toggleScreenShare}
            hasQuestionnaires={userRole === 'physio'}
          />
          {selectedTool && (
            <ToolPanel
              selectedTool={selectedTool}
              activePainMap={activePainMap}
              handlePainMapSelect={handlePainMapSelect}
              sendPainMapToPatient={sendPainMapToPatient}
              userRole={userRole}
              partsColoredFront={partsColoredFront}
              partsColoredBack={partsColoredBack}
              sendWebSocketMessage={webSocket.sendWebSocketMessage}
              questionnaires={questionnaires}
              addChatMessage={chat.addChatMessage}
              onCloseTool={() => setSelectedTool(null)}
              token={token}
            />
          )}
        </>
      )}

      {!webRTC.connected && !webRTC.connecting && (
        <div className={styles.reconnectContainer}>
          <button
            className="inline-flex items-center gap-2 bg-teal-500 text-white font-semibold py-3 px-6 rounded-xl shadow"
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

      {userRole === 'physio' && questionnaireResponse && (
        <div className={styles.modalOverlay}>
          <QuestionnaireResponseViewer
            responseData={questionnaireResponse}
            questionnaire={responseQuestionnaire}
            onClose={() => {
              setQuestionnaireResponse(null);
              setResponseQuestionnaire(null);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Room;
