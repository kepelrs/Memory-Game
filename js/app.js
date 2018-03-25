/*
 * Create a list that holds all of your cards
 */
let allCards = [];
let cardValues = document.querySelectorAll('.card i');
for (let i of cardValues) {
    allCards.push(i.className);
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

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

// shuffle array of cards
let shuffledCards = shuffle(allCards);

// place shuffled cards on the HTML
cardValues.forEach(function(card) {
    card.className = shuffledCards.shift();
});

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

// game object that tracks game state
let game;
function startGame() {
    game = {
        moves: 0,
        locked: 0,
        faceUp: [],
        startTime: performance.now(),
    };
}

// turn up card
function turnUp(card) {
    card.className += " open show";
    game.faceUp.push(card);
}

function incrementMoves() {
    game.moves += 1;
}

// compare cards that are face up
function compareCards() {
    // only compare when there are two cards face up
    if (game.faceUp.length === 2) {
        let firstCard = game.faceUp[0].firstElementChild.className;
        let secondCard = game.faceUp[1].firstElementChild.className;


        if (firstCard == secondCard) {

            // if they are equal, lock face up
            lockFaceUp();

        } else if (firstCard != secondCard) {

            // if they are different, turn face down
            setTimeout(resetFaceUp, 1000);

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

function resetFaceUp() {
    for (let card of game.faceUp) {
        card.className = "card";
    }
    game.faceUp = [];
}

function checkGameOver() {
    if (game.locked === 16) {
        let totalMoves = game.moves/2;
        alert(`GameOver in ${totalMoves} moves.`);
    }
}

// add event handlers to cards
deck = document.querySelector('.deck');
deck.addEventListener('click', function(evt) {
    // only respond when target is a card,
    // and game state is ready for new play
    if (evt.target.className === "card" &&
        game.faceUp.length !== 2) {
        turnUp(evt.target);
        incrementMoves();
        compareCards();
        checkGameOver();
    }
});

// start game
startGame();
