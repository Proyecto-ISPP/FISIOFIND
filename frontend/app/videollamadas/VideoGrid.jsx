import React from 'react';
import styles from './Room.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideoSlash, faSpinner } from '@fortawesome/free-solid-svg-icons';

const VideoGrid = ({ 
  localVideoRef, 
  remoteVideoRef, 
  cameraActive, 
  connected, 
  isSharing, 
  userRole
}) => {
  return (
    <div className={styles.videoGrid}>
      {/* Fisioterapeuta */}
      {userRole === 'physio' && (
        <div className={styles.videoContainer}>
          <video 
            ref={localVideoRef} 
            className={styles.localVideo} 
            autoPlay 
            muted
            playsInline
          />
          {!cameraActive && (
            <div className={styles.noVideoOverlay}>
              <FontAwesomeIcon icon={faVideoSlash} className={styles.iconLarge} />
              <p>Cámara desactivada</p>
            </div>
          )}
          <div className={styles.videoLabel}>
            <span className={styles.labelText}>Tú (Fisioterapeuta)</span>
            {isSharing && <span className={styles.sharingIndicator}>Compartiendo pantalla</span>}
          </div>
        </div>
      )}

      {/* Paciente */}
      {userRole === 'patient' && (
        <div className={styles.videoContainer}>
          <video 
            ref={localVideoRef} 
            className={styles.localVideo} 
            autoPlay 
            muted
            playsInline
          />
          {!cameraActive && (
            <div className={styles.noVideoOverlay}>
              <FontAwesomeIcon icon={faVideoSlash} className={styles.iconLarge} />
              <p>Cámara desactivada</p>
            </div>
          )}
          <div className={styles.videoLabel}>
            <span className={styles.labelText}>Tú (Paciente)</span>
          </div>
        </div>
      )}

      {/* Cámara remota */}
      <div className={styles.videoContainer}>
        <video 
          ref={remoteVideoRef} 
          className={styles.remoteVideo} 
          autoPlay 
          playsInline
        />
        {!connected && (
          <div className={styles.noVideoOverlay}>
            <FontAwesomeIcon icon={faSpinner} spin className={styles.iconLarge} />
            <p>Esperando conexión...</p>
          </div>
        )}
        <div className={styles.videoLabel}>
          <span className={styles.labelText}>{userRole === 'physio' ? 'Paciente' : 'Fisioterapeuta'}</span>
        </div>
      </div>
    </div>
  );
};

export default VideoGrid;
