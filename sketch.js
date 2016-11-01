var system, video;

var vScale = 4;
var img_u8 = new jsfeat.matrix_t(640, 480, jsfeat.U8C1_t);

function setup() {
  //createCanvas(window.innerWidth, window.innerHeight);
  createCanvas(640, 480);
  pixelDensity(1);
  video = createCapture(VIDEO);
  video.size(width/vScale, height/vScale);
  system = new ParticleSystem();
  for (var i = 0; i < 640; i += 12) {
    for (var j = 0; j < 480; j += 12) {
      system.addParticle(i, j);
    }
  }
}

function draw() {
  background('black');
  video.loadPixels();
  jsfeat.imgproc.grayscale(video.pixels, 640, 480, img_u8);
  jsfeat.imgproc.gaussian_blur(img_u8, img_u8, 6, 0);
  jsfeat.imgproc.canny(img_u8, img_u8, 20, 50);
  loadPixels();
  updatePixels();
  system.run();
}

// A simple Particle class
var Particle = function(position) {
  var x = random(-1, 1), y = random(-1, 1);
  this.velocity = createVector(x, y);
  this.position = position.copy();
};

Particle.prototype.run = function() {
  this.update();
  this.display();
};

// Method to update position
Particle.prototype.update = function(){
  this.position.add(this.velocity);
};

// Method to display
Particle.prototype.display = function() {
  rgb = video.get(floor(this.position.x/vScale), floor(this.position.y/vScale));
  fill(rgb[0], rgb[1], rgb[2], 150);
  ellipse(this.position.x, this.position.y, 6, 6);
};

// Is the particle still useful?
Particle.prototype.isDead = function(){
  var x = this.position.x, y = this.position.y;
  return x < 0 || x > width || y <= 0 || y > height;
};

var ParticleSystem = function() {
  this.particles = [];
};

ParticleSystem.prototype.addParticle = function(x, y) {
  this.particles.push(new Particle(createVector(x, y)));
};

ParticleSystem.prototype.run = function() {
  for (var i = this.particles.length-1; i >= 0; i--) {
    var p = this.particles[i];
    p.run();
  }
};
