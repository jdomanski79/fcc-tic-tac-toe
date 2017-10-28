console.clear();
(function() {
  let fields = document.querySelectorAll(".boardField");
  let computerScoreDOM = document.getElementById("score-computer");
  let playerScoreDOM = document.getElementById("score-player");
  let gamesNumberDOM = document.getElementById("games-number");
  let board = ["", "", "", "", "", "", "", "", ""];
  let numberOfGames = 0;
  let playerScore = 0;
  let computerScore = 0;
  let computerStart = true;

  // new variables
  let ui = {
    squares: document.querySelectorAll(".boardField"),
    computerScore: document.getElementById("score-computer"),
    playerScore: document.getElementById("score-player"),
    computerScoreHeader: document.getElementById("computer"),
    playerScoreHeader: document.getElementById("player"),
    gamesNumber: document.getElementById("games-number")
  };
  let playing;
  let playerChance;
  let userMark = "O";
  let computerMark = "X";
  let score = {
    player: 0,
    computer: 0,
    games: 0
  };
  let userTurn = true;
  const delay = 500;
  const blinkBordersDelay = 500;
  let bordersBlinking = false;
  

  init();

  function init() {
    for (let i = ui.squares.length; i--; ) {
      fields[i].addEventListener("mousedown", selectSquare);
    }
    document.getElementById("tag-o").addEventListener("click", chooseMark);
    document.getElementById("tag-x").addEventListener("click", chooseMark);
    document.getElementById("reset").addEventListener("click", reset);

    playing = true;
    updateScoreBoard();
    updateTurn();
  }

  function selectSquare() {
    console.log(this.id);
    if (bordersBlinking) return;
    if (!playing) {
      start();
      return;
    }
    if (board[this.id] === "" && playing && userTurn) {
      board[this.id] = userMark;
      updateBoard(userTurn, this.id);
      changeTurn();
    }
  }

  function updateBoard(user, index) {
    ui.squares[index].innerHTML = board[index] = user ? userMark : computerMark;
    ui.squares[index].classList.add("animated");
    setTimeout(() => ui.squares[index].classList.remove("animated"), 200);
  }

  function changeTurn() {
    if (userTurn) {
      userTurn = false;
      if (isGameOver(userMark)) return;
      updateTurn();
    }
    setTimeout(() => {
      computerMove();
      userTurn = true;
      if (isGameOver(computerMark)) return;
      updateTurn();
    }, delay);
  }

  function isGameOver(mark) {
    winningComb = won(mark);
    if (winningComb) {
      endGame(winningComb);
      return true;
    }
    if (possibleMoves().length === 0) {
      endGame();
      return true;
    }
    return false;
  }

  function computerMove() {
    let possible = possibleMoves();
    let randomMove = possible[Math.floor(Math.random() * possible.length)];

    let move = Math.random() > playerChance ? findBestMove(board) : randomMove;

    board[move] = computerMark;
    updateBoard(userTurn, move);
  }

  function updateTurn() {
    if (userTurn) {
      ui.playerScoreHeader.classList.add("active-player");
      ui.computerScoreHeader.classList.remove("active-player");
    } else {
      ui.playerScoreHeader.classList.remove("active-player");
      ui.computerScoreHeader.classList.add("active-player");
    }
  }

  function endGame(winComb) {
    playing = false;
    if (winComb) {
      board[winComb[0]] === userMark ? playerScore++ : computerScore++;
      winComb.forEach(el => {
        ui.squares[el].classList.add("tag-win");
      });
    } else {
      //if draw
      blinkBorders();
    }
    // update DOM score board
    numberOfGames++;
    updateScoreBoard();
    console.log(winComb, playerScore, computerScore);
  }

  function blinkBorders() {
    //debugger;
    let interval;
    let blinkCount = 0;
    let color;

    bordersBlinking = true;

    interval = setInterval(() => {
      console.log(blinkCount);
      for (let i = ui.squares.length; i--; ) {
        color = blinkCount % 2 === 0 ? "black" : "";
        ui.squares[i].style.borderColor = color;
      }
      if (++blinkCount === 4) {
        clearInterval(interval);
        bordersBlinking = false;
        console.log("interval cleared");
      }
    }, blinkBordersDelay);
  }

  function updateScoreBoard() {
    ui.playerScore.innerHTML = playerScore;
    ui.computerScore.innerHTML = computerScore;
    ui.gamesNumber.innerHTML = numberOfGames;
  }

  function start() {
    console.log("clear, " + (userTurn ? "user" : "computer") + " turn");
    board = ["", "", "", "", "", "", "", "", ""];
    board.forEach((_, i) => {
      ui.squares[i].innerHTML = "";
      //fields[i].style.backgroundColor='';
      ui.squares[i].classList.remove("tag-win");
    });

    updateTurn();
    playing = true;
    if (!userTurn) {
      changeTurn();
    }
  }

  function won(mark) {
    //checking rows
    if (board[0] === mark && board[1] === mark && board[2] === mark) return [0, 1, 2];
    if (board[3] === mark && board[4] === mark && board[5] === mark) return [3, 4, 5];
    if (board[6] === mark && board[7] === mark && board[8] === mark) return [6, 7, 8];
    // columns
    if (board[0] === mark && board[3] === mark && board[6] === mark) return [0, 3, 6];
    if (board[1] === mark && board[4] === mark && board[7] === mark) return [1, 4, 7];
    if (board[2] === mark && board[5] === mark && board[8] === mark) return [2, 5, 8];
    // diagonals
    if (board[0] === mark && board[4] === mark && board[8] === mark) return [0, 4, 8];
    if (board[2] === mark && board[4] === mark && board[6] === mark) return [2, 4, 6];
    // else
    return false;
  }

  function movesLeft() {
    return board.some(el => {
      return el === "";
    });
  }
  function possibleMoves() {
    let possible = [];
    board.forEach((el, i) => {
      if (el === "") {
        possible.push(i);
      }
    });
    return possible;
  }

  function chooseMark(event) {
    userMark = event.target.id === "tag-o" ? "O" : "X";
    computerMark = event.target.id === "tag-o" ? "X" : "O";
    document.querySelector(".choose-tag").classList.add("hidden");
    document.querySelector(".scoreBoard").classList.remove("hidden");
    document.querySelector(".board").classList.remove("hidden");

    switch (document.querySelector('input[name="difficulty"]:checked').value) {
      case "easy":
        console.log("easy");
        playerChance = 0.9;
        break;
      case "medium":
        console.log("medium");
        playerChance = 0.4;
        break;
      default:
        playerChance = 0;
    }
    console.log("difficulty ", playerChance);
  }

  function reset() {
    document.querySelector(".choose-tag").classList.remove("hidden");
    document.querySelector(".scoreBoard").classList.add("hidden");
    document.querySelector(".board").classList.add("hidden");

    numberOfGames = 0;
    playerScore = 0;
    computerScore = 0;
    userTurn = true;

    updateScoreBoard();
    start();
  }

  function findBestMove(board) {
    let bestMove, currVal;
    let bestVal = -100;
    let bestMovesList = [];
    possibleMoves(board).forEach(move => {
      board[move] = computerMark;
      currVal = minimax(board, 0, false);
      console.log("Move: ", move, " value: ", currVal);
      board[move] = "";
      if (currVal > bestVal) {
        bestVal = currVal;
        bestMovesList = [move];
      } else if (currVal === bestVal) {
        bestMovesList.push(move);
      }
    });
    console.log(bestMovesList);
    bestMove = bestMovesList[Math.floor(Math.random() * bestMovesList.length)];
    return bestMove;
  }

  function minimax(board, depth, isComputer) {
    if (depth > 10) return null;
    let tag, bestVal, value, oponnentTag;

    //console.log('----', depth, isComputer, possibleMoves(board));
    //print(board);

    if (won(isComputer ? userMark : computerMark)) {
      if (isComputer) {
        //console.log('board value:', -10);
        return -10 + depth;
      } else {
        //console.log('board value:', 10);
        return 10 - depth;
      }
    } else if (!movesLeft(board)) {
      //console.log('board value:', 0);
      return 0;
    }
    if (isComputer) {
      bestVal = -100;
      possibleMoves(board).forEach(move => {
        board[move] = computerMark;
        value = minimax(board, depth + 1, false);
        board[move] = "";
        bestVal = Math.max(value, bestVal);
      });
    } else {
      bestVal = 100;
      possibleMoves(board).forEach(move => {
        board[move] = userMark;
        value = minimax(board, depth + 1, true);
        board[move] = "";
        bestVal = Math.min(value, bestVal);
      });
    }
    return bestVal;
  }
})();

/*
    Minimax algorithm
    http://www.geeksforgeeks.org/minimax-algorithm-in-game-theory-set-3-tic-tac-toe-ai-finding-optimal-move/
    
    function FINDBESTMOVE
    for each move in board :
       if current move is better than bestMove
           bestMove = current move
    return bestMove 
    
    function minimax(board, depth, isMaximizingPlayer):

    if current board state is a terminal state :
        return value of the board
    
    if isMaximizingPlayer :
        bestVal = -INFINITY 
        for each move in board :
            value = minimax(board, depth+1, false)
            bestVal = max( bestVal, value) 
        return bestVal

    else :
        bestVal = +INFINITY 
        for each move in board :
            value = minimax(board, depth+1, true)
            bestVal = min( bestVal, value) 
        return bestVal
    */