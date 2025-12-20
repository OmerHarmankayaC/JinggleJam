const kangaroo = document.getElementById('kangaroo');
const wavesContainer = document.getElementById('waves-container');
const scoreElement = document.getElementById('score');
const finalScoreElement = document.getElementById('final-score');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const winScreen = document.getElementById('win-screen'); // New UI
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const playAgainBtn = document.getElementById('play-again-btn');

let isGameRunning = false;
let score = 0;
let scoreInterval;
let waveSpawnInterval;
let currentWaveSpeed = 3000; // ms to cross screen (Starts slow: 3s)
const MIN_WAVE_SPEED = 1000; // Fastest speed limit (1s)
let spawnRate = 2500; // Initial spawn rate ms

// Audio context could be added here for sound effects

function jump(event) {
    if ((event.code === 'Space' || event.type === 'touchstart') && isGameRunning) {
        if (!kangaroo.classList.contains('jump')) {
            kangaroo.classList.add('jump');
            setTimeout(() => {
                kangaroo.classList.remove('jump');
            }, 1000); // Matches CSS animation duration
        }
    }
}

document.addEventListener('keydown', jump);
document.addEventListener('touchstart', jump);

const surpriseContainer = document.getElementById('surprise-container');
const giftPlayAgainBtn = document.getElementById('gift-play-again-btn');

function startGame() {
    isGameRunning = true;
    score = 0;
    currentWaveSpeed = 2500; // Constant speed
    spawnRate = 3000; // Constant spawn rate (prevents back-to-back)

    scoreElement.innerText = score;
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    if (winScreen) winScreen.classList.add('hidden');
    if (surpriseContainer) {
        surpriseContainer.classList.add('hidden');
        surpriseContainer.classList.remove('open-gift');
    }

    // Clear existing waves
    wavesContainer.innerHTML = '';

    // Start scoring
    scoreInterval = setInterval(() => {
        score++;
        scoreElement.innerText = score;

        // Win Condition
        if (score >= 150) {
            gameWin();
        }

        // Removed Progressive Difficulty Logic
    }, 100);

    // Spawn waves
    spawnWave();
    waveSpawnInterval = setInterval(spawnWave, spawnRate);

    gameLoop();
}

function spawnWave() {
    if (!isGameRunning) return;

    const wave = document.createElement('div');
    wave.classList.add('wave');

    // START MOVEMENT MANUALLY TO CONTROL SPEED
    const animation = wave.animate([
        { left: '800px' },
        { left: '-120px' }
    ], {
        duration: currentWaveSpeed,
        easing: 'linear',
        iterations: 1
    });

    animation.onfinish = () => {
        if (wave.parentNode) {
            wave.remove();
        }
    };

    wavesContainer.appendChild(wave);
}

function stopGame() {
    isGameRunning = false;
    clearInterval(scoreInterval);
    clearInterval(waveSpawnInterval);

    // Stop all waves using Web Animations API pause
    const waves = document.querySelectorAll('.wave');
    waves.forEach(w => {
        w.getAnimations().forEach(anim => anim.pause());
    });

    finalScoreElement.innerText = score;
    gameOverScreen.classList.remove('hidden');
}

function gameWin() {
    isGameRunning = false;
    clearInterval(scoreInterval);
    clearInterval(waveSpawnInterval);

    const waves = document.querySelectorAll('.wave');
    waves.forEach(w => {
        w.getAnimations().forEach(anim => anim.pause());
    });

    if (surpriseContainer) {
        const messages = [
            "I wish for the year 2026 to be an unforgettable year full of health and peace, where all your dreams come true.",
            "May you have a wonderful year where each new day is brighter than the last, and where success and happiness never leave your side.",
            "I hope that 2026 opens brand new doors for you, and never lets the smile fade from your face or hope leave your heart."
        ];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        const messageElement = document.getElementById('surprise-message');
        if (messageElement) {
            messageElement.innerText = randomMessage;
        }

        surpriseContainer.classList.remove('hidden');
        setTimeout(() => {
            surpriseContainer.classList.add('open-gift');
        }, 500); // Slight delay before opening
    } else if (winScreen) {
        winScreen.classList.remove('hidden');
    } else {
        alert("You Win! Score: " + score); // Fallback
        stopGame();
    }
}

function checkCollision() {
    if (!isGameRunning) return;

    const kangarooRect = kangaroo.getBoundingClientRect();
    const waves = document.querySelectorAll('.wave');

    waves.forEach(wave => {
        const waveRect = wave.getBoundingClientRect();

        // Simple AABB collision detection with some padding for forgiveness
        const padding = 30; // Increased padding for surfing hitbox forgiveness

        if (
            kangarooRect.right - padding > waveRect.left + padding &&
            kangarooRect.left + padding < waveRect.right - padding &&
            kangarooRect.bottom - padding > waveRect.top + padding &&
            kangarooRect.top + padding < waveRect.bottom - padding
        ) {
            stopGame();
        }
    });
}

function gameLoop() {
    if (isGameRunning) {
        checkCollision();
        requestAnimationFrame(gameLoop);
    }
}

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);
if (playAgainBtn) playAgainBtn.addEventListener('click', startGame);
if (giftPlayAgainBtn) giftPlayAgainBtn.addEventListener('click', startGame);

