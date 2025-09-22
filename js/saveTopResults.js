const saveTopResults = (numberSteps, numberAttacks) => {
    let date = new Date().toLocaleDateString();
    
    const newResult = {
        date: date,
        numberSteps: numberSteps,
        numberAttacks: numberAttacks
    };
    
    // Получаем текущие топ-результаты из localStorage
    let topResults = JSON.parse(localStorage.getItem('top-results')) || [];
    
    // Добавляем новый результат в массив
    topResults.push(newResult);
    
    // Сортируем результаты: сначала по шагам (меньше лучше), затем по атакам (меньше лучше)
    topResults.sort((a, b) => {
        if (a.numberSteps !== b.numberSteps) {
            return a.numberSteps - b.numberSteps; // Меньше шагов - лучше
        } else {
            return a.numberAttacks - b.numberAttacks; // Меньше атак - лучше
        }
    });
    
    // Оставляем только 3 лучших результата
    topResults = topResults.slice(0, 10);
    
    // Сохраняем обновленный массив в localStorage
    localStorage.setItem('top-results', JSON.stringify(topResults));
    
    console.log('Топ-3 результатов сохранены:', topResults);
}

export default saveTopResults;