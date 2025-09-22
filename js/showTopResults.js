const showTopResults = () => {
    const headerTopBtn = document.querySelector(".header-top-btn"); 
    const modalOverlay = document.querySelector(".modal-overlay"); 
    const topResults = document.querySelector(".top-results"); 
    const topResultsInfo = document.querySelector(".top-results-info");  
    const topResultsTable = document.querySelector(".top-results-table");   
    const topResultsClearBtn = document.querySelector(".top-results__clear-btn");
    const topResultsCloseBtn = document.querySelector(".top-results__close-btn");
    
    const openTopResults = () => {
        modalOverlay.classList.add('active');
        topResults.classList.add('active');
        topResultsInfo.classList.add('active');

        const topResultsFormLS = JSON.parse(localStorage.getItem('top-results')) || [];
    
        // Очищаем таблицу
        topResultsTable.innerHTML = '';
        
        if (topResultsFormLS.length === 0) {
            topResultsTable.innerHTML = `Пока нет сохраненных результатов`;
            return;
        }

        console.log(topResultsFormLS)

        topResultsFormLS.forEach((result, index) => {
            if (result) {
                topResultsTable.innerHTML += `<span>${index + 1}. 📅 ${result.date} 👣 ${result.numberSteps} ⚔️ ${result.numberAttacks}</span>`;
            }
        });
    }

    const closeTopResults = () => {
        modalOverlay.classList.remove('active');
        topResults.classList.remove('active');
        topResultsInfo.classList.remove('active');
    }

    const clearTopResults = () => {
    localStorage.removeItem('top-results');
    topResultsTable.innerHTML = `Пока нет сохраненных результатов`;
    openTopResults();
}
    
    headerTopBtn.addEventListener("click", openTopResults);
    topResultsCloseBtn.addEventListener("click", closeTopResults);
    topResultsClearBtn.addEventListener("click", clearTopResults);
  
}

export default showTopResults;