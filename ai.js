/**
 * Entscheidung der KI basierend auf Spielstatus.
 * @param {Object} player - Der aktuelle Spieler.
 * @param {Number} currentBet - Der derzeitige höchste Einsatz.
 * @param {Number} pot - Der aktuelle Pot.
 * @returns {String} - Die Entscheidung der KI: "check", "call", "raise", "fold".
 */
function makeDecision(player, currentBet, pot) {
    const callAmount = currentBet - player.bet;
    const raiseAmount = Math.floor(Math.random() * (player.chips / 10)); // Zufälliger Raise bis 10% der Chips

    // Aggressives Verhalten bei großem Pot
    if (pot > player.chips * 2) {
        return Math.random() < 0.5 ? "call" : "raise"; // 50% Chance auf Call oder Raise
    }

    // Defensives Verhalten bei wenigen Chips
    if (player.chips < currentBet / 2) {
        return "fold"; // Passen bei wenig Chips
    }

    // Checken, wenn möglich
    if (callAmount === 0) {
        return "check";
    }

    // Mit einer kleinen Wahrscheinlichkeit raisen
    if (Math.random() < 0.3 && player.chips > callAmount + raiseAmount) {
        return "raise";
    }

    // Ansonsten callen, wenn möglich
    if (player.chips >= callAmount) {
        return "call";
    }

    // Wenn keine andere Option möglich ist, passen
    return "fold";
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
            const raiseAmount = Math.floor(Math.random() * (player.chips / 10)); // Zufälliger Raise-Betrag
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
