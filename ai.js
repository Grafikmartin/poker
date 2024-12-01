/**
 * Entscheidung der KI basierend auf Spielstatus.
 * @param {Object} player - Der aktuelle Spieler.
 * @param {Number} currentBet - Der derzeitige höchste Einsatz.
 * @param {Number} pot - Der aktuelle Pot.
 * @returns {String} - Die Entscheidung der KI: "check", "call", "raise", "fold".
 */
function makeDecision(player, currentBet, pot) {
    const callAmount = currentBet - player.bet;

    // 1. Call, wenn nötig und möglich
    if (callAmount > 0) {
        if (player.chips >= callAmount) {
            return Math.random() < 0.7 ? "call" : "raise"; // 70% Call, 30% Raise
        } else {
            return "fold"; // Fold bei zu wenig Chips
        }
    }

    // 2. Raise, wenn sinnvoll
    const minRaise = currentBet + 10; // Mindestbetrag für Raise
    const maxRaise = Math.min(player.chips, currentBet + Math.floor(Math.random() * (player.chips / 2)));
    if (Math.random() < 0.3 && maxRaise > minRaise) {
        return "raise";
    }

    // 3. Check, wenn kein Einsatz notwendig ist
    if (callAmount === 0) {
        return "check";
    }

    // 4. Fold, wenn keine bessere Aktion möglich
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
            player.bet += raiseAmount; // Aktualisiere den Einsatz des Spielers
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
