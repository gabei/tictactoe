(() => {
  /*__________________________________________________ */

  /* Control
  - Maintains the flow of the game's logic
  - Calls player and board methods to update their status
  - Harbors the functions that are attached to DOM elements in the UI
  ____________________________________________________ */

  const Control = (function () {
    let currentPlayer;
    let playerX;
    let playerO;
    let TURNCOUNT = 0;
    let MAXTURNS = 9;

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

    function addPlayers(xname, yname) {
      playerX = Player(xname, "x");
      playerO = Player(yname, "o");
    }

    function setupGame(e) {
      e.preventDefault();

      let xname = this.elements["x-name"].value;
      let yname = this.elements["y-name"].value;
      addPlayers(xname, yname);

      Board.clearBoard();
      UI.initGameDisplay();
      startGame();
    }

    function startGame() {
      currentPlayer = playerX;
      TURNCOUNT = 0;
      UI.changeTurnText(currentPlayer.getName());
    }

    function endGame(turncount, draw = false) {
      UI.disableButtons();
      draw
        ? UI.showGameOver(turncount, "Nobody")
        : UI.showGameOver(turncount, currentPlayer.getName());
    }

    function resetGame() {
      UI.hideGameOver();
      UI.initGameDisplay();
      Board.clearBoard();
    }

    function playTurn(e) {
      let choice = parseInt(e.target.getAttribute("value"));

      if (isValid(choice)) {
        Board.updateBoard(choice);
        currentPlayer.addSpace(choice);
        UI.changeSpaceText(e.target, currentPlayer.getSign());
        UI.updateText(`${currentPlayer.getName()} chose spot ${choice}.`);
        TURNCOUNT++;
        if (TURNCOUNT >= MAXTURNS) endGame(TURNCOUNT, true);
        if (isWinningMove()) endGame(TURNCOUNT);
        nextPlayer();
      } else {
        UI.updateText("Invalid move. Please choose another space.");
      }
    }

    function nextPlayer() {
      currentPlayer == playerX
        ? (currentPlayer = playerO)
        : (currentPlayer = playerX);

      UI.changeTurnText(currentPlayer.getName());
    }

    function isValid(choice) {
      let isAvailable = !Board.getSpaces().includes(choice);
      console.log(isAvailable);
      return isAvailable;
    }

    function isWinningMove() {
      let isWin = false;
      let playerSpaces = currentPlayer.getSpaces();
      if (playerSpaces.length < 3) return isWin;

      // does player have all nums of a winning combo
      winningCombos.forEach(function (combo) {
        let comboCount = 0;

        for (let num of combo) {
          if (playerSpaces.includes(num)) {
            comboCount++;
          }

          if (comboCount === 3) {
            isWin = true;
            break;
          }
        }
      });

      return isWin;
    }

    return { setupGame, playTurn, endGame, resetGame };
  })();

  /*__________________________________________________ */
  /* Board

  - Tracks all currently used spaces
  - Spaces are numbered 1-9 according to a tic-tac-toe grid:
      1 | 2 | 3
      __________
      4 | 5 | 6
      __________
      7 | 8 | 9
  ____________________________________________________ */

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

    return { getSpaces, updateBoard, clearBoard };
  })();

  /*__________________________________________________ */
  /* Player

  - Holds player names
  - Holds player symbol (currently just 'x' or 'o')
  - Tracks player's held spaces according to board grid (1-9)
  ____________________________________________________ */

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

  /*__________________________________________________ */
  /* UI

  - Sets up DOM elements for display and player control
  - Event listeners here hold callback functions from the Control module
  - The Control methods invoke the public UI functions
  ____________________________________________________ */
  const UI = (function () {
    const textUpdate = document.querySelector(".text-updates");
    const turnText = document.querySelector(".turn-text");
    const gameBoard = document.querySelector(".game-board");
    const gameOver = document.querySelector(".game-over");
    const winningPlayer = document.querySelector(".winning-player");
    const mainContainer = document.querySelector(".main");
    const gameSetup = document.querySelector(".game-setup");
    const setupForm = document.querySelector(".game-setup__form");
    const reset = document.querySelector(".reset");

    gameBoard.addEventListener("click", Control.playTurn);
    setupForm.addEventListener("submit", Control.setupGame);
    reset.addEventListener("click", Control.resetGame);

    function updateText(text) {
      textUpdate.textContent = text;
    }

    function changeTurnText(playerName) {
      turnText.textContent = `${playerName}'s Turn`;
    }

    function changeSpaceText(target, symbol) {
      if (target.tagName === "DIV") {
        target.classList.add("square-selected");
        target.textContent = symbol;
      }
    }

    function disableButtons() {
      gameBoard.classList.add("disable-game-board");
    }

    function enableButtons() {
      gameBoard.classList.remove("disable-game-board");
    }

    function showGameOver(turncount, playerName) {
      winningPlayer.textContent = `${playerName} wins on turn ${turncount}!`;
      gameOver.classList.add("show-board");
    }

    function hideGameOver() {
      gameOver.classList.remove("show-board");
    }

    function initGameDisplay() {
      if (gameSetup.classList.contains("display-none")) {
        gameSetup.classList.remove("display-none");
      } else {
        gameSetup.classList.add("display-none");
      }

      if (mainContainer.classList.contains("display-none")) {
        mainContainer.classList.remove("display-none");
      } else {
        mainContainer.classList.add("display-none");
      }
      resetAllSquares();
      enableButtons();
      setupForm.reset();
    }

    function resetAllSquares() {
      gameBoard.childNodes.forEach((square) => {
        if (
          square.tagName === "DIV" &&
          square.classList.contains("square-selected")
        ) {
          square.classList.remove("square-selected");
          square.textContent = square.getAttribute("value");
        }
      });
    }

    return {
      updateText,
      changeTurnText,
      disableButtons,
      showGameOver,
      changeSpaceText,
      initGameDisplay,
      hideGameOver,
    };
  })();
})();
