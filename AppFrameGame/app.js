"use strict";

function MyApp()
{
	var version = "v1.0";
	
	// display strings
	var thinkingOfNumber = "Player 2, Player 1 is thinking of a number. Try to guess what it is!";
	var enterANumber = "Hey Player 1, enter a number so Player 2 can guess it";
	var notANumber = "You didn't enter a number.";
	var guessTooHigh = "That guess was too high. Guess again!";
	var guessTooLow = "That guess was too low. Guess again!";
	
	
	var GameState = {
		RetrievingGuess: 1,
		AttemptingGuess: 2,
		AwaitingReplay: 3,
	};
	
	var gameState = GameState.RetrievingGuess;
	var theNumber = null;
	var guesses = 0;
	
	
	function setStatus(message)
	{
		$("#app>footer").text(message);
	}

	this.start = function()
	{ 
		$("#msg").text(enterANumber);
		document.getElementById("guessbox").type = "password";
		
		$("#guessbox").keydown(function(event)
		{
			if (event.keyCode != 13 || gameState === GameState.AwaitingReplay) return;
			
			if (gameState === GameState.RetrievingGuess) {
				var input = parseInt($("#guessbox").val(), 10);
				if (input === NaN) {
					$("#msg").text(notANumber);
				}
				else {
					theNumber = input;
					$("#msg").text(thinkingOfNumber);
					gameState = GameState.AttemptingGuess;
					$("#guessbox").val("");
					document.getElementById("guessbox").type = "text";
				}
			}
	
			else {
				guesses += 1;
				var guess = parseInt($("#guessbox").val(), 10);
				if (guess > theNumber) {
					$("#msg").text(guessTooHigh);
				}
				else if (guess < theNumber) {
					$("#msg").text(guessTooLow);
				}
				else if (guess === theNumber) {
					$("#msg").text("Correct! Nice job.");
					setStatus("You guessed that number in " + guesses + " guesses.");
					$("#restart").removeClass("hidden");
					gameState = GameState.AwaitingReplay;
				}
				else {
					$("#msg").innerHTML = notANumber;
				}
			}
			
			return;
		}
		);
		
		$("#restart").click(function()
		{
			theNumber = null;
			setStatus("ready");
			$("#msg").text(enterANumber);
			$("#guessbox").val("");
			$("#restart").addClass("hidden");
			guesses = 0;
			gameState = GameState.RetrievingGuess;
			document.getElementById("guessbox").type = "password";
			return;
		}
		);
		
		$("#app>header").append(version);
		setStatus("ready");
	};
}

$(function() {
	window.app = new MyApp();
	window.app.start();
});