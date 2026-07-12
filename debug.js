// ===== ОТЛАДОЧНЫЕ ФУНКЦИИ =====

function setupDebugMenu() {
    const debugToggle = document.getElementById('debugToggle');
    const debugPanel = document.getElementById('debugPanel');
    
    if (debugToggle && debugPanel) {
        debugToggle.addEventListener('click', () => {
            debugPanel.style.display = debugPanel.style.display === 'none' ? 'block' : 'none';
        });
        
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.debug-menu')) {
                debugPanel.style.display = 'none';
            }
        });
    }
}

function handleFileImport(event) {
    const file = event.target.files[0];
    if (file) {
        UTILS.importData(file);
    }
}

function showStatistics() {
    const stats = UTILS.getStatistics();
    
    if (!stats) {
        alert('Нет данных для отображения статистики');
        return;
    }
    
    const completed = stats.completedSteps;
    const total = stats.totalSteps;
    const percentage = stats.percentage;
    const daysLeft = stats.daysLeft;
    const stepsPerDay = stats.stepsPerDay;
    
    const message = 'СТАТИСТИКА ПРОГРЕССА\n' +
        'Завершено шагов: ' + completed + ' из ' + total + '\n' +
        'Процент завершения: ' + percentage + '%\n' +
        'Дней до экзамена: ' + daysLeft + '\n' +
        'Шагов в день (рекомендуется): ' + stepsPerDay;
    
    alert(message);
}
