// ===== СДВГ-ОРИЕНТИРОВАННЫЕ ФУНКЦИИ =====

// 1. СИСТЕМА НАПОМИНАНИЙ И УВЕДОМЛЕНИЙ
const ADHDFeatures = {
    // Случайные мотивирующие фразы
    motivationalPhrases: [
        '🎯 Ты справишься! Это всего лишь один шаг!',
        '💪 Каждый шаг приближает тебя к цели!',
        '🌟 Ты уже делаешь прогресс!',
        '🚀 Начни с малого - это уже победа!',
        '✨ Ты сильнее, чем думаешь!',
        '🎉 Даже 5 минут - это хорошо!',
        '💚 Ты заслуживаешь отдыха после работы!',
        '🏆 Каждый день - новая возможность!',
        '⭐ Ты не один в этом!',
        '🌈 Прогресс, а не совершенство!'
    ],

    // Получить случайную фразу
    getRandomPhrase() {
        return this.motivationalPhrases[
            Math.floor(Math.random() * this.motivationalPhrases.length)
        ];
    },

    // 2. СИСТЕМА МИКРО-ЦЕЛЕЙ
    microGoals: [
        { text: 'Посмотри видео 5 минут', reward: '⏰' },
        { text: 'Прочитай одну страницу', reward: '📖' },
        { text: 'Реши один вопрос', reward: '❓' },
        { text: 'Сделай перерыв 2 минуты', reward: '☕' },
        { text: 'Встань и потянись', reward: '🧘' },
        { text: 'Выпей воды', reward: '💧' },
        { text: 'Сделай 10 приседаний', reward: '🏃' },
        { text: 'Посмотри в окно', reward: '🪟' }
    ],

    // Получить случайную микро-цель
    getRandomMicroGoal() {
        return this.microGoals[
            Math.floor(Math.random() * this.microGoals.length)
        ];
    },

    // 3. СИСТЕМА ОТВЛЕЧЕНИЙ (для гиперфокуса)
    distractionBreaks: [
        'Ты уже 20 минут занимаешься! Пора отдохнуть? 🌟',
        'Не забудь про воду! 💧',
        'Может быть, встать и размяться? 🧘',
        'Ты делаешь отличную работу! Продолжай! 💪',
        'Пора проверить прогресс? 📊'
    ],

    // 4. СИСТЕМА НАГРАЖДЕНИЯ
    rewards: {
        firstLesson: '🎖️ Первый урок дня!',
        allLessons: '🏆 Все уроки завершены!',
        weekStreak: '🔥 Неделя подряд!',
        monthProgress: '👑 Месячный прогресс!',
        halfwayThere: '🎯 Половина пути!',
        almostThere: '🚀 Финишная прямая!'
    },

    // 5. СИСТЕМА ВИЗУАЛЬНЫХ ПОДСКАЗОК
    showMotivationalNotification() {
        const phrase = this.getRandomPhrase();
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px 30px;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
            font-size: 1.1em;
            font-weight: 600;
            z-index: 10000;
            animation: slideIn 0.4s ease-out;
            max-width: 300px;
        `;
        notification.textContent = phrase;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.4s ease-out';
            setTimeout(() => notification.remove(), 400);
        }, 3000);
    },

    // 6. СИСТЕМА ТАЙМЕРА ОТВЛЕЧЕНИЙ
    startDistractionTimer(minutes = 20) {
        setTimeout(() => {
            const message = this.distractionBreaks[
                Math.floor(Math.random() * this.distractionBreaks.length)
            ];
            alert(message);
        }, minutes * 60 * 1000);
    },

    // 7. СИСТЕМА ВИЗУАЛЬНОГО ФОКУСА
    enableFocusMode() {
        document.body.style.filter = 'brightness(0.95)';
        document.querySelector('.footer').style.opacity = '0.5';
    },

    disableFocusMode() {
        document.body.style.filter = 'brightness(1)';
        document.querySelector('.footer').style.opacity = '1';
    },

    // 8. СИСТЕМА ОТСЛЕЖИВАНИЯ ВРЕМЕНИ
    trackSessionTime() {
        const startTime = Date.now();
        return {
            getElapsedTime() {
                const elapsed = Math.floor((Date.now() - startTime) / 1000);
                const minutes = Math.floor(elapsed / 60);
                const seconds = elapsed % 60;
                return `${minutes}:${seconds.toString().padStart(2, '0')}`;
            },
            getElapsedMinutes() {
                return Math.floor((Date.now() - startTime) / 60000);
            }
        };
    },

    // 9. СИСТЕМА ПОЗИТИВНОГО ПОДКРЕПЛЕНИЯ
    celebrateSmallWins() {
        const wins = [
            '🎉 Отлично!',
            '✨ Супер!',
            '🌟 Потрясающе!',
            '💯 Идеально!',
            '🚀 Вперед!'
        ];
        const win = wins[Math.floor(Math.random() * wins.length)];
        console.log(win);
        return win;
    },

    // 10. СИСТЕМА ГИБКОГО РАСПИСАНИЯ
    suggestFlexibleSchedule() {
        const times = [
            '9:00 - 10:00',
            '10:30 - 11:30',
            '14:00 - 15:00',
            '15:30 - 16:30',
            '18:00 - 19:00',
            '19:30 - 20:30'
        ];
        return times[Math.floor(Math.random() * times.length)];
    },

    // 11. СИСТЕМА МИНИМИЗАЦИИ ОТВЛЕЧЕНИЙ
    hideDistractions() {
        const style = document.createElement('style');
        style.textContent = `
            .debug-menu { display: none !important; }
            .footer { opacity: 0.3; }
        `;
        document.head.appendChild(style);
    },

    showDistractions() {
        const style = document.createElement('style');
        style.textContent = `
            .debug-menu { display: block !important; }
            .footer { opacity: 1; }
        `;
        document.head.appendChild(style);
    },

    // 12. СИСТЕМА НАПОМИНАНИЙ О ПЕРЕРЫВАХ
    scheduleBreakReminders() {
        setInterval(() => {
            const hour = new Date().getHours();
            if (hour >= 9 && hour <= 21) {
                const chance = Math.random();
                if (chance < 0.1) { // 10% шанс каждый час
                    this.showMotivationalNotification();
                }
            }
        }, 60 * 60 * 1000); // Каждый час
    },

    // 13. СИСТЕМА ОТСЛЕЖИВАНИЯ НАСТРОЕНИЯ
    moodTracker: {
        moods: ['😊', '😐', '😔', '😤', '🤗'],
        currentMood: null,

        setMood(emoji) {
            this.currentMood = emoji;
            localStorage.setItem('currentMood', emoji);
        },

        getMood() {
            return localStorage.getItem('currentMood') || '😊';
        }
    },

    // 14. СИСТЕМА АДАПТИВНОЙ СЛОЖНОСТИ
    adjustDifficulty() {
        const stats = UTILS.getStatistics();
        if (!stats) return 'normal';

        const percentage = stats.percentage;
        if (percentage < 25) return 'easy'; // Легче в начале
        if (percentage < 50) return 'normal';
        if (percentage < 75) return 'medium';
        return 'hard'; // Сложнее в конце
    },

    // 15. СИСТЕМА СОЦИАЛЬНОЙ ПОДДЕРЖКИ
    shareProgress() {
        const stats = UTILS.getStatistics();
        if (!stats) return;

        const message = `Я прошел ${stats.completedSteps} из ${stats.totalSteps} шагов подготовки к экзамену на водительские права! Прогресс: ${stats.percentage}% 🚗💨`;
        
        // Копировать в буфер обмена
        navigator.clipboard.writeText(message).then(() => {
            alert('Сообщение скопировано! Поделись с друзьями! 📱');
        });
    }
};

// Инициализация СДВГ-функций при загрузке
document.addEventListener('DOMContentLoaded', () => {
    // Показать мотивирующее сообщение при загрузке
    setTimeout(() => {
        ADHDFeatures.showMotivationalNotification();
    }, 1000);

    // Запустить напоминания о перерывах
    ADHDFeatures.scheduleBreakReminders();
});
