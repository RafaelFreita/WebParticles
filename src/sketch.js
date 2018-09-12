var system;

function setup() {
  createCanvas(720, 400);
  
	system = new ParticleSystem(createVector(width/2, 325));
}

function draw() {
  background(51);
  
  system.addParticle();
  system.run();
  
}