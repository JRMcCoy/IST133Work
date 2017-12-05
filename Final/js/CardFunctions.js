
var Hands = {
	HIGH_CARD: 0,
	PAIR: 1,
	TWO_PAIR: 2,
	THREE_OF_A_KIND: 3,
	STRAIGHT: 4,
	FLUSH: 5,
	FULL_HOUSE: 6,
	FOUR_OF_A_KIND: 7,
	STRAIGHT_FLUSH: 8,
	ROYAL_FLUSH: 9
};

function HandToString(handValue) {
	switch (handValue) {
		case Hands.HIGH_CARD:
			return "High Card";
		case Hands.PAIR:
			return "Pair";
		case Hands.TWO_PAIR:
			return "Two Pair";
		case Hands.THREE_OF_A_KIND:
			return "Three Of A Kind";
		case Hands.STRAIGHT:
			return "Straight";
		case Hands.FLUSH:
			return "Flush";
		case Hands.FULL_HOUSE:
			return "Full House";
		case Hands.FOUR_OF_A_KIND:
			return "Four Of A Kind";
		case Hands.STRAIGHT_FLUSH:
			return "Straight Flush"
		case Hands.ROYAL_FLUSH:
			return "Royal Flush";
	}
}

function DetermineHandValue(cards) {
	switch (cards.length) {
		case 2:
		
		break;
		
		case 5:
			return FiveCardHandValue(cards);
		break;
		
		case 6:
		
		break;
		
		case 7:
			var combinations = GetCardCombinations(cards);
		    var bestHand = 0;
		    var thisHand;
		    for (c = 0; c < 21; c++) {
		        thisHand = FiveCardHandValue(combinations[c]);
		        if (thisHand > bestHand) {
		            bestHand = thisHand;
		        }
		    }
		    return bestHand;
		break;
	}
}

function FiveCardHandValue(cards) {
	
	if (IsFlush(cards)) {
		if (IsStraight(cards)) {
			var foundTen = false;
			var foundAce = false;
			for (i = 0; i < 5; i++) {
				if (cards[i].value === "10") foundTen = true;
				else if (cards[i].value === "ACE") foundAce = true;
			}
			if (foundTen && foundAce) {
			    return Hands.ROYAL_FLUSH;
			}
			else {
			    return Hands.STRAIGHT_FLUSH;
			}
		}
		else {
			return Hands.FLUSH;
		}
	}
	
	else if (IsStraight(cards)) {
		return Hands.STRAIGHT;
	}
	
	else {
		var cardCounts = GetCardCounts(cards);
		
		if (cardCounts.length === 5) {
			return Hands.HIGH_CARD;
		}
		else if (cardCounts.length === 2) {
			if (Math.abs(cardCounts[0].count - cardCounts[1].count) === 1) {
				return Hands.FULL_HOUSE;
			}
			else {
				return Hands.FOUR_OF_A_KIND;
			}
		}
		else {
			var pairs = 0;
			for (i = 0; i < cardCounts.length; i++) {
				if (cardCounts[i].count === 3) {
					return Hands.THREE_OF_A_KIND;
				}
				else if (cardCounts[i].count === 2) {
					pairs += 1;
				}
			}
			if (pairs === 2) {
				return Hands.TWO_PAIR;
			}
			else {
				return Hands.PAIR;
			}
		}
	}
}


// need not be five card hand
function IsFlush(cards) {
	var suit = cards[0].suit;
	for (i = 1; i < cards.length; i++) {
		if (cards[i].suit != suit) return false;
	}
	return true;
}

// must be five card hand
function IsStraight(cards) {
	var difference;
	var cardOne;
	var cardTwo;
	for (i = 0; i < 5; i++) {
		for (j = 0; j < 5; j++) {
			if (i === j) continue;
			if (cards[i].value === "ACE") {
				cardOne = GetCardValue(cards[i]);
				cardTwo = GetCardValue(cards[j]);
				difference = Math.abs(cardOne - cardTwo);
				if (difference === 0) return false;
				if (difference >= 5) {
					difference = Math.abs(1 - cardTwo);
				}
			}
			else if (cards[j].value === "ACE") {
				cardOne = GetCardValue(cards[i]);
				cardTwo = GetCardValue(cards[j].value);
				difference = Math.abs(cardOne - cardTwo);
				if (difference === 0) return false;
				if (difference >= 5) {
					difference = Math.abs(cardOne - 1);
				}
			}
			else {
				difference = Math.abs(GetCardValue(cards[i]) - GetCardValue(cards[j]));
				if ((difference === 0) || (difference >= 4)) {
					return false;
				}
			}
		}
	}
	return true;
}

// expects 7 cards
function GetCardCombinations(cards) {
	var combinations = [];
	var thisCombination;

	for (i = 0; i < 7; i++) {
		for (j = (i + 1) ; j < 7; j++) {
			thisCombination = cards.slice(0, 7);
			thisCombination.splice(i, 1);
			thisCombination.splice((j - 1), 1);
			combinations.push(thisCombination);
		}
    }
	return combinations;
}

// expects five cards
function GetCardCounts(cards) {
	var cardsFound = [];
	var cardKey;
	var searchIndex;
	for (i = 0; i < 5; i++) {
	    cardKey = GetCardValue(cards[i]).toString();

	    searchIndex = 0;
	    do {
	        if (searchIndex === cardsFound.length) {
	            cardsFound.push({ "key": cardKey, "count": 1 });
	            break;
	        }
	        else if (cardsFound[searchIndex].key === cardKey) {
	            cardsFound[searchIndex].count += 1;
	            break;
	        }
	        searchIndex++;
	    } while (true);
	}
	return cardsFound;
}


// expects one card
function GetCardValue(card) {
	switch (card.value) {
		case "ACE":
			return 14;
		case "KING":
			return 13;
		case "QUEEN":
			return 12;
		case "JACK":
			return 11;
		default:
			return parseInt(card.value);
	}
}

// expects array of win candidtaes that could win, returns ID of winning player/s
function ResolveTie(players, winningHand) {
	var finalWinners = [];
	var bestHand = 0;
	var currentHand;
	
	for (p = 0; p < players.length; p++) {
		currentHand = GetBestHand(players[p].hand, winningHand);
		players[p].finalValue = currentHand;
		if (currentHand > bestHand) {
			bestHand = currentHand;
		}
	}
	
	for (i = 0; i < players.length; i++) {
		if (players[i].finalValue === bestHand) {
			finalWinners.push(players[i].id);
		}
	}
	return finalWinners;
}


function GetBestHand(cards, handToFind) {
	var hands = FindHands(cards, handToFind);
	switch (handToFind) {
		case Hands.RoyalFlush:
			return 14;
		case Hands.FOUR_OF_A_KIND:
			return bestFourOfAKind(hands);
			
		case Hands.FULL_HOUSE:		
			return bestFullHouse(hands);
		
		case Hands.THREE_OF_A_KIND:
			return bestThreeOfAKind(hands);
		
		case Hands.TWO_PAIR:
			return bestTwoPair(hands);
		
		case Hands.PAIR:
			return bestPair(hands);
		
		default:
			return bestDefault(hands);
	}
}	

function FindHands(cards, handToFind) {
	var combinations = GetCardCombinations(cards);
	var candidates = [];
	var thisHand;
	for (h = 0; h < 21; h++) {
		thisHand = DetermineHandValue(combinations[h]);
		if (thisHand === handToFind) {
			candidates.push(combinations[h]);
		}
	}
	return candidates;
}

function bestFourOfAKind(combos) {
	var cards;
	var bestCombo;
	var highestQuad = 2;
	for (x = 0; x < combos.length; x++) {
		cards = GetCardCounts(combos[x]);
		if (cards[0].count === 1) {
			if (parseInt(cards[1].key) > highestQuad) {
				highestQuad = parseInt(cards[1].key);
			}
		}
		else {
			if (parseInt(cards[0].key) > highestQuad) {
				highestQuad = parseInt(cards[0].key);
			}
		}
	}
	return highestQuad;
}

function bestFullHouse(combos) {
	var cards;
	var bestCombo;
	var highestTriple = 2;
	var highestPair = 2;
	for (x = 0; x < combos.length; x++) {
		cards = GetCardCounts(combos[x]);
		if (cards[0].count === 3) {
			if (parseInt(cards[0].key) === highestTriple) {
				if (parseInt(cards[1].key) > highestPair) {
					highestTriple = parseInt(cards[0].key);
					highestPair = parseInt(cards[1].key);
					bestCombo = combos[x];
				}
			}
			else if (parseInt(cards[0].key) > highestTriple) {
				highestTriple = parseInt(cards[0].key);
				highestPair = parseInt(cards[1].key);
				bestCombo = combos[x];
			}
		}
		else {
			if (parseInt(cards[1].key) === highestTriple) {
				if (parseInt(cards[0].key) > highestPair) {
					highestTriple = parseInt(cards[1].key);
					highestPair = parseInt(cards[0].key);
					bestCombo = combos[x];
				}
			}
			else if (parseInt(cards[1].key) > highestTriple) {
				highestTriple = parseInt(cards[1].key);
				highestPair = parseInt(cards[0].key);
				bestCombo = combos[x];
			}
		}
	}
	return [highestTriple, highestPair];
}

function bestThreeOfAKind(combos) {
	var cards;
	var bestCombo;
	var highestTriple = 2;
	for (x = 0; x < combos.length; x++) {
		cards = GetCardCounts(combos[x]);
		for (t = 0; t < cards.length; t++) {
			if (cards[t].count === 3) {
				if (parseInt(cards[t].key) > highestTriple) {
					highestTriple = parseInt(cards[t].key);
					bestCombo = combos[x];
				}
				break;
			}
		}
	}
	return highestTriple;
}

function bestTwoPair(combos) {
	var cards;
	var bestCombo;
	var highestPair1 = 2;
	var highestPair2 = 2;
	for (x = 0; x < combos.length; x++) {
		cards = GetCardCounts(combos[x]);
		if (cards[0].count === 1) {
			if (parseInt(cards[1].key) > parseInt(cards[2].key)) {
				if (parseInt(cards[1].key) > highestPair1) {
					highestPair1 = parseInt(cards[1].key);
					highestPair2 = parseInt(cards[2].key);
					
				}
				else if (parseInt(cards[1].key) === highestPair1) {
					if (parseInt(cards[2].key) > highestPair2) {
						highestPair1 = parseInt(cards[1].key);
						highestPair2 = parseInt(cards[2].key);
					}
				}
			}
			else {
				if (parseInt(cards[2].key) > highestPair1) {
					highestPair1 = parseInt(cards[2].key);
					highestPair2 = parseInt(cards[1].key);
					
				}
				else if (parseInt(cards[2].key) === highestPair1) {
					if (parseInt(cards[1].key) > highestPair2) {
						highestPair1 = parseInt(cards[2].key);
						highestPair2 = parseInt(cards[1].key);
					}
				}
			}
		}
		else if (cards[1].count === 1) {
			if (parseInt(cards[0].key) > parseInt(cards[2].key)) {
				if (parseInt(cards[0].key) > highestPair1) {
					highestPair1 = parseInt(cards[0].key);
					highestPair2 = parseInt(cards[2].key);
					
				}
				else if (parseInt(cards[0].key) === highestPair1) {
					if (parseInt(cards[2].key) > highestPair2) {
						highestPair1 = parseInt(cards[0].key);
						highestPair2 = parseInt(cards[2].key);
					}
				}
			}
			else {
				if (parseInt(cards[2].key) > highestPair1) {
					highestPair1 = parseInt(cards[2].key);
					highestPair2 = parseInt(cards[0].key);
					
				}
				else if (parseInt(cards[2].key) === highestPair1) {
					if (parseInt(cards[0].key) > highestPair2) {
						highestPair1 = parseInt(cards[2].key);
						highestPair2 = parseInt(cards[0].key);
					}
				}
			}
		}
		else {
			if (parseInt(cards[0].key) > parseInt(cards[1].key)) {
				if (parseInt(cards[0].key) > highestPair1) {
					highestPair1 = parseInt(cards[0].key);
					highestPair2 = parseInt(cards[1].key);
					
				}
				else if (parseInt(cards[0].key) === highestPair1) {
					if (parseInt(cards[1].key) > highestPair2) {
						highestPair1 = parseInt(cards[0].key);
						highestPair2 = parseInt(cards[1].key);
					}
				}
			}
			else {
				if (parseInt(cards[1].key) > highestPair1) {
					highestPair1 = parseInt(cards[1].key);
					highestPair2 = parseInt(cards[0].key);
					
				}
				else if (parseInt(cards[1].key) === highestPair1) {
					if (parseInt(cards[0].key) > highestPair2) {
						highestPair1 = parseInt(cards[1].key);
						highestPair2 = parseInt(cards[0].key);
					}
				}
			}
		}
	}
	return [highestPair1, highestPair2];
}

function bestPair(combos) {
	var cards;
	var bestCombo;
	var highestPair = 2;
	for (x = 0; x < combos.length; x++) {
		cards = GetCardCounts(combos[x]);
		for (t = 0; t < cards.length; t++) {
			if (cards[t].count === 2) {
				if (parseInt(cards[t].key) > highestPair) {
					highestPair = parseInt(cards[t].key);
					bestCombo = combos[x];
				}
				break;
			}
		}
	}
	return highestPair;
}

function bestDefault(combos) {
	var maxCard = 2;
	var temp;
	for (x = 0; x < combos.length; x++) {
		temp = MaxCardInHand(combos[x]);
		if (temp > maxCard) {
			maxCard = temp;
		}
	}
	return maxCard;
}


function MaxCardInHand(hand) {
	var max = -1;
	var cardValue;
	for (y = 0; y < 5; y++) {
		cardValue = GetCardValue(hand[y]);
		if (cardValue > max) {
			max = cardValue;
		}
	}
	return max;
}

