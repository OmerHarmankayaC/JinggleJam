import React, { useState, useRef, useEffect } from 'react';

const MusicPlayer: React.FC = () => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);

    // DEFAULT: Royalty-Free Jingle Bells (MP3 for better compatibility)
    // TO USE "LAST CHRISTMAS":
    // 1. Place your 'LastChristmas.mp3' file in the 'public' folder.
    // 2. Change the src below to: "/LastChristmas.mp3"
    const musicSource = "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Kevin_MacLeod/Jazz_Sampler/Kevin_MacLeod_-_Jingle_Bells.mp3";

    useEffect(() => {
        // Attempt auto-play on mount
        const playAudio = async () => {
            if (audioRef.current) {
                audioRef.current.volume = volume;
                try {
                    await audioRef.current.play();
                    setIsPlaying(true);
                } catch (err) {
                    console.log("Autoplay blocked, waiting for interaction");
                    setIsPlaying(false);
                }
            }
        };
        playAudio();

        // Global click listener to unlock audio on first interaction
        const handleGlobalClick = () => {
            if (audioRef.current && audioRef.current.paused) {
                audioRef.current.play().then(() => {
                    setIsPlaying(true);
                }).catch(e => console.error("Play failed", e));
            }
            // Remove listener after trigger
            document.removeEventListener('click', handleGlobalClick);
        };

        document.addEventListener('click', handleGlobalClick);
        return () => document.removeEventListener('click', handleGlobalClick);
    }, []);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: 'rgba(0, 0, 0, 0.7)',
            padding: '10px 15px',
            borderRadius: '25px',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            zIndex: 9999,
            backdropFilter: 'blur(5px)',
            border: '1px solid rgba(255,255,255,0.2)'
        }}>
            <audio ref={audioRef} loop src={musicSource} crossOrigin="anonymous" />

            <button
                onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '20px',
                    width: '30px',
                    display: 'flex',
                    justifyContent: 'center'
                }}
            >
                {isPlaying ? '⏸' : '▶'}
            </button>

            <span style={{ fontSize: '12px', opacity: 0.8 }}>
                {isPlaying ? "Merry Christmas!" : "Click to Play Music"}
            </span>

            <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: '60px',
                    cursor: 'pointer',
                    accentColor: '#d90000'
                }}
            />
        </div>
    );
};

export default MusicPlayer;
