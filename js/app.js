let cardFaces, cardValues, cardElements;
// List all card values
cardValues = [];
cardFaces = document.querySelectorAll('.card i');
for (let i of cardFaces) {
    cardValues.push(i.className);
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*  start game function
*  - turns all cards elements face down
*  - shuffles card values
*  - places on the HTML
*  - resets game state and counters
*/
cardElements = document.querySelectorAll('.card');
function startGame() {
    // ensure all cards are face down
    for (let i of cardElements) {
        i.className = "card";
    }

    // shuffle array of cards
    let shuffledCards = shuffle(cardValues);

    // place shuffled cards on the HTML
    cardFaces.forEach(function(card, index) {
        card.className = shuffledCards[index];
    });

    // reset game state
    resetGame();
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

// GAME LOGIC
let game, moveCounter, deck, restartBtn;

// reset game object that tracks game state
function resetGame() {
    game = {
        moves: 0,
        locked: 0,
        faceUp: [],
        startTime: 0,
        finishTime: 0,
    };
    moveCounter.innerHTML = 0;
}

// turn up card and add to list of face up cards
function turnUp(card) {
    card.className += " open show";
    game.faceUp.push(card);
}

// increment move counter
moveCounter = document.querySelector(".moves");

function incrementMoves() {
    // start counting game time from the first move
    if (game.moves === 0) {
        game.startTime = performance.now();
    }

    // each move = two card face up
    game.moves += 0.5;
    moveCounter.innerHTML = Math.floor(game.moves);
}

// compare cards that are face up
function compareCards() {
    if (game.faceUp.length === 2) {
        let firstCard = game.faceUp[0].firstElementChild.className;
        let secondCard = game.faceUp[1].firstElementChild.className;

        if (firstCard == secondCard) {

            // if they are equal, lock face up
            lockFaceUp();

        } else if (firstCard != secondCard) {

            // if they are different, turn face down
            setTimeout(turnDown, 1000);

        }
    }
}

function lockFaceUp() {
    for (let card of game.faceUp) {
        card.className = "card match";
    }
    game.faceUp = [];
    game.locked += 2;
}

function turnDown() {
    for (let card of game.faceUp) {
        card.className = "card";
    }
    game.faceUp = [];
}

function checkGameOver() {
    if (game.locked === 16) {
        game.finishTime = performance.now();
        let totalTime = Math.floor((game.finishTime - game.startTime)/1000);

        alert(`GameOver in ${game.moves} moves.`);
        alert(`Total time was ${totalTime} seconds.`);
    }
}

// add event handlers to cards
deck = document.querySelector('.deck');
deck.addEventListener('click', function(evt) {
    // delegate only to cards, and only when game state ready is for new play
    if (evt.target.className === "card" && game.faceUp.length !== 2) {
        turnUp(evt.target);
        incrementMoves();
        compareCards();
        checkGameOver();
    }
});

// restart button behavior
restartBtn = document.querySelector(".restart");
restartBtn.addEventListener("click", function() {
    startGame();
});

// start game
startGame();
