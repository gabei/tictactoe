(() => {
  console.log("Hello.");

  const Board = (function () {
    let spaces = [];

    function getSpaces() {
      return spaces;
    }

    function updateBoard(space) {
      spaces.push(space);
    }

    function clearBoard() {
      spaces = [];
    }

    return { updateBoard, clearBoard, getSpaces };
  })();

  const Control = (function () {
    let isGameOver = false;
    let currentPlayer;
    let playerX;
    let playerO;

    let winningCombos = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9],
      [1, 5, 9],
      [7, 5, 3],
    ];

    function getPlayerName(playerSign) {
      let name = prompt(`What is player ${playerSign}'s name?'`); //testing like this <-----------
      return name;
    }

    function addPlayers() {
      playerX = Player(getPlayerName("x"), "x");
      playerO = Player(getPlayerName("o"), "o");
    }

    function setupGame() {
      Board.clearBoard;
      addPlayers();
      startGame();
    }

    function startGame() {
      currentPlayer = playerX;
      UI.changeTurnText(currentPlayer.getName());
    }

    function isValid(choice) {
      let isAvailable = !Board.getSpaces().includes(choice);
      return isAvailable;
    }

    function nextPlayer() {
      currentPlayer == playerX
        ? (currentPlayer = playerO)
        : (currentPlayer = playerX);

      UI.changeTurnText(currentPlayer.getName());
    }

    function isWinningMove() {
      console.log("isWinningMove()");
      let win = false;
      //check if a winning combination has been acheived by the current player
      winningCombos.forEach(function (combo) {
        for (let num of combo) {
          win = currentPlayer.getSpaces().includes(num);
        }
      });
      return win;
    }

    function endGame() {
      console.log(`Game over! ${currentPlayer.getName()} wins!`);
      UI.disableButtons();
    }

    function playTurn(e) {
      let choice = e.target.getAttribute("value");

      if (isValid(choice)) {
        Board.updateBoard(choice);
        currentPlayer.addSpace(choice);
        if (isWinningMove()) {
          endGame();
        }
        UI.updateText(`${currentPlayer.getName()} chose spot ${choice}.`);
        nextPlayer();
      } else {
        UI.updateText("Invalid move. Please choose another space.");
      }
    }

    return { setupGame, playTurn, endGame };
  })();

  function Player(name, playerSign) {
    let spaces = [];
    let sign = playerSign;

    function getName() {
      return name;
    }

    function getSign() {
      return sign;
    }

    function addSpace(space) {
      spaces.push(space);
    }

    function getSpaces() {
      return spaces;
    }

    return { getName, getSign, addSpace, getSpaces };
  }

  const UI = (function () {
    const textUpdate = document.querySelector(".text-updates");
    const turnText = document.querySelector(".turn-text");
    const gameBoard = document.querySelector(".game-board");
    const gameOver = document.querySelector(".game-over");
    const winningPlayer = document.querySelector(".winning-player");

    gameBoard.addEventListener("click", Control.playTurn);

    function updateText(text) {
      textUpdate.textContent = text;
    }

    function changeTurnText(playerName) {
      turnText.textContent = `${playerName}'s Turn`;
    }

    function disableButtons() {
      gameBoard.classList.add("disable-game-board");
    }

    function revealGameOver() {
      gameOver.classList.add("show-board");
    }

    return { updateText, changeTurnText, disableButtons };
  })();

  Control.setupGame();
})();
