import React from 'react';
import styles from './Room.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMicrophone, faMicrophoneSlash, faVideo, faVideoSlash,
  faShare, faComments, faCog, faPhoneSlash
} from '@fortawesome/free-solid-svg-icons';

const Controls = ({
  micActive,
  cameraActive,
  toggleMic,
  toggleCamera,
  toggleScreenShare,
  showChat,
  setShowChat,
  showSettings,
  setShowSettings,
  endCall
}) => {
  return (
    <div className={styles.controls}>
      <button onClick={toggleMic} className={styles.controlButton}>
        <FontAwesomeIcon icon={micActive ? faMicrophone : faMicrophoneSlash} />
      </button>
      <button onClick={toggleCamera} className={styles.controlButton}>
        <FontAwesomeIcon icon={cameraActive ? faVideo : faVideoSlash} />
      </button>
      <button onClick={() => setShowChat(!showChat)} className={styles.controlButton}>
        <FontAwesomeIcon icon={faComments} />
      </button>
      <button onClick={() => setShowSettings(!showSettings)} className={styles.controlButton}>
        <FontAwesomeIcon icon={faCog} />
      </button>
      <button onClick={endCall} className={`${styles.controlButton} ${styles.endCallButton}`}>
  <FontAwesomeIcon icon={faPhoneSlash} />
</button>

    </div>
  );
};

export default Controls;
