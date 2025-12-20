
import React from 'react';

interface WelcomeModalProps {
    onStart: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onStart }) => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 20000,
            backdropFilter: 'blur(10px)',
            fontFamily: "'Outfit', sans-serif"
        }}>
            <div style={{
                backgroundColor: '#1e293b',
                border: '2px solid #334155',
                borderRadius: '24px',
                padding: '3rem',
                maxWidth: '600px',
                width: '90%',
                textAlign: 'center',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Decorative Top Line */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '6px',
                    background: 'linear-gradient(to right, #ef4444, #eab308, #22c55e)'
                }}></div>

                <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: '800',
                    marginBottom: '1.5rem',
                    background: 'linear-gradient(to right, #f87171, #fbbf24)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    color: 'white'
                }}>
                    Hoş Geldiniz! 🎄
                </h1>

                <p style={{
                    color: '#cbd5e1',
                    fontSize: '1.1rem',
                    lineHeight: '1.6',
                    marginBottom: '2rem'
                }}>
                    Noel Baba'nın dünya turuna katılmaya hazır mısın?
                    Dünya üzerindeki <strong style={{ color: '#fca5a5' }}>Kırmızı</strong> bölgelere tıkla,
                    oyunları kazan ve Noel Baba'nın hediyeleri dağıtmasına yardım et!
                </p>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    textAlign: 'left',
                    backgroundColor: '#0f172a',
                    padding: '1.5rem',
                    borderRadius: '16px',
                    marginBottom: '2rem',
                    border: '1px solid #334155'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>🎯</span>
                        <span style={{ color: '#94a3b8' }}>Her ülkenin kendine özel bir mini oyunu var.</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>✅</span>
                        <span style={{ color: '#94a3b8' }}>Görevi tamamlanan ülkeler <span style={{ color: '#4ade80', fontWeight: 'bold' }}>Yeşil</span> yanar.</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>🎅</span>
                        <span style={{ color: '#94a3b8' }}>Tüm dünyayı yeşile boya ve büyük kutlamayı gör!</span>
                    </div>
                </div>

                <button
                    onClick={onStart}
                    style={{
                        background: 'linear-gradient(to right, #ef4444, #dc2626)',
                        color: 'white',
                        border: 'none',
                        padding: '1rem 3rem',
                        fontSize: '1.25rem',
                        fontWeight: 'bold',
                        borderRadius: '50px',
                        cursor: 'pointer',
                        boxShadow: '0 10px 15px -3px rgba(220, 38, 38, 0.4)',
                        transition: 'transform 0.1s',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    Maceraya Başla
                </button>

            </div>
        </div>
    );
};

export default WelcomeModal;
