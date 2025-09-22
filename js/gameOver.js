import { startGame } from "./newGame.js";

export const gameOver = (text) => {
    const gameOver = document.querySelector(".game-over");
    const gameOverInfo = document.querySelector(".game-over-info")
    const modalOverlay = document.querySelector(".modal-overlay");
    const gameOverYesBtn = document.querySelector(".game-over__yes-btn");
    const gameOverCancelBtn = document.querySelector(".game-over__cancel-btn");
    const gameOverCancelText = document.querySelector(".game-over-text");

    if (!gameOver || !modalOverlay || !gameOverYesBtn || !gameOverCancelBtn || !gameOverCancelText) {
        console.error("Один из элементов не найден в DOM");
        return;
    }

    // Блокировка всех клавиш
    const blockKeys = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const closeModal = () => {
        gameOver.classList.remove('active');
        gameOverInfo.classList.remove('active');
        modalOverlay.classList.remove('active')
        document.removeEventListener('keydown', blockKeys, true);
    };

    gameOver.classList.add('active');
    gameOverInfo.classList.add('active');
    modalOverlay.classList.add('active');
    gameOverCancelText.innerHTML = text;

    document.addEventListener('keydown', blockKeys, true);

    gameOverYesBtn.addEventListener("click", () => {
        // window.location.reload();
        startGame();
        closeModal();
    });

    gameOverCancelBtn.addEventListener("click", closeModal);
};
