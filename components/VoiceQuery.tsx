'use client';

import { useRef, useState } from 'react';

export default function VoiceQuery() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech Recognition not supported');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = 'hi-IN';

    recognitionRef.current.onstart = () => setIsListening(true);
    recognitionRef.current.onend = () => setIsListening(false);

    recognitionRef.current.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptSegment = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          setTranscript(transcriptSegment);
        }
      }
    };

    recognitionRef.current.start();
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={startListening}
        disabled={isListening}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg text-sm font-medium transition"
      >
        {isListening ? '🎤 Listening...' : '🎤 Voice Query'}
      </button>

      {transcript && (
        <button
          onClick={() => speak('यहाँ खतरा है')}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition"
        >
          🔊 Warning
        </button>
      )}

      {transcript && <span className="text-sm text-gray-300">{transcript}</span>}
    </div>
  );
}
