/**
 * RecordButton - Press and hold to record, release to playback
 *
 * Features:
 * - Hold to record (max 3 seconds)
 * - Release to playback
 * - Click without hold shows instructions
 * - Visual feedback during recording
 */

import { useState, useRef, useCallback } from 'react';

const MAX_DURATION_MS = 3000;
const HOLD_THRESHOLD_MS = 200; // Time to distinguish click from hold

export default function RecordButton() {
  const [isRecording, setIsRecording] = useState(false);
  const [showInstruction, setShowInstruction] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const pressStartRef = useRef<number>(0);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const maxDurationTimerRef = useRef<NodeJS.Timeout | null>(null);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    if (maxDurationTimerRef.current) {
      clearTimeout(maxDurationTimerRef.current);
      maxDurationTimerRef.current = null;
    }
    setIsRecording(false);
    setRecordingProgress(0);
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());

        // Play back the recording
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          audio.play();
          audio.onended = () => URL.revokeObjectURL(audioUrl);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setShowInstruction(false);

      // Progress indicator
      const startTime = Date.now();
      progressIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        setRecordingProgress(Math.min(elapsed / MAX_DURATION_MS, 1));
      }, 50);

      // Auto-stop at max duration
      maxDurationTimerRef.current = setTimeout(() => {
        stopRecording();
      }, MAX_DURATION_MS);

    } catch (error) {
      console.error('Failed to start recording:', error);
      setIsRecording(false);
    }
  }, [stopRecording]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    pressStartRef.current = Date.now();
    setShowInstruction(false);

    // Start recording after hold threshold
    holdTimerRef.current = setTimeout(() => {
      startRecording();
    }, HOLD_THRESHOLD_MS);
  }, [startRecording]);

  const handlePointerUp = useCallback(() => {
    const pressDuration = Date.now() - pressStartRef.current;

    // Clear hold timer if still pending
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }

    if (isRecording) {
      // Was recording, stop and playback
      stopRecording();
    } else if (pressDuration < HOLD_THRESHOLD_MS) {
      // Quick click, show instruction
      setShowInstruction(true);
      setTimeout(() => setShowInstruction(false), 3000);
    }
  }, [isRecording, stopRecording]);

  const handlePointerLeave = useCallback(() => {
    // If pointer leaves while recording, stop
    if (isRecording) {
      stopRecording();
    }
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  }, [isRecording, stopRecording]);

  return (
    <div className="record-button-container">
      <button
        className={`record-button ${isRecording ? 'recording' : ''}`}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        onPointerCancel={handlePointerLeave}
        aria-label="Hold to record, release to play"
      >
        <span className="record-icon">{isRecording ? '⏺' : '🎤'}</span>
        {isRecording && (
          <svg className="record-progress" viewBox="0 0 36 36">
            <circle
              className="record-progress-bg"
              cx="18"
              cy="18"
              r="16"
              fill="none"
              strokeWidth="3"
            />
            <circle
              className="record-progress-bar"
              cx="18"
              cy="18"
              r="16"
              fill="none"
              strokeWidth="3"
              strokeDasharray={`${recordingProgress * 100} 100`}
              transform="rotate(-90 18 18)"
            />
          </svg>
        )}
      </button>
      {showInstruction && (
        <div className="record-instruction">
          Hold to record, release to play
        </div>
      )}
    </div>
  );
}
