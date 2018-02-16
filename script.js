(function() {

var code = [], //color sequence user must guess
    guess = [], //color sequence of players guesses
    options = document.getElementsByClassName('option'), //6 color options
    inputRows = document.getElementsByClassName('guessRow'), //each input row
    hintBox = document.getElementsByClassName('hintBox'), //each hint box
    answerRow = document.getElementsByClassName('circleAnswer input'), //each hidden answer inputs
    rowIncrement = 1, //move up an input row
    hintIncrement = 1,
    modalTitle = document.getElementById('modalTitle'), //modal title
    modalMessage = document.getElementById('modalMessage'), //modal message
    pegs = {
        1: 'red',
        2: 'blue',
        3: 'yellow',
        4: 'green',
        5: 'orange',
        6: 'purple'

    };


//Run new game
function gameSetup() {
    

    generateSecretCode(1, 7);

    //add event listener to 6 color options
    for (var i = 0; i < options.length; i++)
        options[i].addEventListener('click', insertGuess, false);


    //when reset button clicked newGame function is run
    document.getElementById('restartGame').onclick = newGame;

    //when delete button is clicked deleteLast function is run
    document.getElementById('delete').onclick = deleteLast;

}

//insert clicked guess circle into input
function insertGuess() {

    var self = this;


    //sets slot to next free slot in row
    var slots = inputRows[inputRows.length - rowIncrement].getElementsByClassName('input');

    //insert node into page
    slots[guess.length].className = slots[guess.length].className + ' ' + self.id;


    //push to the guess array
    guess.push(+(self.value));

    //check once all 4 slots have filled whether correct or move up a row
    if (guess.length === 4) {
        if (compare())
            gameState('won');
        else
            rowIncrement += 1;
    }

    //player reaches top of board && hasn't matched the lost 
    if (rowIncrement === inputRows.length + 1 && !compare())
        gameState('lost');

}

//function to compare player guess and answer
function compare() {

    var isMatch = true;
    //make copy of answer array
    var codeCopy = code.slice(0);

    //first check if any pegs right color right place
    for (var i = 0; i < code.length; i++) {
        if (guess[i] === code[i]) { //if any pegs match color and position
            insertPeg('hit'); //run insert peg function 'hit'
            codeCopy[i] = 0;
            guess[i] = -1;
        } else
            isMatch = false;
    }

    //then check for pegs of correct color but wrong postion
    for (var j = 0; j < code.length; j++) {
        if (codeCopy.indexOf(guess[j]) !== -1) { //guess position is not correct but color is correct
            insertPeg('almost'); //run insert peg function 'almost'
            codeCopy[codeCopy.indexOf(guess[j])] = 0;
        }
    }

    hintIncrement += 1; //move up to next row of hints
    guess = []; //reset guess sequence

    return isMatch;

}

//function to insert peg for hints
function insertPeg(type) {

    var sockets = hintBox[hintBox.length - hintIncrement].getElementsByClassName('js-hintCircle');
    sockets[0].className = 'hintCircle ' + type; //change class name to fill peg
}

//function to delete last guess
function deleteLast() {
    if (guess.length !== 0) { //as long as guess length is not zero
        var slots = inputRows[inputRows.length - rowIncrement].getElementsByClassName('input'); //current input
        slots[guess.length - 1].className = 'input'; //insert node
        guess.pop();
    }
}

//new game function
function newGame() {
    hideModal();
    guess = []; //reset game array
    clearBoard();
    rowIncrement = 1; //first row avalable for guesses
    hintIncrement = 1; //first row avalable for hints
    gameSetup(); //prepare game
}

//function to clear the board
function clearBoard() {

    //clear the guess inputs
    for (var i = 0; i < inputRows.length; i++) {
        inputRows[i].innerHTML = '';
        for (var j = 0; j < 4; j++) {
            var input = document.createElement('div');
            input.className = 'input';
            inputRows[i].appendChild(input);
        }
    }

    //clear the hint inputs
    for (var i = 0; i < hintBox.length; i++) {
        var inputCollection = hintBox[i].getElementsByClassName('hintCircle');
        for (var j = 0; j < 4; j++) {
            inputCollection[j].className = 'hintCircle js-hintCircle';
        }
    }

    //reset the answer code sockets if they have been filled
    for (var i = 0; i < answerRow.length; i++) {
        answerRow[i].className = 'circleAnswer input';
        answerRow[i].innerHTML = '<h4>?</h4>';
    }
    
    //reset background
    document.getElementsByTagName('body')[0].className = '';

}


// creates color sequence that user needs to guess
function generateSecretCode(min, max) {

    for (var i = 0; i < 4; i++)
        code[i] = Math.floor(Math.random() * (max - min)) + min;

}

//function to reveal the code once user has guesses it right
function revealCode() {
    for (var i = 0; i < answerRow.length; i++) {
        //change classname of each answer circle to that of secret code
        answerRow[i].className += ' ' + pegs[code[i]];
        answerRow[i].innerHTML = ''; //remove ?
    }
}

//when game is over remove color options and reveal code
function gameOver () {
    //remove color options
    for (var i = 0; i < options.length; i++)
        options[i].removeEventListener('click', insertGuess, false);
    
    revealCode();
}

//show modal function
function showModal() {
    $('#my-modal').modal('show');
}

//hide function modal
function hideModal() {
    $('#my-modal').modal('hide');
}

function gameState (state) {
    
    gameOver();
    showModal();
    document.getElementById('playAgain').onclick = newGame;
    
    if (state === 'won') {
        modalTitle.innerHTML = '<h5 class="modal-title" id="modalTitle">Well Done!</h5>';
        modalMessage.innerHTML = '<p>You have completed the game.</p>';
    }
    
    if (state === 'lost') {
        modalTitle.innerHTML = '<h5 class="modal-title" id="modalTitle">Unlucky!</h5>';
        modalMessage.innerHTML = '<p>You have failed to complete the game. Better luck next time.</p>';
    }
    
    
    
}

gameSetup();
    
}());
