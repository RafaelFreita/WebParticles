var movementTypes = ['Linear', 'Circular', 'Linear&Circular']

function returnIfUndefined(obj, optionalReturn) {
  return (obj !== undefined) ? obj : optionalReturn;
}

var Particle = function (pos, vel, acc, opts = {}) {
  this.position = pos.copy();
  this.velocity = vel.copy();
  this.acceleration = acc.copy();

  //////////////////////////
  // Custom optional options
  this.size = opts.size || 10;
  this.sizeLifetime = opts.sizeLifetime || false;

  this.lifespan = opts.lifespan || 5;
  this.format = opts.format || "Ellipse";

  this.fill = returnIfUndefined(opts.fill, true);
  this.fillColor = opts.fillColor || [255, 0, 0];
  this.fillEndColor = opts.fillEndColor || [255, 100, 50];
  this.fillTransparency = returnIfUndefined(opts.fillTransparency, 1);
  this.fillLifetime = opts.fillLifetime || false;

  this.stroke = returnIfUndefined(opts.stroke, true);
  this.strokeWeight = (opts.strokeWeight !== undefined) ? opts.strokeWeight * opts.size : 1;
  this.strokeColor = opts.strokeColor || [255, 255, 255];
  this.strokeEndColor = opts.strokeEndColor || [128, 128, 128];
  this.strokeTransparency = (opts.strokeTransparency !== undefined) ? opts.strokeTransparency : 1;
  this.strokeLifetime = opts.strokeLifetime || false;

  // Setting fill and stroke
  this.fillColor = color(this.fillColor[0], this.fillColor[1], this.fillColor[2], this.fillTransparency * 255);
  this.fillEndColor = color(this.fillEndColor[0], this.fillEndColor[1], this.fillEndColor[2], this.fillTransparency * 255);
  this.strokeColor = color(this.strokeColor[0], this.strokeColor[1], this.strokeColor[2], this.strokeTransparency * 255);
  this.strokeEndColor = color(this.strokeEndColor[0], this.strokeEndColor[1], this.strokeEndColor[2], this.strokeTransparency * 255);

  this.movement = opts.movement || {
    type: movementTypes[0]
  };

  ///////////////////////////

  // Utilities

  this.lifetime = 0;
  this.initialPosition = pos.copy();
  this.initialSize = this.size;
  // Used for parameters that change with lifetime
  this.invertAge = 1;

  this.start();
};

Particle.prototype.start = function () {
  switch (this.movement.type) {
    case movementTypes[0]:
      break;
    case movementTypes[1]:
    case movementTypes[2]:

      if (this.pivotPos === undefined) {
        this.pivotPos = this.position;
      }
      var ageToRad = this.lifetime / this.lifespan * 2 * PI * (this.movement.circles || 1);
      this.position = createVector(
        this.pivotPos.x + cos(ageToRad) * this.movement.radius,
        this.pivotPos.y + sin(ageToRad) * this.movement.radius
      );

      break;
  }
}

Particle.prototype.run = function () {
  this.display();
  this.update();
};

Particle.prototype.update = function () {
  var dt = frameRate() / 1000;
  this.lifetime += dt;

  this.invertAge = (1 - (this.lifetime / this.lifespan));
  var invertAge255 = this.invertAge * 255;

  switch (this.movement.type) {
    case movementTypes[0]:
      this.linearMovement();
      break;
    case movementTypes[1]:
      this.circularMovement();
      break;
    case movementTypes[2]:
      this.linearAndCircularMovement();
      break;
  }


  if (this.fillLifetime === true) {
    this.fillColor.setAlpha(this.fillTransparency * invertAge255);
    this.fillEndColor.setAlpha(this.fillTransparency * invertAge255);
  }

  if (this.strokeLifetime === true) {
    this.strokeColor.setAlpha(this.strokeTransparency * invertAge255);
    this.strokeEndColor.setAlpha(this.strokeTransparency * invertAge255);
  }

  if (this.sizeLifetime === true) {
    this.size = this.initialSize * this.invertAge;
  }

};

Particle.prototype.isDead = function () {
  return this.lifetime >= this.lifespan;
}

Particle.prototype.display = function () {

  if (this.stroke) {
    stroke(lerpColor(this.strokeEndColor, this.strokeColor, this.invertAge));
    strokeWeight(this.strokeWeight);
  } else {
    noStroke();
  }

  if (this.fill) {
    fill(lerpColor(this.fillEndColor, this.fillColor, this.invertAge));
  } else {
    noFill();
  }

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

Particle.prototype.linearMovement = function () {
  this.velocity.add(this.acceleration);
  this.position.add(this.velocity);
}

Particle.prototype.circularMovement = function () {
  var ageToRad = this.lifetime / this.lifespan * 2 * PI * (this.movement.circles || 1);
  this.position = createVector(
    this.initialPosition.x + cos(ageToRad) * this.movement.radius,
    this.initialPosition.y + sin(ageToRad) * this.movement.radius
  );
}

Particle.prototype.linearAndCircularMovement = function () {
  if (this.pivotPos === undefined) {
    this.pivotPos = this.position;
  }

  this.velocity.add(this.acceleration);
  this.pivotPos.add(this.velocity);

  var ageToRad = this.lifetime / this.lifespan * 2 * PI * (this.movement.circles || 1);
  this.position = createVector(
    this.pivotPos.x + cos(ageToRad) * this.movement.radius,
    this.pivotPos.y + sin(ageToRad) * this.movement.radius
  );
}