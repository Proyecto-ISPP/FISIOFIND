import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * Custom hook for managing chat functionality
 * @param {Object} options - Configuration options
 * @param {Function} options.sendWebSocketMessage - Function to send WebSocket messages
 * @param {string} options.userRole - User role (physio or patient)
 * @returns {Object} Chat utilities and state
 */
const useChat = ({ sendWebSocketMessage, userRole }) => {
  // Chat state
  const [chatMessages, setChatMessages] = useState([
    { sender: 'Sistema', text: 'Bienvenido a la consulta virtual. El chat está disponible durante la sesión.' },
  ]);
  const [messageInput, setMessageInput] = useState('');
  const [showChat, setShowChat] = useState(false);
  
  // References
  const chatMessagesRef = useRef(null);
  const messageInputRef = useRef(null);

  // Auto-scroll chat when messages change
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Add message to chat
  const addChatMessage = useCallback((sender, text) => {
    setChatMessages(prev => [...prev, { sender, text }]);
  }, []);

  // Send chat message
  const sendChatMessage = useCallback(() => {
    if (messageInput.trim() === '') return;
    
    sendWebSocketMessage({
      action: 'chat-message',
      message: {
        text: messageInput,
        sender: userRole === 'physio' ? 'physio' : 'patient'
      }
    });
    setMessageInput('');
    
    if (messageInputRef.current) {
      messageInputRef.current.focus();
    }
  }, [messageInput, sendWebSocketMessage, userRole]);

  // Handle key press in chat input
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      sendChatMessage();
    }
  }, [sendChatMessage]);

  // Handle incoming chat message
  const handleChatMessage = useCallback((message) => {
    console.log('Mensaje de chat recibido:', message);
    if (message.text) {
      const rol = message.sender === userRole ? 'Tú' : 'Usuario';
      addChatMessage(rol, message.text);
    }
  }, [userRole, addChatMessage]);

  return {
    chatMessages,
    messageInput,
    showChat,
    chatMessagesRef,
    messageInputRef,
    setMessageInput,
    setShowChat,
    addChatMessage,
    sendChatMessage,
    handleKeyPress,
    handleChatMessage
  };
};

export default useChat;