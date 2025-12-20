
import React, { useState, useEffect } from 'react';
import SantaClaus from './components/SantaClaus';
import SantaSleigh from './components/SantaSleigh';
import GiftBox from './components/GiftBox';
import './SessizSinemaGame.css';

interface SessizSinemaGameProps {
    onComplete: () => void;
}

const movieData = [
    { "title": "matrix", "emojis": "💊🕶️🟩" },
    { "title": "harry potter", "emojis": "⚡👓🪄" },
    { "title": "yüzüklerin efendisi", "emojis": "💍🧝🏻👑" },
    { "title": "evde tek başına", "emojis": "🏠🥷👦" },
    { "title": "kuzuların sessizliği", "emojis": "🐑🤫" }
];

const SessizSinemaGame: React.FC<SessizSinemaGameProps> = ({ onComplete }) => {
    const [currentMovie, setCurrentMovie] = useState<any>(null);
    const [score, setScore] = useState(0);
    const [guess, setGuess] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [curtainState, setCurtainState] = useState('open');
    const [isShaking, setIsShaking] = useState(false);
    const [starDelays, setStarDelays] = useState<number[]>([]);
    const [santaState, setSantaState] = useState<'idle' | 'success' | 'error'>('idle');
    const [usedMovies, setUsedMovies] = useState<number[]>([]);
    const [gameStatus, setGameStatus] = useState<'playing' | 'won'>('playing');
    const [showVictoryText, setShowVictoryText] = useState(false);

    const pickRandomMovie = (currentUsed = usedMovies) => {
        const availableIndices = movieData
            .map((_, index) => index)
            .filter(index => !currentUsed.includes(index));

        if (availableIndices.length === 0) return;

        const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
        setCurrentMovie(movieData[randomIndex]);
        setGuess("");
        setMessage("");
        setMessageType("");
    };

    useEffect(() => {
        pickRandomMovie([]);
    }, []);

    const resetGame = () => {
        onComplete(); // Use this to traverse back to the main map instead of restarting!
    };

    const handleGuess = () => {
        if (!currentMovie || curtainState !== 'open') return;

        // Normalize inputs
        const userGuess = guess.trim().replace(/\s+/g, ' ').toLowerCase();
        const correctTitle = currentMovie.title.toLowerCase();

        // Check partial match or exact match logic? User code was exact match.
        // I will stick to exact match from original code.
        if (userGuess === correctTitle) {
            const newScore = score + 1;
            setScore(newScore);
            setStarDelays(prev => [...prev, Math.random() * 3]);

            setMessage("Doğru!");
            setMessageType("success");
            setIsShaking(false);

            const currentIndex = movieData.indexOf(currentMovie);
            const newUsedMovies = [...usedMovies, currentIndex];
            setUsedMovies(newUsedMovies);

            // Check Victory Condition
            // Original was 4. Let's keep 4.
            if (newScore >= 4) {
                setSantaState('success');
                setTimeout(() => {
                    setGameStatus('won');
                }, 1500);
                return;
            }

            setSantaState('success');
            setTimeout(() => setSantaState('idle'), 2000);
            setCurtainState('closed');

            setTimeout(() => {
                pickRandomMovie(newUsedMovies);
                setTimeout(() => {
                    setCurtainState('open');
                }, 400);
            }, 800);

        } else {
            setMessage("Yanlış, tekrar dene");
            setMessageType("error");
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 500);
            setSantaState('error');
            setTimeout(() => setSantaState('idle'), 1000);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleGuess();
        }
    };

    const handleSleighArrival = () => {
        setShowVictoryText(true);
    };

    if (gameStatus === 'won') {
        return (
            <div className="ss-body">
                {/* Sleigh Animation Container */}
                <div style={{ marginBottom: '2rem', transform: 'scale(1.5)' }}>
                    <SantaSleigh onFinish={handleSleighArrival} />
                </div>

                {/* Victory Text Container */}
                {showVictoryText && (
                    <div className="ss-victory-container animate-text-pop-in">
                        <div className="ss-header-line"></div>

                        <h1 className="ss-victory-title">
                            Tebrikler!
                        </h1>

                        <div style={{ fontSize: '6rem', marginBottom: '1.5rem' }} className="animate-bounce">
                            🏆
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem', height: '3rem', alignItems: 'center' }}>
                            {Array.from({ length: 4 }).map((_, index) => (
                                <GiftBox key={index} delay={Math.random() * 2} />
                            ))}
                        </div>

                        <p style={{ color: '#cbd5e1', fontSize: '1.125rem', marginBottom: '2rem' }}>
                            Tebrikler! Bütün hediyeleri dağıttın!
                        </p>

                        <button
                            onClick={resetGame}
                            className="ss-victory-button"
                        >
                            Yolculuğa devam et
                        </button>
                    </div>
                )}
            </div>
        );
    }

    if (!currentMovie) return <div className="ss-body">Yükleniyor...</div>;

    return (
        <div className="ss-body">
            <div className="ss-card">
                <div className="ss-header-line"></div>

                <h1 className="ss-title">
                    Emojilerle Sessiz Sinema
                </h1>
                <p className="ss-subtitle">Filmi tahmin et!</p>

                <div className={`ss-emoji-container ${isShaking ? 'animate-shake' : ''}`}>
                    <div className="ss-screen">
                        <div className="ss-emojis">
                            {currentMovie.emojis}
                        </div>

                        <div className={`ss-curtain-left ${curtainState === 'closed' ? 'ss-curtain-closed' : 'ss-curtain-open'}`}></div>
                        <div className={`ss-curtain-right ${curtainState === 'closed' ? 'ss-curtain-closed' : 'ss-curtain-open'}`}></div>

                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1rem', backgroundColor: '#991b1b', zIndex: 20, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}></div>
                    </div>

                    <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 1rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <div style={{ width: '0.5rem', height: '0.5rem', backgroundColor: '#ef4444', borderRadius: '50%', animation: 'pulse 2s infinite' }}></div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}>CINE-TV</div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <input
                        type="text"
                        value={guess}
                        onChange={(e) => setGuess(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={curtainState !== 'open'}
                        placeholder="Filmin adı ne?"
                        className="ss-input"
                    />

                    <div style={{ marginTop: '1rem' }}>
                        <SantaClaus onClick={handleGuess} state={santaState} />
                    </div>
                </div>

                <div style={{ height: '3rem', marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {message && (
                        <div className={`ss-message ${messageType === 'success' ? 'ss-success' : 'ss-error'}`}>
                            {message}
                        </div>
                    )}
                </div>

                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '4rem' }}>
                    {score === 0 ? (
                        <span style={{ color: '#475569', fontSize: '0.875rem' }}>Haydi başla!</span>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            {Array.from({ length: score }).map((_, index) => (
                                <GiftBox key={index} delay={starDelays[index] || 0} />
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

export default SessizSinemaGame;
