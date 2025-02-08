
document.addEventListener("DOMContentLoaded", function () {
    let wheel = document.getElementById("wheel");
    let cardContainer = document.getElementById("cardContainer");
    let cardFront = document.querySelector(".card-front");
    let cardBack = document.querySelector(".card-back");
    let spinButton = document.querySelector(".btn-spin");

    let selectedMode = null;
    let cards = {};
    let finalLocations = {};

    // Загружаем данные из JSON
    fetch("final_game_data.json")
        .then(response => response.json())
        .then(data => {
            cards = data.cards;
            finalLocations = data.final_locations;
        });

    function selectMode(mode) {
        selectedMode = mode;
        document.getElementById("modeScreen").classList.add("hidden");
        document.getElementById("gameScreen").classList.remove("hidden");
    }

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

    function revealCard() {
        let randomIndex = Math.floor(Math.random() * cards[selectedMode].length);
        let selectedCard = cards[selectedMode][randomIndex];
        let finalLocation = getFinalLocation(selectedCard.text);

        cardFront.innerText = selectedCard.text;
        cardBack.innerText = `Финиш: ${finalLocation}`;

        cardContainer.classList.remove("hidden");
        cardContainer.classList.add("flip");
    }

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

    function goBack() {
        document.getElementById("gameScreen").classList.add("hidden");
        document.getElementById("modeScreen").classList.remove("hidden");
    }

    window.spinWheel = spinWheel;
    window.selectMode = selectMode;
    window.goBack = goBack;
});
