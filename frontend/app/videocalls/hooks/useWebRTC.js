import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for managing WebRTC connections
 * @param {Object} options - Configuration options
 * @param {Object} options.localStreamRef - Reference to local media stream
 * @param {Object} options.localVideoRef - Reference to local video element
 * @param {Object} options.remoteVideoRef - Reference to remote video element
 * @param {Function} options.sendWebSocketMessage - Function to send WebSocket messages
 * @param {String} options.userRole - User role (physio or patient)
 * @param {Function} options.addChatMessage - Function to add a chat message
 * @returns {Object} WebRTC utilities and state
 */
const useWebRTC = ({
  localStreamRef,
  localVideoRef,
  remoteVideoRef,
  sendWebSocketMessage,
  userRole,
  addChatMessage
}) => {
  // State variables
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  
  // References
  const peerConnectionRef = useRef(null);
  const remoteUserChannelRef = useRef(null);

  // Send ICE candidate - defining this first to avoid circular references
  const sendICECandidate = useCallback((candidate, receiverChannelName) => {
    // Make sure we have a destination channel
    const targetChannel = receiverChannelName || remoteUserChannelRef.current;
    
    if (targetChannel) {
      console.log('Enviando ICE candidate a:', targetChannel);
      sendWebSocketMessage({
        action: 'new-ice-candidate',
        message: {
          candidate: candidate,
          receiver_channel_name: targetChannel
        }
      });
    } else {
      console.warn('No hay canal de destino para ICE candidate, intentando broadcast');
      sendWebSocketMessage({
        action: 'new-ice-candidate',
        message: {
          candidate: candidate
        }
      });
    }
  }, [sendWebSocketMessage]);

  // Create peer connection
  const createPeerConnection = useCallback((remoteChannel = null) => {
    console.log('Creando RTCPeerConnection...');
    
    // Configuration for STUN/TURN servers to traverse NAT/Firewalls
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ]
    };
    
    const peerConnection = new RTCPeerConnection(configuration);
    console.log('RTCPeerConnection creada');
    
    // Add our audio/video tracks
    if (localStreamRef.current) {
      console.log('Añadiendo tracks locales a la conexión...');
      localStreamRef.current.getTracks().forEach(track => {
        console.log(`Añadiendo track: ${track.kind}`);
        peerConnection.addTrack(track, localStreamRef.current);
      });
    } else {
      console.error('No hay stream local al crear PeerConnection');
    }
    
    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      console.log('Nuevo ICE candidate:', event.candidate);
      if (event.candidate) {
        sendICECandidate(event.candidate, remoteChannel);
      }
    };
    
    // Receive remote stream
    peerConnection.ontrack = (event) => {
      console.log('¡Stream remoto recibido!', event.streams[0]);
      if (remoteVideoRef.current && event.streams[0]) {
        console.log('Asignando stream remoto al elemento de video');
        remoteVideoRef.current.srcObject = event.streams[0];
        setConnected(true);
        setConnecting(false);
        addChatMessage('Sistema', `${userRole === 'physio' ? 'Paciente' : 'Fisioterapeuta'} conectado a la videollamada.`);
      } else {
        console.error('remoteVideoRef no está disponible o no hay stream');
      }
    };
    
    // Connection state changes
    peerConnection.onconnectionstatechange = (event) => {
      console.log('Estado de conexión cambiado a:', peerConnection.connectionState);
      if (peerConnection.connectionState === 'connected') {
        console.log('¡Conexión establecida correctamente!');
        setConnected(true);
        setConnecting(false);
      } else if (peerConnection.connectionState === 'disconnected' || 
                peerConnection.connectionState === 'failed') {
        console.log('Conexión perdida o fallida');
        setConnected(false);
        setErrorMessage('La conexión se ha perdido. Intenta recargar la página.');
      }
    };
    
    // ICE connection state
    peerConnection.oniceconnectionstatechange = (event) => {
      console.log('ICE connection state:', peerConnection.iceConnectionState);
    };
    
    peerConnectionRef.current = peerConnection;
    return peerConnection;
  }, [localStreamRef, remoteVideoRef, sendICECandidate, userRole, addChatMessage]);

  // Create and send offer
  const createAndSendOffer = useCallback(async (remoteChannel = null) => {
    console.log('Creando oferta para:', remoteChannel);
    if (!peerConnectionRef.current) {
      console.log('No hay peerConnection, creando una nueva');
      createPeerConnection(remoteChannel);
    }
    
    try {
      const offer = await peerConnectionRef.current.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });
      
      console.log('Oferta creada:', offer);
      await peerConnectionRef.current.setLocalDescription(offer);
      console.log('LocalDescription establecida');
      
      // Make sure we have a destination channel
      if (!remoteChannel && remoteUserChannelRef.current) {
        remoteChannel = remoteUserChannelRef.current;
        console.log('Usando channel guardado:', remoteChannel);
      }
      
      if (remoteChannel) {
        sendWebSocketMessage({
          action: 'new-offer',
          message: {
            sdp: offer,
            receiver_channel_name: remoteChannel
          }
        });
        console.log('Oferta enviada a:', remoteChannel);
      } else {
        console.log('No hay canal de destino para enviar la oferta');
        // Fallback: send without receiver_channel_name (broadcast)
        sendWebSocketMessage({
          action: 'new-offer',
          message: {
            sdp: offer
          }
        });
        console.log('Oferta enviada en broadcast (no óptimo)');
      }
    } catch (error) {
      console.error('Error al crear o enviar oferta:', error);
      setErrorMessage('Error al establecer la conexión de video');
    }
  }, [createPeerConnection, sendWebSocketMessage]);

  // Initialize connection
  const initConnection = useCallback((remoteChannel = null) => {
    console.log('Iniciando proceso de conexión con remoteChannel:', remoteChannel);
    createPeerConnection(remoteChannel);
    createAndSendOffer(remoteChannel);
  }, [createPeerConnection, createAndSendOffer]);

  // Handle offer
  const handleOffer = useCallback(async (message) => {
    console.log('Procesando oferta recibida:', message);
    try {
      // Save the sender's channel if available
      if (message.sender_channel_name) {
        remoteUserChannelRef.current = message.sender_channel_name;
        console.log('Channel del remitente guardado:', remoteUserChannelRef.current);
      }
      
      if (!peerConnectionRef.current) {
        console.log('Creando peerConnection para procesar oferta');
        createPeerConnection(remoteUserChannelRef.current);
      }
      
      const offer = new RTCSessionDescription(message.sdp);
      
      if (peerConnectionRef.current.signalingState !== 'stable') {
        console.log('No se puede procesar la oferta en estado:', peerConnectionRef.current.signalingState);
        return;
      }
      
      console.log('Estableciendo oferta como RemoteDescription');
      await peerConnectionRef.current.setRemoteDescription(offer);
      
      console.log('Creando respuesta...');
      const answer = await peerConnectionRef.current.createAnswer();
      console.log('Respuesta creada:', answer);
      
      console.log('Estableciendo respuesta como LocalDescription');
      await peerConnectionRef.current.setLocalDescription(answer);
      
      // Determine who to send the answer to
      const receiverChannel = message.sender_channel_name || remoteUserChannelRef.current;
      
      if (receiverChannel) {
        console.log('Enviando respuesta a:', receiverChannel);
        sendWebSocketMessage({
          action: 'new-answer',
          message: {
            sdp: answer,
            receiver_channel_name: receiverChannel
          }
        });
      } else {
        console.warn('No hay canal definido para respuesta, enviando broadcast');
        sendWebSocketMessage({
          action: 'new-answer',
          message: {
            sdp: answer
          }
        });
      }
    } catch (error) {
      console.error('Error al manejar oferta:', error);
      setErrorMessage('Error al procesar la oferta de conexión');
    }
  }, [createPeerConnection, sendWebSocketMessage]);

  // Handle offer v1 (for backward compatibility)
  const handleOfferV1 = useCallback(async (message) => {
    console.log('Procesando oferta V1:', message);
    try {
      if (!peerConnectionRef.current) {
        console.log('Creando peerConnection para procesar oferta V1');
        createPeerConnection();
      }
      
      const offer = new RTCSessionDescription(message.sdp);
      
      console.log('Estableciendo oferta V1 como RemoteDescription');
      await peerConnectionRef.current.setRemoteDescription(offer);
      
      console.log('Creando respuesta V1...');
      const answer = await peerConnectionRef.current.createAnswer();
      console.log('Respuesta V1 creada:', answer);
      
      console.log('Estableciendo respuesta V1 como LocalDescription');
      await peerConnectionRef.current.setLocalDescription(answer);
      
      console.log('Enviando respuesta V1');
      sendWebSocketMessage({
        action: 'new-answer',
        message: { sdp: answer }
      });
    } catch (error) {
      console.error('Error al manejar oferta V1:', error);
    }
  }, [createPeerConnection, sendWebSocketMessage]);

  // Handle answer
  const handleAnswer = useCallback(async (message) => {
    console.log('Procesando respuesta recibida:', message);
    try {
      if (!peerConnectionRef.current) {
        console.error('No hay peerConnection al recibir respuesta');
        return;
      }
      
      const answer = new RTCSessionDescription(message.sdp);
      
      if (peerConnectionRef.current.signalingState === 'have-local-offer') {
        console.log('Estableciendo respuesta como RemoteDescription');
        await peerConnectionRef.current.setRemoteDescription(answer);
        console.log('Respuesta procesada correctamente');
      } else {
        console.log('No se puede procesar la respuesta en estado:', peerConnectionRef.current.signalingState);
      }
    } catch (error) {
      console.error('Error al manejar respuesta:', error);
    }
  }, []);

  // Handle answer v1 (for backward compatibility)
  const handleAnswerV1 = useCallback(async (message) => {
    console.log('Procesando respuesta V1:', message);
    try {
      if (!peerConnectionRef.current) {
        console.error('No hay peerConnection al recibir respuesta V1');
        return;
      }
      
      const answer = new RTCSessionDescription(message.sdp);
      
      console.log('Estableciendo respuesta V1 como RemoteDescription');
      await peerConnectionRef.current.setRemoteDescription(answer);
      console.log('Respuesta V1 procesada correctamente');
    } catch (error) {
      console.error('Error al manejar respuesta V1:', error);
    }
  }, []);

  // Handle ICE candidate
  const handleNewICECandidate = useCallback(async (message) => {
    console.log('Procesando ICE candidate:', message);
    try {
      if (!peerConnectionRef.current) {
        console.error('No hay peerConnection al recibir ICE candidate');
        return;
      }
      
      if (message.candidate) {
        console.log('Añadiendo ICE candidate a la conexión');
        const candidate = new RTCIceCandidate(message.candidate);
        await peerConnectionRef.current.addIceCandidate(candidate);
        console.log('ICE candidate añadido correctamente');
      }
    } catch (error) {
      console.error('Error al añadir ICE candidate:', error);
    }
  }, []);

  // Already moved sendICECandidate function to the top to fix circular reference

  // Close connection
  const closeConnection = useCallback(() => {
    console.log('Cerrando conexión de pares...');
    
    if (peerConnectionRef.current) {
      console.log('Cerrando RTCPeerConnection');
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    
    setConnected(false);
  }, []);

  // Handle WebSocket message
  const handleWebSocketMessage = useCallback((data) => {
    if (!data.action || !data.message) return;
    
    const { action, message } = data;
    
    if (action === 'connected') {
      console.log('Conectado al servidor, channel_name:', message?.channel_name);
      return;
    }
    
    switch (action) {
      case 'join':
        console.log('Otro usuario se unió a la sala:', message);
        remoteUserChannelRef.current = message.channel_name;
        
        if (userRole === 'physio') {
          console.log('Somos fisio, iniciando conexión con:', message.channel_name);
          setTimeout(() => {
            initConnection(message.channel_name);
          }, 1000);
        }
        break;
      
      case 'new-offer':
        console.log('Oferta recibida:', message);
        handleOffer(message);
        break;
      
      case 'new-answer':
        console.log('Respuesta recibida:', message);
        handleAnswer(message);
        break;
      
      case 'new-ice-candidate':
        console.log('ICE Candidate recibido:', message);
        handleNewICECandidate(message);
        break;
      case 'call-ended':
          console.log('Recibido mensaje de finalización de llamada:', message);
          setTimeout(() => {
            closeConnection();
            window.location.href = '/videollamadas';
          }, 1500);
          break;
        
      
      // Other actions are handled elsewhere
      
      default:
        console.log('Acción WebRTC desconocida:', action);
    }
  }, [userRole, initConnection, handleOffer, handleAnswer, handleNewICECandidate]);

  return {
    connected,
    connecting,
    setConnecting,
    errorMessage,
    setErrorMessage,
    peerConnectionRef,
    remoteUserChannelRef,
    createPeerConnection,
    createAndSendOffer,
    initConnection,
    handleOffer,
    handleOfferV1,
    handleAnswer,
    handleAnswerV1,
    handleNewICECandidate,
    sendICECandidate,
    closeConnection,
    handleWebSocketMessage
  };
};

export default useWebRTC;