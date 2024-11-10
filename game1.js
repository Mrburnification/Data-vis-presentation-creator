let cards = [];
let revealedCards = [];
let matchedPairs = 0;
const gridSize = 4;
let cardWidth, cardHeight;
let startTime = -1;
let hueValue = 0;
const revealTime = 1000; // Time in milliseconds
const cardPadding = 10; // Padding between cards
const topPadding = 50; // Space at the top to display game time


let gameStats = {
  turns: 0,
  firstPairTurns: 0,
  secondPairTurns: 0,
  thirdPairTurns: 0,
  firstPairTime: 0,
  secondPairTime: 0,
  thirdPairTime: 0,
  timeTaken: 0,
  startTime: 0
};

function setup() {
  gameState = "notStarted"; // Game hasn't started yet
  createCanvas(windowWidth, windowHeight);
  cardWidth = width / gridSize;
  cardHeight = height / gridSize;
  colorMode(HSB, 360, 100, 100);
  initializeCards();
  gameStats.startTime = millis();
}

function draw() {
  if (gameState === "notStarted") {
    background(255);
    fill(0);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Click to Start Game", width / 2, height / 2);
    // No need to call other functions like displayCards or updateTimer here
  } else {
  background(255);
  displayCards();
  updateTimer();
  displayGameTime();
}
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initializeCards(); // Recalculate card positions with new canvas size
}

function displayGameTime() {
  let textSizeValue = min(cardWidth, cardHeight) / 3;
  fill(0);
  textSize(textSizeValue);
  textAlign(LEFT, TOP);
  let currentTime = matchedPairs === (gridSize * gridSize) / 2 ? gameStats.timeTaken : (millis() - gameStats.startTime) / 1000;
  text("Time: " + currentTime.toFixed(2) + "s", cardPadding, cardPadding);
}

function updateTimer() {
  if (revealedCards.length === 2 && startTime > -1) {
    let elapsedTime = millis() - startTime;
    if (elapsedTime < revealTime) {
      for (let card of revealedCards) {
        drawTimer(card, elapsedTime);
      }
    } else {
      // Flip back only if they are not matched
      if (!revealedCards[0].matched && !revealedCards[1].matched) {
        revealedCards[0].revealed = false;
        revealedCards[1].revealed = false;
      }
      revealedCards = [];
      startTime = -1;
    }
  }
}

function initializeCards() {
  // Define and populate the numbers array
  let numbers = [];
  for (let i = 0; i < (gridSize * gridSize) / 2; i++) {
    numbers.push(i);
    numbers.push(i);
  }
  shuffle(numbers, true);

  // Adjust card dimensions based on the canvas size and padding
  cardWidth = (width - cardPadding * (gridSize + 1)) / gridSize;
  cardHeight = (height - topPadding - cardPadding * (gridSize + 1)) / gridSize;

  cards = []; // Clear existing cards if any

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      let card = {
        x: i * (cardWidth + cardPadding) + cardPadding,
        y: j * (cardHeight + cardPadding) + topPadding + cardPadding,
        width: cardWidth,
        height: cardHeight,
        number: numbers[i * gridSize + j],
        revealed: false,
        matched: false
      };
      cards.push(card);
    }
  }
}

function displayCards() {
  let textSizeValue = min(cardWidth, cardHeight) / 3;
  for (let card of cards) {
    if (card.revealed || card.matched) {
      fill(70);
      rect(card.x, card.y, card.width, card.height);
      fill(0);
      noStroke();
      textSize(textSizeValue);
      textAlign(CENTER, CENTER);
      text(card.number, card.x + card.width / 2, card.y + card.height / 2);
      stroke(0);
    } else {
      fill(20);
      noStroke();
      rect(card.x, card.y, card.width, card.height);
      stroke(0);
    }
  }
}
function drawTimer(card, elapsedTime) {
  let angle = map(elapsedTime, 0, revealTime, TWO_PI, 0);

  // Adjust arc position and size based on card size
  let arcX = card.x + card.width - card.width / 5;
  let arcY = card.y + card.height / 5;
  let arcSize = min(cardWidth, cardHeight) / 5;

  // Styling for the arc
  stroke(0);
  strokeWeight(2);

  // Cycling through the hue for the fill color
  hueValue = (hueValue + 1) % 360;
  fill(hueValue, 100, 60);

  // Drawing the arc
  arc(arcX, arcY, arcSize, arcSize, 0, angle, PIE);

  // Resetting stroke weight for other drawings
  strokeWeight(1);
}

function mousePressed() {
    if (gameState === "notStarted") {
    startGame();
  } else {
  if (gameState !== "inProgress") {
    return; // Do nothing if the game hasn't started
  }
  if (revealedCards.length === 2 && startTime > -1) {
    return; // Do nothing if two cards are revealed and waiting for the timer
  }

    if (revealedCards.length === 1) { // Increment turn count when a pair is being checked
    gameStats.turns++;
    if (matchedPairs === 0) {
      gameStats.firstPairTurns = gameStats.turns;
    } else if (matchedPairs === 1) {
      gameStats.secondPairTurns = gameStats.turns;
    } else if (matchedPairs === 2) {
      gameStats.thirdPairTurns = gameStats.turns;
    }
  }

  for (let card of cards) {
    if (mouseX > card.x && mouseX < card.x + card.width &&
        mouseY > card.y && mouseY < card.y + card.height &&
        !card.matched && !card.revealed) {
      
      card.revealed = true;
      revealedCards.push(card);

      if (revealedCards.length === 2) {
        startTime = millis();
        checkMatch(); // Immediately check for a match
      }

      break;
    }
  }
  }
}


function startGame() {
  gameState = "inProgress";
  gameStats.startTime = millis(); // Reset the start time
  initializeCards(); // Initialize the cards for a new game
}

function checkMatch() {
  if (revealedCards.length === 2) {
    if (revealedCards[0].number === revealedCards[1].number) {
      revealedCards[0].matched = true;
      revealedCards[1].matched = true;
      matchedPairs++;
      let currentTime = millis();

      // Update time for finding pairs
      if (matchedPairs === 1) {
        gameStats.firstPairTime = round(((currentTime - gameStats.startTime) / 1000), 4); // convert to seconds
      } else if (matchedPairs === 2) {
        gameStats.secondPairTime = round(((currentTime - gameStats.startTime) / 1000),4);
      } else if (matchedPairs === 3) {
        gameStats.thirdPairTime = round(((currentTime - gameStats.startTime) / 1000),4);
      }

      // Check if game is over
      if (matchedPairs === (gridSize * gridSize) / 2) {
        console.log("Game Over. You found all pairs!");
        gameStats.timeTaken = round(((currentTime - gameStats.startTime) / 1000),4) ;
        console.log("Game Statistics: ", JSON.stringify(gameStats));
      }

      revealedCards = [];

    } else {
      // If no match, flip cards back after a delay
      setTimeout(() => {
        revealedCards[0].revealed = false;
        revealedCards[1].revealed = false;
        revealedCards = [];
      }, 1000);
    }
  }
}
