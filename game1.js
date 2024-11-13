let cards = [];
let revealedCards = [];
let matchedPairs = 0;
const gridSize = 4;
let cardWidth, cardHeight;
let startTime = -1;
const revealTime = 1000;
const cardPadding = 10;
const topPadding = 50;

// Pre-calculate common values
let lastFrameTime = 0;
const targetFrameRate = 30; // Lower framerate for mobile
const frameInterval = 1000 / targetFrameRate;
let cachedCanvasWidth = 0;
let cachedCanvasHeight = 0;

// Cache DOM elements and commonly used values
let canvas;
let textSizeCache = {};

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
  // Optimize canvas creation
  const parentElement = document.getElementById('game-container') || document.body;
  const displayDensity = window.devicePixelRatio || 1;
  
  // Create canvas with device pixel ratio consideration
  canvas = createCanvas(
    parentElement.clientWidth, 
    parentElement.clientHeight, 
    P2D // Use P2D renderer for better mobile performance
  );
  
  // Scale the canvas according to device pixel ratio
  canvas.style('width', '100%');
  canvas.style('height', '100%');
  
  // Cache initial dimensions
  cachedCanvasWidth = width;
  cachedCanvasHeight = height;
  
  // Setup game
  gameState = "notStarted";
  colorMode(HSB, 360, 100, 100);
  calculateCardDimensions();
  initializeCards();
  gameStats.startTime = millis();
  
  // Enable double click prevention on mobile
  canvas.touchStarted(preventDoubleTouchZoom);
}

function calculateCardDimensions() {
  cardWidth = (cachedCanvasWidth - cardPadding * (gridSize + 1)) / gridSize;
  cardHeight = (cachedCanvasHeight - topPadding - cardPadding * (gridSize + 1)) / gridSize;
}

function draw() {
  // Frame rate limiting for mobile
  const currentTime = millis();
  if (currentTime - lastFrameTime < frameInterval) return;
  lastFrameTime = currentTime;

  if (gameState === "notStarted") {
    clear(); // More efficient than background()
    drawStartScreen();
  } else {
    clear();
    displayCards();
    updateTimer();
    displayGameTime();
  }
}

function drawStartScreen() {
  push();
  const fontSize = min(cachedCanvasWidth, cachedCanvasHeight) * 0.05;
  fill(0);
  noStroke();
  textSize(fontSize);
  textAlign(CENTER, CENTER);
  text("Click to Start Game", cachedCanvasWidth / 2, cachedCanvasHeight / 2);
  pop();
}

function displayCards() {
  push();
  const textSizeValue = min(cardWidth, cardHeight) / 3;
  
  // Batch similar operations
  noStroke();
  
  for (let card of cards) {
    if (card.revealed || card.matched) {
      fill(70);
      rect(card.x, card.y, card.width, card.height);
      
      fill(0);
      textAlign(CENTER, CENTER);
      if (!textSizeCache[textSizeValue]) {
        textSize(textSizeValue);
        textSizeCache[textSizeValue] = true;
      }
      text(card.number, card.x + card.width / 2, card.y + card.height / 2);
    } else {
      fill(20);
      rect(card.x, card.y, card.width, card.height);
    }
  }
  pop();
}

function displayGameTime() {
  push();
  const textSizeValue = min(cardWidth, cardHeight) / 3;
  fill(0);
  noStroke();
  textSize(textSizeValue);
  textAlign(LEFT, TOP);
  
  const currentTime = matchedPairs === (gridSize * gridSize) / 2 
    ? gameStats.timeTaken 
    : (millis() - gameStats.startTime) / 1000;
    
  text("Time: " + currentTime.toFixed(1) + "s", cardPadding, cardPadding);
  pop();
}

function updateTimer() {
  if (revealedCards.length !== 2 || startTime === -1) return;
  
  const elapsedTime = millis() - startTime;
  if (elapsedTime < revealTime) {
    for (let card of revealedCards) {
      drawTimer(card, elapsedTime);
    }
  } else {
    handleTimerComplete();
  }
}

function handleTimerComplete() {
  if (!revealedCards[0].matched && !revealedCards[1].matched) {
    revealedCards[0].revealed = false;
    revealedCards[1].revealed = false;
  }
  revealedCards = [];
  startTime = -1;
}

function drawTimer(card, elapsedTime) {
  push();
  const angle = map(elapsedTime, 0, revealTime, TWO_PI, 0);
  const arcSize = min(cardWidth, cardHeight) / 5;
  const arcX = card.x + card.width - arcSize;
  const arcY = card.y + arcSize;

  stroke(0);
  strokeWeight(2);
  fill((frameCount % 360), 100, 60);
  arc(arcX, arcY, arcSize, arcSize, 0, angle, PIE);
  pop();
}

function windowResized() {
  // Only resize if dimensions actually changed
  if (cachedCanvasWidth !== windowWidth || cachedCanvasHeight !== windowHeight) {
    resizeCanvas(windowWidth, windowHeight);
    cachedCanvasWidth = width;
    cachedCanvasHeight = height;
    calculateCardDimensions();
    initializeCards();
  }
}

function preventDoubleTouchZoom(event) {
  if (event.touches && event.touches.length > 1) {
    event.preventDefault();
  }
}

// Touch event handling
function touchStarted() {
  if (touches.length === 1) {
    handleInput(touches[0].x, touches[0].y);
    return false; // Prevent default
  }
}

function mousePressed() {
  handleInput(mouseX, mouseY);
}

function handleInput(x, y) {
  if (gameState === "notStarted") {
    startGame();
    return;
  }
  
  if (gameState !== "inProgress" || 
      (revealedCards.length === 2 && startTime > -1)) {
    return;
  }

  if (revealedCards.length === 1) {
    updateGameStats();
  }

  checkCardClick(x, y);
}

function checkCardClick(x, y) {
  for (let card of cards) {
    if (x > card.x && x < card.x + card.width &&
        y > card.y && y < card.y + card.height &&
        !card.matched && !card.revealed) {
      
      card.revealed = true;
      revealedCards.push(card);

      if (revealedCards.length === 2) {
        startTime = millis();
        checkMatch();
      }
      break;
    }
  }
}

function updateGameStats() {
  gameStats.turns++;
  if (matchedPairs === 0) {
    gameStats.firstPairTurns = gameStats.turns;
  } else if (matchedPairs === 1) {
    gameStats.secondPairTurns = gameStats.turns;
  } else if (matchedPairs === 2) {
    gameStats.thirdPairTurns = gameStats.turns;
  }
}

function startGame() {
  gameState = "inProgress";
  gameStats.startTime = millis();
  initializeCards();
}

function checkMatch() {
  if (revealedCards.length === 2) {
    if (revealedCards[0].number === revealedCards[1].number) {
      handleMatchSuccess();
    } else {
      handleMatchFailure();
    }
  }
}

function handleMatchSuccess() {
  revealedCards[0].matched = true;
  revealedCards[1].matched = true;
  matchedPairs++;
  
  const currentTime = millis();
  updateMatchTimes(currentTime);
  
  if (matchedPairs === (gridSize * gridSize) / 2) {
    handleGameComplete(currentTime);
  }
  
  revealedCards = [];
}

function handleMatchFailure() {
  setTimeout(() => {
    revealedCards[0].revealed = false;
    revealedCards[1].revealed = false;
    revealedCards = [];
  }, revealTime);
}

function updateMatchTimes(currentTime) {
  const timeInSeconds = round((currentTime - gameStats.startTime) / 1000, 4);
  if (matchedPairs === 1) {
    gameStats.firstPairTime = timeInSeconds;
  } else if (matchedPairs === 2) {
    gameStats.secondPairTime = timeInSeconds;
  } else if (matchedPairs === 3) {
    gameStats.thirdPairTime = timeInSeconds;
  }
}

function handleGameComplete(currentTime) {
  gameStats.timeTaken = round((currentTime - gameStats.startTime) / 1000, 4);
  console.log("Game Over. You found all pairs!");
  console.log("Game Statistics: ", JSON.stringify(gameStats));
}