var system, system2, system3;

function setup() {
  createCanvas(screen.availWidth*.75, screen.availHeight*.75);
  
  frameRate(60);
  
  system = new ParticleSystem(createVector(width/2 + width/3, height/2));
  system2 = new ParticleSystem(createVector(width/2, height/2));
  system3 = new ParticleSystem(createVector(width/2 - width/3, height/2));
}

function draw() {
  background(51);
  noStroke();

  system.addParticle();
  system.run();

  system2.addParticle();
  system2.run();
  
  system3.addParticle();
  system3.run();
}