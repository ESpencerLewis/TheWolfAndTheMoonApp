import React, { useEffect, useRef, useState } from 'react';

export default function AudioVisualizer({ audioRef, isPlaying }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const audioContextRef = useRef(null);
  const sourceRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!audioRef?.current || isConnected) return;

    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.8;

      const source = audioContext.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(audioContext.destination);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      sourceRef.current = source;
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
      setIsConnected(true);
    } catch (e) {
      // Audio context already connected or not supported
    }
  }, [audioRef, isConnected]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);

      // Clear canvas
      ctx.fillStyle = 'rgba(15, 23, 42, 0.3)';
      ctx.fillRect(0, 0, width, height);

      if (analyserRef.current && dataArrayRef.current && isPlaying) {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        
        const barCount = 32;
        const barWidth = width / barCount;
        const bufferLength = dataArrayRef.current.length;

        for (let i = 0; i < barCount; i++) {
          const dataIndex = Math.floor(i * bufferLength / barCount);
          const value = dataArrayRef.current[dataIndex];
          const barHeight = (value / 255) * height * 0.8;

          // Create gradient for each bar - amber/gold desert colors
          const gradient = ctx.createLinearGradient(0, height - barHeight, 0, height);
          gradient.addColorStop(0, `rgba(251, 191, 36, ${0.9})`);
          gradient.addColorStop(0.5, `rgba(217, 119, 6, ${0.7})`);
          gradient.addColorStop(1, `rgba(180, 83, 9, ${0.5})`);

          ctx.fillStyle = gradient;
          
          // Draw rounded bars from bottom
          const x = i * barWidth + barWidth * 0.15;
          const w = barWidth * 0.7;
          const y = height - barHeight;
          const radius = w / 2;

          ctx.beginPath();
          ctx.moveTo(x + radius, y);
          ctx.lineTo(x + w - radius, y);
          ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
          ctx.lineTo(x + w, height);
          ctx.lineTo(x, height);
          ctx.lineTo(x, y + radius);
          ctx.quadraticCurveTo(x, y, x + radius, y);
          ctx.closePath();
          ctx.fill();

          // Add glow effect
          ctx.shadowColor = 'rgba(251, 191, 36, 0.5)';
          ctx.shadowBlur = 10;
        }
        ctx.shadowBlur = 0;
      } else {
        // Idle animation - gentle wave when not playing
        const time = Date.now() * 0.002;
        const barCount = 32;
        const barWidth = width / barCount;

        for (let i = 0; i < barCount; i++) {
          const wave = Math.sin(time + i * 0.3) * 0.5 + 0.5;
          const barHeight = wave * height * 0.15 + height * 0.05;

          const gradient = ctx.createLinearGradient(0, height - barHeight, 0, height);
          gradient.addColorStop(0, `rgba(180, 83, 9, 0.4)`);
          gradient.addColorStop(1, `rgba(120, 53, 15, 0.2)`);

          ctx.fillStyle = gradient;
          
          const x = i * barWidth + barWidth * 0.15;
          const w = barWidth * 0.7;
          const y = height - barHeight;

          ctx.beginPath();
          ctx.roundRect(x, y, w, barHeight, w / 2);
          ctx.fill();
        }
      }
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  return (
    <div className="relative w-full h-32 rounded-lg overflow-hidden bg-slate-900/50 border border-amber-800/20">
      <canvas
        ref={canvasRef}
        width={600}
        height={128}
        className="w-full h-full"
      />
      {/* Reflection effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}