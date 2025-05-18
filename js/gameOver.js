export const gameOver = (text) => {
    const gameOver = document.querySelector(".game-over");
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
        gameOver.style.display = 'none';
        modalOverlay.style.display = 'none';
    };

    // Открытие модалки
    gameOver.style.display = 'flex';
    modalOverlay.style.display = 'block';
    gameOverCancelText.innerHTML = text;

    document.addEventListener('keydown', blockKeys, true);

    gameOverYesBtn.addEventListener("click", () => {
        window.location.reload();
    });

    gameOverCancelBtn.addEventListener("click", closeModal);
};
