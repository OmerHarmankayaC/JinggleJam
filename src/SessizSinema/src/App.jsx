import { useState, useEffect } from 'react'
import SantaClaus from './components/SantaClaus'
import SantaSleigh from './components/SantaSleigh'
import GiftBox from './components/GiftBox'

const movieData = [
  { "title": "Matrix", "emojis": "💊🕶️🟩" },
  { "title": "Harry Potter", "emojis": "⚡👓🪄" },
  { "title": "Yüzüklerin Efendisi", "emojis": "💍🧝🏻👑" },
  { "title": "Evde Tek Başına", "emojis": "🏠🥷👦" },
  { "title": "Kuzuların Sessizliği", "emojis": "🐑🤫" }
];

function App() {
  const [currentMovie, setCurrentMovie] = useState(null);
  const [score, setScore] = useState(0);
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [curtainState, setCurtainState] = useState('open');
  const [isShaking, setIsShaking] = useState(false);
  const [starDelays, setStarDelays] = useState([]);
  const [santaState, setSantaState] = useState('idle');
  const [usedMovies, setUsedMovies] = useState([]);
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won'
  const [showVictoryText, setShowVictoryText] = useState(false);

  const pickRandomMovie = (currentUsed = usedMovies) => {
    const availableIndices = movieData
      .map((_, index) => index)
      .filter(index => !currentUsed.includes(index));

    if (availableIndices.length === 0) return;

    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    setCurrentMovie(movieData[randomIndex]);
    setGuess("");
    setMessage("");
    setMessageType("");
  };

  useEffect(() => {
    pickRandomMovie([]);
  }, []);

  const resetGame = () => {
    setScore(0);
    setUsedMovies([]);
    setStarDelays([]);
    setGameStatus('playing');
    setCurtainState('open');
    setSantaState('idle');
    setShowVictoryText(false);
    setGuess("");
    setMessage("");
    pickRandomMovie([]);
  };

  const handleGuess = () => {
    if (!currentMovie || curtainState !== 'open') return;

    // Normalize inputs
    const userGuess = guess.trim().replace(/\s+/g, ' ').toLowerCase();
    const correctTitle = currentMovie.title.toLowerCase();

    if (userGuess === correctTitle) {
      const newScore = score + 1;
      setScore(newScore);
      setStarDelays(prev => [...prev, Math.random() * 3]);

      setMessage("Doğru!");
      setMessageType("success");
      setIsShaking(false);

      const currentIndex = movieData.indexOf(currentMovie);
      const newUsedMovies = [...usedMovies, currentIndex];
      setUsedMovies(newUsedMovies);

      // Check Victory Condition
      if (newScore >= 4) {
        setSantaState('success');
        setTimeout(() => {
          setGameStatus('won');
        }, 1500);
        return;
      }

      setSantaState('success');
      setTimeout(() => setSantaState('idle'), 2000);
      setCurtainState('closed');

      setTimeout(() => {
        pickRandomMovie(newUsedMovies);
        setTimeout(() => {
          setCurtainState('open');
        }, 400);
      }, 800);

    } else {
      setMessage("Yanlış, tekrar dene");
      setMessageType("error");
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setSantaState('error');
      setTimeout(() => setSantaState('idle'), 1000);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleGuess();
    }
  };

  const handleSleighArrival = () => {
    setShowVictoryText(true);
  };

  if (gameStatus === 'won') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 font-sans overflow-hidden">

        {/* Sleigh Animation Container */}
        <div className="mb-8 scale-150">
          <SantaSleigh onFinish={handleSleighArrival} />
        </div>

        {/* Victory Text Container - Appears after arrival */}
        {showVictoryText && (
          <div className="max-w-md w-full bg-slate-800/90 rounded-2xl shadow-2xl p-8 border border-slate-700 text-center relative overflow-hidden animate-text-pop-in backdrop-blur-md">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400"></div>

            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 mb-6 drop-shadow-sm">
              Tebrikler!
            </h1>

            <div className="text-8xl mb-6 animate-bounce">
              🏆
            </div>

            <div className="flex justify-center gap-2 mb-8 h-12 items-center">
              {Array.from({ length: 4 }).map((_, index) => (
                <GiftBox key={index} delay={Math.random() * 2} />
              ))}
            </div>

            <p className="text-slate-300 text-lg mb-8">
              Tebrikler! Bütün hediyeleri dağıttın!
            </p>

            <button
              onClick={resetGame}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-4 rounded-xl transition-all active:scale-95 shadow-lg shadow-green-900/20 text-xl"
            >
              Yolculuğa devam et
            </button>
          </div>
        )}
      </div>
    );
  }

  if (!currentMovie) return <div className="text-white text-center mt-20">Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 mb-2">
          Emojilerle Sessiz Sinema
        </h1>
        <p className="text-slate-400 mb-6 text-sm">Filmi tahmin et!</p>

        <div className={`relative bg-black rounded-3xl p-4 mb-8 shadow-xl border-4 border-gray-700 ring-4 ring-gray-800 ${isShaking ? 'animate-shake' : ''}`}>
          <div className="bg-slate-900 relative h-48 rounded-xl overflow-hidden flex items-center justify-center border border-gray-600 shadow-inner">

            <div className="text-7xl leading-tight select-none filter drop-shadow-lg z-0">
              {currentMovie.emojis}
            </div>

            <div
              className={`absolute top-0 bottom-0 left-0 bg-red-700 z-10 transition-all duration-[800ms] ease-in-out border-r-4 border-red-900 shadow-2xl ${curtainState === 'closed' ? 'w-1/2' : 'w-0'}`}
              style={{ backgroundImage: 'repeating-linear-gradient(90deg, #b91c1c, #b91c1c 20px, #991b1b 20px, #991b1b 40px)' }}
            ></div>
            <div
              className={`absolute top-0 bottom-0 right-0 bg-red-700 z-10 transition-all duration-[800ms] ease-in-out border-l-4 border-red-900 shadow-2xl ${curtainState === 'closed' ? 'w-1/2' : 'w-0'}`}
              style={{ backgroundImage: 'repeating-linear-gradient(90deg, #b91c1c, #b91c1c 20px, #991b1b 20px, #991b1b 40px)' }}
            ></div>

            <div className="absolute top-0 left-0 right-0 h-4 bg-red-800 z-20 shadow-md"></div>
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] pointer-events-none z-10 opacity-20"></div>
          </div>

          <div className="mt-2 flex justify-between items-center px-4">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">CINE-TV</div>
            </div>
            <div className="flex space-x-1">
              <div className="w-8 h-1 bg-gray-600 rounded"></div>
              <div className="w-8 h-1 bg-gray-600 rounded"></div>
            </div>
          </div>
        </div>

        <div className="space-y-4 flex flex-col items-center">
          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={curtainState !== 'open'}
            placeholder="Filmin adı ne?"
            className="w-full bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-lg text-center shadow-sm disabled:opacity-50"
          />

          <div className="mt-4">
            <SantaClaus onClick={handleGuess} state={santaState} />
          </div>
        </div>

        <div className="h-12 mt-6 flex items-center justify-center">
          {message && (
            <div className={`px-6 py-2 rounded-full text-base font-bold animate-bounce ${messageType === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
              {message}
            </div>
          )}
        </div>

        {/* Gift Box Score System */}
        <div className="mt-6 flex justify-center items-center h-16 relative">
          {score === 0 ? (
            <span className="text-slate-600 text-sm">Haydi başla!</span>
          ) : (
            <div className="flex items-center justify-center gap-2"> {/* With gap-2, they will be slightly separated. Center justified. */}
              {Array.from({ length: score }).map((_, index) => (
                <GiftBox key={index} delay={starDelays[index] || 0} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default App
