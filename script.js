// DOM Elements
const introScreen = document.getElementById("introScreen");
const gameScreen = document.getElementById("gameScreen");
const endScreen = document.getElementById("endScreen");
const scoreElement = document.getElementById("score");
const endMessage = document.getElementById("endMessage");

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game Variables
let score = 0;
let gameInterval;
let hearts = [];
let gameOver = false;
let heartMissed = false;

// Log: Initializing game
console.log("Initializing game...");

// Heart Object
class Heart {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 30;  // Adjust the size of the heart image
        this.image = new Image();
        // Updated to your image path
        this.image.src = "images/vecteezy_realistic-3d-design-icon-heart-symbol-love_21392620.jpg";  // Update to the correct path
    }

    draw() {
        // Draw the heart image at the heart's position
        ctx.drawImage(this.image, this.x, this.y, this.size, this.size);
    }

    move() {
        this.y += 2; // Speed of falling hearts
        if (this.y > canvas.height) {
            // If heart goes off-screen, it's missed
            heartMissed = true;
            this.y = -30; // Reset position
            this.x = Math.random() * (canvas.width - this.size);
        }
    }

    // Improved collision detection
    isCollected(player) {
        return (
            player.x < this.x + this.size &&
            player.x + player.size > this.x &&
            player.y < this.y + this.size &&
            player.y + player.size > this.y
        );
    }
}

// Player Object
const player = {
    x: canvas.width / 2 - 20,
    y: canvas.height - 60,
    size: 40,
    color: "#6a0dad",
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
    },
    moveTo(x) {
        this.x = x - this.size / 2; // Center player on mouse/touch position
    }
};

// Controls
function setupControls() {
    if ('ontouchstart' in window) {
        // Touch control for mobile
        canvas.addEventListener("touchmove", (e) => {
            const touch = e.touches[0];
            player.moveTo(touch.clientX);
        });
    } else {
        // Mouse control for desktop
        canvas.addEventListener("mousemove", (e) => {
            player.moveTo(e.clientX);
        });
    }
}

// Start Game
function startGame() {
    console.log("Starting game...");
    introScreen.style.display = "none";
    gameScreen.style.display = "block";
    score = 0;
    heartMissed = false;
    gameOver = false;
    hearts = [];
    for (let i = 0; i < 5; i++) {
        const heart = new Heart(
            Math.random() * canvas.width,
            Math.random() * -canvas.height // Start hearts off-screen
        );
        console.log(`Created heart at x: ${heart.x}, y: ${heart.y}`);
        hearts.push(heart);
    }
    scoreElement.textContent = score;
    setupControls();
    gameLoop();
}

// Game Loop
function gameLoop() {
    console.log("Game loop started...");
    gameInterval = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw Player
        player.draw();

        // Draw and Move Hearts
        hearts.forEach((heart) => {
            heart.draw();
            heart.move();

            if (heart.isCollected(player)) {
                score++;
                scoreElement.textContent = score;
                console.log(`Heart collected! Score: ${score}`);
                // Reset heart position
                heart.y = -30;
                heart.x = Math.random() * (canvas.width - heart.size);
            }
        });

        // Check for missed heart
        if (heartMissed) {
            console.log("A heart was missed!");
            endGame(false);
        }

        // Check Victory
        if (score >= 10) {
            console.log("Victory achieved!");
            endGame(true);
        }
    }, 1000 / 60); // 60 FPS
}

// End Game
function endGame(victory) {
    console.log("Game ended. Victory:", victory);
    gameOver = true;
    clearInterval(gameInterval);
    gameScreen.style.display = "none";
    endScreen.style.display = "block";
    endMessage.textContent = victory ? "You collected all the hearts! ❤️" : "Game Over! You missed a heart.";
}

// Reset Game
function resetGame() {
    console.log("Resetting game...");
    endScreen.style.display = "none";
    introScreen.style.display = "block";
    heartMissed = false;
    score = 0;
    scoreElement.textContent = score;
}
