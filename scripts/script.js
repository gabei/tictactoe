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
    let isGameOver;
    let currentPlayer;

    function getPlayerName(playerSign) {
      let name = alert(`What is ${playerSign}'s name?`);
      return name;
    }

    function addPlayers() {
      let playerX = getPlayerName("x");
      let playerO = getPlayerName("o");
    }

    function setupGame() {}

    function playGame() {}

    function nextPlayer() {
      currentPlayer.sign = "x" ? (currentPlayer = "o") : (currentPlayer = "x");
    }
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
