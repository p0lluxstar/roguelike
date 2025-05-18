// import { Game } from "./game";

export const newGame = () => {
    const headerNewBtn = document.querySelector(".header-new-btn"); 

    headerNewBtn.addEventListener('click', () => {
        window.location.reload();
    })
}