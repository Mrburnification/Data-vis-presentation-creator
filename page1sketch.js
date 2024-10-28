let graph;
let config = {
  jsonData: jsonData,
  xLabel: "Date",
  yLabel: "Y Axis",
  startX: 50,
  startY: 50,
  scalerx: 0.9,
  scalery: 0.9,
  ymin: 0,
  ymax: 100,
  colour: [255, 0, 0],
  threshold: 0.5,
  ticks: 11,
  sizeropacity: 255,
  animationSpeed: 1,
};

function setup() {
  let canvas = createCanvas(800, 600);
  canvas.parent('canvas-container');
  graph = new JSONGraph(config);
  createInputsForConfig(config);
}

function createInputsForConfig(config) {
  let yPosition = 10;
  for (let key in config) {
    if (config.hasOwnProperty(key)) {
      createLabelAndInput(key, config[key], yPosition);
      yPosition += 30;
    }
  }
}

function createLabelAndInput(key, value, yPosition) {
  let controlPanel = select('#control-panel');
  let div = createDiv();
  div.parent(controlPanel);
  let label = createDiv(key);
  label.parent(div);
  let input = createInput(value.toString());
  input.parent(div);
  input.input(() => updateConfig(key, input.value()));
}

function updateConfig(key, value) {
  if (typeof config[key] === 'number') {
    config[key] = parseFloat(value);
  } else if (Array.isArray(config[key])) {
    config[key] = value.split(',').map(Number);
  } else {
    config[key] = value;
  }
  graph = new JSONGraph(config);
}

function addElement(type) {
  if (type === 'animateDisplay') {
    addAnimateDisplayForm();
  } else if (type === 'targetLine') {
    addTargetLineForm();
  }
}

function addAnimateDisplayForm() {
  let controlPanel = select('#control-panel');
  let div = createDiv();
  div.parent(controlPanel);

  createLabelAndInput('threshold', 50, 10, div);
  createLabelAndInput('x', 50, 40, div);
  createLabelAndInput('y', 50, 70, div);
  createLabelAndInput('size', 12, 100, div);
  createLabelAndInput('r', 0, 130, div);
  createLabelAndInput('g', 0, 160, div);
  createLabelAndInput('b', 0, 190, div);

  let button = createButton('Add Animate Display');
  button.parent(div);
  button.mousePressed(() => {
    let threshold = parseFloat(div.child()[1].value());
    let x = parseFloat(div.child()[3].value());
    let y = parseFloat(div.child()[5].value());
    let size = parseFloat(div.child()[7].value());
    let r = parseFloat(div.child()[9].value());
    let g = parseFloat(div.child()[11].value());
    let b = parseFloat(div.child()[13].value());
    graph.animateAndDisplayCount(threshold, x, y, size, r, g, b);
  });
}

function addTargetLineForm() {
  let controlPanel = select('#control-panel');
  let div = createDiv();
  div.parent(controlPanel);

  createLabelAndInput('target', 50, 10, div);
  createLabelAndInput('speed', 0.1, 40, div);
  createLabelAndInput('name', 'Target Line', 70, div);
  createLabelAndInput('r', 0, 100, div);
  createLabelAndInput('g', 0, 130, div);
  createLabelAndInput('b', 0, 160, div);
  createLabelAndInput('xx', 0, 190, div);
  createLabelAndInput('yy', 0, 220, div);

  let button = createButton('Add Target Line');
  button.parent(div);
  button.mousePressed(() => {
    let target = parseFloat(div.child()[1].value());
    let speed = parseFloat(div.child()[3].value());
    let name = div.child()[5].value();
    let r = parseFloat(div.child()[7].value());
    let g = parseFloat(div.child()[9].value());
    let b = parseFloat(div.child()[11].value());
    let xx = parseFloat(div.child()[13].value());
    let yy = parseFloat(div.child()[15].value());
    graph.targetline(target, speed, name, r, g, b, xx, yy);
  });
}
