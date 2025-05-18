import { Game } from './game.js';

let currentGame = null;

export const newGame = (initialGame) => {
    const headerNewBtn = document.querySelector(".header-new-btn");

    const startGame = () => {
        if (currentGame) currentGame.removeControls();
        currentGame = new Game();
        currentGame.init();
    };

    // Устанавливаем текущую игру, чтобы removeControls работал при первом нажатии
    currentGame = initialGame;

    // Назначаем кнопку
    headerNewBtn.removeEventListener("click", startGame);
    headerNewBtn.addEventListener("click", startGame);
};
