// --- 1. КОНФИГУРАЦИЯ API И ГОРОДОВ ---

// !!! ЗАМЕНИ ЭТОТ URL НА URL, КОТОРЫЙ ТЕБЕ ДАЛ VERCEL !!!
const API_URL = "https://event-scraper-api-xxx.vercel.app/api/scrape"; 

// Города/Деревни в радиусе ~100 км от Hürth-Efferen
const CITIES_NEARBY = [
    "Hürth-Efferen",
    "Кёльн (Köln)",
    "Бонн (Bonn)",
    "Дюссельдорф (Düsseldorf)",
    "Аахен (Aachen)",
    "Брюль (Brühl)",
    // ... остальной список городов ...
];

// Темы по умолчанию (не меняем)
const DEFAULT_TOPICS = [
    "Open Air Концерты",
    // ... остальные темы ...
];

// Глобальная переменная для хранения загруженных событий
let loadedEvents = []; 

// --- 2. ФУНКЦИИ ДЛЯ РАБОТЫ С ДАТАМИ (Оставляем без изменений) ---
// ... (formatDate и calculateNextTwoWeekends остаются прежними) ...

// --- 3. ИНИЦИАЛИЗАЦИЯ ИНТЕРФЕЙСА (Обновляем вызов) ---

async function initializeApp() {
    // ... (Установка дат и создание чекбоксов остаются прежними) ...

    // Загрузка реальных данных
    await loadEventsFromAPI();
    
    // Автоматический поиск событий при загрузке (по датам по умолчанию)
    filterEvents();
}

// Новая функция для загрузки данных из твоего API
async function loadEventsFromAPI() {
    const listContainer = document.getElementById('events-list');
    listContainer.innerHTML = '<p>⏳ Загружаем актуальные данные о событиях...</p>';

    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`Ошибка сети или сервера API: ${response.status}`);
        }
        
        // Получаем чистый JSON от Claude
        const data = await response.json();
        
        // Добавляем к полученным данным имитацию города (поскольку Claude его не знает)
        loadedEvents = data.map(event => ({
            ...event,
            // Здесь должна быть логика определения города.
            // Пока используем заглушку, чтобы данные отобразились
            city: "Брюль (Brühl)", 
            // !!! В РЕАЛЬНОМ ПРОЕКТЕ НУЖНО ДОБАВИТЬ ЭТУ ИНФОРМАЦИЮ В ПРОМПТ ДЛЯ CLAUDE ИЛИ ПАРСИТЬ ОТДЕЛЬНО
        }));
        
        console.log("Данные успешно загружены:", loadedEvents);

    } catch (error) {
        console.error("Ошибка загрузки данных:", error);
        listContainer.innerHTML = `<p style="color: red;">❌ Ошибка при загрузке данных: ${error.message}. Проверьте консоль Vercel и API-ключ.</p>`;
        loadedEvents = [];
    }
}

document.addEventListener('DOMContentLoaded', initializeApp);


// --- 4. ОСНОВНАЯ ЛОГИКА ФИЛЬТРАЦИИ (Используем loadedEvents) ---

function filterEvents() {
    // 1. Получение фильтров (остается прежним)
    const startDateStr = document.getElementById('date-start').value;
    const endDateStr = document.getElementById('date-end').value;

    const selectedTopics = Array.from(document.querySelectorAll('input[name="topic"]:checked'))
                               .map(checkbox => checkbox.value);

    const startFilterDate = startDateStr;
    const endFilterDate = endDateStr;

    // 2. Фильтрация данных
    const filteredEvents = loadedEvents.filter(event => {
        const eventDateStr = event.date;

        // a) Фильтрация по дате
        const isDateMatch = eventDateStr >= startFilterDate && eventDateStr <= endFilterDate;
        
        // b) Фильтрация по теме
        const isTopicMatch = selectedTopics.includes(event.topic);
        
        // c) Фильтрация по географии (Проверяем, что город события есть в нашем списке)
        const isCityMatch = CITIES_NEARBY.includes(event.city);

        return isDateMatch && isTopicMatch && isCityMatch;
    });

    // 3. Отображение результатов
    displayEvents(filteredEvents);
}

// ... (displayEvents остается прежней, но теперь обрабатывает реальные данные) ...
