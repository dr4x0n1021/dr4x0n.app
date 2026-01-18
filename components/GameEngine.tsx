
import React, { useRef, useEffect, useCallback } from 'react';
import { Player, Obstacle, GameStatus, Particle } from '../types';

interface Props {
  status: GameStatus;
  onGameOver: (score: number) => void;
  onScoreUpdate: (score: number) => void;
  gameSpeed: number;
}

const GameEngine: React.FC<Props> = ({ status, onGameOver, onScoreUpdate, gameSpeed }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scoreRef = useRef(0);
  const requestRef = useRef<number | null>(null);
  
  const playerRef = useRef<Player>({
    x: 80, y: 0, width: 30, height: 50, dy: 0, jumpForce: 12, grounded: false, isSliding: false, slideTimer: 0
  });

  const obstaclesRef = useRef<Obstacle[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const lastTimeRef = useRef<number>(0);
  const spawnTimerRef = useRef<number>(0);

  const resetGame = useCallback(() => {
    scoreRef.current = 0;
    obstaclesRef.current = [];
    particlesRef.current = [];
    playerRef.current = { ...playerRef.current, y: 300, dy: 0, grounded: true, isSliding: false, height: 50 };
    onScoreUpdate(0);
  }, [onScoreUpdate]);

  const update = (time: number) => {
    const canvas = canvasRef.current;
    if (!canvas || status !== 'PLAYING') return;

    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;

    const player = playerRef.current;
    const groundY = canvas.height - 60;

    // Gravity
    if (!player.grounded) player.dy += 0.6;
    player.y += player.dy;

    if (player.y + player.height > groundY) {
      player.y = groundY - player.height;
      player.dy = 0;
      player.grounded = true;
    }

    // Spawn
    spawnTimerRef.current -= deltaTime;
    if (spawnTimerRef.current <= 0) {
      const isAir = Math.random() > 0.7;
      obstaclesRef.current.push({
        x: canvas.width,
        y: isAir ? groundY - 80 : groundY - 40,
        width: 30,
        height: 40,
        speed: gameSpeed,
        type: isAir ? 'AIR' : 'GROUND'
      });
      spawnTimerRef.current = 1000 + Math.random() * 800;
    }

    // Move & Collide
    obstaclesRef.current = obstaclesRef.current.filter(obs => {
      obs.x -= obs.speed;
      const colliding = player.x < obs.x + obs.width && player.x + player.width > obs.x && player.y < obs.y + obs.height && player.y + player.height > obs.y;
      if (colliding) {
        onGameOver(Math.floor(scoreRef.current));
        return false;
      }
      return obs.x + obs.width > 0;
    });

    scoreRef.current += deltaTime * 0.01;
    onScoreUpdate(Math.floor(scoreRef.current));

    draw();
    requestRef.current = requestAnimationFrame(update);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const player = playerRef.current;
    const groundY = canvas.height - 60;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Background
    ctx.fillStyle = '#0d0208';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Ground
    ctx.strokeStyle = '#00ff41';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(canvas.width, groundY);
    ctx.stroke();

    // Player
    ctx.fillStyle = '#00ff41';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00ff41';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Obstacles
    ctx.fillStyle = '#ff0041';
    ctx.shadowColor = '#ff0041';
    obstaclesRef.current.forEach(obs => {
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    });
    ctx.shadowBlur = 0;
  };

  const handleInput = useCallback((e: KeyboardEvent) => {
    if (status !== 'PLAYING') return;
    if ((e.code === 'Space' || e.code === 'ArrowUp') && playerRef.current.grounded) {
      playerRef.current.dy = -playerRef.current.jumpForce;
      playerRef.current.grounded = false;
    }
  }, [status]);

  useEffect(() => {
    window.addEventListener('keydown', handleInput);
    return () => window.removeEventListener('keydown', handleInput);
  }, [handleInput]);

  useEffect(() => {
    if (status === 'PLAYING') {
      resetGame();
      lastTimeRef.current = performance.now();
      requestRef.current = requestAnimationFrame(update);
    } else if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [status, resetGame]);

  return <canvas ref={canvasRef} width={800} height={400} className="w-full h-auto max-h-[400px] border border-green-500/20" />;
};

export default GameEngine;
