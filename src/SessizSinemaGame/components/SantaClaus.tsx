
import React from 'react';

interface SantaClausProps {
    onClick: () => void;
    state: 'idle' | 'success' | 'error';
}

const SantaClaus: React.FC<SantaClausProps> = ({ onClick, state }) => {
    const isSuccess = state === 'success';
    const isError = state === 'error';
    const isIdle = state === 'idle';

    return (
        <div
            onClick={onClick}
            className={`relative w-32 h-32 cursor-pointer transition-transform duration-300 hover:scale-105 ${isSuccess ? 'animate-santa-jump' : ''} ${isIdle ? 'animate-santa-float' : ''}`}
            role="button"
            aria-label="Santa Claus Submit"
            style={{ width: '8rem', height: '8rem', cursor: 'pointer' }}
        >
            <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 10px 8px rgb(0 0 0 / 0.04))' }}>
                <path d="M60 140 C60 140 50 190 100 190 C150 190 140 140 140 140 L60 140" fill="#D32F2F" />
                <path d="M100 140 L100 190" stroke="#B71C1C" strokeWidth="2" opacity="0.2" />
                <rect x="55" y="150" width="90" height="10" fill="#212121" />
                <rect x="90" y="148" width="20" height="14" rx="2" fill="#FFC107" />
                <path d="M60 145 C40 150 30 140 35 120" stroke="#D32F2F" strokeWidth="20" strokeLinecap="round" />
                <circle cx="35" cy="120" r="10" fill="#FFFFFF" />
                <g className={isSuccess ? 'animate-santa-hand-wave' : ''}>
                    <path d="M140 145 C160 150 170 140 165 120" stroke="#D32F2F" strokeWidth="20" strokeLinecap="round" />
                    <circle cx="165" cy="120" r="10" fill="#FFFFFF" />
                </g>
                <g className={isError ? 'animate-santa-head-shake' : ''}>
                    <path d="M50 80 Q100 150 150 80" fill="#FFFFFF" />
                    <circle cx="100" cy="80" r="30" fill="#FFCCBC" />
                    <circle cx="90" cy="75" r="3" fill="#212121" />
                    <circle cx="110" cy="75" r="3" fill="#212121" />
                    <ellipse cx="100" cy="90" rx="5" ry="3" fill="#8C3E3E" className={isSuccess ? 'animate-santa-mouth-hoho' : ''} />
                    <path d="M80 85 Q100 95 120 85" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" fill="none" />
                    <path d="M60 60 C60 60 70 10 100 10 C130 10 140 60 140 60" fill="#D32F2F" />
                    <rect x="55" y="60" width="90" height="15" rx="5" fill="#FFFFFF" />
                    <circle cx="140" cy="20" r="8" fill="#FFFFFF" />
                    {isError && (
                        <g>
                            <path d="M85 70 L95 65" stroke="#8C3E3E" strokeWidth="2" strokeLinecap="round" />
                            <path d="M115 70 L105 65" stroke="#8C3E3E" strokeWidth="2" strokeLinecap="round" />
                        </g>
                    )}
                </g>
            </svg>
        </div>
    );
};

export default SantaClaus;
