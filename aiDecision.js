// Texas Hold'em KI-Wahrscheinlichkeitsberechnung und Aktionsentscheidung

// Funktion zur Berechnung der Handstärke basierend auf Hole Cards und Community Cards
function calculateHandStrength(holeCards, communityCards) {
    // Platzhalter: Eine echte Implementierung würde alle möglichen Hände simulieren und die Gewinnwahrscheinlichkeit berechnen.
    // Zur Vereinfachung hier ein zufälliger Wert zwischen 0 und 1.
    return Math.random();
}

// Funktion zur Entscheidung der KI basierend auf Handstärke und Bluff-Strategie
function determineAction(handStrength, currentBet, pot, chips, bluffChance = 0.3) {
    const callAmount = currentBet;

    // Bluff-Logik: Nur bluffen, wenn die Handstärke schlecht ist
    if (handStrength < 0.3 && Math.random() < bluffChance) {
        console.log("Bluff: Die KI blufft trotz schlechter Chancen.");
        return { action: "raise", amount: Math.min(pot, chips / 2) }; // Bluff mit einem halben Pot oder weniger
    }

    // Aktionen basierend auf Handstärke
    if (handStrength > 0.7) {
        // Starke Hand -> Erhöhen
        const raiseAmount = Math.min(currentBet * 2, chips);
        console.log(`Starke Hand: Die KI erhöht auf ${raiseAmount}.`);
        return { action: "raise", amount: raiseAmount };
    } else if (handStrength > 0.4) {
        // Mittlere Hand -> Call
        if (callAmount <= chips) {
            console.log("Mittlere Hand: Die KI callt.");
            return { action: "call", amount: callAmount };
        } else {
            console.log("Mittlere Hand: Nicht genügend Chips zum Callen, die KI foldet.");
            return { action: "fold" };
        }
    } else {
        // Schwache Hand -> Fold
        console.log("Schwache Hand: Die KI foldet.");
        return { action: "fold" };
    }
}

// Verbindung zur bestehenden Datei: Entscheidung basierend auf den Karten treffen
export function makeAiDecision(holeCards, communityCards, currentBet, pot, chips) {
    console.log("Berechnung der KI-Entscheidung...");

    // Handstärke berechnen
    const handStrength = calculateHandStrength(holeCards, communityCards);
    console.log(`Berechnete Handstärke: ${handStrength.toFixed(2)}`);

    // Aktion bestimmen
    return determineAction(handStrength, currentBet, pot, chips);
}
