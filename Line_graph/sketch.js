// sketch.js

let elements = [];
let clickCount = 0; // Global click counter
let freeClickMode = false;
let currentTrackIndex = null;
let currentElementIndex = null;
let scale = 1;
let adjustedMouseX;
let adjustedMouseY;
let canvasWidth = 800;
let canvasHeight = 600;

function setup() {
    let canvas = createCanvas(canvasWidth, canvasHeight);
    pixelDensity(1);
    canvas.parent('canvas-container');
    //test
    windowResized();
}

function draw() {
    background(220);

    let adjustedMouseX = mouseX / scale;
    let adjustedMouseY = mouseY / scale;

    let elements = tracks.map(track => track.flat());


        for (let track of elements) {
            for(let i=0; i<clickCount; i++){
            if (track[i-1]) {
                track[i-1].show();
                track[i-1].animate();
                track[i-1].applyTransition(clickCount);
            }
        }
        }

        if (freeClickMode) {
            fill(0, 255, 0, 100);
            ellipse(adjustedMouseX, adjustedMouseY, 20, 20);
            const selectedElement = tracks[currentTrackIndex][currentElementIndex];
            selectedElement.x = adjustedMouseX;
            selectedElement.y = adjustedMouseY;
        }

}

// Function to check if the current click count meets the target
function clicks(targetCount) {
    return clickCount >= targetCount;
}

function startFreeClickMode(trackIndex, elementIndex) {
    console.log(trackIndex + " " + elementIndex);
    freeClickMode = true;
    currentTrackIndex = trackIndex;
    currentElementIndex = elementIndex;
    //draw();  // Ensure canvas is updated
}
// Function to handle mouse press events and increment click count
function mousePressed() {

    let adjustedMouseX = mouseX / scale;
    let adjustedMouseY = mouseY / scale;

    if (freeClickMode) {

        console.log("return to normal mode");
        freeClickMode = false;
        showEditPopup(currentTrackIndex, currentElementIndex);

    } else {
        if (adjustedMouseX >= 0 && adjustedMouseX <= width && adjustedMouseY >= 0 && adjustedMouseY <= height) {
            clickCount++;
            updateTimeline();
            // Small animation: create a circle that expands and fades out
            let animationStartFrame = frameCount;
            let animationDuration = 60; // Duration of the animation in frames
            let initialRadius = 10;
            let maxRadius = 50;
            let animationColor = color(255, 0, 0);

            function animateClick() {
                let elapsedFrames = frameCount - animationStartFrame;
                if (elapsedFrames <= animationDuration) {
                    let t = elapsedFrames / animationDuration; // Normalized time [0, 1]
                    let radius = lerp(initialRadius, maxRadius, t);
                    let alpha = lerp(255, 0, t);
                    fill(animationColor.levels[0], animationColor.levels[1], animationColor.levels[2], alpha);
                    noStroke();
                    ellipse(adjustedMouseX, adjustedMouseY, radius, radius);
                    requestAnimationFrame(animateClick); // Continue the animation
                }
            }

            animateClick();
        }
}
}

class bblank {
    constructor(colorbox) {
        this.name = "blank";
        this.colorbox = colorbox;
        this.transitionJSON = {transitions:[]};
        this.initialState = {};
    }

    show() {
    }

    animate() {
        // this.x += 2;
    }

    reset() {
        for (let prop in this.initialState) {
            this[prop] = this.initialState[prop];
        }
    }

    setInitialStates() {
        for (let prop in this) {
            if (typeof this[prop] !== 'function' && prop !== 'initialState' && prop !== 'transitionJSON') {
                this.initialState[prop] = this[prop];
            }
        }
    }

    applyTransition(clickCount) {
        this.transitionJSON.transitions.forEach(transition => {
            if (transition.click === clickCount) {
                const property = transition.property;
                if (this.initialState[property] === undefined) {
                    this.initialState[property] = this[property];
                }
                this[property] = parseFloat(transition.value) || transition.value;
            } 
            // else if (transition.click > clickCount) {
            //     // Revert to initial state if clickCount is less than transition click
            //     if (this.initialState[transition.property] !== undefined) {
            //         this[transition.property] = this.initialState[transition.property];
            //     }
            // }
        });
    }
}

// Element class example
class bcircle {
    constructor(colorbox) {
        this.name = "Circle";
        this.initialX = 0;
        this.initialY = height / 2;
        this.initialColor = color;

        this.x = this.initialX;
        this.y = this.initialY;
        this.color = this.initialColor;
        this.colorbox = colorbox;
        this.transitionJSON = {transitions:[]};
        this.initialState = {};
    }

    show() {
        fill(this.colorbox);
        ellipse(this.x, this.y, 50, 50);
    }

    animate() {
        // this.x += 2;
    }

    reset() {
        for (let prop in this.initialState) {
            this[prop] = this.initialState[prop];
        }
    }

    setInitialStates() {
        for (let prop in this) {
            if (typeof this[prop] !== 'function' && prop !== 'initialState' && prop !== 'transitionJSON') {
                this.initialState[prop] = this[prop];
            }
        }
    }

    applyTransition(clickCount) {
        this.transitionJSON.transitions.forEach(transition => {
            if (transition.click === clickCount) {
                const property = transition.property;
                if (this.initialState[property] === undefined) {
                    this.initialState[property] = this[property];
                }
                this[property] = parseFloat(transition.value) || transition.value;
            } 
            // else if (transition.click > clickCount) {
            //     // Revert to initial state if clickCount is less than transition click
            //     if (this.initialState[transition.property] !== undefined) {
            //         this[transition.property] = this.initialState[transition.property];
            //     }
            // }
        });
    }
}

// written words or faded 
class writeWord {
    constructor(colorbox, word="word", x=width/2, y=height/2, size=30, spd=10, fade=false, write=true) {
    this.name = "Write Word";
      this.word = word;
      this.x = x;
      this.y = y;
      this.pos = 0;
      this.textspd = spd;
      this.size = size;
      this.opacity = 255;
      this.fade = fade;
      this.write = write;
      this.colorbox = colorbox;
      this.transitionJSON = {transitions:[]};
      this.initialState = {};
    }
  
    show(){
        if(this.fade==true){
            this.fadedisplay();
        }
        if(this.write==true){
            this.writedisplay();
        }
    }

    setInitialStates() {
        for (let prop in this) {
            if (typeof this[prop] !== 'function' && prop !== 'initialState' && prop !== 'transitionJSON') {
                this.initialState[prop] = this[prop];
            }
        }
    }

    applyTransition(clickCount) {
        this.transitionJSON.transitions.forEach(transition => {
            if (transition.click === clickCount) {
                const property = transition.property;
                if (this.initialState[property] === undefined) {
                    this.initialState[property] = this[property];
                }
                this[property] = parseFloat(transition.value) || transition.value;
            } 
            // else if (transition.click > clickCount) {
            //     // Revert to initial state if clickCount is less than transition click
            //     if (this.initialState[transition.property] !== undefined) {
            //         this[transition.property] = this.initialState[transition.property];
            //     }
            // }
        });
    }

    writedisplay() {
      //addding format for the text
      textSize(this.size);
      strokeWeight(0);
      stroke(0);
      fill(0, 0, 0, this.opacity);
      textAlign(CENTER, CENTER);
  
      text(this.word.substring(0, this.pos), this.x, this.y);
      this.pos = this.pos + (this.textspd/100);
    }
    
    fadedisplay(){
      //addding format for the text
      textSize(this.size);
      strokeWeight(0);
      stroke(0);
      fill(0, 0, 0, this.opacity);
      textAlign(CENTER, CENTER);
  
      text(this.word, this.x, this.y);
      this.opacity = this.opacity + this.textspd;
    }

    reset(){
        //this.textspd = 0
        this.pos = 0;
        //this.opacity = 255;
        if(this.fade==true){this.opacity=0};
        for (let prop in this.initialState) {
            this[prop] = this.initialState[prop];
        }
        this.initialState = {};
    }

    animate(){}

  }

// Textbox element class
class Textbox {
    constructor(colorbox, text, x, y, size, color = (50, 50, 50), opacity = 1, visible = true) {
        this.name = "Text Box";
        this.text = text;
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.opacity = opacity;
        this.visible = visible;
        this.colorbox = colorbox;
        this.textalign = CENTER;
        this.textalignActual = CENTER;
        this.transitionJSON = {transitions:[]};
        this.initialState = {};
    }

    show() {
        if(this.textalign == "CENTER"){
            this.textalignActual = CENTER;
        }
        else if(this.textalign == "LEFT"){
            this.textalignActual = LEFT;
        }
        else if(this.textalign == "RIGHT"){
            this.textalignActual = RIGHT;
        }
        let bbox = estimateTextBounds(this.text, this.x, this.y, this.size);
        textAlign(this.textalignActual, this.textalignActual);
        fill(this.color);
        stroke(0);
        rectMode(CORNER);
        rect(bbox.x - (bbox.w * 0.02) / 2, this.y - bbox.h, bbox.w + bbox.w * 0.02, bbox.h * 2);
        fill(0);
        noStroke();
        textSize(this.size);
        text(this.text, this.x, this.y);
    }

    animate() {
        // Add any animation logic here if needed
    }

    reset() {
        for (let prop in this.initialState) {
            this[prop] = this.initialState[prop];
        }
    }

    setInitialStates() {
        for (let prop in this) {
            if (typeof this[prop] !== 'function' && prop !== 'initialState' && prop !== 'transitionJSON') {
                this.initialState[prop] = this[prop];
            }
        }
    }

    applyTransition(clickCount) {
        this.transitionJSON.transitions.forEach(transition => {
            if (transition.click === clickCount) {
                const property = transition.property;
                if (this.initialState[property] === undefined) {
                    this.initialState[property] = this[property];
                }
                this[property] = parseFloat(transition.value) || transition.value;
            } 
            // else if (transition.click > clickCount) {
            //     // Revert to initial state if clickCount is less than transition click
            //     if (this.initialState[transition.property] !== undefined) {
            //         this[transition.property] = this.initialState[transition.property];
            //     }
            // }
        });
    }
}

class targetBox {
    constructor(colorbox, result=90, target=100, scaler=100, color = (13, 106, 191)) {
        this.colorbox = colorbox;
        this.name = "Target Box";
        this.text = "Title";
      this.result = result;
      this.shadow = true;
      this.counter = 0;
      this.x = (width / 6) * 1;
      this.y = (height / 6) * 3;
      this.changey = (height / 6) * 3;
      this.target = target;
      this.scaler = scaler;
      this.resize = scaler * 1.2;
      this.color = color;
      this.opacity = 255;
      this.transitionJSON = {transitions:[]};
      this.initialState = {};
    }
    difference() {
      stroke(2);
      let textchange = "X";
      let diff = this.result - this.target;
      textSize(this.scaler * 0.15);
      if (diff < 0) {
        fill(100, 0, 0, this.opacity - 900);
        textchange = "below target";
      } else {
        fill(0, 100, 0, this.opacity - 900);
        textchange = "above target";
      }
      text(round(diff, 1) + textchange, this.x, this.y + this.scaler * 0.6);
      stroke(0);
    }
  
    show() {
      noFill();
      fill(0, 0, 0, this.opacity);
      strokeWeight(0);
      stroke(0, 0, 0, this.opacity);
      rectMode(CENTER);
  
      textSize(this.scaler * 0.17);
      text(this.text, this.x, this.y - this.scaler * 0.75);
  
      strokeWeight(4);
        if(this.shadow){
      //shadow
      noStroke();
      fill(0, 0, 0, this.opacity);
      rect(
        this.x + this.scaler * 0.05,
        this.y - this.scaler * 0.4 + this.scaler * 0.05,
        this.scaler * 1.1,
        this.scaler * 0.4
      );
      //shadow
    }
      stroke(0);
      fill(this.color);
      rect(
        this.x,
        this.y - this.scaler * 0.4,
        this.scaler * 1.1,
        this.scaler * 0.4
      );
  
      noStroke();
      if(this.shadow){
      //shadow2
      fill(0, 0, 0, this.opacity);
      rect(
        this.x + this.scaler * 0.05,
        this.y + this.scaler * 0.05,
        this.scaler * 1.1,
        this.scaler * 0.7
      );
      //shadow2
    }
      stroke(0);
      fill(220,220,220, this.opacity);
      rect(this.x, this.y, this.scaler * 1.1, this.scaler * 0.7);
    
      fill(0, 0, 0, this.opacity);
      textSize(this.scaler * 0.18);
      strokeWeight(0);
      fill(0, 0, 0);
      textAlign(CENTER, CENTER);
      text("Target " + this.target + "%", this.x, this.y - this.scaler * 0.45);
      textSize(this.scaler * 0.35);
      text(round(this.counter, 1) + "%", this.x, this.y);
      if(this.opacity<255){
      this.opacity = this.opacity + 5;
      }
      else{this.opacity = 255;}
      //changing size
    //   if (this.scaler < this.resize) {
    //     this.scaler = this.scaler + 0.1;
    //   }
    //   if (this.scaler > this.resize * 0.95) {
    //     this.scaler = this.scaler - 0.1;
    //   }
    //   //changing y
    //   if (this.y < this.changey) {
    //     this.y = this.y + 0.6;
    //   }
    //   if (this.y > this.changey * 0.95) {
    //     this.y = this.y - 0.6;
    //   }
    }
    animate() {
      if (this.counter < this.result - 1) {
        this.counter = this.counter + random(0.8, 1.5);
      } else {
        this.counter = this.result;
      }
    }

    reset(){
        this.counter = 0;
        for (let prop in this.initialState) {
            this[prop] = this.initialState[prop];
        }
    }

    setInitialStates() {
        for (let prop in this) {
            if (typeof this[prop] !== 'function' && prop !== 'initialState' && prop !== 'transitionJSON') {
                this.initialState[prop] = this[prop];
            }
        }
    }

    applyTransition(clickCount) {
        this.transitionJSON.transitions.forEach(transition => {
            if (transition.click === clickCount) {
                const property = transition.property;
                if (this.initialState[property] === undefined) {
                    this.initialState[property] = this[property];
                }
                this[property] = parseFloat(transition.value) || transition.value;
            } 
            // else if (transition.click > clickCount) {
            //     // Revert to initial state if clickCount is less than transition click
            //     if (this.initialState[transition.property] !== undefined) {
            //         this[transition.property] = this.initialState[transition.property];
            //     }
            // }
        });
    }
  }

class PieGraph {
constructor(colorbox, result = 90, target = 100, scaler = 100) {
    this.colorbox = colorbox;
    this.name = "Pie Graph";
    this.text = "Title";
    this.x = width / 2;
    this.y = height / 2;
    this.target = target;
    this.scaler = scaler;
    this.resize = scaler * 1.2;
    this.color = color;
    this.opacity = 255;
    this.data = [40, 20, 30, 10];
    this.defaultColors = ['#0D6ABF', '#DB2D20', '#F0C200', '#009640', '#8B4513', '#4B0082', '#FF1493', '#00CED1'];
    this.colors = this.defaultColors.slice(0, this.data.length);
    this.labels = ["john", "bob", "mark", "tim"];
    this.angles = this.data.map(value => TWO_PI * (value / 100));
    this.currentAngles = Array(this.data.length).fill(0);
    this.currentSegment = 0;
    this.animationStep = 0.2;
    this.animationComplete = false;
    this.transitionJSON = {transitions:[]};
    this.initialState = {};
    this.updateAngles();
}

show() {
    
    push();
    textSize(this.scaler/8);
    stroke(0);
    strokeWeight(1);
    translate(this.x, this.y);
    let lastAngle = 0;
    for (let i = 0; i < this.data.length; i++) {
        stroke(1);
        fill(this.getColor(i));
    arc(0, 0, this.scaler * 2, this.scaler * 2, lastAngle, lastAngle + this.currentAngles[i], PIE);
    
    // Calculate the middle angle for the text
    let middleAngle = lastAngle + this.currentAngles[i] / 2;

    // Display the value if the animation is complete
    if (this.animationComplete) {
        let tx = (this.scaler * 0.6) * cos(middleAngle);
        let ty = (this.scaler * 0.6) * sin(middleAngle);
        fill(0);
        noStroke();
        textAlign(CENTER, CENTER);
        text(this.data[i], tx, ty);
    }

    lastAngle += this.currentAngles[i];
    }
    pop();
}

getColor(index) {
    if (index >= this.colors.length) {
        return this.getNextColor();
    }
    return this.colors[index];
}

updateAngles() {
    this.angles = this.data.map(value => TWO_PI * (value / this.data.reduce((a, b) => a + b, 0)));
    this.currentAngles = Array(this.data.length).fill(0);
    this.currentSegment = 0;
    this.animationComplete = false;
}

updateData(newData) {
    this.data = newData.map(Number);
    // Ensure we have enough colors
    while (this.colors.length < this.data.length) {
        this.colors.push(this.getNextColor());
    }
    this.updateAngles();
}

getNextColor() {
    // If we've used all default colors, generate a random one
    if (this.colors.length >= this.defaultColors.length) {
        return color(random(255), random(255), random(255)).toString('#rrggbb');
    }
    return this.defaultColors[this.colors.length];
}

animate() {
    stroke(1);
    if(!this.animationComplete){
    let interval = setInterval(() => {
    if (this.currentSegment < this.data.length) {
        if (this.currentAngles[this.currentSegment] < this.angles[this.currentSegment] - .1) { // Add a small tolerance
        this.currentAngles[this.currentSegment] += this.animationStep;
        if (this.currentAngles[this.currentSegment] > this.angles[this.currentSegment]) {
            this.currentAngles[this.currentSegment] = this.angles[this.currentSegment];
        }
        } else {
        this.currentAngles[this.currentSegment] = this.angles[this.currentSegment]
        this.currentSegment++;
        }
    } else {
        clearInterval(interval);
        this.animationComplete = true; // Mark animation as complete
    }
    }, 30);
}
}

    reset() {
        for (let prop in this.initialState) {
            this[prop] = this.initialState[prop];
        }
        this.animationComplete = false;
        this.currentSegment = 0;
        this.currentAngles = Array(this.data.length).fill(0); 
    }

    setInitialStates() {
        for (let prop in this) {
            if (typeof this[prop] !== 'function' && prop !== 'initialState' && prop !== 'transitionJSON') {
                this.initialState[prop] = this[prop];
            }
        }
    }

    applyTransition(clickCount) {
        this.transitionJSON.transitions.forEach(transition => {
            if (transition.click === clickCount) {
                const property = transition.property;
                if (this.initialState[property] === undefined) {
                    this.initialState[property] = this[property];
                }
                this[property] = parseFloat(transition.value) || transition.value;
            } 
            // else if (transition.click > clickCount) {
            //     // Revert to initial state if clickCount is less than transition click
            //     if (this.initialState[transition.property] !== undefined) {
            //         this[transition.property] = this.initialState[transition.property];
            //     }
            // }
        });
    }
}

class ColumnGraph {
    constructor(colorbox, x, y, size) {
      this.x = x;
      this.y = y;
      this.name = "Column Graph";
      this.colorbox = colorbox;
      this.size = size;
      this.data = [40, 50, 30]; // Array of numeric values
      this.dataLabels = ["john", "bob", "mark"]; // Array of labels
      this.maxValue = 0;
      this.animationProgress = 0;
      this.ticks_x = this.data.length;
      this.ticks_y = 5;
      this.columnWidth = 40; // Default column width
      this.animationType = 'sequential';
      this.currentAnimatingColumn = 0;
      this.defaultColors = ['#0D6ABF', '#DB2D20', '#F0C200', '#009640', '#8B4513', '#4B0082', '#FF1493', '#00CED1']; // Use predefined default colors
      this.colors = this.defaultColors.slice(0, this.data.length);
      this.transitionJSON = { transitions: [] };
      this.initialState = {};
  
      this.processData();
    }
  
    processData() {
      // Find max value
      this.maxValue = max(...this.data);
  
      // Ensure the colors array has enough colors for the data values
      while (this.colors.length < this.data.length) {
        this.colors.push('#000000'); // Default to black if more colors are needed
      }
    }

    updateData(newData) {
        this.data = newData.map(Number);
        // Ensure we have enough colors
        while (this.colors.length < this.data.length) {
            this.colors.push(this.getNextColor());
        }
        this.processData();
    }

    getColor(index) {
        if (index >= this.colors.length) {
            return this.getNextColor();
        }
        return this.colors[index];
    }
  
    getNextColor() {
        // If we've used all default colors, generate a random one
        if (this.colors.length >= this.defaultColors.length) {
            return color(random(255), random(255), random(255)).toString('#rrggbb');
        }
        return this.defaultColors[this.colors.length];
    }

    show() {
      push();
      translate(this.x, this.y);
  
      this.drawAxes();
      this.drawColumns();
      this.drawLegend();
  
      pop();
    }
  
    drawAxes() {
      stroke(0);
      line(0, 0, 0, -this.size);
      line(0, 0, this.size, 0);
  
      // Y-axis ticks and labels
      for (let i = 0; i <= this.maxValue; i += ceil(this.maxValue / this.ticks_y)) {
        let y = map(i, 0, this.maxValue, 0, -this.size);
        line(0, y, -5, y);
        textAlign(RIGHT, CENTER);
        noStroke();
        text(i, -10, y);
        stroke(0);
      }
    }
  
    drawColumns() {
      noStroke();
      let columnSpacing = this.size / this.data.length;
      for (let i = 0; i < this.data.length; i++) {
        let columnHeight = (this.data[i] / this.maxValue) * this.size;
        let animatedHeight;
  
        if (this.animationType === 'all') {
          animatedHeight = columnHeight * this.animationProgress;
        } else { // sequential
          if (i < this.currentAnimatingColumn) {
            animatedHeight = columnHeight;
          } else if (i === this.currentAnimatingColumn) {
            animatedHeight = columnHeight * this.animationProgress;
          } else {
            animatedHeight = 0;
          }
        }
  
        fill(this.getColor(i));
        rect(i * columnSpacing + (columnSpacing - this.columnWidth) / 2, 0, this.columnWidth, -animatedHeight);
  
        // Draw column value
        if (animatedHeight > 0) {
          fill(0);
          textAlign(CENTER, BOTTOM);
          let displayValue = floor(map(animatedHeight, 0, columnHeight, 0, this.data[i]));
          text(displayValue, i * columnSpacing + columnSpacing / 2, -animatedHeight - 5);
        }
      }
    }
  
    drawLegend() {
      for (let i = 0; i < this.dataLabels.length; i++) {
        let x = i * (this.size / this.dataLabels.length) + (this.size / this.dataLabels.length) / 2;
        textAlign(CENTER, TOP);
        fill(0);
        text(this.dataLabels[i], x, 20);
      }
    }
  
    animate() {
      if (this.animationType === 'all') {
        this.animationProgress = min(this.animationProgress + 0.02, 1);
      } else { // sequential
        this.animationProgress += 0.05;
        if (this.animationProgress >= 1) {
          this.animationProgress = 0;
          this.currentAnimatingColumn++;
          if (this.currentAnimatingColumn >= this.data.length) {
            // this.currentAnimatingColumn = this.data.length - 1;
          }
        }
      }
    }
  
    reset() {
      for (let prop in this.initialState) {
        this[prop] = this.initialState[prop];
      }
      this.animationProgress = 0;
      this.currentAnimatingColumn = 0;
    }
  
    setColumnWidth(newWidth) {
      this.columnWidth = newWidth;
    }
  
    setAnimationType(type) {
      if (type === 'all' || type === 'sequential') {
        this.animationType = type;
        this.reset();
      }
    }
  
    setInitialStates() {
      for (let prop in this) {
        if (typeof this[prop] !== 'function' && prop !== 'initialState' && prop !== 'transitionJSON') {
          this.initialState[prop] = this[prop];
        }
      }
    }
  
    applyTransition(clickCount) {
      this.transitionJSON.transitions.forEach(transition => {
        if (transition.click === clickCount) {
          const property = transition.property;
          if (this.initialState[property] === undefined) {
            this.initialState[property] = this[property];
          }
          this[property] = parseFloat(transition.value) || transition.value;
        }
      });
    }
  }
  


function clickBack(){
    clickCount = clickCount-1;
}

function clickForward(){
    clickCount = clickCount+1;
}

function resetAnimations(){
    let elements = tracks.map(track => track.flat());
    for (let track of elements) {
        for (let element of track) {
            if (element) {
                element.reset();
            }
        }
    }
}


function resetTimeline() {
    clickCount = 0;
    let elements = tracks.map(track => track.flat());
    for (let track of elements) {
        for (let element of track) {
            if (element) {
                element.reset();
            }
        }
    }
}

// Function to estimate text bounds
function estimateTextBounds(txt, x, y, textSize) {
    let textW = textWidth(txt);
    let textH = textSize * 1.05; // Rough estimate of text height
  
    return {
      x: x-textW/2,
      y: y - textH,
      w: textW,
      h: textH
    };
  }