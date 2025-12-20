import React from 'react';

const HappyNewYear: React.FC = () => {
    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#000',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            fontFamily: 'sans-serif',
            fontSize: '4rem',
            textAlign: 'center',
            background: 'linear-gradient(to bottom, #0f2027, #203a43, #2c5364)' // Dark starry sky gradient
        }}>
            <div>
                <h1>Happy New Year!</h1>
                <p style={{ fontSize: '1.5rem', marginTop: '1rem', opacity: 0.8 }}>2026</p>
            </div>
        </div>
    );
};

export default HappyNewYear;
