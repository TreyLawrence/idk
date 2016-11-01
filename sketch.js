var system, video, img;

var vidScale = 1;
var painterSize = 6;
var numPainters = 512;
var speed = 10;

function setup() {
  createCanvas(640, 480);
  pixelDensity(1);
  noStroke();

  video = createCapture(VIDEO);
  video.size(width/vidScale, height/vidScale);
  video.style('display', 'none');
  img = new jsfeat.matrix_t(width/vidScale, height/vidScale, jsfeat.U8C1_t);


  system = new PainterSystem();
  for (var i = 0; i < width; i += painterSize*4) {
    for (var j = 0; j < height; j += painterSize*4) {
      system.addPainter(i, j);
    }
  }
}

function draw() {
  video.loadPixels();
  system.run();
}

// A simple Painter class
var Painter = function(position) {
  this.velocity = createVector(random(-1, 1), random(-1, 1));
  this.position = position.copy();
};

Painter.prototype.run = function() {
  this.update();
  this.display();
};

// Method to update position
Painter.prototype.update = function(){
  this.position.add(p5.Vector.mult(this.velocity, speed));
  if (this.position.x < 0) {
    this.position.x = -this.position.x;
    this.velocity.x = -this.velocity.x;
  } else if (this.position.x > width) {
    this.position.x = 2*width - this.position.x;
    this.velocity.x = -this.velocity.x
  }

  if (this.position.y < 0) {
    this.position.y = -this.position.y;
    this.velocity.y = -this.velocity.y;
  } else if (this.position.y > height) {
    this.position.y = 2*height - this.position.y;
    this.velocity.y = -this.velocity.y;
  }
};

// Method to display
Painter.prototype.display = function() {
  rgb = video.get(floor(this.position.x/vidScale), floor(this.position.y/vidScale));
  fill(rgb[0], rgb[1], rgb[2], 200);
  ellipse(this.position.x, this.position.y, painterSize, painterSize);
};

var PainterSystem = function() {
  this.painters = [];
};

PainterSystem.prototype.addPainter = function(x, y) {
  this.painters.push(new Painter(createVector(x, y)));
};

PainterSystem.prototype.run = function() {
  for (var i = this.painters.length-1; i >= 0; i--) {
    this.painters[i].run();
  }
};
