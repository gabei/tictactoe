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
      playGame();
    }

    function playGame() {
      currentPlayer = playerX;
      while (isGameOver === false) {
        playTurn();
      }

      endGame();
    }

    async function getPlayerChoice() {
      console.log("getPlayerChoice()");
      let choice = null;
      while (!isValid(choice)) {
        // UI.updateText(`${currentPlayer}: Choose a number!`);
        // choice = await playerInput();
        choice = prompt(`${currentPlayer.getName()}: select a number 1-9`);
      }
      currentPlayer.addSpace(choice);
      Board.updateBoard(choice);
    }

    function isValid(choice) {
      let exists = choice;
      let isInRange = choice >= 1 && choice <= 9;
      let isAvailable = !Board.getSpaces().includes(choice);
      return exists && isInRange && isAvailable;
    }

    function nextPlayer() {
      console.log("nextPlayer()");

      if (currentPlayer === playerX) {
        currentPlayer = playerO;
      }

      if (currentPlayer === playerO) {
        currentPlayer = playerX;
      }
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
    }

    function playTurn(e) {
      let choice = e.target.getAttribute("value");
      console.log(choice);
      console.log(isValid(choice));

      if (isValid(choice)) {
        Board.updateBoard(choice);
        currentPlayer.addSpace(choice);
        if (isWinningMove()) {
          endGame();
        }
        nextPlayer();
      } else {
        console.log("bad move");
      }
    }

    return { setupGame, playTurn };
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
    const textUpdate = document.querySelector(".text-update");
    const gameBoard = document.querySelector(".game-board");

    gameBoard.addEventListener("click", Control.playTurn);

    function updateText(text) {
      textUpdate.textContent = text;
    }

    return { updateText };
  })();

  Control.setupGame();
})();
