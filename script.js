const audioFiles = {
  dealCards: new Audio("sounds/deal-cards.mp3"),
  intro: new Audio("sounds/intro.mp3"),
  players: {
    player1: {
      fold: new Audio("sounds/player-1-fold.mp3"),
      check: new Audio("sounds/player-1-check.mp3"),
      call: new Audio("sounds/player-1-call.mp3"),
      raise: new Audio("sounds/player-1-raise.mp3"),
      allin: new Audio("sounds/player-1-all-in.mp3"),
    },
    player2: {
      fold: new Audio("sounds/player-2-fold.mp3"),
      check: new Audio("sounds/player-2-check.mp3"),
      call: new Audio("sounds/player-2-call.mp3"),
      raise: new Audio("sounds/player-2-raise.mp3"),
      allin: new Audio("sounds/player-2-all-in.mp3"),
    },
    player3: {
      fold: new Audio("sounds/player-3-fold.mp3"),
      check: new Audio("sounds/player-3-check.mp3"),
      call: new Audio("sounds/player-3-call.mp3"),
      raise: new Audio("sounds/player-3-raise.mp3"),
      allin: new Audio("sounds/player-3-all-in.mp3"),
    },
    player4: {
      fold: new Audio("sounds/player-4-fold.mp3"),
      check: new Audio("sounds/player-4-check.mp3"),
      call: new Audio("sounds/player-4-call.mp3"),
      raise: new Audio("sounds/player-4-raise.mp3"),
      allin: new Audio("sounds/player-4-all-in.mp3"),
    },
    player5: {
      fold: new Audio("sounds/player-5-fold.mp3"),
      check: new Audio("sounds/player-5-check.mp3"),
      call: new Audio("sounds/player-5-call.mp3"),
      raise: new Audio("sounds/player-5-raise.mp3"),
      allin: new Audio("sounds/player-5-all-in.mp3"),
    },
    player6: {
      fold: new Audio("sounds/player-6-fold.mp3"),
      check: new Audio("sounds/player-6-check.mp3"),
      call: new Audio("sounds/player-6-call.mp3"),
      raise: new Audio("sounds/player-6-raise.mp3"),
      allin: new Audio("sounds/player-6-all-in.mp3"),
    },
  },
};

/**
 * Universelle Funktion zur Steuerung von Audio-Eigenschaften.
 * @param {HTMLAudioElement} audioElement - Das Audio-Element.
 * @param {Object} options - Optionen für das Audio-Element.
 * @param {number} [options.volume] - Lautstärke (0 bis 1).
 * @param {boolean} [options.muted] - Ob das Audio stummgeschaltet ist.
 * @param {boolean} [options.play] - Ob das Audio abgespielt werden soll.
 * @param {boolean} [options.pause] - Ob das Audio pausiert werden soll.
 */
function setAudioProperties(audioElement, options = {}) {
  if ("volume" in options) audioElement.volume = options.volume;
  if ("muted" in options) audioElement.muted = options.muted;
  if (options.play && audioElement.paused) audioElement.play();
  if (options.pause && !audioElement.paused) audioElement.pause();
}

const blindLevels = [
  { players: 6, sb: 25, bb: 50 },
  { players: 5, sb: 50, bb: 100 },
  { players: 4, sb: 100, bb: 200 },
  { players: 3, sb: 200, bb: 400 },
  { players: 2, sb: 400, bb: 800 },
];
let currentSB = 0;
let currentBB = 0;

function updateBlinds() {
  const activePlayers = players.filter((player) => player.active).length;
  const level = blindLevels.find((b) => b.players === activePlayers);
  if (level) {
    currentSB = level.sb;
    currentBB = level.bb;
  }
}

// Spieleraktionen mit Sounds
let soundPlaying = false;
const fullscreenEnter = document.getElementById("fullscreen-enter");
const fullscreenExit = document.getElementById("fullscreen-exit");
let soundMuted = false; // Steuert, ob Sounds abgespielt werden
let aiSpeed = 2000; // Standardwert: 2 Sekunden (normale Geschwindigkeit)

// intro
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const introOverlay = document.getElementById("intro-overlay");
    if (introOverlay) {
      introOverlay.remove();
    }
  }, 10000); // Entfernt nach 2 Sekunden
});
function toggleMuteAll(audioObject, mute) {
  Object.values(audioObject).forEach((audio) => {
    if (audio instanceof Audio) {
      audio.muted = mute; // Stummschalten oder aktivieren
    } else if (audio && typeof audio === "object") {
      toggleMuteAll(audio, mute); // Rekursiver Aufruf für verschachtelte Objekte
    }
  });
}

function setVolumeAll(audioObject, volume) {
  Object.values(audioObject).forEach((audio) => {
    if (audio instanceof Audio) {
      audio.volume = volume;
    } else if (typeof audio === "object") {
      setVolumeAll(audio, volume); // Rekursiver Aufruf für verschachtelte Objekte
    }
  });
}

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
//zoomen
const zoomTargets = document.querySelectorAll("#poker-table, #controls"); // Selektiere die relevanten Bereiche
let currentScale = 1; // Initialer Skalierungsfaktor

document.getElementById("zoom-in").addEventListener("click", function () {
  currentScale += 0.1; // Skaliere um 10% nach oben
  zoomTargets.forEach((target) => {
    target.style.transform = `scale(${currentScale})`;
    target.style.transformOrigin = "center"; // Skalierung vom Zentrum aus
  });
});

document.getElementById("zoom-out").addEventListener("click", function () {
  currentScale = Math.max(currentScale - 0.1, 0.5); // Skaliere um 10% nach unten, aber min. 50%
  zoomTargets.forEach((target) => {
    target.style.transform = `scale(${currentScale})`;
    target.style.transformOrigin = "center"; // Skalierung vom Zentrum aus
  });
});

document.getElementById("mute-button").addEventListener("click", () => {
  const muteButtonIcon = document.querySelector("#mute-button .material-icons");
  soundMuted = !soundMuted; // Umschalten des Mute-Zustands
  muteButtonIcon.textContent = soundMuted ? "volume_off" : "volume_up";

  // Alle Sounds stummschalten oder aktivieren
  toggleMuteAll(audioFiles, soundMuted);

  console.log(soundMuted ? "Ton ist ausgestellt" : "Ton ist an");
});

document.getElementById("music-button").addEventListener("click", () => {
  const musicButtonIcon = document.querySelector(
    "#music-button .material-icons"
  );
  const music = document.getElementById("background-music");
  if (music) {
    if (music.paused) {
      music.play();
      musicButtonIcon.textContent = "music_note";
      console.log("Musik gestartet");
    } else {
      music.pause();
      musicButtonIcon.textContent = "music_off";
      console.log("Musik pausiert");
    }
  } else {
    console.log("Hintergrundmusik nicht gefunden");
  }
});

// Modal öffnen
document.getElementById("settings-button").addEventListener("click", () => {
  const settingsModal = document.getElementById("settings-modal");
  settingsModal.style.display = "flex"; // Zeigt das Modal an
});

const players = [
  {
    id: "player1",
    name: "You",
    chips: 2500,
    bet: 0,
    active: true,
    isUser: true,
  },
  {
    id: "player2",
    name: "Player 2",
    chips: 2500,
    bet: 0,
    active: true,
    isUser: false,
  },
  {
    id: "player3",
    name: "Player 3",
    chips: 2500,
    bet: 0,
    active: true,
    isUser: false,
  },
  {
    id: "player4",
    name: "Player 4",
    chips: 2500,
    bet: 0,
    active: true,
    isUser: false,
  },
  {
    id: "player5",
    name: "Player 5",
    chips: 2500,
    bet: 0,
    active: true,
    isUser: false,
  },
  {
    id: "player6",
    name: "Player 6",
    chips: 2500,
    bet: 0,
    active: true,
    isUser: false,
  },
];

function displayAction(player, action) {
  //Funktion zur Anzeige von Aktionen im UI
  const betElement = document.querySelector(`#${player.id} .bet`);
  if (betElement) {
    betElement.textContent = action; // Aktionstext anzeigen
  }
}
function resetBetDisplay() {
  //Beim Start des Spiels solltest du sicherstellen, dass die div.bet-Felder zurückgesetzt
  players.forEach((player) => {
    const betElement = document.querySelector(`#${player.id} .bet`);
    if (betElement) {
      betElement.textContent = ""; // Textfeld zurücksetzen
    }
  });
}

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
// Marker zufällig verteilen
function assignMarkers() {
  console.log("Marker werden gesetzt.");
  dealerIndex = Math.floor(Math.random() * players.length);
  const sbIndex = (dealerIndex + 1) % players.length;
  const bbIndex = (dealerIndex + 2) % players.length;

  updateBlinds(); // Blinds basierend auf Spieleranzahl aktualisieren

  players[sbIndex].chips -= currentSB;
  players[sbIndex].bet = currentSB;

  players[bbIndex].chips -= currentBB;
  players[bbIndex].bet = currentBB;

  currentBet = currentBB;
  pot = currentSB + currentBB;

  updateMarkers(players, dealerIndex, sbIndex, bbIndex);

  currentPlayerIndex = (bbIndex + 1) % players.length;
  console.log(`Dealer: ${players[dealerIndex].name}, SB: ${players[sbIndex].name}, BB: ${players[bbIndex].name}`);
  console.log(`Nächster Spieler: ${players[currentPlayerIndex].name}`);
}

function updateMarkers(players, dealerIndex, sbIndex, bbIndex) {
  players.forEach((player, index) => {
    const marker = document.querySelector(`#marker-${player.id}`);
    if (!marker) {
      console.error(`Marker für ${player.id} nicht gefunden.`);
      return;
    }

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
  console.log(
    `Marker aktualisiert: Dealer=${players[dealerIndex].name}, SB=${players[sbIndex].name}, BB=${players[bbIndex].name}`
  );
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

      animationDelay += 0.3; // Verzögerung für die nächste Karte
    });
    console.log("Kartenverteilung abgeschlossen. Marker nicht erneut aktualisiert.");

  }

  // Warten, bis Kartenverteilung abgeschlossen ist
  setTimeout(() => {
    updateUI(); // UI aktualisieren
    console.log("Kartenverteilung abgeschlossen.");
    const currentPlayer = players[currentPlayerIndex];
    if (!currentPlayer.isUser) {
        console.log(`KI-Spieler ${currentPlayer.name} beginnt automatisch.`);
        nextPlayer();
    } else {
        console.log(`Dein Zug, ${currentPlayer.name}.`);
    }
}, animationDelay * 1000 + 500);
 // Sicherstellen, dass Animation abgeschlossen ist
}

// Marker aktualisieren

// Event-Listener initialisieren, wenn das Dokument geladen ist
document.addEventListener("DOMContentLoaded", () => {
  // Alle relevanten Elemente holen
  const speedSlider = document.getElementById("speed-slider");
  const musicVolumeSlider = document.getElementById("music-volume");
  const soundVolumeSlider = document.getElementById("sound-volume");
  const backgroundMusic = document.getElementById("background-music");

  // Fehler abfangen, falls ein Element fehlt
  if (
    !speedSlider ||
    !musicVolumeSlider ||
    !soundVolumeSlider ||
    !backgroundMusic
  ) {
    console.error("Ein oder mehrere DOM-Elemente fehlen!");
    return;
  }

  // Voreinstellungen setzen
  speedSlider.value = 2; // Standardwert für Spielgeschwindigkeit
  musicVolumeSlider.value = 100; // Standardwert für Musiklautstärke
  soundVolumeSlider.value = 100; // Standardwert für Soundlautstärke

  // Event-Listener für die Slider hinzufügen
  speedSlider.addEventListener("input", (event) => {
    const speedValue = parseInt(event.target.value, 10);
    switch (speedValue) {
      case 3: // Schnell
        aiSpeed = 1000; // 1 Sekunde
        break;
      case 2: // Normal
        aiSpeed = 5000; // 5 Sekunden
        break;
      case 1: // Langsam
        aiSpeed = 10000; // 10 Sekunden
        break;
    }
    console.log(`KI-Geschwindigkeit geändert: ${aiSpeed} ms`);
  });

  musicVolumeSlider.addEventListener("input", (event) => {
    const volume = event.target.value / 100;
    setAudioProperties(backgroundMusic, { volume });
    console.log(`Musiklautstärke geändert: ${volume}`);
  });

  soundVolumeSlider.addEventListener("input", (event) => {
    const volume = event.target.value / 100; // Skalierung auf 0 bis 1
    setVolumeAll(audioFiles, volume); // Rekursive Lautstärkeanpassung
    console.log(`Soundlautstärke geändert: ${volume}`);
  });
});

// Funktion, um den Bet-Slider zu initialisieren und zu synchronisieren
function initializeBetSlider() {
  const player1 = players.find((player) => player.id === "player1");
  if (!player1) return;

  const betSlider = document.getElementById("bet-slider");
  const betValue = document.getElementById("bet-value");

  betSlider.min = 0;
  betSlider.max = player1.chips;
  betSlider.value = 0;
  betValue.textContent = `0`;

  const updateBetValue = (value) => {
    betSlider.value = value;
    betValue.textContent = value;
  };

  betSlider.addEventListener("input", (event) =>
    updateBetValue(event.target.value)
  );
  document.getElementById("increase-slider").addEventListener("click", () => {
    if (+betSlider.value < player1.chips) updateBetValue(+betSlider.value + 1);
  });
  document.getElementById("decrease-slider").addEventListener("click", () => {
    if (+betSlider.value > 0) updateBetValue(+betSlider.value - 1);
  });
}

//dient dazu, dass der Sound nur einmal abgespielt wird
function playSoundOnce(audioFile) {
  if (!soundPlaying) {
    soundPlaying = true;
    audioFile.play().then(() => {
      soundPlaying = false;
    });
  }
}
function getPlayerSound(playerId, action) {
  const playerSounds = audioFiles.players[playerId];
  if (playerSounds && playerSounds[action]) {
    return playerSounds[action];
  }
  return audioFiles[action]; // Fallback auf allgemeinen Sound
}

/**
 * Entscheidung der KI basierend auf Spielstatus.
 * @param {Object} player - Der aktuelle Spieler.
 * @param {Number} currentBet - Der derzeitige höchste Einsatz.
 * @param {Number} pot - Der aktuelle Pot.
 * @returns {String} - Die Entscheidung der KI: "check", "call", "raise", "fold".
 */
function makeDecision(player, currentBet, pot) {
  const callAmount = currentBet - player.bet;

  if (callAmount > 0 && player.chips < callAmount) return "fold";
  if (callAmount > 0) return Math.random() < 0.7 ? "call" : "raise";

  const minRaise = currentBet + 10;
  const maxRaise = Math.min(
    player.chips,
    currentBet + Math.floor(Math.random() * (player.chips / 2))
  );
  if (Math.random() < 0.3 && maxRaise > minRaise) return "raise";

  return "check";
}

/**
 * Führt die Entscheidung der KI aus.
 * @param {Object} player - Der KI-Spieler.
 * @param {String} decision - Die Entscheidung der KI.
 * @param {Object} actions - Die verfügbaren Aktionen (check, call, raise, fold).
 */
function executeDecision(player, decision, actions) {
  console.log(`${player.name} entscheidet sich für: ${decision}`);

  switch (decision) {
    case "check":
      actions.check();
      break;
    case "call":
      actions.call();
      break;
    case "raise":
      const raiseAmount = Math.max(
        currentBet + 10,
        Math.floor(Math.random() * (player.chips / 2))
      ); // Mindestens currentBet + 10
      console.log(`${player.name} raist um ${raiseAmount}`);
      actions.raise(raiseAmount);
      break;
    case "fold":
      actions.fold();
      break;
    default:
      console.error("Ungültige Entscheidung:", decision);
  }
}

// Exportiere die Funktionen für die Verwendung in anderen Dateien
export { makeDecision, executeDecision };

function playSound(action) {
  const currentPlayer = players[currentPlayerIndex];
  const sound = getPlayerSound(currentPlayer.id, action);
  if (sound) {
    sound.play();
  }
}
function fold() {
  console.log("fold() Funktion aufgerufen");
  playSound("fold");
  const currentPlayer = players[currentPlayerIndex];
  displayAction(currentPlayer, "Fold"); // Aktion anzeigen
  console.log(`${currentPlayer.name} hat gefoldet.`);
  currentPlayer.active = false; // Spieler deaktivieren
  foldAnimation(currentPlayer.id); // Kartenanimation

  const activePlayers = players.filter((player) => player.active);
  if (activePlayers.length <= 1) {
    console.log(`Spieler ${activePlayers[0].name} gewinnt das Spiel!`);
    return; // Das Spiel endet, wenn nur ein Spieler übrig bleibt
  }
  updateBlinds(); // Aktualisiere Blinds basierend auf der Spielerzahl
  nextPlayer(); // Zum nächsten Spieler wechseln
}

function check() {
  console.log("check() Funktion aufgerufen");
  playSound("check");
  const currentPlayer = players[currentPlayerIndex];
  displayAction(currentPlayer, "Check"); // Aktion anzeigen
  console.log(`${currentPlayer.name} hat gecheckt.`);
  nextPlayer();
}
function call() {
  console.log("call() Funktion aufgerufen");
  playSound("call");

  const currentPlayer = players[currentPlayerIndex];
  const callAmount = currentBet - currentPlayer.bet; // Differenzbetrag berechnen

  if (callAmount > currentPlayer.chips) {
    console.error("Call-Betrag übersteigt verfügbare Chips!");
    return; // Abbrechen, wenn der Spieler nicht genug Chips hat
  }

  currentPlayer.chips -= callAmount; // Chips des Spielers reduzieren
  currentPlayer.bet += callAmount; // Einsatz des Spielers erhöhen
  pot += callAmount; // Pot erhöhen

  displayAction(currentPlayer, `Call: ${callAmount}`);
  console.log(`${currentPlayer.name} hat gecallt.`);
  updateUI(); // UI aktualisieren

  nextPlayer(); // Zum nächsten Spieler wechseln
}

function raise(amount) {
  console.log(`raise() Funktion aufgerufen mit Betrag: ${amount}`);
  playSound("raise");

  const currentPlayer = players[currentPlayerIndex];
  const minRaise = currentBet + currentBB; // Mindestraise ist der aktuelle Einsatz + BB

  if (amount < minRaise) {
    console.error(`Raise-Betrag muss mindestens ${minRaise} sein.`);
    return; // Abbrechen, wenn Raise ungültig ist
  }

  if (amount > currentPlayer.chips) {
    console.error("Raise-Betrag übersteigt verfügbare Chips!");
    return; // Abbrechen, wenn der Spieler nicht genug Chips hat
  }

  const raiseDiff = amount - currentPlayer.bet; // Zusätzlicher Betrag über den aktuellen Einsatz hinaus
  currentPlayer.chips -= raiseDiff; // Chips des Spielers reduzieren
  currentPlayer.bet = amount; // Setze den neuen Einsatz des Spielers
  currentBet = amount; // Aktualisiere den höchsten Einsatz
  pot += raiseDiff; // Erhöhe den Pot

  displayAction(currentPlayer, `Raise: ${amount}`);
  console.log(`${currentPlayer.name} erhöht auf ${amount} Chips.`);
  updateUI(); // UI aktualisieren

  nextPlayer(); // Zum nächsten Spieler wechseln
}

function allIn() {
  console.log("allIn() Funktion aufgerufen");
  playSound("allin");
  const currentPlayer = players[currentPlayerIndex];
  displayAction(currentPlayer, "All-In"); // Aktion anzeigen
  console.log(`${currentPlayer.name} geht All-In.`);
  currentPlayer.bet = currentPlayer.chips;
  currentPlayer.chips = 0;
  updateUI(); // UI aktualisieren
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
  players.forEach((player) => {
    const playerElement = document.getElementById(player.id);
    if (playerElement) {
      playerElement.classList.remove("highlight");
    }
  });

  do {
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
  } while (!players[currentPlayerIndex].active);

  const currentPlayer = players[currentPlayerIndex];
  const currentPlayerElement = document.getElementById(currentPlayer.id);

  if (currentPlayerElement) {
    currentPlayerElement.classList.add("highlight");
  }

  console.log(`Spieler ${currentPlayer.name} ist dran.`);

  if (currentPlayer.isUser) {
    console.log(`Dein Zug, ${currentPlayer.name}`);
  } else {
    console.log(`KI-Spieler ${currentPlayer.name} trifft eine Entscheidung.`);
    setTimeout(() => {
      const decision = makeDecision(currentPlayer, currentBet, pot);

      // Überprüfen, ob die Entscheidung gültig ist
      if (decision === "check" && currentBet > currentPlayer.bet) {
        console.error("Ungültige Entscheidung: Check bei laufendem Einsatz.");
        return; // Abbrechen, wenn die Entscheidung ungültig ist
      }

      executeDecision(currentPlayer, decision, {
        check: () => check(),
        call: () => call(),
        raise: (amount) => raise(amount),
        fold: () => fold(),
      });
    }, aiSpeed);
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
  document.getElementById(
    "current-blinds"
  ).textContent = `SB: ${currentSB} / BB: ${currentBB}`;
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

// Modal-Elemente
const settingsModal = document.getElementById("settings-modal");
const settingsButton = document.getElementById("settings-button");
const closeSettingsButton = document.getElementById("close-settings");

// Öffnen des Modals
settingsButton.addEventListener("click", () => {
  settingsModal.style.display = "flex";
});

// Schließen des Modals
closeSettingsButton.addEventListener("click", () => {
  settingsModal.style.display = "none";
});

// Modal schließen, wenn außerhalb geklickt wird
window.addEventListener("click", (event) => {
  if (event.target === settingsModal) {
    settingsModal.style.display = "none";
  }
});

// Initialisierung der Einstellungen
document.addEventListener("DOMContentLoaded", () => {
  const speedSlider = document.getElementById("speed-slider");
  const musicVolumeSlider = document.getElementById("music-volume");
  const soundVolumeSlider = document.getElementById("sound-volume");
  const backgroundMusic = document.getElementById("background-music");

  // Voreinstellungen setzen
  speedSlider.value = 2; // Standardwert für Spielgeschwindigkeit
  aiSpeed = 5000;
  musicVolumeSlider.value = 100; // Standardwert für Musiklautstärke
  soundVolumeSlider.value = 100; // Standardwert für Soundlautstärke

  // Event-Listener für die Slider
  speedSlider.addEventListener("input", (event) => {
    const speedValue = parseInt(event.target.value, 10);
    switch (speedValue) {
      case 3: // Schnell
        aiSpeed = 1000; // 1 Sekunde
        break;
      case 2: // Normal
        aiSpeed = 5000; // 5 Sekunden
        break;
      case 1: // Langsam
        aiSpeed = 10000; // 10 Sekunden
        break;
    }
    console.log(`KI-Geschwindigkeit geändert: ${aiSpeed} ms`);
  });

  musicVolumeSlider.addEventListener("input", (event) => {
    const volume = event.target.value / 100; // Lautstärke skalieren (0 bis 1)
    backgroundMusic.volume = volume; // Lautstärke der Hintergrundmusik
    console.log(`Musiklautstärke geändert: ${volume}`);
  });

  // Event-Listener für den Sound-Lautstärke-Slider
  soundVolumeSlider.addEventListener("input", (event) => {
    const volume = event.target.value / 100; // Skalierung auf 0 bis 1
    setVolumeAll(audioFiles, volume); // Rekursive Lautstärkeanpassung
    console.log(`Soundlautstärke geändert: ${volume}`);
  });
});
function saveSettings() {
  const settings = {
    gameSpeed: document.getElementById("speed-slider").value,
    musicVolume: document.getElementById("music-volume").value,
    soundVolume: document.getElementById("sound-volume").value,
  };
  localStorage.setItem("gameSettings", JSON.stringify(settings));
  console.log("Einstellungen gespeichert:", settings);
}
function loadSettings() {
  const savedSettings = JSON.parse(localStorage.getItem("gameSettings"));
  if (savedSettings) {
    document.getElementById("speed-slider").value = savedSettings.gameSpeed;
    document.getElementById("music-volume").value = savedSettings.musicVolume;
    document.getElementById("sound-volume").value = savedSettings.soundVolume;

    // Anwenden der gespeicherten Einstellungen
    document.getElementById("background-music").volume =
      savedSettings.musicVolume / 100;
    Object.values(audioFiles).forEach((audio) => {
      audio.volume = savedSettings.soundVolume / 100;
    });

    console.log("Einstellungen geladen:", savedSettings);
  }
}

// Einstellungen beim Laden der Seite laden
document.addEventListener("DOMContentLoaded", () => {
  loadSettings();

  const speedSlider = document.getElementById("speed-slider");
  speedSlider.addEventListener("input", saveSettings);

  // Füge hier alle anderen DOM-Initialisierungen hinzu
  initializeBetSlider();
});
