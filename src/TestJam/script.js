class ShellGame {
    constructor() {
        this.boxes = document.querySelectorAll('.box-wrapper');
        this.startBtn = document.getElementById('start-btn');
        this.scoreDisplay = document.getElementById('score');
        this.operatorImg = document.getElementById('operator-img');
        this.speechBubble = document.getElementById('speech-bubble');

        this.score = 0;
        this.isShuffling = false;
        this.isPlaying = false;
        this.winningBoxIndex = -1;
        this.baseX = [0, 200, 400]; // Initial visual positions (relative pixels or percentages could be used)

        // Initialize positions
        this.resetPositions();

        // Process Operator Transparency
        this.processOperatorImages();

        // Event Listeners
        this.startBtn.addEventListener('click', () => this.startGame());
        this.boxes.forEach((box, index) => {
            box.addEventListener('click', () => this.handleBoxClick(index));
        });
    }

    processOperatorImages() {
        // We need to process the operator images to remove white background
        // We will create an Image object, load the src, process it on canvas, and update the DOM
        const states = ['neutral', 'happy', 'surprised'];
        this.processedImages = {};

        states.forEach(state => {
            const img = new Image();
            img.src = `assets/operator_${state}.png`;
            img.crossOrigin = "Anonymous";
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;

                // Simple threshold to remove white
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];
                    // If pixel is very light/white
                    if (r > 240 && g > 240 && b > 240) {
                        data[i + 3] = 0; // Alpha 0
                    }
                }

                ctx.putImageData(imageData, 0, 0);
                this.processedImages[state] = canvas.toDataURL();

                // If this is the current state (neutral), update immediately
                if (state === 'neutral' && this.operatorImg.src.includes('neutral')) {
                    this.operatorImg.src = this.processedImages['neutral'];
                }
            };
        });
    }

    resetPositions() {
        // Reset transform styles for all boxes
        this.boxes.forEach(box => {
            box.style.transform = 'translateX(0) scale(1)';
            box.classList.remove('open');
            const item = box.querySelector('.item');
            item.classList.remove('gingerbread');
        });
    }

    setOperator(state) {
        // States: 'neutral', 'happy', 'surprised'
        if (this.processedImages && this.processedImages[state]) {
            this.operatorImg.src = this.processedImages[state];
        } else {
            // Fallback if not processed yet
            const path = `assets/operator_${state}.png`;
            this.operatorImg.src = path;
        }
    }

    showSpeech(text) {
        this.speechBubble.textContent = text;
        this.speechBubble.classList.add('visible');
        setTimeout(() => {
            // Optional: Hide after some time if needed, but keeping it persistent is fine
        }, 3000);
    }

    async startGame() {
        if (this.isShuffling || this.isPlaying) return;

        this.isPlaying = true;
        this.startBtn.disabled = true;
        this.setOperator('neutral');
        this.showSpeech("Watch the boxes closely! 👀");

        // Reset previous game state
        this.resetPositions();

        // Place Reindeer
        this.winningBoxIndex = Math.floor(Math.random() * 3);
        const winningBox = this.boxes[this.winningBoxIndex];
        winningBox.querySelector('.item').classList.add('gingerbread');

        // Show Reindeer briefly before shuffling
        await this.revealReindeerBriefly();

        // Shuffle
        await this.shuffleBoxes();

        this.isShuffling = false;
        this.showSpeech("Where is it? Pick a box! 🤔");
    }

    async revealReindeerBriefly() {
        // Open winning box
        this.boxes[this.winningBoxIndex].classList.add('open');
        await this.wait(1000);
        // Close it
        this.boxes[this.winningBoxIndex].classList.remove('open');
        await this.wait(500);
    }

    async shuffleBoxes() {
        this.isShuffling = true;
        const shuffles = 10;
        const speed = 400; // ms per swap

        // We can simulate shuffling by just swapping DOM elements visual positions via translate?
        // Or actually swapping the values. 
        // A simple visual shuffle: random swaps of X transform?
        // To keep it simple but working:
        // We will assign logical positions: 0 (left), 1 (center), 2 (right)
        // And we will animate the transition between them.

        let positions = [0, 1, 2]; // Index of box at Left, Center, Right
        // box[0] is at position[0]

        for (let i = 0; i < shuffles; i++) {
            // Pick two random indices to swap
            let idx1 = Math.floor(Math.random() * 3);
            let idx2 = Math.floor(Math.random() * 3);
            while (idx1 === idx2) idx2 = Math.floor(Math.random() * 3);

            // Audio sound for shuffling? (Optional)

            // Swap positions physically in array
            [positions[idx1], positions[idx2]] = [positions[idx2], positions[idx1]];

            // Apply visual transform
            this.updateBoxPositions(positions);

            await this.wait(speed);
        }
    }

    updateBoxPositions(positions) {
        // positions[0] = 2 means box-0 is at position 2 (Right)

        // Slot distance = 260px (180 width + 80 gap)
        const stride = 260;

        this.boxes.forEach((box, index) => {
            const slot = positions[index]; // Where is box 'index' currently?

            const currentVisualSlot = slot;
            const originalSlot = index;
            const diff = currentVisualSlot - originalSlot;

            const pxMove = diff * stride;
            box.style.transform = `translateX(${pxMove}px)`;
        });
    }

    handleBoxClick(index) {
        if (!this.isPlaying || this.isShuffling) return;

        // Check if correct
        const box = this.boxes[index];
        box.classList.add('open');

        if (index === this.winningBoxIndex) {
            // WIN
            this.handleWin();
        } else {
            // LOSE
            this.handleLose();
        }

        this.isPlaying = false; // Game over round
        this.startBtn.disabled = false;
        this.startBtn.textContent = "Play Again";
    }

    handleWin() {
        this.score++;
        this.scoreDisplay.textContent = this.score;
        this.setOperator('happy');
        this.showSpeech("YES! You found it! 🎉");

        // Trigger Star Animation
        this.boxes[this.winningBoxIndex].classList.add('win');

        // Check for New Year Celebration (Score 3)
        if (this.score === 3) {
            this.celebrateNewYear();
        }
    }

    celebrateNewYear() {
        this.showSpeech("Mutlu Yıllar! 🎄✨ Happy New Year!");
        // Keep the happy operator
        this.setOperator('happy');
        // Add a global celebration class to body for background changes or more confetti later
        document.body.classList.add('celebration-mode');

        // Spawn Confetti
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            document.body.appendChild(confetti);
        }
    }

    handleLose() {
        this.setOperator('surprised');
        this.showSpeech("Oh no! It was in the other box! 😱");

        // Reveal the actual winner after a delay
        setTimeout(() => {
            this.boxes[this.winningBoxIndex].classList.add('open');
        }, 500);
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Start Game Logic
document.addEventListener('DOMContentLoaded', () => {
    const game = new ShellGame();
});
