var PlayerTypes = {
    HUMAN: 0,
    COMPUTER: 1
};

var Roles = {
    NONE: 0,
    BLIND: 1,
    DEALER: 2
};

var DeckStates = {
    NEW: 0,
    DEALT: 1,
    FLOP: 2,
    BRIDGE: 3,
    RIVER: 4,
	DETERMINE_WINNER: 5
};

var PlayerStates = {
    ACTIVE: 0,
    FOLDED: 1,
	ALLIN: 2,
    OUT: 3
};

var BetResults = {
    FOLD: 0,
    CHECK: 1,
    CALL: 2,
    RAISE: 3,
    ALLIN: 4
};

var RoundStates = {
	NOT_STARTED: 0,
	IN_PROGRESS: 1,
	COMPLETE: 2,
	PLAY_OUT: 3
};


function NewDeck() {
    ApiShuffleDeck(DeckId);
    return {
        "deckState": DeckStates.NEW,
        "publicHand": [],
		"highestBetter": null,
		"roundState": RoundStates.NOT_STARTED,
		"handWinner": null,
		"pot": 0
    };
}

function NewHand() {
    var drawnCards = ApiDrawCards(DeckId, 2);
    return {
        "cardOne": drawnCards[0],
        "cardTwo": drawnCards[1]
    };
}

function NewPlayer(playerType, startingWealth, id) {
    return {
        "playerType": playerType,
		"playerId": id,
        "hand": null,
		"handValue": 0,
        "bet": 0,
        "wealth": startingWealth,
        "playerState": PlayerStates.ACTIVE,
        "role": Roles.NONE,
        "left": null,
        "right": null
    };
}

function NewGame(humanPlayerCount, startingWealth) {
    return {
        "players": SetPlayers(humanPlayerCount, startingWealth),
        "playersLeft": MaxPlayers,
		"currentPlayer": null,
        "deck": NewDeck(),
		"playOut": false
    };
}

function NewWinCandidate(player, pubHand) {
	candidateHand = pubHand.slice(0, 7);
	candidateHand.push(player.hand.cardOne);
	candidateHand.push(player.hand.cardTwo);
	
	return {
		"id": player.playerId,
		"hand": candidateHand,
		"finalValue": 0
	};
}

var MaxPlayers = 4;
var DeckId = ApiGetDeck();
var Game = null;


// helpers

function SetPlayers(humanPlayerCount, startingWealth) {
    var players = [];
    for (i = 0; i < MaxPlayers; i++) {
        var playerType = (humanPlayerCount--) > 0 ? PlayerTypes.HUMAN : PlayerTypes.COMPUTER;
        players.push(NewPlayer(playerType, startingWealth, i + 1));
    }
    players[0].role = Roles.DEALER;
    players[3].role = Roles.BLIND;
    for (i = 0; i < MaxPlayers; i++) {
        if (i === 0) {
            players[i].left = players[MaxPlayers - 1];
            players[i].right = players[i + 1];
        }
        else if (i === MaxPlayers - 1) {
            players[i].left = players[i - 1];
            players[i].right = players[0];
        }
        else {
            players[i].left = players[i - 1];
            players[i].right = players[i + 1];
        }
    }
    return players;
}