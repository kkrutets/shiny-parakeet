// ===== КОНФИГУРАЦИЯ ПРИЛОЖЕНИЯ =====

const CONFIG = {
    // Дата экзамена (формат: год, месяц (0-11), день)
    EXAM_DATE: new Date(2026, 7, 11), // 11 августа 2026 (30 дней)
    
    // Количество шагов на карте
    TOTAL_STEPS: 88,
    
    // Количество уроков в день
    LESSONS_PER_DAY: 3,
    
    // Помодоро таймер (в секундах)
    POMODORO_WORK: 20 * 60,      // 20 минут работы
    POMODORO_BREAK: 10 * 60,     // 10 минут отдыха
    
    // Кнопка спасения (в секундах)
    RESCUE_TIMER: 5 * 60,        // 5 минут
    
    // Цвета
    COLORS: {
        primary: '#FF6B6B',
        success: '#51CF66',
        warning: '#FFD93D',
        info: '#6C5CE7',
        darkBg: '#1A1A2E',
        lightBg: '#F8F9FA',
        textDark: '#2D3436',
        textLight: '#636E72',
    },
    
    // Звуки (частоты в Hz)
    SOUNDS: {
        punch: {
            frequency: 800,
            duration: 0.1,
            gain: 0.3,
        },
        victory: {
            notes: [523, 659, 784], // Do, Mi, Sol
            duration: 0.2,
            gain: 0.2,
            interval: 100,
        },
        startup: {
            startFreq: 400,
            endFreq: 600,
            duration: 0.3,
            gain: 0.1,
        },
    },
    
    // Вибрация (в миллисекундах)
    VIBRATION: {
        punch: 50,
        victory: [100, 50, 100],
    },
    
    // Конфетти
    CONFETTI: {
        count: 50,
        duration: 3000,
        colors: ['#51CF66', '#FFD93D', '#FF6B6B', '#6C5CE7'],
    },
    
    // Сетка шагов (строки x столбцы)
    STEPS_GRID: {
        columns: 11,
        rows: 8,
    },
    
    // Локальное хранилище
    STORAGE_KEY: 'driverLicenseTracker',
    
    // Сообщения
    MESSAGES: {
        allLessonsCompleted: '🎉 Отлично! Все уроки на сегодня завершены!',
        rescueTitle: 'Просто включи видео на х1.5 и посмотри 5 минут',
        rescueSubtitle: 'Если через 5 минут захочешь закрыть — закрой. Я разрешаю. 💚',
        pomodoroWorkEnd: '⏰ Время работы закончилось! Отдыхай 10 минут.',
        pomodoroBreakEnd: '🎯 Отдых закончился! Готов к новому раунду?',
        examToday: 'Экзамен сегодня! Ты готов! 🚀',
        examPassed: 'Экзамен уже прошел! Поздравляем! 🎉',
        inSchedule: 'Мы в графике! 🎯',
    },
    
    // Темы (для будущего расширения)
    THEMES: {
        light: {
            name: 'Светлая',
            primary: '#667eea',
            secondary: '#764ba2',
        },
        dark: {
            name: 'Темная',
            primary: '#1A1A2E',
            secondary: '#16213E',
        },
    },
};

// ===== УТИЛИТЫ =====

const UTILS = {
    // Форматирование времени
    formatTime: (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    },
    
    // Расчет дней до экзамена
    getDaysUntilExam: () => {
        const today = new Date();
        const daysLeft = Math.ceil((CONFIG.EXAM_DATE - today) / (1000 * 60 * 60 * 24));
        return daysLeft;
    },
    
    // Получение текущей даты в формате строки
    getTodayString: () => {
        return new Date().toDateString();
    },
    
    // Проверка, новый ли день
    isNewDay: (lastSaveDate) => {
        return lastSaveDate !== UTILS.getTodayString();
    },
    
    // Случайное число в диапазоне
    randomRange: (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    // Случайный элемент из массива
    randomElement: (array) => {
        return array[Math.floor(Math.random() * array.length)];
    },
    
    // Проверка поддержки вибрации
    isVibrationSupported: () => {
        return 'vibrate' in navigator;
    },
    
    // Проверка поддержки Web Audio API
    isAudioSupported: () => {
        return !!(window.AudioContext || window.webkitAudioContext);
    },
    
    // Сохранение в localStorage
    saveToStorage: (key, data) => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Ошибка при сохранении в localStorage:', e);
            return false;
        }
    },
    
    // Загрузка из localStorage
    loadFromStorage: (key) => {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Ошибка при загрузке из localStorage:', e);
            return null;
        }
    },
    
    // Удаление из localStorage
    removeFromStorage: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Ошибка при удалении из localStorage:', e);
            return false;
        }
    },
    
    // Очистка всех данных
    clearAllData: () => {
        if (confirm('Вы уверены? Это удалит все ваши данные!')) {
            UTILS.removeFromStorage(CONFIG.STORAGE_KEY);
            location.reload();
        }
    },
    
    // Экспорт данных в JSON
    exportData: () => {
        const data = UTILS.loadFromStorage(CONFIG.STORAGE_KEY);
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `driver-license-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    },
    
    // Импорт данных из JSON
    importData: (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                UTILS.saveToStorage(CONFIG.STORAGE_KEY, data);
                alert('Данные успешно импортированы!');
                location.reload();
            } catch (error) {
                alert('Ошибка при импорте данных: ' + error.message);
            }
        };
        reader.readAsText(file);
    },
    
    // Получение статистики
    getStatistics: () => {
        const data = UTILS.loadFromStorage(CONFIG.STORAGE_KEY);
        if (!data) return null;
        
        const completedSteps = data.completedStepsArray.filter(Boolean).length;
        const percentage = Math.round((completedSteps / CONFIG.TOTAL_STEPS) * 100);
        const daysLeft = UTILS.getDaysUntilExam();
        const stepsPerDay = daysLeft > 0 ? (CONFIG.TOTAL_STEPS - completedSteps) / daysLeft : 0;
        
        return {
            completedSteps,
            totalSteps: CONFIG.TOTAL_STEPS,
            percentage,
            daysLeft,
            stepsPerDay: Math.ceil(stepsPerDay),
            lastSaveDate: data.lastSaveDate,
        };
    },
};

// ===== ЭКСПОРТ =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, UTILS };
}
