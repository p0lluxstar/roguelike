import { Game } from "./game.js";
import { newGame } from "./newGame.js";

// Создаём игру при первом запуске
const initialGame = new Game();
initialGame.init();

newGame(initialGame);
