import { Game } from './game.js';

let currentGame = null;

export const startGame = () => {
    if (currentGame) currentGame.removeControls();
    
    currentGame = new Game();
    currentGame.init();
};

export const newGame = (initialGame) => {
    const headerNewBtn = document.querySelector(".header-new-btn");
    
    // Устанавливаем текущую игру, чтобы removeControls работал при первом нажатии
    currentGame = initialGame;

    headerNewBtn.removeEventListener("click", startGame);
    headerNewBtn.addEventListener("click", startGame);
};
