let animations = [];
let currentTime = 0;
let playing = false;
let ticker;
let currentFrameDisplay;

function setup() {
    let canvas = createCanvas(800, 400);
    canvas.parent('canvas-container');
    background(220);

    let addTrackBtn = select('#add-track-btn');
    addTrackBtn.mousePressed(addTrackItem);

    let playBtn = select('#play-btn');
    playBtn.mousePressed(playAnimation);

    let pauseBtn = select('#pause-btn');
    pauseBtn.mousePressed(pauseAnimation);

    ticker = select('#ticker');
    ticker.mousePressed(startDragTicker);

    currentFrameDisplay = select('#current-frame');

    document.addEventListener('mouseup', stopDragTicker);
    document.addEventListener('mousemove', dragTicker);
}

function draw() {
    if (playing) {
        currentTime++;
        currentFrameDisplay.html(currentTime);
        background(220);
        animations.forEach(animation => {
            animation.update(currentTime);
            animation.display();
        });

        updateTicker();
    }
}

function addTrackItem() {
    let track1 = select('#track1');
    let newItem = createDiv('');
    newItem.class('track-item');
    newItem.style('width', '100px');
    newItem.style('left', '0px');
    newItem.parent(track1);

    let animationDropdown = select('#animation-dropdown');
    let animationType = animationDropdown.value();
    let animation;

    if (animationType === 'circle') {
        animation = new CircleAnimation(newItem);
    } else if (animationType === 'square') {
        animation = new SquareAnimation(newItem);
    }

    newItem.mousePressed(startDragTrackItem);
    document.addEventListener('mouseup', stopDragTrackItem);
    document.addEventListener('mousemove', dragTrackItem);

    animations.push(animation);
}

function playAnimation() {
    playing = true;
}

function pauseAnimation() {
    playing = false;
}

function updateTicker() {
    let track1 = select('#track1');
    let timelineWidth = track1.width;
    let tickerPos = map(currentTime, 0, width, 0, timelineWidth);
    ticker.style('left', `${tickerPos}px`);

    if (currentTime >= width) {
        playing = false;
    }
}

class CircleAnimation {
    constructor(trackItem) {
        this.trackItem = trackItem;
        this.startTime = parseFloat(trackItem.style('left'));
        this.duration = parseFloat(trackItem.style('width'));
        console.log(`Parsed startTime: ${this.startTime}, duration: ${this.duration}`); // Log parsed values
        this.x = 0;
        this.isActive = false;
    }

    update(time) {
        console.log("time is " + time);
        console.log(this.startTime + " This is start time");
        if (time >= this.startTime && time < this.startTime + this.duration) {
            this.isActive = true;
            console.log("Active now");
            this.x = map(time - this.startTime, 0, this.duration, 0, 100);
        } else {
            this.isActive = false;
        }
    }

    display() {
        if (this.isActive) {
            ellipse(this.x, 50, 20, 20);
        }
    }
}

class SquareAnimation {
    constructor(trackItem) {
        this.trackItem = trackItem;
        this.startTime = parseInt(trackItem.style('left'));
        this.duration = parseInt(trackItem.style('width'));
        this.x = 0;
        this.isActive = false;
    }

    update(time) {
        if (time >= this.startTime && time < this.startTime + this.duration) {
            this.isActive = true;
            this.x = map(time - this.startTime, 0, this.duration, 0, width);
            if (this.x > 200) {
                this.x = 200;
                this.isActive = false;
            }
        } else {
            this.isActive = false;
        }
    }

    display() {
        if (this.isActive) {
            square(this.x, 50, 20);
        }
    }
}

let isDraggingTicker = false;
function startDragTicker() {
    isDraggingTicker = true;
}

function stopDragTicker() {
    isDraggingTicker = false;
}

function dragTicker(event) {
    if (isDraggingTicker) {
        let timeline = select('#track1');
        let timelineRect = timeline.elt.getBoundingClientRect();
        //console.log()
        let mouseXPos = event.clientX - timelineRect.left;
        mouseXPos = constrain(mouseXPos, 0, timelineRect.width);
        ticker.style('left', `${mouseXPos}px`);
        currentTime = mouseXPos;
        //map(mouseXPos, 0, timelineRect.width, 0, timelineRect.width);
        console.log(mouseXPos);
        currentFrameDisplay.html(currentTime);
        background(220);
        animations.forEach(animation => {
            animation.update(currentTime);
            animation.display();
        });
    }
}

let isDraggingTrackItem = false;
let draggedTrackItem;
function startDragTrackItem() {
    isDraggingTrackItem = true;
    draggedTrackItem = this;
}

function stopDragTrackItem() {
    isDraggingTrackItem = false;
    draggedTrackItem = null;
}

function dragTrackItem(event) {
    if (isDraggingTrackItem) {
        let timeline = select('#track1');
        let timelineRect = timeline.elt.getBoundingClientRect();
        let mouseXPos = event.clientX - timelineRect.left;
        mouseXPos = constrain(mouseXPos, 0, timelineRect.width - parseFloat(draggedTrackItem.style('width')));
        draggedTrackItem.style('left', `${mouseXPos}px`);
        
        // Correctly update the start time attribute
        let newStartTime = map(mouseXPos, 0, timelineRect.width, 0, width);
        draggedTrackItem.attribute('data-start-time', mouseXPos); // Use mouseXPos directly for start time
        let animation = animations.find(anim => anim.trackItem.elt === draggedTrackItem.elt);
        animation.startTime = parseFloat(draggedTrackItem.style('left'));
    }
}

