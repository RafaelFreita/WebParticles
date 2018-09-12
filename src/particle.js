var Particle = function (pos, color, vel, acc, opts = {}) {
  this.position = pos.copy();
  this.color = color;
  this.velocity = vel.copy();
  this.acceleration = acc.copy();
  this.lifetime = 0;

  // Custom optional options
  this.lifespan = opts.lifespan || 5;
  this.format = opts.format || "Ellipse";
  this.opacity = opts.opacity || 255;
  this.lifetimeParameter = (opts.lifetimeParameter !== undefined && opts.lifetimeParameter !== null) ? opts.lifetimeParameter : true;
  this.weight = opts.weight || 2;
  this.size = opts.size || 10;
  this.initialSize = this.size;
};

Particle.prototype.run = function () {
  this.update();
  this.display();
};

Particle.prototype.update = function () {
  this.velocity.add(this.acceleration);
  this.position.add(this.velocity);
  this.lifetime += frameRate() / 1000;

  if (this.lifetimeParameter === true) {
    this.opacity = (1 - (this.lifetime / this.lifespan)) * 255;
    this.color.setAlpha(this.opacity);
    this.size = this.opacity / 255 * this.initialSize;
  }
};

Particle.prototype.isDead = function () {
  return this.lifetime >= this.lifespan;
}

Particle.prototype.display = function () {
  stroke(this.color);
  strokeWeight(this.weight);
  fill(this.color);

  if (this.format === "Ellipse") {
    ellipse(this.position.x, this.position.y, this.size, this.size);
  } else if (this.format === 'Rect') {
    rect(this.position.x - this.size / 2, this.position.y - this.size / 2, this.size, this.size);
  } else if (this.format === 'Triangle') {
    triangle(
      this.position.x - this.size / 2, this.position.y + this.size / 2,
      this.position.x + this.size / 2, this.position.y + this.size / 2,
      this.position.x, this.position.y - this.size / 2);
  }
}