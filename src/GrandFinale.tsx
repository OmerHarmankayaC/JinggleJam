
import React, { useEffect, useState } from 'react';
import './GrandFinale.css';
// import GiftBox from '../../earth-map copy/SessizSinemaGame/components/GiftBox'; // Taking a shortcut reuse or SVG

interface GrandFinaleProps {
    onRestart: () => void;
}

const GrandFinale: React.FC<GrandFinaleProps> = ({ onRestart }) => {
    const [gifts, setGifts] = useState<{ id: number; left: number; delay: number; duration: number }[]>([]);

    useEffect(() => {
        // Generate gifts for rain effect
        const count = 50;
        const newGifts = Array.from({ length: count }).map((_, i) => ({
            id: i,
            left: Math.random() * 100, // vw
            delay: Math.random() * 2, // seconds
            duration: 2 + Math.random() * 3 // seconds fall time
        }));
        setGifts(newGifts);
    }, []);

    return (
        <div className="gf-container">
            {gifts.map(g => (
                <div
                    key={g.id}
                    className="gf-gift"
                    style={{
                        left: `${g.left}vw`,
                        animationDuration: `${g.duration}s`,
                        animationDelay: `${g.delay}s`
                    }}
                >
                    <div style={{ transform: 'scale(1.5)' }}>
                        <svg viewBox="0 0 100 100" width="50" height="50">
                            <rect x="20" y="20" width="60" height="60" fill="#ec4899" rx="4" />
                            <rect x="45" y="20" width="10" height="60" fill="#facc15" />
                            <rect x="20" y="45" width="60" height="10" fill="#facc15" />
                        </svg>
                    </div>
                </div>
            ))}

            <div className="gf-content">
                <div className="gf-emoji">🎅🎁🎄</div>
                <h1 className="gf-title">GÖREV TAMAMLANDI!</h1>
                <p className="gf-subtitle">
                    Tüm dünyayı mutluluğa boyadın!<br />
                    Noel Baba ve çocuklar sana minnettar.
                    <br /><br />
                    <strong>MUTLU YILLAR 2026!</strong>
                </p>
                <button className="gf-btn" onClick={onRestart}>
                    Yeniden Oyna 🔄
                </button>
            </div>
        </div>
    );
};

export default GrandFinale;
