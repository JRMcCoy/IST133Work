$(function () {
    $("#startButton").click(function () {
        PlayGame();
    });
	
	$("#betInput").on("keyup", function () {
        var betAmount = $(this).val();
		var betMinimum = Game.deck.highestBetter.bet;
		if (isNaN(betAmount)) {
			alert("Invalid bet, resetting to minimum");
			$(this).val(betMinimum);
		}
		else if (betAmount === "") {
			$("#btnSubmitBet").html("Call");
		}
		else {
			if (betAmount > betMinimum) {
				$("#btnSubmitBet").html("Raise");
			}
			else {
				$("#btnSubmitBet").html("Call");
			}
		}
    });
	
	$("#btnSubmitBet").click(function() {
		var betAmount = parseInt($("#betInput").val());
		var betMinimum = Game.deck.highestBetter.bet;
		if ((betAmount < betMinimum) && (betAmount != Game.currentPlayer.wealth)) {
			alert("Bet is below minimum");
			return;
		}
		else if (betAmount > Game.currentPlayer.wealth) {
			alert("Bet exceeds your wealth");
			return;
		}
		
		$("#controlPanel").slideUp();
		$("#hand").slideUp();
	
		Game.currentPlayer.bet = betAmount;
		
		setTimeout(function() { PlaySegment(Game) }, 1000);
	});
	
	$("#btnFold").click(function() {
		Game.currentPlayer.playerState = PlayerStates.FOLDED;
		$("#controlPanel").slideUp();
		$("#hand").slideUp();
		setTimeout(function() { PlaySegment(Game) }, 1000);
	});
	
});

function ApiGetDeck() {
    var deck = null;
    $.ajax({
        url: "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1",
        dataType: "json",
        async: false
    })
	.done(function (data) { deck = data.deck_id; })
	.fail(function (jqXHR, textStatus, errorThrown) { HandleAjaxError(errorThrown); });
    return deck;
}

function ApiShuffleDeck(deckId) {
    $.ajax({
        url: "https://deckofcardsapi.com/api/deck/" + deckId + "/shuffle/",
        dataType: "json",
        async: false
    })
	.done(function (data) { return; })
	.fail(function (jqXHR, textStatus, errorThrown) { HandleAjaxError(errorThrown); });
}

function ApiDrawCards(deckId, cardCount) {
    var cards;
    $.ajax({
        url: "https://deckofcardsapi.com/api/deck/" + deckId + "/draw/?count=" + cardCount,
        dataType: "json",
        async: false
    })
	.done(function (data) { cards = data.cards; })
	.fail(function (jqXHR, textStatus, errorThrown) { handleAjaxError(errorThrown); });
    return cards;
}

function CollectStartupInfo() {
	var startWealth = $("#startingWealth").val();
	var humanCount = $("#playerCountInput").val();
	var isValid;
	if (startWealth < 5 || humanCount > 4) {
		isValid = false;
	}
	else {
		isValid = true;
	}
	return { "valid": isValid,
			 "wealth": startWealth,
			 "humans": humanCount
	};
}

function HandleAjaxError(errorThrown) {
    //
}