
import React, { useState, useEffect, useRef } from 'react';
import './KangarooGame.css'; // We will create this next

// Import Images
import imgKangaroo from './kangaroo-latest.png';
import imgWave from './wave-latest.png';
import imgBackground from './sea-background.png';

interface KangarooGameProps {
    onComplete: () => void;
}

const KangarooGame: React.FC<KangarooGameProps> = ({ onComplete }) => {
    const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover' | 'win'>('start');
    const [score, setScore] = useState(0);
    const [finalScore, setFinalScore] = useState(0);
    const [surpriseMessage, setSurpriseMessage] = useState("");
    const [showSurprise, setShowSurprise] = useState(false);

    // Refs for game loop and cleanup
    const kangarooRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const wavesRef = useRef<HTMLDivElement>(null);
    const scoreIntervalRef = useRef<any>(null);
    const waveSpawnIntervalRef = useRef<any>(null);
    const gameLoopRef = useRef<number>(null);
    const isGameRunningRef = useRef(false);

    // Game Constants
    const WIN_SCORE = 150;
    const currentWaveSpeed = 2500;
    const spawnRate = 3000;

    useEffect(() => {
        // Cleanup on unmount
        return () => stopGameLogic();
    }, []);

    const startGame = () => {
        setGameState('playing');
        setScore(0);
        setShowSurprise(false);
        isGameRunningRef.current = true;

        // Clear waves
        if (wavesRef.current) wavesRef.current.innerHTML = '';

        // Score Loop
        scoreIntervalRef.current = setInterval(() => {
            setScore(prev => {
                const newScore = prev + 1;
                if (newScore >= WIN_SCORE) {
                    handleWin();
                }
                return newScore;
            });
        }, 100);

        // Spawn Loop
        spawnWave();
        waveSpawnIntervalRef.current = setInterval(spawnWave, spawnRate);

        // Collision Loop
        gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    const stopGameLogic = () => {
        isGameRunningRef.current = false;
        if (scoreIntervalRef.current) clearInterval(scoreIntervalRef.current);
        if (waveSpawnIntervalRef.current) clearInterval(waveSpawnIntervalRef.current);
        if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);

        // Stop animations
        const waves = document.querySelectorAll('.kangaroo-wave');
        waves.forEach(w => {
            w.getAnimations().forEach(anim => anim.pause());
        });
    };

    const handleGameOver = () => {
        stopGameLogic();
        setFinalScore(score);
        setGameState('gameover');
    };

    const handleWin = () => {
        stopGameLogic();
        setGameState('win');

        // Select Message
        const messages = [
            "I wish for the year 2026 to be an unforgettable year full of health and peace, where all your dreams come true.",
            "May you have a wonderful year where each new day is brighter than the last, and where success and happiness never leave your side.",
            "I hope that 2026 opens brand new doors for you, and never lets the smile fade from your face or hope leave your heart."
        ];
        setSurpriseMessage(messages[Math.floor(Math.random() * messages.length)]);
        setShowSurprise(true);
    };

    const spawnWave = () => {
        if (!isGameRunningRef.current || !wavesRef.current) return;

        const wave = document.createElement('div');
        wave.className = 'kangaroo-wave';
        // Add styling manually or via class. 
        // We will match the CSS class 'kangaroo-wave' to the image

        const animation = wave.animate([
            { left: '800px' },
            { left: '-120px' }
        ], {
            duration: currentWaveSpeed,
            easing: 'linear',
            iterations: 1
        });

        animation.onfinish = () => {
            if (wave.parentNode) wave.remove();
        };

        wavesRef.current.appendChild(wave);
    };

    const checkCollision = () => {
        if (!isGameRunningRef.current || !kangarooRef.current) return;

        const kangarooRect = kangarooRef.current.getBoundingClientRect();
        const waves = document.querySelectorAll('.kangaroo-wave');

        waves.forEach(wave => {
            const waveRect = wave.getBoundingClientRect();
            const padding = 30;

            if (
                kangarooRect.right - padding > waveRect.left + padding &&
                kangarooRect.left + padding < waveRect.right - padding &&
                kangarooRect.bottom - padding > waveRect.top + padding &&
                kangarooRect.top + padding < waveRect.bottom - padding
            ) {
                handleGameOver();
            }
        });
    };

    const gameLoop = () => {
        if (isGameRunningRef.current) {
            checkCollision();
            gameLoopRef.current = requestAnimationFrame(gameLoop);
        }
    };

    const jump = () => {
        if (isGameRunningRef.current && kangarooRef.current) {
            if (!kangarooRef.current.classList.contains('jump')) {
                kangarooRef.current.classList.add('jump');
                setTimeout(() => {
                    if (kangarooRef.current) kangarooRef.current.classList.remove('jump');
                }, 1000);
            }
        }
    };

    // Input handlers
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space') jump();
        };
        const handleTouch = () => jump();

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('touchstart', handleTouch);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('touchstart', handleTouch);
        };
    }, []);


    return (
        <div className="kangaroo-body">
            <h1 style={{ color: 'white', position: 'absolute', top: '10px', width: '100%', textAlign: 'center' }}>Surfing Kangaroo Mission</h1>

            <div className="kangaroo-game-container" ref={containerRef}>
                <div className="kangaroo-background" style={{ backgroundImage: `url(${imgBackground})` }}></div>

                <div className="kangaroo-score-board">
                    <span>Score: {score}</span>
                </div>

                {gameState === 'start' && (
                    <div className="kangaroo-screen">
                        <h1>Kangaroo Jump</h1>
                        <p>Press Space/Tap to Jump</p>
                        <button onClick={startGame}>Start Mission</button>
                    </div>
                )}

                {gameState === 'gameover' && (
                    <div className="kangaroo-screen">
                        <h1>Game Over</h1>
                        <p>Score: {finalScore}</p>
                        <button onClick={startGame}>Try Again</button>
                    </div>
                )}

                {gameState === 'win' && showSurprise && (
                    <div className="kangaroo-gift-overlay">
                        <div className="gift-box-container open-gift">
                            <div className="christmas-star">
                                <svg viewBox="0 0 24 24" fill="gold" width="100%" height="100%">
                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                </svg>
                            </div>
                            <div className="gift-box">
                                <div className="gift-lid"></div>
                                <div className="gift-body"></div>
                            </div>
                        </div>
                        <h1 className="kangaroo-merry-text">{surpriseMessage}</h1>
                        <button onClick={onComplete}>Return to Map</button>
                    </div>
                )}

                <div className="kangaroo-character" ref={kangarooRef} style={{ backgroundImage: `url(${imgKangaroo})` }}></div>
                <div className="kangaroo-waves-container" ref={wavesRef}></div>
            </div>
            {/* Inject Global Styles for wave image since it's dynamic */}
            <style>{`
                .kangaroo-wave {
                    background-image: url(${imgWave});
                }
            `}</style>
        </div>
    );
};

export default KangarooGame;
