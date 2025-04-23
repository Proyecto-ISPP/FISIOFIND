// hooks/useRemoteSpeechTranscription.js
import { useState, useEffect, useRef, useCallback } from 'react'
import {
  SpeechConfig,
  PushAudioInputStream,
  AudioConfig,
  AudioStreamFormat,
  SpeechRecognizer
} from 'microsoft-cognitiveservices-speech-sdk'

/**
 * Hook para transcribir SOLO el audio remoto de WebRTC usando Azure Speech-to-Text.
 * @param {boolean} active – si true, arranca la transcripción; si false, la detiene.
 * @param {MediaStream|null} remoteStream – el MediaStream que tienes en remoteVideoRef.current.srcObject.
 * @returns {{ transcripts: Array<{text: string, isFinal: boolean}> }}
 */
export default function useRemoteSpeechTranscription(active, remoteStream) {
  const [transcripts, setTranscripts] = useState([])
  const recognizerRef = useRef(null)
  const processorRef = useRef(null)
  const audioCtxRef = useRef(null)
  const pushStreamRef = useRef(null)

  const start = useCallback(() => {
    if (!remoteStream) return

    // 1) Configuración de Azure Speech
    const speechConfig = SpeechConfig.fromSubscription(
      process.env.NEXT_PUBLIC_SPEECH_KEY,
      process.env.NEXT_PUBLIC_SPEECH_REGION
    )
    speechConfig.speechRecognitionLanguage = 'es-ES'

    // 2) Creamos un AudioContext y sacamos su sampleRate
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    const audioCtx = new AudioCtx()
    audioCtxRef.current = audioCtx
    const sampleRate = audioCtx.sampleRate

    // 3) Preparamos el PushAudioInputStream con el formato PCM correcto
    const waveFormat = AudioStreamFormat.getWaveFormatPCM(sampleRate, 16, 1)
    const pushStream = PushAudioInputStream.createPushStream(waveFormat)
    pushStreamRef.current = pushStream

    // 4) Creamos el recognizer de Azure sobre ese stream
    const audioConfig = AudioConfig.fromStreamInput(pushStream)
    const recognizer = new SpeechRecognizer(speechConfig, audioConfig)
    recognizerRef.current = recognizer

    recognizer.recognizing = (_s, e) => {
      setTranscripts(prev => {
        const last = prev[prev.length - 1]
        if (last && !last.isFinal) {
          // actualiza el texto parcial
          return [...prev.slice(0, -1), { text: e.result.text, isFinal: false }]
        }
        return [...prev, { text: e.result.text, isFinal: false }]
      })
    }

    recognizer.recognized = (_s, e) => {
      if (e.result.text) {
        setTranscripts(prev => [
          ...prev.slice(0, -1),
          { text: e.result.text, isFinal: true }
        ])
      }
    }

    recognizer.canceled = (_s, e) => {
      console.warn('Speech recognition canceled:', e)
    }
    recognizer.sessionStopped = (_s, e) => {
      console.log('Speech session stopped')
    }

    // 5) Conectamos Web Audio: capturamos el audio remoto
    const remoteSource = audioCtx.createMediaStreamSource(remoteStream)
    const processor = audioCtx.createScriptProcessor(4096, 1, 1)
    processorRef.current = processor

    remoteSource.connect(processor)
    // No queremos oír este audio en tus altavoces:
    processor.connect(audioCtx.destination)

    processor.onaudioprocess = event => {
      const float32 = event.inputBuffer.getChannelData(0)
      const int16 = new Int16Array(float32.length)
      for (let i = 0; i < float32.length; i++) {
        const s = Math.max(-1, Math.min(1, float32[i]))
        int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF
      }
      pushStream.write(int16.buffer)
    }

    // 6) Arrancamos reconocimiento continuo
    recognizer.startContinuousRecognitionAsync()
  }, [remoteStream])

  const stop = useCallback(() => {
    // Detén el recognizer
    if (recognizerRef.current) {
      recognizerRef.current.stopContinuousRecognitionAsync()
      recognizerRef.current = null
    }
    // Desconecta el processor
    if (processorRef.current) {
      processorRef.current.disconnect()
      processorRef.current = null
    }
    // Cierra el AudioContext
    if (audioCtxRef.current) {
      audioCtxRef.current.close()
      audioCtxRef.current = null
    }
    // Cierra el PushAudioInputStream
    if (pushStreamRef.current) {
      pushStreamRef.current.close()
      pushStreamRef.current = null
    }
  }, [])

  useEffect(() => {
    if (active && remoteStream) {
      setTranscripts([])  // limpia cualquier transcripción previa
      start()
    } else {
      stop()
    }
    return stop
  }, [active, remoteStream, start, stop])

  return { transcripts }
}
