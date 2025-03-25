import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for managing WebSocket connection and communication
 * @param {string} roomCode - The room code for the WebSocket connection
 * @param {string} userRole - The user's role (physio or patient)
 * @param {function} initialMessageHandler - Initial function to handle incoming WebSocket messages
 * @returns {Object} WebSocket utilities and state
 */
const useWebSocket = (roomCode, userRole, initialMessageHandler) => {
  const [errorMessage, setErrorMessage] = useState('');
  const wsRef = useRef(null);
  const messageHandlerRef = useRef(initialMessageHandler);
  
  // Allow external updates to the message handler
  const setMessageHandler = useCallback((handler) => {
    messageHandlerRef.current = handler;
  }, []);
  
  // Connect to WebSocket
  const connectWebSocket = useCallback(() => {
    console.log(`Conectando al WebSocket: ws://localhost:8000/ws/room/${roomCode}/`);
    
    const isProduction = window.location.protocol === 'https:';
    const wsProtocol = isProduction ? 'wss://' : 'ws://';
    const wsHost = isProduction ? process.env.NEXT_PUBLIC_API_URL.replace(/^https?:\/\//, '') : 'localhost:8000';
    const socket = new WebSocket(`${wsProtocol}${wsHost}/ws/room/${roomCode}/`);
    
    socket.onopen = () => {
      console.log('Conectado al WebSocket');
      wsRef.current = socket;
      
      // Send our channel_name to everyone in the room
      socket.send(JSON.stringify({
        action: 'join',
        message: {
          userRole: userRole
        }
      }));
      
      console.log(`Usuario ${userRole} ha enviado acción join`);
    };

    socket.onerror = (event) => {
      console.error('Error de WebSocket:', event);
      setErrorMessage('Error de conexión con el servidor');
    };

    socket.onclose = (event) => {
      console.log(`WebSocket cerrado: ${event.code} - ${event.reason}`);
    };

    socket.onmessage = (event) => {
      console.log('Mensaje WebSocket recibido:', event.data);
      try {
        const data = JSON.parse(event.data);
        // Use the current message handler from the ref
        if (messageHandlerRef.current) {
          messageHandlerRef.current(data);
        }
      } catch (error) {
        console.error('Error al procesar mensaje WebSocket:', error);
      }
    };
    
    wsRef.current = socket;
  }, [roomCode, userRole]);

  // Send message through WebSocket
  const sendWebSocketMessage = useCallback((data) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log('Enviando mensaje WebSocket:', data);
      wsRef.current.send(JSON.stringify(data));
    } else {
      console.error('WebSocket no está conectado');
      setErrorMessage('Error: No hay conexión con el servidor');
    }
  }, []);

  // Close WebSocket connection
  const closeWebSocket = useCallback(() => {
    if (wsRef.current) {
      console.log('Cerrando WebSocket');
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  // Clean up WebSocket connection on unmount
  useEffect(() => {
    return () => {
      closeWebSocket();
    };
  }, [closeWebSocket]);

  return {
    wsRef,
    errorMessage,
    connectWebSocket,
    sendWebSocketMessage,
    closeWebSocket,
    setMessageHandler,
    // Export a field that can be overridden by the component
    handleWebSocketMessage: messageHandlerRef
  };
};

export default useWebSocket;
