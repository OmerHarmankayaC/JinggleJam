import React, { useState } from 'react';
import Scene from './Scene';
import HappyNewYear from './HappyNewYear';

import MusicPlayer from './MusicPlayer';

const App: React.FC = () => {
  const [page, setPage] = useState<'home' | 'success'>('home');

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <MusicPlayer />
      {page === 'home' && <Scene onSuccess={() => setPage('success')} />}
      {page === 'success' && <HappyNewYear />}
    </div>
  );
};

export default App;
