export const rulesGame = (game) => {
    const headerRulesBtn = document.querySelector(".header-rules-btn");
    const gameRules = document.querySelector(".game-rules");
    const listRules = document.querySelector(".list-rules");
    const gameRulesCloseBtn = document.querySelector(".game-rules__close-btn");
    const modalOverlay = document.querySelector(".modal-overlay");

    if (!headerRulesBtn || !gameRules || !gameRulesCloseBtn || !modalOverlay) {
        console.error("Один из элементов не найден в DOM");
        return;
    }

    // Закрытие по Escape
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    };

    // Блокировка всех клавиш кроме Escape
    const blockKeys = (e) => {
        if (e.key !== 'Escape') {
            e.preventDefault();
            e.stopPropagation();
        }
    };

    const openModal = () => {
        document.body.style.overflow = 'hidden';
        gameRules.classList.add('active');
        listRules.classList.add('active');
        modalOverlay.classList.add('active');
        document.addEventListener('keydown', handleEscape);
        document.addEventListener('keydown', blockKeys, true); // useCapture = true
    };

    const closeModal = () => {
        document.body.style.overflow = 'visible';
        gameRules.classList.remove('active');
        listRules.classList.remove('active');
        modalOverlay.classList.remove('active');
        document.removeEventListener('keydown', handleEscape);
        document.removeEventListener('keydown', blockKeys, true);
    };

    headerRulesBtn.addEventListener("click", openModal);
    gameRulesCloseBtn.addEventListener("click", closeModal);
};
