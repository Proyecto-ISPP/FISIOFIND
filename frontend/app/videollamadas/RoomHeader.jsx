import React from 'react';
import styles from './Room.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const RoomHeader = ({ roomCode, errorMessage }) => {
  return (
    <div className={styles.header}>
      <h2 className={styles.roomTitle}>
        <span className={styles.roomLabel}>Consulta Virtual:</span> {roomCode}
      </h2>
      {errorMessage && (
        <div className={styles.errorMessage}>
          <FontAwesomeIcon icon={faExclamationTriangle} /> {errorMessage}
        </div>
      )}
    </div>
  );
};

export default RoomHeader;
