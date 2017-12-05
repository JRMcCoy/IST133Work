function Deal(gameData) {
    for (i = 0; i < MaxPlayers; i++) {
		if (gameData.players[i].state != PlayerStates.OUT) {
			gameData.players[i].state = PlayerStates.ACTIVE;
		}
        gameData.players[i].hand = NewHand();
    }
	gameData.deck.roundState = RoundStates.IN_PROGRESS;
    gameData.deck.deckState = DeckStates.DEALT;
}

function Flop(deckData) {
    var flopCards = ApiDrawCards(DeckId, 3);
    for (i = 0; i < 3; i++) {
        deckData.publicHand.push(flopCards[i]);
		$("#pubCard" + (i + 1)).attr("src", deckData.publicHand[i].image);
		$("#pubCard" + (i + 1)).slideDown();
    }
	deckData.roundState = RoundStates.IN_PROGRESS;
    deckData.deckState = DeckStates.FLOP;
}

function Bridge(deckData) {
    deckData.publicHand.push(ApiDrawCards(DeckId, 1)[0]);
	$("#pubCard4").attr("src", deckData.publicHand[3].image);
	$("#pubCard4").slideDown();
    deckData.deckState = DeckStates.BRIDGE;
}

function River(deckData) {
    deckData.publicHand.push(ApiDrawCards(DeckId, 1)[0]);
	$("#pubCard5").attr("src", deckData.publicHand[4].image);
	$("#pubCard5").slideDown();
    deckData.deckState = DeckStates.RIVER;
}

function CollectCpuBet(gameData) {
	var player = gameData.currentPlayer;
	var descision = Math.floor((Math.random() * 10) + 1);
	
	if (gameData.deck.highestBetter.bet === 0) {
		if ((descision % 2) === 0) {
				player.bet = 0;
				alert("Player " + player.playerId + " checks");
			}
			else {
				gameData.deck.highestBetter = player;
				player.bet = 2;
				gameData.deck.highestBetter.bet = player.bet;
				alert("Player " + player.playerId + " bets");
			}
			return;
	}

	var descision = Math.floor((Math.random() * 10) + 1);
	var highestBet = gameData.deck.highestBetter.bet;
	if (descision > 6) {

		// call
		if (highestBet >= player.wealth) {
			player.bet = player.wealth;
			alert("Player " + player.playerId + " calls");
		}
			
		else {
			player.bet = highestBet;
			alert("Player " + player.playerId + " calls");
		}
	}
	else if (descision > 2) {
		player.playerState = PlayerStates.FOLDED;
		alert("Player " + player.playerId + " folds");
	}
	else {
		if (highestBet >= player.wealth) {
			player.playerState = PlayerStates.FOLDED;
			alert("Player " + player.playerId + " folds");
		}
		else {
			var activePlayers = getPlayerStates(gameData.players);
			if (activePlayers.active === 1) {
				player.bet = gameData.deck.highestBetter.bet;
				alert("Player " + player.playerId + " calls");
			}
			var highestBet = gameData.deck.highestBetter.bet;
			player.bet = highestBet + 2;
			alert("Player " + player.playerId + " raises");
		}
	}
}

function TakePlayerTurn(gameData) {
	
	if (gameData.playOut) {
		gameData.currentPlayer.bet = 0;
		PlaySegment(gameData);
		return;
	}
	if (gameData.currentPlayer.playerType === PlayerTypes.HUMAN) {
		SetPlayerUI(gameData);
	}
	else {
		CollectCpuBet(gameData);
		PlaySegment(gameData);
	}
}


function SetPlayerUI(gameData) {
	var player = gameData.currentPlayer;
	
	alert("It's player " + player.playerId + "'s turn");
	
	$("#wealthDisplay").text("Your Wealth: " + player.wealth);
	$("#highestBetDisplay").text("Current Bet: " + gameData.deck.highestBetter.bet);
	$("#betInput").val(gameData.deck.highestBetter.bet);
	
	$("#card1").attr("src", player.hand.cardOne.image);
	$("#card2").attr("src", player.hand.cardTwo.image);
	$("#btnSubmitBet").html("Call");
	$("#controlPanel").slideDown();
	$("#hand").slideDown();
}


function StartHand(gameData) {	
	Deal(gameData);
	
	var currentBetter = findFirstBetter(gameData.players);
	gameData.deck.highestBetter = currentBetter;
	gameData.currentPlayer = currentBetter;
	
	TakePlayerTurn(gameData);
}


function PlaySegment(gameData) {
	
	switch (gameData.deck.deckState) {
		case DeckStates.NEW:
			StartHand(gameData);
		break;
		case DeckStates.DEALT:
			if (gameData.playOut) {
				gameData.deck.roundState = RoundStates.COMPLETE;
			}
			else {
				ProcessPlayerTurn(gameData);
				if (gameData.deck.handWinner != null) {
					AwardWinner(gameData);
					return;
				}
			}
			if (gameData.deck.roundState === RoundStates.COMPLETE) {
				alert("Flop");
				CleanupRound(gameData);
				Flop(gameData.deck);
				setTimeout(function() { TakePlayerTurn(gameData); }, 1500);
			}
			else {
				TakePlayerTurn(gameData); // to next better
			}
		break;
		case DeckStates.FLOP:
			if (gameData.playOut) {
				gameData.deck.roundState = RoundStates.COMPLETE;
			}
			else {
				ProcessPlayerTurn(gameData);
				if (gameData.deck.handWinner != null) {
					AwardWinner(gameData);
					return;
				}
			}
			if (gameData.deck.roundState === RoundStates.COMPLETE) {
				alert("Bridge");
				CleanupRound(gameData);
				Bridge(gameData.deck);
				setTimeout(function() { TakePlayerTurn(gameData); }, 1500);
			}
			else {
				TakePlayerTurn(gameData); // to next better
			}
		break;
		case DeckStates.BRIDGE:
			ProcessPlayerTurn(gameData);
			if (gameData.deck.handWinner != null) {
				AwardWinner(gameData);
				return;
			}

			if (gameData.deck.roundState === RoundStates.COMPLETE) {
				alert("River");
				CleanupRound(gameData);
				River(gameData.deck);
				setTimeout(function() { TakePlayerTurn(gameData); }, 1500);
			}
			else {
				TakePlayerTurn(gameData); // to next better
			}
		break;
		case DeckStates.RIVER:
			ProcessPlayerTurn(gameData);
			if (gameData.deck.handWinner != null) {
				AwardWinner(gameData);
				return;
			}
			if (gameData.deck.roundState === RoundStates.COMPLETE) {
				alert("Show cards");
				gameData.deck.deckState = DeckStates.DETERMINE_WINNER;
				gameData.currentPlayer = gameData.players[0];
				setTimeout(function() { PlaySegment(gameData); }, 1500);
			}
			else {
				TakePlayerTurn(gameData); // to next better
			}
		break;
		case DeckStates.DETERMINE_WINNER:
			DisplayHands(gameData);
		break;
	}
}

function PlayGame() {
	
    // runs when start new game button is pressed
	var startupInfo = CollectStartupInfo();
	if (!startupInfo.valid) {
		alert("Invalid starup info");
		return;
	}
	
	$("#gameControls").addClass("hidden");
	var gameLabels = $("#potDisplay").find("p");
	for (i = 0; i < 4; i++) {
		($(gameLabels[i])).text("Player " + (i + 1) + ": " + $("#startingWealth").val());
	}
	
	$("#potDisplay").removeClass("hidden");
	
	setTimeout(function() {
		Game = NewGame(startupInfo.humans, parseInt(startupInfo.wealth));
		PlaySegment(Game);
	}, 10);
}

function ProcessPlayerTurn(gameData) {
	
	var justPlayed = gameData.currentPlayer;
	
	if (justPlayed.playerState === PlayerStates.FOLDED) {
		// player who folded loses their bet, it goes in the pot
		justPlayed.wealth -= justPlayed.bet;
		gameData.deck.pot += justPlayed.bet;	
	}
	
	var betAmount = justPlayed.bet;
	
	if (betAmount > gameData.deck.highestBetter.bet) {
			Game.deck.highestBetter = justPlayed;
		}
		
	if (betAmount === justPlayed.wealth) {
		justPlayed.playerState = PlayerStates.ALLIN;
		justPlayed.wealth -= justPlayed.bet;
		gameData.deck.pot += justPlayed.bet;
	}
	
	var playerStates = getPlayerStates(gameData.players);
	
	if ((playerStates.out + playerStates.folded) === 3) {
		// someone won through betting
		for (i = 0; i < MaxPlayers; i++) {
			if ((gameData.players[i].playerState === PlayerStates.ALLIN) || (gameData.players[i].playerState === PlayerStates.ACTIVE)) {
				gameData.deck.handWinner = gameData.players[i];
				return;
			}
		}
	}
	else if ((playerStates.allin > 1) && (playerStates.active === 0)) {
		gameData.playOut = true;
		for (z = 0; z < MaxPlayers; z++) {
			if (gameData.players[z].playerState === PlayerStates.ACTIVE) {
				gameData.currentPlayer = gameData.players[z];
				break;
			}
		}
		if (gameData.currentPlayer.bet === gameData.deck.highestBetter.bet) {
			gameData.deck.roundState = RoundStates.COMPLETE;
		}
	}
	else {
		var nextPlayer = getNextBetter(justPlayed);
		if (nextPlayer.playerId === gameData.deck.highestBetter.playerId) {
			// next in line is the one that set the bet. this betting round is over.
			gameData.deck.roundState = RoundStates.COMPLETE;
		}
		else {
			gameData.currentPlayer = nextPlayer;
		}
	}
}


function DisplayHands(gameData) {
	var playerToDisplay = gameData.currentPlayer;
	var timeout = 5000;
	if (playerToDisplay.playerId === 1) {
		$("#displayPanel").slideDown();
	}
	
	switch (playerToDisplay.playerState) {
		case PlayerStates.OUT:
			//
		break;
		case PlayerStates.FOLDED:
			//
		break;
		case PlayerStates.ALLIN:
			//
		break;
		case PlayerStates.ACTIVE:
			gameData.deck.pot += playerToDisplay.bet;
			playerToDisplay.wealth -= playerToDisplay.bet;
			playerToDisplay.bet = 0;
		break;
	}
	
	if ((playerToDisplay.playerState === PlayerStates.ACTIVE) || (playerToDisplay.playerState === PlayerStates.ALLIN)) {
		// display their hand
		$("#handDisplayTitle").text("Player " + (playerToDisplay.playerId) + "'s hand:");
		$("#displayCardOne").attr("src", playerToDisplay.hand.cardOne.image);
		$("#displayCardTwo").attr("src", playerToDisplay.hand.cardTwo.image);
		var hand = gameData.deck.publicHand.slice(0, 5);
		hand.push(playerToDisplay.hand.cardOne);
		hand.push(playerToDisplay.hand.cardTwo);
		playerToDisplay.handValue = DetermineHandValue(hand);
		$("#handDescription").text(HandToString(playerToDisplay.handValue));
	}
	else {
		timeout = 5;
	}
	
	if (playerToDisplay.playerId === 4) {
		setTimeout(function() { AwardWinner(gameData); }, timeout);
	}
	else {
		gameData.currentPlayer = playerToDisplay.right;
		setTimeout(function() { DisplayHands(gameData); }, timeout);
	}
}

function AwardWinner(gameData) {
	if (gameData.deck.deckState === DeckStates.DETERMINE_WINNER) {
		var maxHand = 0;
		var winnerId = -1;
		for (i = 0; i < MaxPlayers; i++) {
			if ((gameData.players[i].playerState === PlayerStates.ACTIVE) || (gameData.players[i].playerState === PlayerStates.ALLIN)) {
				if (gameData.players[i].handValue > maxHand) {
					maxHand = gameData.players[i].handValue;
					winnerId = gameData.players[i].playerId;
				}
			}
		}
		
		var winners = [winnerId];
		for (i = 0; i < MaxPlayers; i++) {
			if ((gameData.players[i].playerState === PlayerStates.ACTIVE) || (gameData.players[i].playerState === PlayerStates.ALLIN)) {
				if ((gameData.players[i].playerId != winnerId) && (gameData.players[i].handValue === maxHand)) {
					winners.push(gameData.players[i].playerId);
				}
			}
		}
		
		if (winners.length > 1) {
			var finalists = [];
			for (i = 0; i < winners.length; i++) {
				finalists.push(NewWinCandidate(gameData.players[winners[i] - 1], gameData.deck.publicHand));
			}
			winners = ResolveTie(finalists, maxHand);
			/*
			if (winners > 1) {
				alert("There were multiple winners: " + winners);
				// handle split pot and return
			}
			*/
			if (false) {} // split pot not implemented. Give it to whoever was lucky enough to come first
			else {
				gameData.deck.handWinner = winners[0];
				winnerId = winners[0];
				var winner = gameData.players[winnerId - 1];
				alert("Player " + winnerId + " wins!");
				winner.wealth += gameData.deck.pot;
				$(("#p" + winnerId + "Wealth")).text("Player " + winnerId + ": " + winner.wealth);
				for (i = 0; i < MaxPlayers; i++) {
					if ((gameData.players[i].playerId != winner.playerId) && (gameData.players[i].playerState === PlayerStates.ALLIN)) {
						gameData.players[i].playerState = PlayerStates.OUT;
					}
				}
			}
		}
		else {
			var winner = gameData.players[(winnerId - 1)];
			alert("Player " + winnerId + " wins!");
			winner.wealth += gameData.deck.pot;
			$(("#p" + winnerId + "Wealth")).text("Player " + winnerId + ": " + winner.wealth);
			for (i = 0; i < MaxPlayers; i++) {
				if ((gameData.players[i].playerId != winner.playerId) && (gameData.players[i].playerState === PlayerStates.ALLIN)) {
					gameData.players[i].playerState = PlayerStates.OUT;
				}
			}
		}
		
	}
	else {
		var winner = gameData.players[(gameData.deck.handWinner.playerId - 1)];
		alert("Player " + winner.playerId + " won!");
		winner.wealth += gameData.deck.pot;
		for (i = 0; i < MaxPlayers; i++) {
			if ((gameData.players[i].playerId != winner.playerId) && (gameData.players[i].playerState === PlayerStates.ALLIN)) {
				gameData.players[i].playerState = PlayerStates.OUT;
			}
		}
	}
	
	var victoryCheck = getPlayerStates(gameData.players);
	if (victoryCheck.out === 3) {
		for (f = 0; f < MaxPlayers; f++) {
			if (gameData.players[f].playerState != PlayerStates.OUT) {
				alert("Player " + gameData.players[f].playerId + " wins the pot!");
				$("#gameControls").slideDown();
				return;
			}
		}
	}
	
	CleanupHand(gameData);
}

function CleanupHand(gameData) {
	ApiShuffleDeck(DeckId);
	for (i = 0; i < MaxPlayers; i++) {
		if (gameData.players[i].playerState != PlayerStates.OUT) {
			gameData.players[i].playerState = PlayerStates.ACTIVE;
			gameData.players[i].bet = 0;
			gameData.players[i].handValue = 0;
		}
	}
	gameData.deck.pot = 0;
	gameData.deck.publicHand = [];
	gameData.deck.handWinner = null;
	gameData.deck.roundState = RoundStates.NOT_STARTED;
	gameData.deck.deckState = DeckStates.NEW;
	gameData.playOut = false;
	
	$("#pubCard1").slideUp();
	$("#pubCard1").attr("src", "");
	$("#pubCard2").slideUp();
	$("#pubCard2").attr("src", "");
	$("#pubCard3").slideUp();
	$("#pubCard3").attr("src", "");
	$("#pubCard4").slideUp();
	$("#pubCard4").attr("src", "");
	$("#pubCard5").slideUp();
	$("#pubCard5").attr("src", "");
	
	$("#controlPanel").slideUp();
	$("#hand").slideUp();
	
	$("#displayPanel").slideUp();
	
	var gameLabels = $("#potDisplay").find("p");
	for (i = 0; i < 4; i++) {
		($(gameLabels[i])).text("Player " + (i + 1) + ": " + gameData.players[i].wealth);
	}
	$("#pot").text("Pot: 0");
	
	setTimeout(function() { PlaySegment(gameData); }, 1500);
}

function CleanupRound(gameData) {
	for (i = 0; i < MaxPlayers; i++) {
		if (gameData.players[i].playerState === PlayerStates.ACTIVE) {
			gameData.deck.pot += gameData.players[i].bet;
			gameData.players[i].wealth -= gameData.players[i].bet;
			gameData.players[i].bet = 0;
		}
	}
	
	if (gameData.deck.deckState === DeckStates.RIVER) {
		alert("Now just determine a winner!");
	}
	else {
		gameData.deck.roundState = RoundStates.NOT_STARTED;
		gameData.currentPlayer = findFirstBetter(gameData.players);
		gameData.deck.highestBetter = gameData.currentPlayer;
	}
	
	$("#pot").text("Pot: " + gameData.deck.pot);
}

// helpers

function getNextBetter (better) {
	if (Game.playOut) {
		do {
			better = better.left;
		} while ((better.playerState === PlayerStates.OUT) || (better.playerState === PlayerStates.FOLDED));
		return better;
	}
	else {
		
		do {
			better = better.left;
		} while (better.playerState != PlayerStates.ACTIVE);
		return better;
	}
}

function findFirstBetter(playerData) {
	var currentBetter;
    var index = 0;
    do {
        currentBetter = playerData[index++];
    } while (currentBetter.role != Roles.BLIND);
	
	
	if (Game.playOut) {
		while ((currentBetter.playerState === PlayerStates.OUT) || (currentBetter.playerState === PlayerStates.FOLDED)) {
			currentBetter = currentBetter.left;
		}
	}
	else {
		while (currentBetter.playerState != PlayerStates.ACTIVE) {
			currentBetter = currentBetter.left;
		}
	}
	return currentBetter;
}

function getPlayerStates(playerData) {
	
	var result = {
		"active": 0,
		"folded": 0,
		"allin": 0,
		"out": 0
	};
	
	for (i = 0; i < MaxPlayers; i++) {
		switch (playerData[i].playerState) {
			case PlayerStates.ACTIVE:
				result.active = result.active + 1;
				break;
			case PlayerStates.FOLDED:
				result.folded = result.folded + 1;
				break;
			case PlayerStates.ALLIN:
				result.allin = result.allin + 1;
				break;
			case PlayerStates.OUT:
				result.out = result.out + 1;
				break;
		}
	}
	
	return result;
}


