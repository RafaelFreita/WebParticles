var ParticleSystem = function (position) {
  this.origin = position.copy();
  this.particles = [];
  this.formats = ['Ellipse', 'Rect', 'Triangle'];

  this.control = new ParticleSystemControl();

  this.gui = new dat.GUI();
  this.gui.add(this.control, 'size', 0.01, 300);
  this.gui.add(this.control, 'lifespan', 0.01, 10);
  this.gui.add(this.control, 'format', ['Ellipse', 'Rect', 'Triangle']);
  this.gui.add(this.control, 'useLifetime');

};

ParticleSystem.prototype.addParticle = function () {
  var that = this;
  var redVal = random(100, 200);
  this.particles.push(new Particle(
    this.origin,
    color(redVal, redVal * random(2, 6) / 10, redVal * random(1, 3) / 10),
    createVector(random(-2, 2), random(-2, 0)),
    createVector(0, -0.1), {
      lifespan: that.control.lifespan,
      format: that.control.format,
      size: that.control.size,
      lifetimeParameter: that.control.useLifetime
    }
  ));
};

ParticleSystem.prototype.run = function () {
  for (var i = this.particles.length - 1; i >= 0; i--) {
    var p = this.particles[i];
    p.run();
    if (p.isDead()) {
      this.particles.splice(i, 1);
    }
  }
};