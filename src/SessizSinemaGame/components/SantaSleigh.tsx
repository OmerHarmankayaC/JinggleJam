
import React, { useEffect, useState } from 'react';

interface SantaSleighProps {
    onFinish: () => void;
}

const SantaSleigh: React.FC<SantaSleighProps> = ({ onFinish }) => {
    const [trails, setTrails] = useState<{ id: number; top: number; left: number }[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTrails(prev => [
                ...prev,
                { id: Date.now(), top: 120 + Math.random() * 20, left: -20 }
            ]);
        }, 100);

        const cleanup = setInterval(() => {
            setTrails(prev => prev.filter(t => Date.now() - t.id < 1500));
        }, 500);

        const stopGen = setTimeout(() => {
            clearInterval(interval);
            if (onFinish) onFinish();
        }, 2800);

        return () => {
            clearInterval(interval);
            clearInterval(cleanup);
            clearTimeout(stopGen);
        };
    }, [onFinish]);

    return (
        <div className="animate-slide-in-sleigh" style={{ position: 'relative', width: '24rem', height: '16rem' }}>
            {trails.map(t => (
                <div
                    key={t.id}
                    className="animate-snow-trail"
                    style={{
                        position: 'absolute',
                        width: '1rem', height: '1rem', backgroundColor: 'white', borderRadius: '9999px', filter: 'blur(4px)',
                        top: t.top,
                        left: -Math.random() * 100,
                    }}
                />
            ))}

            <svg viewBox="0 0 400 300" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 25px 25px rgb(0 0 0 / 0.15))' }}>
                <g transform="translate(260, 100)">
                    <path d="M20 40 Q40 40 50 60 L50 90 L40 90 L40 70 L30 70 L30 90 L20 90 L20 60 Z" fill="#795548" />
                    <path d="M45 40 L55 20 M50 40 L65 25" stroke="#5D4037" strokeWidth="3" />
                    <circle cx="55" cy="40" r="3" fill="#BF360C" />
                </g>
                <line x1="200" y1="130" x2="260" y2="150" stroke="#8D6E63" strokeWidth="2" />
                <g transform="translate(50, 80)">
                    <path d="M20 100 C20 100 0 100 0 80 C0 60 30 60 30 60 L150 60 C150 60 180 60 180 80 L160 100 Z" fill="#C62828" />
                    <path d="M10 100 L170 100" stroke="#FFD700" strokeWidth="5" />
                    <path d="M15 110 L175 110 C185 110 195 100 195 90" stroke="#5D4037" strokeWidth="4" fill="none" />
                    <path d="M40 100 L40 110 M140 100 L140 110" stroke="#5D4037" strokeWidth="4" />
                </g>
                <path d="M80 140 Q80 100 110 110 Q140 100 140 140" fill="#4CAF50" />
                <g transform="translate(100, 70)">
                    <path d="M10 70 L80 70 C80 70 70 20 45 20 C20 20 10 70 10 70" fill="#D32F2F" />
                    <rect x="10" y="65" width="70" height="8" fill="#212121" />
                    <g transform="translate(25, -10)">
                        <circle cx="20" cy="20" r="20" fill="#FFCCBC" />
                        <path d="M0 20 Q20 50 40 20" fill="#FFFFFF" />
                        <circle cx="15" cy="15" r="2" fill="#000" />
                        <circle cx="25" cy="15" r="2" fill="#000" />
                        <path d="M12 25 Q20 32 28 25" fill="none" stroke="#B71C1C" strokeWidth="2" strokeLinecap="round" />
                        <path d="M0 10 C0 10 10 -20 40 -10 L40 10 Z" fill="#D32F2F" />
                        <circle cx="40" cy="-10" r="5" fill="#FFF" />
                        <rect x="-5" y="8" width="50" height="8" rx="2" fill="#FFF" />
                    </g>
                    <g transform="rotate(-20, 60, 50)">
                        <path d="M50 50 L70 30" stroke="#D32F2F" strokeWidth="12" strokeLinecap="round" />
                        <circle cx="70" cy="30" r="6" fill="#FFF" />
                    </g>
                </g>
            </svg>
        </div>
    );
};

export default SantaSleigh;
