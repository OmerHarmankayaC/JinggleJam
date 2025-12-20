import React from 'react';

const GiftBox = ({ delay }) => {
    return (
        <div
            className="w-12 h-12 relative animate-twinkle filter drop-shadow-md"
            style={{ animationDelay: `${delay}s` }}
        >
            <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Box Body */}
                <rect x="15" y="30" width="70" height="60" rx="4" fill="#D32F2F" />

                {/* Vertical Ribbon */}
                <rect x="45" y="30" width="10" height="60" fill="#FFD700" />

                {/* Lid */}
                <rect x="10" y="25" width="80" height="15" rx="2" fill="#F44336" />

                {/* Horizontal Ribbon on Lid */}
                <rect x="45" y="25" width="10" height="15" fill="#FFD700" />

                {/* Bow */}
                <path d="M50 30 Q30 5 20 25 Q35 40 50 30" fill="#FFD700" />
                <path d="M50 30 Q70 5 80 25 Q65 40 50 30" fill="#FFD700" />
                <circle cx="50" cy="30" r="4" fill="#FFC107" />

                {/* Shine/Reflection */}
                <path d="M20 40 L30 40 L20 60 Z" fill="#FFFFFF" opacity="0.2" />
            </svg>
        </div>
    );
};

export default GiftBox;
