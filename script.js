// ===== СОСТОЯНИЕ ПРИЛОЖЕНИЯ =====
const state = {
    totalSteps: CONFIG.TOTAL_STEPS,
    completedSteps: 0,
    todayLessons: new Array(CONFIG.LESSONS_PER_DAY).fill(false),
    ticketsCompleted: false,
    completedStepsArray: new Array(CONFIG.TOTAL_STEPS).fill(false),
    rescueTimerActive: false,
    pomodoroTimerActive: false,
    pomodoroMode: 'work', // 'work' или 'break'
    pomodoroTimeLeft: CONFIG.POMODORO_WORK,
    rescueTimeLeft: CONFIG.RESCUE_TIMER,
};

// ===== ИНИЦИАЛИЗАЦИЯ =====
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    initializeStepsGrid();
    updateProgressBar();
    setupEventListeners();
    setupDebugMenu();
    playStartupSound();
});

// ===== СОЗДАНИЕ СЕТКИ 88 ШАГОВ =====
function initializeStepsGrid() {
    const stepsGrid = document.getElementById('stepsGrid');
    stepsGrid.innerHTML = '';
    
    for (let i = 1; i <= state.totalSteps; i++) {
        const circle = document.createElement('div');
        circle.className = 'step-circle';
        circle.textContent = i;
        circle.dataset.step = i;
        
        if (state.completedStepsArray[i - 1]) {
            circle.classList.add('completed');
        }
        
        circle.addEventListener('click', () => toggleStep(i - 1, circle));
        stepsGrid.appendChild(circle);
    }
}

// ===== ПЕРЕКЛЮЧЕНИЕ ШАГА =====
function toggleStep(index, element) {
    state.completedStepsArray[index] = !state.completedStepsArray[index];
    
    if (state.completedStepsArray[index]) {
        element.classList.add('completed');
        playPunchSound();
    } else {
        element.classList.remove('completed');
    }
    
    updateProgressBar();
    saveToLocalStorage();
}

// ===== ОБНОВЛЕНИЕ ПРОГРЕСС-БАРА =====
function updateProgressBar() {
    state.completedSteps = state.completedStepsArray.filter(Boolean).length;
    const percentage = Math.round((state.completedSteps / state.totalSteps) * 100);
    
    const progressBar = document.getElementById('mainProgressBar');
    progressBar.style.width = percentage + '%';
    
    const progressText = document.getElementById('progressText');
    progressText.textContent = `${percentage}% завершено (${state.completedSteps} из ${state.totalSteps})`;
}

// ===== УРОКИ НА СЕГОДНЯ =====
function setupEventListeners() {
    // Уроки
    document.querySelectorAll('.lesson-checkbox').forEach((el, index) => {
        el.addEventListener('click', () => toggleLesson(index, el));
        
        if (state.todayLessons[index]) {
            el.classList.add('completed');
        }
    });
    
    // Билеты
    const ticketsCheckbox = document.querySelector('.tickets-checkbox');
    ticketsCheckbox.addEventListener('click', () => toggleTickets(ticketsCheckbox));
    
    if (state.ticketsCompleted) {
        ticketsCheckbox.classList.add('completed');
    }
    
    // Кнопка спасения
    document.getElementById('rescueButton').addEventListener('click', openRescueModal);
    document.getElementById('closeModal').addEventListener('click', closeRescueModal);
    document.getElementById('startRescueTimer').addEventListener('click', startRescueTimer);
    
    // Lo-Fi плеер
    document.getElementById('lofiButton').addEventListener('click', toggleLofiPlayer);
    
    // Помодоро
    document.getElementById('pomodoroButton').addEventListener('click', togglePomodoroTimer);
    document.getElementById('startTimer').addEventListener('click', startPomodoroTimer);
    document.getElementById('resetTimer').addEventListener('click', resetPomodoroTimer);
    
    // Закрытие модального окна при клике вне его
    document.getElementById('rescueModal').addEventListener('click', (e) => {
        if (e.target.id === 'rescueModal') {
            closeRescueModal();
        }
    });
}

function toggleLesson(index, element) {
    state.todayLessons[index] = !state.todayLessons[index];
    
    if (state.todayLessons[index]) {
        element.classList.add('completed');
        playPunchSound();
        
        // Добавляем шаг в глобальную карту
        const nextIncompleteStep = state.completedStepsArray.findIndex(step => !step);
        if (nextIncompleteStep !== -1) {
            state.completedStepsArray[nextIncompleteStep] = true;
            const stepCircle = document.querySelector(`[data-step="${nextIncompleteStep + 1}"]`);
            if (stepCircle) {
                stepCircle.classList.add('completed');
            }
        }
        
        // Проверяем, все ли уроки завершены
        checkAllLessonsCompleted();
    } else {
        element.classList.remove('completed');
    }
    
    updateProgressBar();
    saveToLocalStorage();
}

function toggleTickets(element) {
    state.ticketsCompleted = !state.ticketsCompleted;
    
    if (state.ticketsCompleted) {
        element.classList.add('completed');
        playPunchSound();
    } else {
        element.classList.remove('completed');
    }
    
    saveToLocalStorage();
}

function checkAllLessonsCompleted() {
    const allLessonsCompleted = state.todayLessons.every(lesson => lesson);
    
    if (allLessonsCompleted) {
        triggerConfetti();
        playVictorySound();
    }
}

// ===== КОНФЕТТИ =====
function triggerConfetti() {
    const container = document.getElementById('confetti-container');
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        const colors = ['#51CF66', '#FFD93D', '#FF6B6B', '#6C5CE7'];
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-10px';
        confetti.style.animation = `confettiFall ${2 + Math.random() * 1}s ease-out forwards`;
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        container.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 3000);
    }
}

// ===== МОДАЛЬНОЕ ОКНО СПАСЕНИЯ =====
function openRescueModal() {
    const modal = document.getElementById('rescueModal');
    modal.classList.add('active');
    state.rescueTimeLeft = 5 * 60;
    updateRescueTimerDisplay();
}

function closeRescueModal() {
    const modal = document.getElementById('rescueModal');
    modal.classList.remove('active');
    state.rescueTimerActive = false;
    document.getElementById('startRescueTimer').textContent = 'Нажимай старт!';
    document.getElementById('startRescueTimer').disabled = false;
}

function startRescueTimer() {
    if (state.rescueTimerActive) return;
    
    state.rescueTimerActive = true;
    const button = document.getElementById('startRescueTimer');
    button.disabled = true;
    button.textContent = 'Идет отсчет...';
    
    const interval = setInterval(() => {
        state.rescueTimeLeft--;
        updateRescueTimerDisplay();
        
        if (state.rescueTimeLeft <= 0) {
            clearInterval(interval);
            state.rescueTimerActive = false;
            button.textContent = 'Время вышло! 🎉';
            playVictorySound();
            
            setTimeout(() => {
                closeRescueModal();
            }, 2000);
        }
    }, 1000);
}

function updateRescueTimerDisplay() {
    const minutes = Math.floor(state.rescueTimeLeft / 60);
    const seconds = state.rescueTimeLeft % 60;
    const display = document.getElementById('rescueTimerDisplay');
    display.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// ===== LO-FI ПЛЕЕР =====
function toggleLofiPlayer() {
    const player = document.getElementById('lofiPlayer');
    const button = document.getElementById('lofiButton');
    
    if (player.style.display === 'none') {
        player.style.display = 'block';
        button.style.background = 'rgba(255, 255, 255, 0.2)';
        document.getElementById('lofiAudio').play();
    } else {
        player.style.display = 'none';
        button.style.background = 'transparent';
        document.getElementById('lofiAudio').pause();
    }
}

// ===== ПОМОДОРО ТАЙМЕР =====
function togglePomodoroTimer() {
    const timer = document.getElementById('pomodoroTimer');
    const button = document.getElementById('pomodoroButton');
    
    if (timer.style.display === 'none') {
        timer.style.display = 'block';
        button.style.background = 'rgba(255, 255, 255, 0.2)';
        updatePomodoroDisplay();
    } else {
        timer.style.display = 'none';
        button.style.background = 'transparent';
        state.pomodoroTimerActive = false;
    }
}

function startPomodoroTimer() {
    if (state.pomodoroTimerActive) return;
    
    state.pomodoroTimerActive = true;
    const button = document.getElementById('startTimer');
    button.disabled = true;
    button.textContent = 'Идет отсчет...';
    
    const interval = setInterval(() => {
        state.pomodoroTimeLeft--;
        updatePomodoroDisplay();
        
        if (state.pomodoroTimeLeft <= 0) {
            playVictorySound();
            
            // Переключаемся между работой и отдыхом
            if (state.pomodoroMode === 'work') {
                state.pomodoroMode = 'break';
                state.pomodoroTimeLeft = 10 * 60;
                alert('⏰ Время работы закончилось! Отдыхай 10 минут.');
            } else {
                state.pomodoroMode = 'work';
                state.pomodoroTimeLeft = 20 * 60;
                alert('🎯 Отдых закончился! Готов к новому раунду?');
            }
            
            state.pomodoroTimerActive = false;
            button.disabled = false;
            button.textContent = 'Старт';
            updatePomodoroDisplay();
            clearInterval(interval);
        }
    }, 1000);
}

function resetPomodoroTimer() {
    state.pomodoroTimerActive = false;
    state.pomodoroMode = 'work';
    state.pomodoroTimeLeft = 20 * 60;
    document.getElementById('startTimer').disabled = false;
    document.getElementById('startTimer').textContent = 'Старт';
    updatePomodoroDisplay();
}

function updatePomodoroDisplay() {
    const minutes = Math.floor(state.pomodoroTimeLeft / 60);
    const seconds = state.pomodoroTimeLeft % 60;
    const display = document.getElementById('timerDisplay');
    display.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// ===== ЗВУКИ =====
function playPunchSound() {
    // Используем Web Audio API для создания звука
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
    
    // Вибрация
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
}

function playVictorySound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [523, 659, 784]; // Do, Mi, Sol
    
    notes.forEach((freq, index) => {
        setTimeout(() => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = freq;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        }, index * 100);
    });
    
    // Вибрация
    if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
    }
}

function playStartupSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.3);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
}

// ===== ЛОКАЛЬНОЕ ХРАНИЛИЩЕ =====
function saveToLocalStorage() {
    const data = {
        completedStepsArray: state.completedStepsArray,
        todayLessons: state.todayLessons,
        ticketsCompleted: state.ticketsCompleted,
        lastSaveDate: new Date().toDateString(),
    };
    localStorage.setItem('driverLicenseTracker', JSON.stringify(data));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('driverLicenseTracker');
    
    if (saved) {
        const data = JSON.parse(saved);
        const today = new Date().toDateString();
        
        // Если это новый день, сбрасываем дневные задачи
        if (data.lastSaveDate !== today) {
            state.todayLessons = [false, false, false];
            state.ticketsCompleted = false;
        } else {
            state.todayLessons = data.todayLessons;
            state.ticketsCompleted = data.ticketsCompleted;
        }
        
        state.completedStepsArray = data.completedStepsArray;
    }
}

// ===== ОБНОВЛЕНИЕ ДЕДЛАЙНА =====
function updateDeadline() {
    const examDate = new Date(2026, 8, 15); // 15 сентября 2026
    const today = new Date();
    const daysLeft = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));
    
    const deadlineText = document.getElementById('deadlineText');
    
    if (daysLeft > 0) {
        deadlineText.textContent = `До экзамена примерно ${daysLeft} дней. Мы в графике! 🎯`;
    } else if (daysLeft === 0) {
        deadlineText.textContent = 'Экзамен сегодня! Ты готов! 🚀';
    } else {
        deadlineText.textContent = 'Экзамен уже прошел! Поздравляем! 🎉';
    }
}

// Вызываем при загрузке
updateDeadline();

// Обновляем дедлайн каждый день
setInterval(updateDeadline, 24 * 60 * 60 * 1000);
