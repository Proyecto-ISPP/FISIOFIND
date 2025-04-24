import React from 'react';
import styles from './Room.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMicrophone, faMicrophoneSlash, faVideo, faVideoSlash,
  faShare, faComments, faCog, faPhoneSlash
} from '@fortawesome/free-solid-svg-icons';
import SubtitlesIcon from '@mui/icons-material/Subtitles';
import SubtitlesOffIcon from '@mui/icons-material/SubtitlesOff';

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
  leaveCall,
  showRemoteSubs,
  setShowRemoteSubs,
  webRTCConnected
}) => {

  return (
    <div className={styles.controls}>
      <button onClick={toggleMic} className={styles.controlButton}>
        <FontAwesomeIcon icon={micActive ? faMicrophone : faMicrophoneSlash} />
      </button>
      <button onClick={toggleCamera} className={styles.controlButton}>
        <FontAwesomeIcon icon={cameraActive ? faVideo : faVideoSlash} />
      </button>
      <button
        onClick={() => setShowRemoteSubs(v => !v)}
        disabled={!webRTCConnected}
        className={`
          ${styles.controlButton}
        `}
        title="Subtítulos"
      >
        <FontAwesomeIcon
          icon={showRemoteSubs
            ? faClosedCaptioning
            : faClosedCaptioningSlash
          }
        />
      </button>
      <button onClick={() => setShowChat(!showChat)} className={styles.controlButton}>
        <FontAwesomeIcon icon={faComments} />
      </button>
      <button onClick={() => setShowSettings(!showSettings)} className={styles.controlButton}>
        <FontAwesomeIcon icon={faCog} />
      </button>
      <button onClick={leaveCall} className={`${styles.controlButton} ${styles.endCallButton}`}>
        <FontAwesomeIcon icon={faPhoneSlash} />
      </button>

    </div>
  );
};

export default Controls;
