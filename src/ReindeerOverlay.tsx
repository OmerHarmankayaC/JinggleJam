
import React from 'react';
import './ReindeerOverlay.css';

const ReindeerOverlay: React.FC = () => {
    return (
        <div className="reindeer-container">
            <svg viewBox="0 0 200 150" width="100%" height="100%" style={{ overflow: 'visible' }}>
                <defs>
                    <radialGradient id="nose-glow" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
                        <stop offset="0%" stopColor="red" stopOpacity="1" />
                        <stop offset="100%" stopColor="red" stopOpacity="0" />
                    </radialGradient>
                </defs>

                {/* Back Legs (Darker) */}
                <g className="leg-group back-legs">
                    <path className="leg leg-back-left" d="M40 70 Q 45 90 40 110 L 45 140 L 40 145 L 35 140 L 30 110 Q 25 90 40 70" fill="#3E2723" />
                    <path className="leg leg-back-right" d="M140 70 Q 145 100 150 120 L 155 140 L 150 145 L 140 140 L 135 120 Q 130 90 140 70" fill="#3E2723" />
                </g>

                {/* Body */}
                <path className="body" d="M30 60 Q 30 20 80 30 L 120 30 Q 160 20 170 50 Q 180 80 150 90 L 50 90 Q 20 80 30 60" fill="#5D4037" />

                {/* Tail */}
                <path className="tail" d="M30 60 Q 10 50 15 70 Z" fill="#5D4037" />

                {/* Front Legs (Lighter) */}
                <g className="leg-group front-legs">
                    <path className="leg leg-front-left" d="M50 80 Q 55 100 50 120 L 55 145 L 50 150 L 45 145 L 40 120 Q 35 100 50 80" fill="#795548" />
                    <path className="leg leg-front-right" d="M150 80 Q 155 100 160 120 L 165 145 L 160 150 L 155 145 L 150 120 Q 145 100 150 80" fill="#795548" />
                </g>

                {/* Neck & Head Group */}
                <g className="neck-head">
                    {/* Neck */}
                    <path d="M150 40 Q 160 10 170 15 L 180 40 Z" fill="#795548" />

                    {/* Head */}
                    <g className="head">
                        <path d="M165 20 Q 165 0 185 5 Q 200 10 200 25 Q 190 35 175 30 Q 165 30 165 20" fill="#795548" />
                        <ellipse cx="180" cy="15" rx="2" ry="3" fill="#3E2723" /> {/* Ear */}
                        <circle cx="188" cy="18" r="1.5" fill="black" /> {/* Eye */}
                        <circle cx="200" cy="25" r="4" fill="red" /> {/* Nose */}
                        <circle cx="200" cy="25" r="8" fill="url(#nose-glow)" opacity="0.6" /> {/* Glow */}

                        {/* Antlers */}
                        <path d="M180 5 L 175 -20 L 185 -25 M 175 -15 L 160 -15 M 177 -10 L 190 -15" stroke="#D7CCC8" strokeWidth="3" fill="none" strokeLinecap="round" />
                    </g>
                </g>

                {/* Scarf */}
                <path d="M160 40 Q 170 45 180 35 L 180 45 Q 170 55 160 45 Z" fill="#C62828" />
                <path d="M165 45 L 160 60 L 175 60 L 170 45" fill="#C62828" />
            </svg>
        </div>
    );
};

export default ReindeerOverlay;
