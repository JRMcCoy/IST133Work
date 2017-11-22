$(function() {
	$("#showCardButton").click(handleShowCardButtonClicked);
});

function handleShowCardButtonClicked() {
	$.ajax({
		url: "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1",
		dataType: "json"
	})
	.done(function(data) { deckCreated(data); })
	.fail(function(jqXHR, textStatus, errorThrown) { handleAjaxError(errorThrown); });
}

function deckCreated(deckData) {
	$.ajax({
		url: "https://deckofcardsapi.com/api/deck/" + deckData.deck_id + "/draw/?count=1",
		dataType: "json"
	})
	.done(function(data) { cardDrawn(data); })
	.fail(function(jqXHR, textStatus, errorThrown) { handleAjaxError(errorThrown); })
}

function cardDrawn(cardData) {
	$("#cardImage").attr("src", cardData.cards[0].image);
}
	
function handleAjaxError(error) {
	alert(error);
}