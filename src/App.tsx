import React, { useState } from 'react';
import Scene from './Scene';
import HappyNewYear from './HappyNewYear';

import KangarooGame from './kangaroo-jump/KangarooGame';
import SessizSinemaGame from './SessizSinemaGame/SessizSinemaGame';
import ReindeerOverlay from './ReindeerOverlay';
import TestJamGame from './TestJamGame/TestJamGame';
import WelcomeModal from './WelcomeModal';
import GrandFinale from './GrandFinale';
import bgMusic from './weJamMusic.m4a';

const App: React.FC = () => {
  const [page, setPage] = useState<'home' | 'success' | 'kangaroo' | 'sessizsinema' | 'testjam' | 'finale'>('home');
  const [completedMissions, setCompletedMissions] = useState<string[]>([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const handleStart = () => {
    setShowWelcome(false);
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
      audioRef.current.volume = 0.5; // Set volume to 50%
    }
  };

  React.useEffect(() => {
    // If on home page and welcome modal is gone, enable music
    if (page === 'home' && !showWelcome && audioRef.current) {
      audioRef.current.currentTime = 0; // Ensure start from beginning
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(e => console.log("Auto-play failed:", e));
    }
  }, [page, showWelcome]);

  const handleMissionStart = (missionId: string) => {
    if (missionId === 'kangaroo') {
      setPage('kangaroo');
    } else if (missionId === 'canada') {
      setPage('sessizsinema');
    } else if (missionId === 'turkey') {
      setPage('testjam');
    }
  };

  const handleMissionComplete = (missionId: string) => {
    let newCompleted = completedMissions;
    if (!completedMissions.includes(missionId)) {
      newCompleted = [...completedMissions, missionId];
      setCompletedMissions(newCompleted);
    }

    // Check if all 3 missions are done
    // IDs: kangaroo, canada, turkey
    const allMissions = ['kangaroo', 'canada', 'turkey'];
    const isAllDone = allMissions.every(id => newCompleted.includes(id));

    if (isAllDone) {
      setTimeout(() => setPage('finale'), 1000); // Small delay to show green blinking map first? Or direct?
      // User said "tüm ülkeler yeşile boyanınca oyun bitsin". 
      // So returning to map first to see green might be nice, then Trigger finale?
      // Or trigger immediately?
      // "önce ekran hediye paketleriyle dolsun" -> GrandFinale does this.
      // Let's go to finale immediately or after short delay.
      setPage('finale');
    } else {
      setPage('home'); // Return to map
    }
  };

  const handleRestart = () => {
    setCompletedMissions([]);
    setPage('home');
    setShowWelcome(true); // Optional: show welcome again? User said "yeniden oyna". Usually implies full reset.
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      {page === 'home' && (
        <>
          <audio ref={audioRef} src={bgMusic} loop />
          {showWelcome && <WelcomeModal onStart={handleStart} />}
          <Scene
            onSuccess={() => setPage('success')} // Original end game (now replaced by finale?)
            onMissionStart={handleMissionStart}
            completedMissions={completedMissions}
          />
          <ReindeerOverlay />
        </>
      )}
      {page === 'kangaroo' && (
        <KangarooGame onComplete={() => handleMissionComplete('kangaroo')} />
      )}
      {page === 'sessizsinema' && (
        <SessizSinemaGame onComplete={() => handleMissionComplete('canada')} />
      )}
      {page === 'testjam' && (
        <TestJamGame onComplete={() => handleMissionComplete('turkey')} />
      )}
      {page === 'finale' && <GrandFinale onRestart={handleRestart} />}
      {page === 'success' && <HappyNewYear />}
    </div>
  );
};


export default App;
