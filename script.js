
document.addEventListener("DOMContentLoaded", function () {
    let wheel = document.getElementById("wheel");
    let cardContainer = document.getElementById("cardContainer");
    let cardFront = document.querySelector(".card-front");
    let cardBack = document.querySelector(".card-back");
    let spinButton = document.getElementById("spinButton");

    let modeScreen = document.getElementById("modeScreen");
    let gameScreen = document.getElementById("gameScreen");
    let settingsScreen = document.getElementById("settingsScreen");
    let helpScreen = document.getElementById("helpScreen");
    let mainScreen = document.getElementById("mainScreen");

    let selectedMode = null;
    let cards = {};
    let finalLocations = {};

    // Загружаем данные из JSON
    fetch("final_game_data.json")
        .then(response => response.json())
        .then(data => {
            cards = data.cards;
            finalLocations = data.final_locations;
        })
        .catch(error => console.error("Ошибка загрузки JSON:", error));

    // Функция для показа нужного экрана
    function showScreen(screenId) {
        document.querySelectorAll(".screen").forEach(screen => screen.classList.add("hidden"));
        document.getElementById(screenId).classList.remove("hidden");
    }

    function showModes() { showScreen("modeScreen"); }
    function openSettings() { showScreen("settingsScreen"); }
    function openHelp() { showScreen("helpScreen"); }
    function goBack() { showScreen("mainScreen"); }

    // Выбор режима
    function selectMode(mode) {
        selectedMode = mode;
        showScreen("gameScreen");
        console.log("Выбран режим:", selectedMode);
    }

    // Кручение колеса
    function spinWheel() {
        if (!selectedMode || !cards[selectedMode] || cards[selectedMode].length === 0) {
            alert("Выберите режим перед тем, как крутить колесо!");
            return;
        }

        let angle = Math.floor(Math.random() * 3600) + 1800; // Случайный угол вращения
        wheel.style.transition = "transform 4s ease-out";
        wheel.style.transform = `rotate(${angle}deg)`;

        setTimeout(() => {
            revealCard();
        }, 4500);
    }

    // Выпадение задания
    function revealCard() {
        if (!selectedMode || !cards[selectedMode]) {
            alert("Ошибка: режим не выбран.");
            return;
        }

        let randomIndex = Math.floor(Math.random() * cards[selectedMode].length);
        let selectedCard = cards[selectedMode][randomIndex];
        let finalLocation = getFinalLocation(selectedCard.text);

        cardFront.innerText = selectedCard.text;
        cardBack.innerText = `Финиш: ${finalLocation}`;

        cardContainer.classList.remove("hidden");
        cardContainer.classList.add("flip");
    }

    // Определение места финала
    function getFinalLocation(taskText) {
        for (let key in finalLocations.mapping) {
            if (taskText.includes(key)) {
                let options = finalLocations.locations[finalLocations.mapping[key]];
                return options[Math.floor(Math.random() * options.length)];
            }
        }
        let allOptions = Object.values(finalLocations.locations).flat();
        return allOptions[Math.floor(Math.random() * allOptions.length)];
    }

    // Привязка событий к кнопкам
    document.getElementById("selectModeBtn").addEventListener("click", showModes);
    document.getElementById("settingsBtn").addEventListener("click", openSettings);
    document.getElementById("helpBtn").addEventListener("click", openHelp);
    document.getElementById("backBtn").addEventListener("click", goBack);
    document.getElementById("spinButton").addEventListener("click", spinWheel);

    // Привязываем выбор режима к кнопкам внутри modeScreen
    document.querySelectorAll(".mode-option").forEach(button => {
        button.addEventListener("click", function () {
            let mode = this.getAttribute("data-mode");
            selectMode(mode);
        });
    });

    window.selectMode = selectMode;
});
