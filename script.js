import { makeDecision, executeDecision } from "./ai.js";

const fullscreenEnter = document.getElementById("fullscreen-enter");
const fullscreenExit = document.getElementById("fullscreen-exit");

// Intro-Overlay entfernen
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        const introOverlay = document.getElementById("intro-overlay");
        if (introOverlay) {
            introOverlay.remove();
        }
    }, 10000);
});

// Vollbild aktivieren
fullscreenEnter?.addEventListener("click", () => {
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
    }
    fullscreenEnter.style.display = "none";
    fullscreenExit.style.display = "block";
});

// Vollbild deaktivieren
fullscreenExit?.addEventListener("click", () => {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
    fullscreenEnter.style.display = "block";
    fullscreenExit.style.display = "none";
});

// Spielerinformationen
const players = [
    { id: "player1", name: "You", chips: 2500, bet: 0, active: true },
    { id: "player2", name: "Player 2", chips: 2500, bet: 0, active: true },
    { id: "player3", name: "Player 3", chips: 2500, bet: 0, active: true },
    { id: "player4", name: "Player 4", chips: 2500, bet: 0, active: true },
    { id: "player5", name: "Player 5", chips: 2500, bet: 0, active: true },
    { id: "player6", name: "Player 6", chips: 2500, bet: 0, active: true },
];

let currentBet = 0;
let pot = 0;
let currentPlayerIndex = 0;
let dealerIndex = 0;

// Deck erstellen
function createDeck() {
    const suits = ["♥", "♦", "♠", "♣"];
    const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    const deck = [];
    suits.forEach(suit => {
        values.forEach(value => {
            const color = suit === "♥" || suit === "♦" ? "red" : "black";
            deck.push({ value, suit, color });
        });
    });
    return deck;
}

// Deck mischen
function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

// Karten rendern
function renderCard(card, hidden = false) {
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card");

    if (hidden) {
        cardDiv.style.backgroundImage = "url('assets/pokerkarte_rueck.jpg')";
        cardDiv.style.backgroundSize = "cover";
        return cardDiv;
    }

    if (card.color === "red") {
        cardDiv.classList.add("red");
    } else {
        cardDiv.classList.add("black");
    }

    cardDiv.innerHTML = `
        <div class="value">${card.value}</div>
        <div class="suit">${card.suit}</div>
    `;
    return cardDiv;
}

// Karten mit Animation verteilen
function dealCards(deck, players) {
    let animationDelay = 0;

    players.forEach((player, playerIndex) => {
        const playerCards = document.querySelector(`#${player.id} .cards`);

        if (playerCards && playerCards.childNodes.length < 2) {
            // Nur Karten geben, wenn der Spieler weniger als 2 Karten hat
            for (let i = 0; i < 2; i++) {
                setTimeout(() => {
                    const card = deck.pop();
                    const cardElement = renderCard(card, playerIndex !== 0);
                    cardElement.style.animationName = "dealCard";
                    cardElement.style.animationDuration = "1s";
                    playerCards.appendChild(cardElement);
                }, animationDelay * 1000);
                animationDelay += 0.5;
            }
        }
    });

    // Starte das Spiel, nachdem alle Karten verteilt sind
    setTimeout(startGame, animationDelay * 1000);
}

// Marker zufällig verteilen
function assignMarkers() {
    dealerIndex = Math.floor(Math.random() * players.length);
    const sbIndex = (dealerIndex + 1) % players.length;
    const bbIndex = (dealerIndex + 2) % players.length;

    updateMarkers(players, dealerIndex, sbIndex, bbIndex);

    currentPlayerIndex = (bbIndex + 1) % players.length; // Spieler nach BB beginnt
}

// Marker aktualisieren
function updateMarkers(players, dealerIndex, sbIndex, bbIndex) {
    players.forEach((player, index) => {
        const marker = document.querySelector(`#marker-${player.id}`);
        if (marker) {
            marker.className = "marker";
            marker.style.visibility = "hidden";

            if (index === dealerIndex) {
                marker.classList.add("d");
                marker.textContent = "D";
                marker.style.visibility = "visible";
            } else if (index === sbIndex) {
                marker.classList.add("sb");
                marker.textContent = "SB";
                marker.style.visibility = "visible";
            } else if (index === bbIndex) {
                marker.classList.add("bb");
                marker.textContent = "BB";
                marker.style.visibility = "visible";
            }
        }
    });
}

// Spielfluss starten
function startGame() {
    console.log(`Spiel startet. Spieler ${players[currentPlayerIndex].name} beginnt.`);
    nextTurn();
}

// Spieleraktionen
function check() {
    console.log(`${players[currentPlayerIndex].name} hat gecheckt.`);
    nextTurn();
}

function call() {
    const player = players[currentPlayerIndex];
    const callAmount = currentBet - player.bet;

    if (player.chips >= callAmount) {
        player.chips -= callAmount;
        player.bet += callAmount;
        pot += callAmount;
        console.log(`${player.name} hat ${callAmount} gecallt.`);
        updateUI();
        nextTurn();
    } else {
        console.error(`${player.name} hat nicht genug Chips zum Callen.`);
    }
}

function raise(amount) {
    const player = players[currentPlayerIndex];
    if (player.chips >= amount) {
        player.chips -= amount;
        player.bet += amount;
        currentBet = Math.max(currentBet, player.bet);
        pot += amount;
        console.log(`${player.name} hat um ${amount} erhöht.`);
        updateUI();
        nextTurn();
    } else {
        console.error(`${player.name} hat nicht genug Chips für ein Raise.`);
    }
}

function fold() {
    players[currentPlayerIndex].active = false;
    console.log(`${players[currentPlayerIndex].name} hat gepasst.`);
    nextTurn();
}

// Zum nächsten Spieler wechseln
function nextTurn() {
    do {
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    } while (!players[currentPlayerIndex].active);

    const currentPlayer = players[currentPlayerIndex];
    console.log(`Spieler ${currentPlayer.name} ist dran.`);

    if (currentPlayerIndex === 0) {
        console.log(`Dein Zug, ${currentPlayer.name}`);
    } else {
        const decision = makeDecision(currentPlayer, currentBet, pot);
        executeDecision(currentPlayer, decision, {
            check: check,
            call: call,
            raise: (amount) => raise(amount),
            fold: fold,
        });
    }
}

// UI aktualisieren
function updateUI() {
    document.getElementById("pot").textContent = `Pot: ${pot}`;
    players.forEach(player => {
        const playerElement = document.querySelector(`#${player.id} .chips`);
        const betElement = document.querySelector(`#${player.id} .bet`);
        if (playerElement) playerElement.textContent = `Chips: ${player.chips}`;
        if (betElement) betElement.textContent = `Bet: ${player.bet}`;
    });
}

// Event-Listener
document.getElementById("deal-cards")?.addEventListener("click", () => {
    const deck = shuffleDeck(createDeck());
    assignMarkers();
    dealCards(deck, players);
    updateUI();
});

document.getElementById("check-button")?.addEventListener("click", check);
document.getElementById("call-button")?.addEventListener("click", call);
document.getElementById("raise-button")?.addEventListener("click", () => {
    const sliderValue = document.getElementById("raise-amount")?.value;
    if (sliderValue) raise(parseInt(sliderValue, 10));
});
document.getElementById("fold-button")?.addEventListener("click", fold);
