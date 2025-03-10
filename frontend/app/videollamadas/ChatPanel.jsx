import React from 'react';
import styles from './Room.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const ChatPanel = ({
  showChat,
  chatMessages,
  chatMessagesRef,
  messageInput,
  setMessageInput,
  handleKeyPress,
  sendChatMessage,
  messageInputRef
}) => {
  if (!showChat) return null;

  return (
    <div className={styles.chatPanel}>
      <h4>Chat</h4>
      <div ref={chatMessagesRef} className={styles.chatMessages}>
        {chatMessages.map((msg, index) => (
          <div key={index} className={styles.chatMessage}>
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>

      <div className={styles.chatInput}>
        <input
          ref={messageInputRef}
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Escribe un mensaje..."
        />
        <button onClick={sendChatMessage} className={styles.sendButton}>
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>
    </div>
  );
};

export default ChatPanel;
