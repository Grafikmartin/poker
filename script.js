import { makeDecision, executeDecision } from "./ai.js";

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
    let animationDelay = 0; // Verzögerung für jede Karte

    // 2 Runden: Jeder Spieler erhält eine Karte pro Runde
    for (let round = 0; round < 2; round++) {
        players.forEach((player, playerIndex) => {
            setTimeout(() => {
                const playerCards = document.querySelector(`#${player.id} .cards`);
                if (!playerCards) {
                    console.error(`Kartenbereich für ${player.id} nicht gefunden!`);
                    return;
                }
                
                const card = deck.pop(); // Karte vom Deck ziehen
                const cardElement = renderCard(card, playerIndex !== 0); // Verdeckte Karten für KI

                // Animation aktivieren
                cardElement.style.animationName = "dealCard";
                cardElement.style.animationDuration = "1s";

                playerCards.appendChild(cardElement); // Karte zum Spieler hinzufügen
            }, animationDelay * 1000); // Zeitverzögerung in Millisekunden

            animationDelay += 0.5; // Nächste Karte 0.5 Sekunden später
        });
    }
}

// Marker zufällig verteilen
function assignMarkers() {
    dealerIndex = Math.floor(Math.random() * players.length);
    const sbIndex = (dealerIndex + 1) % players.length;
    const bbIndex = (dealerIndex + 2) % players.length;

    updateMarkers(players, dealerIndex, sbIndex, bbIndex);

    // Spieler nach BB beginnt
    currentPlayerIndex = (bbIndex + 1) % players.length;
    console.log(`Spieler ${players[currentPlayerIndex].name} beginnt.`);
}

// Marker aktualisieren
function updateMarkers(players, dealerIndex, sbIndex, bbIndex) {
    players.forEach((player, index) => {
        const marker = document.querySelector(`#marker-${player.id}`);
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
    });
}

// Spieleraktionen
function check() {
    console.log(`${players[currentPlayerIndex].name} hat gecheckt.`);
    nextPlayer();
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
        nextPlayer();
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
        nextPlayer();
    } else {
        console.error(`${player.name} hat nicht genug Chips für ein Raise.`);
    }
}

function fold() {
    players[currentPlayerIndex].active = false;
    console.log(`${players[currentPlayerIndex].name} hat gepasst.`);
    foldAnimation(players[currentPlayerIndex].id);
    updateUI();
    nextPlayer();
}

// Karten ablegen (Fold-Animation)
function foldAnimation(playerId) {
    const playerCards = document.querySelector(`#${playerId} .cards`);
    if (playerCards) {
        playerCards.childNodes.forEach(card => {
            card.style.transform = "translate(-100%, -100%) rotate(-45deg)";
            card.style.transition = "transform 0.5s ease";
        });
        setTimeout(() => {
            playerCards.innerHTML = "";
        }, 500);
    }
}

// Zum nächsten Spieler wechseln
function nextPlayer() {
    do {
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    } while (!players[currentPlayerIndex].active);

    const currentPlayer = players[currentPlayerIndex];
    console.log(`Spieler ${currentPlayer.name} ist dran.`);

    if (currentPlayerIndex !== 0) {
        const decision = makeDecision(currentPlayer, currentBet, pot);
        executeDecision(currentPlayer, decision, {
            check: check,
            call: call,
            raise: (amount) => raise(amount),
            fold: fold,
        });
    } else {
        console.log(`Dein Zug, ${currentPlayer.name}`);
    }
}

// UI aktualisieren
function updateUI() {
    document.getElementById("pot").textContent = `Pot: ${pot}`;
    players.forEach(player => {
        const playerElement = document.querySelector(`#${player.id} .chips`);
        const betElement = document.querySelector(`#${player.id} .bet`);
        playerElement.textContent = `Chips: ${player.chips}`;
        betElement.textContent = `Bet: ${player.bet}`;
    });
}

// Event-Listener
document.getElementById("deal-cards").addEventListener("click", () => {
    const deck = shuffleDeck(createDeck());
    assignMarkers();
    dealCards(deck, players);
    updateUI();
});

document.getElementById("check-button").addEventListener("click", check);
document.getElementById("call-button").addEventListener("click", call);
document.getElementById("raise-button").addEventListener("click", () => {
    const sliderValue = document.getElementById("raise-amount").value;
    raise(parseInt(sliderValue, 10));
});
document.getElementById("fold-button").addEventListener("click", fold);



