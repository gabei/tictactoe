(() => {
  console.log("Hello.");

  (function Board() {
    let spaces = [];

    function updateBoard(space) {
      spaces.push(space);
    }

    function clearBoard() {
      spaces = [];
    }

    return { updateBoard, clearBoard };
  })();

  (function Control() {
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
      currentPlayer = PlayerX;
      while (!isGameOver) {
        playTurn();
      }

      endGame();
    }

    function playTurn() {
      let choice = null;
      while (!isValid(choice)) {
        choice = prompt(`Player ${currentPlayer}: Choose a spot.`);
      }
      currentPlayer.addSpace(choice);
      Board.addSpace(choice);
      checkForWin();
      nextPlayer();
    }

    function isValid(choice) {
      return choice && !Board.spaces.includes(choice);
    }

    function nextPlayer() {
      currentPlayer = playerX
        ? (currentPlayer = playerO)
        : (currentPlayer = playerX);
    }

    function checkForWin() {
      let winningCombo = false;
      //check if a winning combination has been acheived by the current player
      winningCombos.forEach(function (combo) {
        for (let num of combo) {
          win = currentPlayer.spaces.includes(num);
        }
      });
      return winningCombo;
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

    return { name, sign, addSpace };
  }
})();
