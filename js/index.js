import { Game } from "./game.js";
import { newGame } from "./newGame.js";
import { Loading } from "./loading.js";

// Создаём игру при первом запуске
new Loading().init();
const initialGame = new Game();
initialGame.init();

newGame(initialGame);
