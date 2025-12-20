import React, { useEffect, useState } from 'react';

const SantaSleigh = ({ onFinish }) => {
    const [trails, setTrails] = useState([]);

    // Generate snow trails while moving
    useEffect(() => {
        const interval = setInterval(() => {
            setTrails(prev => [
                ...prev,
                { id: Date.now(), top: 120 + Math.random() * 20, left: -20 } // Relative to sleigh
            ]);
        }, 100);

        // Clean up old trails
        const cleanup = setInterval(() => {
            setTrails(prev => prev.filter(t => Date.now() - t.id < 1500));
        }, 500);

        // Stop generating after animation (approx 2.5s)
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
        <div className="relative w-96 h-64 animate-slide-in-sleigh">
            {/* Snow Trails - Rendered absolutely relative to the moving container might look static relative to container. 
          Actually, if they are children of the moving container, they move with it. 
          To leave a trail, they should be "dropped" in world space, but that's hard in simple React. 
          Instead, we will simulate "wind" lines streaming BACKWARDS from the sleigh.
      */}
            {trails.map(t => (
                <div
                    key={t.id}
                    className="absolute w-4 h-4 bg-white rounded-full blur-sm animate-snow-trail"
                    style={{
                        top: t.top,
                        left: -Math.random() * 100, // Trail behind
                    }}
                />
            ))}

            <svg viewBox="0 0 400 300" className="w-full h-full drop-shadow-2xl">

                {/* Reindeer (Simplified) */}
                <g transform="translate(260, 100)">
                    <path d="M20 40 Q40 40 50 60 L50 90 L40 90 L40 70 L30 70 L30 90 L20 90 L20 60 Z" fill="#795548" />
                    <path d="M45 40 L55 20 M50 40 L65 25" stroke="#5D4037" strokeWidth="3" />
                    <circle cx="55" cy="40" r="3" fill="#BF360C" /> {/* Red Nose */}
                </g>

                {/* Rope */}
                <line x1="200" y1="130" x2="260" y2="150" stroke="#8D6E63" strokeWidth="2" />

                {/* Sleigh Body */}
                <g transform="translate(50, 80)">
                    <path d="M20 100 C20 100 0 100 0 80 C0 60 30 60 30 60 L150 60 C150 60 180 60 180 80 L160 100 Z" fill="#C62828" />
                    <path d="M10 100 L170 100" stroke="#FFD700" strokeWidth="5" />
                    <path d="M15 110 L175 110 C185 110 195 100 195 90" stroke="#5D4037" strokeWidth="4" fill="none" />
                    <path d="M40 100 L40 110 M140 100 L140 110" stroke="#5D4037" strokeWidth="4" />
                </g>

                {/* Bag of Gifts */}
                <path d="M80 140 Q80 100 110 110 Q140 100 140 140" fill="#4CAF50" />

                {/* Santa Siting */}
                <g transform="translate(100, 70)">
                    {/* Body */}
                    <path d="M10 70 L80 70 C80 70 70 20 45 20 C20 20 10 70 10 70" fill="#D32F2F" />
                    <rect x="10" y="65" width="70" height="8" fill="#212121" />

                    {/* Head */}
                    <g transform="translate(25, -10)">
                        <circle cx="20" cy="20" r="20" fill="#FFCCBC" />
                        <path d="M0 20 Q20 50 40 20" fill="#FFFFFF" /> {/* Beard */}
                        <circle cx="15" cy="15" r="2" fill="#000" />
                        <circle cx="25" cy="15" r="2" fill="#000" />
                        {/* Smiling Mouth */}
                        <path d="M12 25 Q20 32 28 25" fill="none" stroke="#B71C1C" strokeWidth="2" strokeLinecap="round" />
                        {/* Hat */}
                        <path d="M0 10 C0 10 10 -20 40 -10 L40 10 Z" fill="#D32F2F" />
                        <circle cx="40" cy="-10" r="5" fill="#FFF" />
                        <rect x="-5" y="8" width="50" height="8" rx="2" fill="#FFF" />
                    </g>

                    {/* Waving Arm */}
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
