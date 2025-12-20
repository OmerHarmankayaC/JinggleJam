
import React from 'react';

interface GiftBoxProps {
    delay: number;
}

const GiftBox: React.FC<GiftBoxProps> = ({ delay }) => {
    return (
        <div
            className="animate-twinkle"
            style={{ width: '3rem', height: '3rem', position: 'relative', animationDelay: `${delay}s`, filter: 'drop-shadow(0 4px 6px -1px rgba(0, 0, 0, 0.1))' }}
        >
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                <rect x="15" y="30" width="70" height="60" rx="4" fill="#D32F2F" />
                <rect x="45" y="30" width="10" height="60" fill="#FFD700" />
                <rect x="10" y="25" width="80" height="15" rx="2" fill="#F44336" />
                <rect x="45" y="25" width="10" height="15" fill="#FFD700" />
                <path d="M50 30 Q30 5 20 25 Q35 40 50 30" fill="#FFD700" />
                <path d="M50 30 Q70 5 80 25 Q65 40 50 30" fill="#FFD700" />
                <circle cx="50" cy="30" r="4" fill="#FFC107" />
                <path d="M20 40 L30 40 L20 60 Z" fill="#FFFFFF" opacity="0.2" />
            </svg>
        </div>
    );
};

export default GiftBox;
