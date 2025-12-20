
import React, { useState, useRef } from 'react';
import './TestJamGame.css';

// Import Assets
import gingerbreadImg from './assets/gingerbread.png';
// import starImg from './assets/star.png';
import opNeutral from './assets/operator_neutral.png';
import opHappy from './assets/operator_happy.png';
import opSurprised from './assets/operator_surprised.png';
import bgImg from './assets/background.png'; // Assuming this exists

interface TestJamGameProps {
    onComplete: () => void;
}

const TestJamGame: React.FC<TestJamGameProps> = ({ onComplete }) => {
    const [score, setScore] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false);
    const [operatorState, setOperatorState] = useState<'neutral' | 'happy' | 'surprised'>('neutral');
    const [speechText, setSpeechText] = useState("");
    const [isSpeechVisible, setIsSpeechVisible] = useState(false);

    const [boxPositions, setBoxPositions] = useState([0, 1, 2]); // Logical Index -> Visual Slot Index (0, 1, 2)
    const [winningBoxIndex, setWinningBoxIndex] = useState(-1); // Who holds the gingerbread?
    const [openBoxes, setOpenBoxes] = useState<number[]>([]); // Array of indices of open boxes
    const [wonBoxIndex, setWonBoxIndex] = useState(-1); // For green styling

    // Visual Slots X positions (relative to container center/left)
    // Container is 800px wide. 
    // Slots: 0: 0px, 1: 260px, 2: 520px (approx based on original CSS stride)
    const slotPositions = [0, 260, 520];

    const speechTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const showSpeech = (text: string) => {
        setSpeechText(text);
        setIsSpeechVisible(true);
        if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
        speechTimeoutRef.current = setTimeout(() => {
            //     setIsSpeechVisible(false); // Keep persistent as per original logic preference
        }, 3000);
    };

    const startGame = async () => {
        if (isShuffling || isPlaying) return;

        setIsPlaying(true);
        setOperatorState('neutral');
        showSpeech("Kutuları dikkatli izle! 👀");
        setOpenBoxes([]);
        setWonBoxIndex(-1);

        // 1. Place Gingerbread
        const winner = Math.floor(Math.random() * 3);
        setWinningBoxIndex(winner);

        // 2. Reveal Briefly
        setOpenBoxes([winner]);
        await wait(1000);
        setOpenBoxes([]);
        await wait(500);

        // 3. Shuffle
        setIsShuffling(true);
        let currentPositions = [0, 1, 2]; // Slot matching input indices 0,1,2

        const shuffles = 10;
        const speed = 400;

        for (let i = 0; i < shuffles; i++) {
            // Pick two random slots to swap content? 
            // No, in React state we map BoxIndex -> SlotIndex.
            // boxPositions[boxIndex] = slotIndex

            // We want to visually swap two items.
            // Let's swap the SLOTS assigned to random box Indices?
            // Actually easier: Swap the values in the currentPositions array. 
            // currentPositions[0] is the slot for box 0. 

            const idx1 = Math.floor(Math.random() * 3);
            let idx2 = Math.floor(Math.random() * 3);
            while (idx1 === idx2) idx2 = Math.floor(Math.random() * 3);

            const temp = currentPositions[idx1];
            currentPositions[idx1] = currentPositions[idx2];
            currentPositions[idx2] = temp;

            // Update state to trigger animation
            setBoxPositions([...currentPositions]);

            await wait(speed);
        }

        setIsShuffling(false);
        showSpeech("Hangisinde? Bir kutu seç! 🤔");
    };

    const handleBoxClick = (index: number) => {
        if (!isPlaying || isShuffling) return;

        // Open clicked box
        setOpenBoxes([index]);

        if (index === winningBoxIndex) {
            // WIN
            const newScore = score + 1;
            setScore(newScore);
            setOperatorState('happy');
            showSpeech("EVET! Buldun! 🎉");
            setWonBoxIndex(index);

            if (newScore >= 3) {
                // End Game / Celebration
                setTimeout(() => {
                    celebrateAndFinish();
                }, 1000);
            } else {
                setIsPlaying(false);
            }

        } else {
            // LOSE
            setOperatorState('surprised');
            showSpeech("Ah hayır! Diğer kutudaydı! 😱");

            // Reveal winner too
            setTimeout(() => {
                setOpenBoxes(prev => [...prev, winningBoxIndex]);
                setIsPlaying(false);
            }, 500);
        }
    };

    const celebrateAndFinish = () => {
        showSpeech("Tebrikler! Mutlu Yıllar! 🎄✨");
        setOperatorState('happy');
        // Confetti effect is handled by a separate component or just simple divs here used once.
        // After 3 seconds, call onComplete
        setTimeout(() => {
            onComplete();
        }, 4000);
    };

    const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    // Determine Operator Image
    const getOperatorImg = () => {
        if (operatorState === 'happy') return opHappy;
        if (operatorState === 'surprised') return opSurprised;
        return opNeutral;
    };

    return (
        <div className="tj-container">
            {/* Confetti if won enough (logic simplistic here) */}
            {score >= 3 && operatorState === 'happy' && Array.from({ length: 50 }).map((_, i) => (
                <div key={i} className="tj-confetti" style={{
                    left: Math.random() * 100 + 'vw',
                    background: `hsl(${Math.random() * 360}, 100%, 50%)`,
                    animationDuration: (Math.random() * 2 + 2) + 's'
                }}></div>
            ))}

            <div className="tj-background" style={{ backgroundImage: `url(${bgImg})`, backgroundSize: 'cover' }}></div>

            <div className="tj-operator-section">
                <div className={`tj-speech-bubble ${isSpeechVisible ? 'visible' : ''}`}>
                    {speechText}
                </div>
                <img src={getOperatorImg()} alt="Host" className="tj-operator-img" />
            </div>

            <div className="tj-stage">
                <div className="tj-boxes-container">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className={`tj-box-wrapper ${openBoxes.includes(i) ? 'open' : ''} ${wonBoxIndex === i ? 'win' : ''}`}
                            style={{ left: slotPositions[boxPositions[i]] }}
                            onClick={() => handleBoxClick(i)}
                        >
                            <div className="tj-box-lid"></div>
                            <div className="tj-box-body"></div>
                            <div className={`tj-item ${i === winningBoxIndex ? 'gingerbread' : ''}`} style={{ backgroundImage: i === winningBoxIndex ? `url(${gingerbreadImg})` : 'none' }}></div>
                            <div className="tj-star-effect">
                                <svg viewBox="0 0 24 24" width="100%" height="100%" fill="gold" stroke="orange" strokeWidth="1">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="tj-hud">
                <div className="tj-score-board">Skor: <span id="score">{score}</span></div>
                <button
                    className="tj-btn-primary"
                    disabled={isShuffling || (isPlaying && score < 3)}
                    onClick={!isPlaying ? startGame : undefined}
                    style={{ opacity: isPlaying ? 0.5 : 1 }}
                >
                    {isPlaying ? 'Seç!' : 'Başla'}
                </button>
            </div>
        </div>
    );
};

export default TestJamGame;
