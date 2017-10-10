var theNumber = Math.floor(Math.random() * 100) + 1;
var guesses = 0;
var gameWon = false;

function handleGuess(e) {
	
	if (e.keyCode != 13 || gameWon) return;
	
	guesses += 1;
	var guess = parseInt(document.getElementById("guessbox").value, 10);
	if (guess > theNumber) {
		document.getElementById("msg").innerHTML = "That guess was too high. Guess again!";
	}
	else if (guess < theNumber) {
		document.getElementById("msg").innerHTML = "That guess was too low. Guess again!";
	}
	else if (guess === theNumber) {
		gameWon = true;
		document.getElementById("msg").innerHTML = "Correct! Nice job.";
		document.getElementById("restart").style.visibility = "visible";
	}
	else {
		document.getElementById("msg").innerHTML = "You didn't enter a number.";
	}
	
	return;
}

function handleRestart() {
	gameWon = false;
	theNumber = Math.floor(Math.random() * 100) + 1;
	document.getElementById("msg").innerHTML = "I'm thinking of a number, try to guess what it is!";
	document.getElementById("guessbox").value = "";
	document.getElementById("restart").style.visibility = "hidden";
	return;
}
