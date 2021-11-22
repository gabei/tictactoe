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
      let name = prompt(`What is ${playerSign}'s name?`);
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
      while (!isGameOver) {
        playTurn();
      }

      endGame();
    }

    function playTurn() {
      getPlayerChoice();
      checkForWin();
      nextPlayer();
      console.log(Board.getSpaces());
    }

    function getPlayerChoice() {
      let choice = null;
      while (!isValid(choice)) {
        choice = prompt(`Player ${currentPlayer.name}: Choose a spot.`);
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
      currentPlayer = playerX
        ? (currentPlayer = playerO)
        : (currentPlayer = playerX);
    }

    function checkForWin() {
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
      console.log(`Game over! ${currentPlayer} wins!`);
    }

    return { setupGame };
  })();

  function Player(name, playerSign) {
    let spaces = [];
    let sign = playerSign;

    function addSpace(space) {
      spaces.push(space);
    }

    function getSpaces() {
      return spaces;
    }

    return { name, sign, addSpace, getSpaces };
  }

  Control.setupGame();
})();
