(() => {
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

    function getPlayerName(playerSign) {
      let name = prompt(`What is player ${playerSign}'s name?'`);
      return name;
    }

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
      UI.changeTurnText(currentPlayer.getName());
    }

    function isValid(choice) {
      let isAvailable = !Board.getSpaces().includes(choice);
      console.log(isAvailable);
      return isAvailable;
    }

    function nextPlayer() {
      currentPlayer == playerX
        ? (currentPlayer = playerO)
        : (currentPlayer = playerX);

      UI.changeTurnText(currentPlayer.getName());
    }

    function isWinningMove() {
      let win = false;
      let playerSpaces = currentPlayer.getSpaces();
      if (playerSpaces.length < 3) return win;

      // does player have all nums of a winning combo
      winningCombos.forEach(function (combo) {
        let comboCount = 0;

        for (let num of combo) {
          if (playerSpaces.includes(num)) {
            comboCount++;
          }

          if (comboCount === 3) {
            win = true;
            break;
          }
        }
      });

      return win;
    }

    function endGame(turncount, draw = false) {
      UI.disableButtons();
      draw
        ? UI.showGameOver(turncount, "Nobody")
        : UI.showGameOver(turncount, currentPlayer.getName());
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
    const mainContainer = document.querySelector(".main");
    const gameSetup = document.querySelector(".game-setup");
    const setupForm = document.querySelector(".game-setup__form");
    gameBoard.addEventListener("click", Control.playTurn);
    setupForm.addEventListener("submit", Control.setupGame);

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

    function showGameOver(turncount, playerName) {
      winningPlayer.textContent = `${playerName} wins on turn ${turncount}!`;
      gameOver.classList.add("show-board");
    }

    function initGameDisplay() {
      gameSetup.classList.add("display-none");
      mainContainer.classList.remove("display-none");
    }

    return {
      updateText,
      changeTurnText,
      disableButtons,
      showGameOver,
      changeSpaceText,
      initGameDisplay,
    };
  })();
})();
