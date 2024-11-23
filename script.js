import { makeDecision, executeDecision } from "./ai.js";

const fullscreenEnter = document.getElementById("fullscreen-enter");
const fullscreenExit = document.getElementById("fullscreen-exit");

// intro
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const introOverlay = document.getElementById("intro-overlay");
    if (introOverlay) {
      introOverlay.remove();
    }
  }, 10000); // Entfernt nach 2 Sekunden
});

// Vollbild aktivieren
fullscreenEnter.addEventListener("click", () => {
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
fullscreenExit.addEventListener("click", () => {
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
  const values = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ];
  const deck = [];
  suits.forEach((suit) => {
    values.forEach((value) => {
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
  // Sound abspielen
  const dealCardsSound = new Audio("sounds/deal-cards.mp3");
  dealCardsSound.play();
  // Überprüfen, ob alle Spieler bereits 2 Karten haben
  const allPlayersHaveCards = players.every((player) => {
    const playerCards = document.querySelector(`#${player.id} .cards`);
    return playerCards && playerCards.childNodes.length >= 2;
  });

  if (allPlayersHaveCards) {
    console.log(
      "Alle Spieler haben bereits Karten. Keine weiteren Karten werden verteilt."
    );
    return; // Kartenvergabe überspringen, wenn alle Spieler Karten haben
  }

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
        cardElement.style.animationDuration = "0.6s";

        playerCards.appendChild(cardElement); // Karte zum Spieler hinzufügen
      }, animationDelay * 1000); // Zeitverzögerung in Millisekunden

      animationDelay += 0.3; // Nächste Karte 0.5 Sekunden später
    });
  }
}

// Marker zufällig verteilen
function assignMarkers() {
  dealerIndex = Math.floor(Math.random() * players.length);
  const sbIndex = (dealerIndex + 1) % players.length;
  const bbIndex = (dealerIndex + 2) % players.length;

  updateMarkers(players, dealerIndex, sbIndex, bbIndex);

  // Spieler nach dem Big Blind beginnt
  currentPlayerIndex = (bbIndex + 1) % players.length;

  console.log(`Spieler ${players[currentPlayerIndex].name} beginnt.`);
  highlightCurrentPlayer(); // Markiere den Spieler, der an der Reihe ist
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

// Event-Listener initialisieren, wenn das Dokument geladen ist
document.addEventListener("DOMContentLoaded", () => {
  initializeBetSlider();
});
// Funktion, um den Bet-Slider zu initialisieren und zu synchronisieren
function initializeBetSlider() {
  const player1 = players.find((player) => player.id === "player1"); // Finde Player 1
  const betSlider = document.getElementById("bet-slider");
  const betValue = document.getElementById("bet-value");
  const increaseButton = document.getElementById("increase-slider");
  const decreaseButton = document.getElementById("decrease-slider");

  // Setze den Slider auf den Bereich von 0 bis Chips von Player 1
  if (player1) {
    betSlider.min = 0;
    betSlider.max = player1.chips;
    betSlider.value = 0; // Standardwert ist 0
    betValue.textContent = `0`; // Initialisiere Anzeige
  }

  // Aktualisiere die Anzeige des Slider-Werts
  function updateBetValue(value) {
    betValue.textContent = value; // Zeige den aktuellen Wert
    betSlider.value = value; // Synchronisiere den Slider
  }

  // Event-Listener für den Slider
  betSlider.addEventListener("input", (event) => {
    const sliderValue = event.target.value;
    updateBetValue(sliderValue); // Zeige den Slider-Wert an
  });

  // Event-Listener für den Erhöhen-Button
  increaseButton.addEventListener("click", () => {
    let currentValue = parseInt(betSlider.value, 10);
    if (currentValue < player1.chips) {
      currentValue += 1; // Erhöhe den Wert um 1
      updateBetValue(currentValue);
    }
  });

  // Event-Listener für den Verringern-Button
  decreaseButton.addEventListener("click", () => {
    let currentValue = parseInt(betSlider.value, 10);
    if (currentValue > 0) {
      currentValue -= 1; // Verringere den Wert um 1
      updateBetValue(currentValue);
    }
  });
}
const audioFiles = {
  fold: new Audio("sounds/fold.mp3"),
  check: new Audio("sounds/check.mp3"),
  call: new Audio("sounds/call.mp3"),
  raise: new Audio("sounds/raise.mp3"),
  allin: new Audio("sounds/allin.mp3"),
  dealCards: new Audio("sounds/deal-cards.mp3"),
};

// Spieleraktionen mit Sounds
let soundPlaying = false;

function playSoundOnce(audioFile) {
  if (!soundPlaying) {
    soundPlaying = true;
    audioFile.play().then(() => {
      soundPlaying = false;
    });
  }
}
function check() {
  console.log("check() Funktion aufgerufen");
  playSoundOnce(audioFiles.check); // Verhindert doppeltes Abspielen
  console.log(`${players[currentPlayerIndex].name} hat gecheckt.`);
  nextPlayer();
}

function call() {
  console.log("call() Funktion aufgerufen");
  playSoundOnce(audioFiles.call); // Verhindert doppeltes Abspielen
  console.log(`${players[currentPlayerIndex].name} hat gecallt.`);
  nextPlayer();
}

function fold() {
  console.log("fold() Funktion aufgerufen");
  playSoundOnce(audioFiles.fold); // Verhindert doppeltes Abspielen
  console.log(`${players[currentPlayerIndex].name} hat gefoldet.`);
  players[currentPlayerIndex].active = false; // Spieler deaktivieren
  foldAnimation(players[currentPlayerIndex].id); // Kartenanimation
  nextPlayer();
}

function raise(amount) {
  console.log(`raise() Funktion aufgerufen mit Betrag: ${amount}`);
  playSoundOnce(audioFiles.raise); // Verhindert doppeltes Abspielen
  console.log(`${players[currentPlayerIndex].name} erhöht um ${amount} Chips.`);
  nextPlayer();
}

// Karten ablegen (Fold-Animation)
function foldAnimation(playerId) {
  const playerCards = document.querySelector(`#${playerId} .cards`);
  if (playerCards) {
    playerCards.childNodes.forEach((card) => {
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
  // Finde den nächsten aktiven Spieler
  do {
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
  } while (!players[currentPlayerIndex].active);

  const currentPlayer = players[currentPlayerIndex];
  console.log(`Spieler ${currentPlayer.name} ist dran.`);

  highlightCurrentPlayer(); // Aktualisiere den Rand für den aktuellen Spieler

  if (currentPlayerIndex !== 0) {
    console.log(`KI-Spieler ${currentPlayer.name} trifft eine Entscheidung.`);
    const decision = makeDecision(currentPlayer, currentBet, pot);

    // Überprüfen, ob die richtige Aktion aufgerufen wird
    console.log(`KI-Entscheidung: ${decision}`);
    executeDecision(currentPlayer, decision, {
      check: () => {
        console.log("KI führt Check aus");
        check();
      },
      call: () => {
        console.log("KI führt Call aus");
        call();
      },
      raise: (amount) => {
        console.log(`KI führt Raise um ${amount} aus`);
        raise(amount);
      },
      fold: () => {
        console.log("KI führt Fold aus");
        fold();
      },
    });
  } else {
    console.log(`Dein Zug, ${currentPlayer.name}`);
  }
}

function highlightCurrentPlayer() {
  // Entferne den Rand von allen Spielern
  players.forEach((player) => {
    const playerElement = document.getElementById(player.id);
    if (playerElement) {
      playerElement.classList.remove("highlight");
    }
  });

  // Setze den Rand für den aktuellen Spieler
  const currentPlayer = players[currentPlayerIndex];
  const currentPlayerElement = document.getElementById(currentPlayer.id);
  if (currentPlayerElement) {
    currentPlayerElement.classList.add("highlight");
  }
}

// UI aktualisieren
function updateUI() {
  document.getElementById("pot").textContent = `Pot: ${pot}`;
  players.forEach((player) => {
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

document.getElementById("fold-button").addEventListener("click", () => {
  fold(); // Ruft die fold-Funktion auf, die den Sound abspielt
});


document.getElementById("check-button").addEventListener("click", () => {
  check(); // Ruft die check-Funktion auf, die den Sound abspielt
});

document.getElementById("call-button").addEventListener("click", () => {
  call(); // Ruft die call-Funktion auf, die den Sound abspielt
});

document.getElementById("raise-button").addEventListener("click", () => {
  const betValueElement = document.getElementById("bet-value");

  // Sicherheitsüberprüfung: Gibt es das Element?
  if (!betValueElement) {
    console.error("Das Element mit der ID 'bet-value' wurde nicht gefunden.");
    return;
  }

  // Wert aus dem Span extrahieren
  const raiseAmount = parseInt(betValueElement.textContent, 10) || 0; // Standardwert 0 bei Fehler
  console.log(`Raise-Button geklickt. Betrag: ${raiseAmount}`);

  raise(raiseAmount); // Ruft die raise-Funktion mit dem Betrag auf
});


betSlider.addEventListener("input", (event) => {
  const betValueElement = document.getElementById("bet-value");
  if (betValueElement) {
    betValueElement.textContent = event.target.value; // Aktualisiert den Span-Wert
  }
});
