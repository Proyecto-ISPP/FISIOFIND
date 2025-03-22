'use client';

import React, { useState } from 'react';
import styles from '../css/AnatomicalModel.css';

const Modelo3D = ({ isVisible }) => {

  const [model, setModel ] = useState(0);

  if (!isVisible) return null;

  // Reemplaza este URL con el enlace embedido de tu modelo en Sketchfab
  const sketchfabEmbedUrls = [
    "https://sketchfab.com/models/e402d3d541eb4b199c57d5410f5d3c57/embed?autostart=1&dnt=1&ui_infos=0&ui_controls=0&ui_stop=0&ui_help=0&ui_inspector=0&ui_vr=0&ui_fullscreen=0", // Cuerpo anatómico
    "https://sketchfab.com/models/765feaaebb4743dab7eeabb35c89cf10/embed?autostart=0&dnt=1&ui_infos=0&ui_controls=0&ui_stop=0&ui_help=0&ui_inspector=0&ui_vr=0&ui_fullscreen=0", // Rodilla 1
    "https://sketchfab.com/models/c7b923c4a5ae4637a3dac4ff80e32851/embed?autostart=0&dnt=1&ui_infos=0&ui_controls=0&ui_stop=0&ui_help=0&ui_inspector=0&ui_vr=0&ui_fullscreen=0", // Rodilla 2
    "https://sketchfab.com/models/85fb3e1b8c864ee18b42a1e4c55d53e7/embed?autostart=0&dnt=1&ui_infos=0&ui_controls=0&ui_stop=0&ui_help=0&ui_inspector=0&ui_vr=0&ui_fullscreen=0", // Biceps
    "https://sketchfab.com/models/2d448e5749ec4d77b65c57b26e32312b/embed?autostart=0&dnt=1&ui_infos=0&ui_controls=0&ui_stop=0&ui_help=0&ui_inspector=0&ui_vr=0&ui_fullscreen=0", // Triceps
    "https://sketchfab.com/models/759009c34c954b2d9c19b311409933cd/embed?autostart=0&dnt=1&ui_infos=0&ui_controls=0&ui_stop=0&ui_help=0&ui_inspector=0&ui_vr=0&ui_fullscreen=0", // Deltoides
    "https://sketchfab.com/models/fa2ca759f6a24738be744aaaf2ed9b5f/embed?autostart=0&dnt=1&ui_infos=0&ui_controls=0&ui_stop=0&ui_help=0&ui_inspector=0&ui_vr=0&ui_fullscreen=0", // Dorsales
    "https://sketchfab.com/models/566cf6b9815e42638c235e7e0b42170c/embed?autostart=0&dnt=1&ui_infos=0&ui_controls=0&ui_stop=0&ui_help=0&ui_inspector=0&ui_vr=0&ui_fullscreen=0", // Trapecio
    "https://sketchfab.com/models/c151c93cfd67492bbecc3584745a097c/embed?autostart=0&dnt=1&ui_infos=0&ui_controls=0&ui_stop=0&ui_help=0&ui_inspector=0&ui_vr=0&ui_fullscreen=0", // Músculos lumbricales
    "https://sketchfab.com/models/18e4593f454641be8432c604ad29e9b5/embed?autostart=0&dnt=1&ui_infos=0&ui_controls=0&ui_stop=0&ui_help=0&ui_inspector=0&ui_vr=0&ui_fullscreen=0", // Serrato anterior
    "https://sketchfab.com/models/a933917b6d3c43dc89c9e1fa92c1a59a/embed?autostart=0&dnt=1&ui_infos=0&ui_controls=0&ui_stop=0&ui_help=0&ui_inspector=0&ui_vr=0&ui_fullscreen=0", // Psoas ilíaco
    "https://sketchfab.com/models/a82e190faa034cc2b68fd56e61a5a652/embed?autostart=0&dnt=1&ui_infos=0&ui_controls=0&ui_stop=0&ui_help=0&ui_inspector=0&ui_vr=0&ui_fullscreen=0", // Pronador cuadrado
    "https://sketchfab.com/models/e4796252a4ca4cbe94dcd3f2587ca5ab/embed?autostart=0&dnt=1&ui_infos=0&ui_controls=0&ui_stop=0&ui_help=0&ui_inspector=0&ui_vr=0&ui_fullscreen=0", // Infraespinoso
    "https://sketchfab.com/models/c1d157dcd0094d298c431e9b352ba8ee/embed?autostart=0&dnt=1&ui_infos=0&ui_controls=0&ui_stop=0&ui_help=0&ui_inspector=0&ui_vr=0&ui_fullscreen=0", // Anconeo
    "https://sketchfab.com/models/66c2117e1be94b37878e10f499eb7d1c/embed?autostart=0&dnt=1&ui_infos=0&ui_controls=0&ui_stop=0&ui_help=0&ui_inspector=0&ui_vr=0&ui_fullscreen=0", // Pronadaor redondo
    "https://sketchfab.com/models/af6a3ed4e0364332a2cb25708eade697/embed?autostart=0&dnt=1&ui_infos=0&ui_controls=0&ui_stop=0&ui_help=0&ui_inspector=0&ui_vr=0&ui_fullscreen=0", // Flexor cubital del carpo
    "https://sketchfab.com/models/97078b3f8a2241cabb86597458400135/embed?autostart=0&dnt=1&ui_infos=0&ui_controls=0&ui_stop=0&ui_help=0&ui_inspector=0&ui_vr=0&ui_fullscreen=0", // Flexor largo del pulgar
    "https://sketchfab.com/models/ca285c324d2d4a9c844c3bdd7629e39e/embed?autostart=0&dnt=1&ui_infos=0&ui_controls=0&ui_stop=0&ui_help=0&ui_inspector=0&ui_vr=0&ui_fullscreen=0", // Braquiorradial
    "https://sketchfab.com/models/a0135ad7273545368dba2c4a9e577f3c/embed?autostart=0&dnt=1&ui_infos=0&ui_controls=0&ui_stop=0&ui_help=0&ui_inspector=0&ui_vr=0&ui_fullscreen=0", // Flexor radial del carpo
    "https://sketchfab.com/models/194c34d962f4446ba55229d12543b7e3/embed?autostart=0&dnt=1&ui_infos=0&ui_controls=0&ui_stop=0&ui_help=0&ui_inspector=0&ui_vr=0&ui_fullscreen=0", // Flexor profundo de los dedos
    "https://sketchfab.com/models/1f07ad88c0bc44deb41088c6262b83c9/embed?autostart=0&dnt=1&ui_infos=0&ui_controls=0&ui_stop=0&ui_help=0&ui_inspector=0&ui_vr=0&ui_fullscreen=0", // Flexor superficial de los dedos
    "https://sketchfab.com/models/cbb8c32d71fb4f5b8f313b71959004d6/embed?autostart=0&dnt=1&ui_infos=0&ui_controls=0&ui_stop=0&ui_help=0&ui_inspector=0&ui_vr=0&ui_fullscreen=0", // Extensor de los dedos
    "https://sketchfab.com/models/e6b29afbbc464bb48e772e8bd4234a89/embed?autostart=0&dnt=1&ui_infos=0&ui_controls=0&ui_stop=0&ui_help=0&ui_inspector=0&ui_vr=0&ui_fullscreen=0", // Supinador
  ];

  return (
    <div className={styles.anatomicalModelContainer}>
      <div className={styles.modelControls}>
        <select className={styles.modelSelector} onChange={val => setModel(val.target.value)}>
          <option value="0">Cuerpo completo</option>
          <option value="1">Vista rodilla 1</option>
          <option value="2">Vista rodilla 2</option>
          <option value="3">Vista biceps</option>
          <option value="4">Vista triceps</option>
          <option value="5">Vista deltoides</option>
          <option value="6">Vista dorsales</option>
          <option value="7">Vista trapecio</option>
          <option value="8">Músculos lumbricales</option>
          <option value="9">Vista serrato anterior</option>
          <option value="10">Psoas ilíaco</option>
          <option value="11">Pronador cuadrado</option>
          <option value="12">Infraespinoso</option>
          <option value="13">Anconeo</option>
          <option value="14">Pronadaor redondo</option>
          <option value="15">Flexor cubital del carpo</option>
          <option value="16">Flexor largo del pulgar</option>
          <option value="17">Braquiorradial</option>
          <option value="18">Flexor radial del carpo</option>
          <option value="19">Flexor profundo de los dedos</option>
          <option value="20">Flexor superficial de los dedos</option>
          <option value="21">Extensor de los dedos</option>
          <option value="22">Supinador</option>
        </select>
      </div>

      <div className={styles.canvasContainer}>
        {/* Embedir el modelo con un iframe */}
        <iframe
          title="Sketchfab Model"
          src={sketchfabEmbedUrls[model]}
          width="100%"
          height="100%"
          frameBorder="0"
          allow="autoplay; fullscreen; vr"
          allowFullScreen
          style={{ minHeight: '500px' }}
        ></iframe>
      </div>
    </div>
  );
};

export default Modelo3D;