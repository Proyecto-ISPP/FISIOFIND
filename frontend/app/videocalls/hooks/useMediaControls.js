import { useState, useCallback } from 'react';

/**
 * Custom hook for managing media controls
 * @param {Object} options - Configuration options
 * @param {Object} options.localStreamRef - Reference to local media stream
 * @param {Object} options.localVideoRef - Reference to local video element
 * @param {Object} options.peerConnectionRef - Reference to peer connection
 * @param {Function} options.addChatMessage - Function to add a chat message
 * @param {Function} options.setErrorMessage - Function to set error message
 * @param {Function} options.setConnecting - Function to set connecting state
 * @returns {Object} Media controls utilities and state
 */
const useMediaControls = ({
  localStreamRef,
  localVideoRef,
  peerConnectionRef,
  addChatMessage,
  setErrorMessage,
  setConnecting
}) => {
  // State for media controls
  const [micActive, setMicActive] = useState(true);
  const [cameraActive, setCameraActive] = useState(true);
  const [isSharing, setIsSharing] = useState(false);

  // Initialize local media (camera and microphone)
  const initLocalMedia = useCallback(async () => {
    console.log("Inicializando medios locales...");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });

      console.log("Stream local obtenido:", stream.id);
      console.log("Pistas de video:", stream.getVideoTracks().length);
      console.log("Pistas de audio:", stream.getAudioTracks().length);

      localStreamRef.current = stream;
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        console.log("Video local configurado");
      }
      
      setConnecting(false);
      return stream;
    } catch (err) {
      console.error("Error al acceder a cámara/micrófono:", err);
      handleMediaError(err);
      throw err;
    }
  }, [localStreamRef, localVideoRef, setConnecting]);

  // Handle media errors
  const handleMediaError = useCallback((err) => {
    if (err.name === 'NotAllowedError') {
      setErrorMessage('Permiso denegado para cámara o micrófono. Habilita los permisos en tu navegador.');
    } else if (err.name === 'NotFoundError') {
      setErrorMessage('No se encontró cámara o micrófono. Verifica la conexión de tus dispositivos.');
    } else {
      setErrorMessage(`Error: ${err.message}`);
    }
    
    setCameraActive(false);
    setMicActive(false);
    setConnecting(false);
  }, [setErrorMessage, setConnecting]);

  // Toggle microphone
  const toggleMic = useCallback(() => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      if (audioTracks.length > 0) {
        audioTracks[0].enabled = !micActive;
        setMicActive(!micActive);
        addChatMessage('Sistema', `Micrófono ${!micActive ? 'activado' : 'desactivado'}`);
      }
    }
  }, [localStreamRef, micActive, addChatMessage]);

  // Toggle camera
  const toggleCamera = useCallback(() => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      if (videoTracks.length > 0) {
        videoTracks[0].enabled = !cameraActive;
        setCameraActive(!cameraActive);
        addChatMessage('Sistema', `Cámara ${!cameraActive ? 'activada' : 'desactivada'}`);
      }
    }
  }, [localStreamRef, cameraActive, addChatMessage]);

  // Start screen sharing
  const startScreenShare = useCallback(async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ 
        video: { cursor: 'always' }, 
        audio: false 
      });
      
      // Save original video track to restore later
      const videoTrack = screenStream.getVideoTracks()[0];
      
      if (peerConnectionRef.current) {
        const senders = peerConnectionRef.current.getSenders();
        const videoSender = senders.find(sender => 
          sender.track && sender.track.kind === 'video'
        );
        
        if (videoSender) {
          await videoSender.replaceTrack(videoTrack);
        }
        
        // Show shared screen in local video
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }
        
        // Handle when user stops sharing
        videoTrack.onended = () => {
          stopScreenShare();
        };
        
        setIsSharing(true);
        addChatMessage('Sistema', 'Has comenzado a compartir tu pantalla');
      }
    } catch (error) {
      console.error('Error al compartir pantalla:', error);
      addChatMessage('Sistema', `Error al compartir pantalla: ${error.message}`);
    }
  }, [peerConnectionRef, localVideoRef, addChatMessage]);

  // Stop screen sharing
  const stopScreenShare = useCallback(async () => {
    try {
      if (peerConnectionRef.current && localStreamRef.current) {
        const videoTrack = localStreamRef.current.getVideoTracks()[0];
        
        if (videoTrack) {
          const senders = peerConnectionRef.current.getSenders();
          const videoSender = senders.find(sender => 
            sender.track && sender.track.kind === 'video'
          );
          
          if (videoSender) {
            await videoSender.replaceTrack(videoTrack);
          }
          
          // Restore local video
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = localStreamRef.current;
          }
        }
        
        setIsSharing(false);
        addChatMessage('Sistema', 'Has dejado de compartir tu pantalla');
      }
    } catch (error) {
      console.error('Error al detener compartición:', error);
    }
  }, [peerConnectionRef, localStreamRef, localVideoRef, addChatMessage]);

  // Toggle screen sharing
  const toggleScreenShare = useCallback(async () => {
    if (isSharing) {
      stopScreenShare();
    } else {
      await startScreenShare();
    }
  }, [isSharing, startScreenShare, stopScreenShare]);

  // Clean up media resources
  const cleanupMedia = useCallback(() => {
    if (localStreamRef.current) {
      console.log('Deteniendo tracks locales');
      localStreamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log(`Track ${track.kind} detenido`);
      });
      localStreamRef.current = null;
    }
  }, [localStreamRef]);

  return {
    micActive,
    cameraActive,
    isSharing,
    initLocalMedia,
    toggleMic,
    toggleCamera,
    toggleScreenShare,
    cleanupMedia
  };
};

export default useMediaControls;