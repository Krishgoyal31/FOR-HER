document.addEventListener('DOMContentLoaded', () => {
    // Only run confetti on the index page for a surprise effect
    if (document.body.classList.contains('homepage')) {
        createConfettiEffect();
    }

    // Add 'active' class to current page in navigation
    document.querySelectorAll('nav a').forEach(link => {
        // Normalize URLs for comparison, remove trailing slashes if present
        const currentPath = window.location.pathname.endsWith('/') ? window.location.pathname.slice(0, -1) : window.location.pathname;
        const linkPath = new URL(link.href).pathname.endsWith('/') ? new URL(link.href).pathname.slice(0, -1) : new URL(link.href).pathname;

        // Special handling for index.html if it's accessed as root '/'
        if (currentPath === '/' && linkPath.endsWith('index.html')) {
            link.classList.add('active');
        } else if (currentPath.includes(linkPath) && linkPath !== '/') { // Check if current path contains link path
            link.classList.add('active');
        }
    });

    // Handle guestbook form submission
    const wishForm = document.getElementById('wishForm');
    const responseMessageDiv = document.getElementById('responseMessage');

    if (wishForm && responseMessageDiv) {
        wishForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent actual form submission

            const wishMessage = document.getElementById('wishMessage').value;
            const yourName = document.getElementById('yourName').value;

            // Simple validation
            if (!wishMessage.trim() || !yourName.trim()) {
                responseMessageDiv.innerHTML = '<p class="error-message">Oops! Please fill in both your name and your heartfelt wish. ✨</p>';
                responseMessageDiv.style.display = 'block';
                responseMessageDiv.classList.add('error');
                return;
            }

            const wishData = {
                message: wishMessage,
                name: yourName,
                timestamp: new Date().toISOString()
            };

            // Simulate backend request to save to wishes.json
            // IMPORTANT: In a real project, this would be a fetch() call to a server-side endpoint
            // (e.g., Node.js, Python Flask, PHP) that would actually write to a file.
            // Client-side JavaScript cannot directly write to local files due to security restrictions.
            console.log("Simulating saving wish to wishes.json:", wishData);

            // Simulate network delay
            setTimeout(() => {
                const isSuccess = Math.random() > 0.1; // 90% chance of success for simulation

                if (isSuccess) {
                    responseMessageDiv.innerHTML = '<p>💖 Thank you for your beautiful wish, ' + yourName + '! It means the world to us! 💖</p><p style="font-size: 0.9em;"><i>(Your wish would be saved to a `wishes.json` file on a real server!)</i></p>';
                    responseMessageDiv.classList.remove('error');
                    responseMessageDiv.classList.add('success');
                    wishForm.reset(); // Clear the form fields on success
                } else {
                    responseMessageDiv.innerHTML = '<p class="error-message">Oh no! Something went wrong while sending your wish. Please try again! 🙁</p>';
                    responseMessageDiv.classList.remove('success');
                    responseMessageDiv.classList.add('error');
                }
                responseMessageDiv.style.display = 'block';
            }, 1000); // Simulate 1 second network delay
        });
    }

    // Game logic for games.html
    if (document.body.classList.contains('games-page')) {
        const gameBoard = document.getElementById('gameBoard');
        const gameMessage = document.getElementById('gameMessage');
        const resetGameBtn = document.getElementById('resetGame');
        let heartLocation;
        let attemptsLeft;
        const totalAttempts = 3; // Example: 3 attempts

        function initializeGame() {
            gameBoard.innerHTML = ''; // Clear previous cards
            gameMessage.textContent = '';
            gameMessage.className = 'game-message'; // Reset classes
            resetGameBtn.style.display = 'none';
            attemptsLeft = totalAttempts;
            heartLocation = Math.floor(Math.random() * 9); // 0-8 for 9 cards

            for (let i = 0; i < 9; i++) {
                const card = document.createElement('div');
                card.classList.add('game-card');
                card.dataset.cardId = i;
                // Staggered animation delay
                card.style.setProperty('--delay', `${i * 0.08}s`); // Slightly slower stagger
                card.addEventListener('click', handleCardClick);
                gameBoard.appendChild(card);
            }
            updateGameMessage();
        }

        function updateGameMessage() {
            gameMessage.textContent = `Attempts left: ${attemptsLeft}`;
            if (attemptsLeft === 0) {
                gameMessage.textContent = 'Oh no, you ran out of attempts! Try again!';
                gameMessage.classList.add('lose');
                resetGameBtn.style.display = 'block';
                revealAllCards();
                disableCards();
            }
        }

        function handleCardClick(event) {
            const clickedCard = event.currentTarget;
            if (clickedCard.classList.contains('revealed') || attemptsLeft === 0) {
                return; // Don't click revealed cards or if no attempts left
            }

            clickedCard.classList.add('revealed');
            attemptsLeft--;

            if (parseInt(clickedCard.dataset.cardId) === heartLocation) {
                clickedCard.classList.add('heart');
                gameMessage.textContent = '🥳 You found the Birthday Heart! Happy Birthday, my love! 💖';
                gameMessage.classList.add('win');
                disableCards();
                resetGameBtn.style.display = 'block';
            } else {
                clickedCard.classList.add('empty');
                updateGameMessage();
                if (attemptsLeft === 0) {
                    // If this click consumed the last attempt and it wasn't the heart
                    gameMessage.textContent = 'Oh no, you ran out of attempts! Try again!';
                    gameMessage.classList.add('lose');
                    revealAllCards(); // Reveal all cards to show where the heart was
                }
            }
        }

        function disableCards() {
            document.querySelectorAll('.game-card').forEach(card => {
                card.removeEventListener('click', handleCardClick);
                card.style.cursor = 'default';
            });
        }

        function revealAllCards() {
            document.querySelectorAll('.game-card').forEach(card => {
                card.classList.add('revealed');
                if (parseInt(card.dataset.cardId) === heartLocation) {
                    card.classList.add('heart');
                } else {
                    card.classList.add('empty');
                }
            });
        }

        resetGameBtn.addEventListener('click', initializeGame);

        initializeGame();
    }

    // Surprise reveal logic for surprise.html
    const revealSurpriseBtn = document.getElementById('revealSurpriseBtn');
    const surpriseRevealArea = document.getElementById('surpriseRevealArea');

    if (revealSurpriseBtn && surpriseRevealArea) {
        // Initially set the height to 0 for the transition
        surpriseRevealArea.style.height = '0';
        surpriseRevealArea.style.opacity = '0';
        surpriseRevealArea.style.overflow = 'hidden';

        revealSurpriseBtn.addEventListener('click', () => {
            revealSurpriseBtn.style.display = 'none'; // Hide the button
            surpriseRevealArea.classList.add('revealed'); // Add class to trigger CSS animation
            surpriseRevealArea.style.height = surpriseRevealArea.scrollHeight + 'px'; // Set height for smooth transition
            surpriseRevealArea.style.opacity = '1';

            // Optional: after animation, remove height to allow content to flow naturally
            surpriseRevealArea.addEventListener('transitionend', () => {
                if (surpriseRevealArea.classList.contains('revealed')) {
                    surpriseRevealArea.style.height = 'auto';
                }
            }, { once: true });
        });
    }
});

function createConfettiEffect() {
    const confettiContainer = document.createElement('div');
    confettiContainer.classList.add('confetti-container');
    document.body.appendChild(confettiContainer);

    // Update confetti colors to match the new palette
    const colors = ['#FFB3C6', '#FFF4A3', '#AEC6CF', '#FFD700', '#FF8C00', '#F7B76D']; // Soft Pink, Pale Yellow, Muted Sky Blue, Gold, Dark Orange, Soft Orange

    for (let i = 0; i < 100; i++) { // Generate even more confetti pieces for extra cuteness!
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animationDuration = Math.random() * 2 + 3 + 's'; // 3-5 seconds
        confetti.style.animationDelay = Math.random() * 2 + 's';
        confetti.style.transform = `scale(${Math.random() * 0.7 + 0.5}) rotate(${Math.random() * 360}deg)`; // 0.5 to 1.2 scale, add rotation
        confetti.style.opacity = 0; // Start invisible
        confettiContainer.appendChild(confetti);

        // Remove confetti after animation to clean up DOM
        confetti.addEventListener('animationend', () => {
            confetti.remove();
            if (confettiContainer.children.length === 0) {
                confettiContainer.remove(); // Remove container if all confetti are gone
            }
        });
    }

    // Optional: Remove confetti container after some time if no more confetti is being added, as a fallback
    setTimeout(() => {
        if (confettiContainer.children.length === 0 && confettiContainer.parentNode) {
            confettiContainer.remove();
        }
    }, 6000); // After all confetti should have fallen (max 5s duration + 2s delay)
}
