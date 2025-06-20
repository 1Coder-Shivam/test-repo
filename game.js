let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let gameInterval;
let isGameRunning = false;

const gameContainer = document.querySelector('.game-container');
const bucket = document.getElementById('bucket');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('highScore');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');

// Initialize high score display
highScoreDisplay.textContent = `Highest Score: ${highScore}`;

// Bucket movement
let bucketPosition = gameContainer.offsetWidth / 2;
const bucketSpeed = 10;
const bucketWidth = 100;

document.addEventListener('mousemove', (e) => {
    if (!isGameRunning) return;
    
    const containerRect = gameContainer.getBoundingClientRect();
    const relativeX = e.clientX - containerRect.left;
    
    bucketPosition = Math.max(0, Math.min(relativeX - bucketWidth/2, containerRect.width - bucketWidth));
    bucket.style.left = `${bucketPosition}px`;
});

// Create falling star
function createStar() {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = `${Math.random() * (gameContainer.offsetWidth - 30)}px`;
    star.style.top = '0px';
    gameContainer.appendChild(star);

    const fallSpeed = 2 + Math.random() * 3;
    
    function fall() {
        if (!isGameRunning) {
            star.remove();
            return;
        }

        const currentTop = parseFloat(star.style.top);
        const starLeft = parseFloat(star.style.left);
        
        if (currentTop >= gameContainer.offsetHeight - 60) {
            // Check collision with bucket
            if (starLeft >= bucketPosition && starLeft <= bucketPosition + bucketWidth) {
                score++;
                scoreDisplay.textContent = `Score: ${score}`;
                
                // Update high score if current score is higher
                if (score > highScore) {
                    highScore = score;
                    localStorage.setItem('highScore', highScore);
                    highScoreDisplay.textContent = `Highest Score: ${highScore}`;
                }
            }
            star.remove();
            return;
        }

        star.style.top = `${currentTop + fallSpeed}px`;
        requestAnimationFrame(fall);
    }

    fall();
}

function startGame() {
    if (isGameRunning) return;
    
    isGameRunning = true;
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    startBtn.textContent = 'Game Running';
    
    gameInterval = setInterval(() => {
        if (Math.random() < 0.1) {
            createStar();
        }
    }, 100);
}

function resetGame() {
    isGameRunning = false;
    clearInterval(gameInterval);
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    startBtn.textContent = 'Start Game';
    
    // Remove all stars
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => star.remove());
}

startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', resetGame);