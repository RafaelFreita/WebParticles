var formats = ['Ellipse', 'Rect', 'Triangle', 'Random'];

var emissorTypes = ['Point', 'Circular'];

var ParticleSystem = function (position) {
  this.originX = position.copy().x;
  this.originY = position.copy().y;
  this.particles = [];
  this.formats = ['Ellipse', 'Rect', 'Triangle'];
  this.emissorType = formats[0];
  this.oldestInFront = false;

  this.particlesPerUpdate = 1;
  this.particleMovement = movementTypes[0];

  this.control = new ParticleSystemControl();

  this.gui = new dat.GUI();

  this.systemFolder = this.gui.addFolder('System');

  this.positionFolder = this.systemFolder.addFolder('Position');
  this.positionFolder.add(this, 'originX', 0, width);
  this.positionFolder.add(this, 'originY', 0, height);

  this.systemFolder.add(this, 'particlesPerUpdate', 0, 10).step(1);
  this.systemFolder.add(this, 'oldestInFront');

  this.emissorFolder = this.systemFolder.addFolder('Emissor');
  this.emissorFolder.add(this, 'emissorType', emissorTypes);

  this.particlesFolder = this.gui.addFolder('Particles');
  this.particlesFolder.add(this.control, 'size', 1, 300);
  this.particlesFolder.add(this.control, 'sizeLifetime');

  this.particlesFolder.add(this.control, 'lifespan', 0.01, 15);
  this.particlesFolder.add(this.control, 'format', formats);

  this.fillFolder = this.particlesFolder.addFolder('Fill');
  this.fillFolder.add(this.control, 'fill')
  this.fillFolder.addColor(this.control, 'fillColor');
  this.fillFolder.addColor(this.control, 'fillEndColor');
  this.fillFolder.add(this.control, 'fillTransparency', 0, 1);
  this.fillFolder.add(this.control, 'fillLifetime');

  this.strokeFolder = this.particlesFolder.addFolder('Stroke');
  this.strokeFolder.add(this.control, 'stroke');
  this.strokeFolder.add(this.control, 'strokeWeight', 0, 1);
  this.strokeFolder.addColor(this.control, 'strokeColor');
  this.strokeFolder.addColor(this.control, 'strokeEndColor');
  this.strokeFolder.add(this.control, 'strokeTransparency', 0, 1);
  this.strokeFolder.add(this.control, 'strokeLifetime');

  this.movementFolder = this.particlesFolder.addFolder('Movement');
  this.movementFolder.add(this, 'particleMovement', movementTypes);

  this.speedFolder = this.movementFolder.addFolder('Speed');
  this.speedFolder.add(this.control, 'minSpeed');
  this.speedFolder.add(this.control, 'maxSpeed');

  this.rotationFolder = this.movementFolder.addFolder('Rotation');
  this.rotationFolder.add(this.control, 'minRotation');
  this.rotationFolder.add(this.control, 'maxRotation');

  this.accelerationFolder = this.movementFolder.addFolder('Acceleration');
  this.accelerationFolder.add(this.control, 'minAccelerationX');
  this.accelerationFolder.add(this.control, 'maxAccelerationX');
  this.accelerationFolder.add(this.control, 'minAccelerationY');
  this.accelerationFolder.add(this.control, 'maxAccelerationY');
};

ParticleSystem.prototype.addParticle = function () {

  for (var i = 0; i < this.particlesPerUpdate; i++) {

    var particleFormat = this.control.format;
    if (this.control.format === 'Random') {
      particleFormat = formats[Math.round(random(0, formats.length - 2))]
    }

    var particleSpawn = this.emitParticle();

    this.particles.push(new Particle(
      particleSpawn.position,
      particleSpawn.velocity,
      particleSpawn.acceleration, {

        size: this.control.size,
        sizeLifetime: this.control.sizeLifetime,

        lifespan: this.control.lifespan,
        format: particleFormat,

        fill: this.control.fill,
        fillColor: this.control.fillColor,
        fillEndColor: this.control.fillEndColor,
        fillTransparency: this.control.fillTransparency,
        fillLifetime: this.control.fillLifetime,

        stroke: this.control.stroke,
        strokeWeight: this.control.strokeWeight,
        strokeColor: this.control.strokeColor,
        strokeEndColor: this.control.strokeEndColor,
        strokeTransparency: this.control.strokeTransparency,
        strokeLifetime: this.control.strokeLifetime,

        movement: {
          type: this.particleMovement,
          radius: 50,
          circles: 3
        }
      }
    ));

  }
};

ParticleSystem.prototype.run = function () {

  var newestFactor = (this.oldestInFront) ? 1 : 0;
  var i = (this.particles.length - 1) * newestFactor;

  while (true) {

    if (this.oldestInFront) {
      if (i < 0) {
        break;
      }
    } else {
      if (i >= this.particles.length) {
        break;
      }
    }

    var p = this.particles[i];
    p.run();
    if (p.isDead()) {
      // Should instead use a pooling system
      this.particles.splice(i, 1);
    }

    if (this.oldestInFront) {
      i -= 1;
    } else {
      i += 1;
    }

  }
};


/** 
 * @returns {ParticleSpawn} 
 */
ParticleSystem.prototype.emitParticle = function () {
  switch (this.emissorType) {
    case this.emissorType[0]:
      return this.pointEmissor();
    case this.emissorType[1]:
      return this.circularEmissor();
    default:
      return this.pointEmissor();
  }
}

ParticleSystem.prototype.pointEmissor = function () {

  var particleRotation = radians(random(this.control.minRotation, this.control.maxRotation));

  var particleDirection = createVector(cos(particleRotation), sin(particleRotation));
  var particleSpeed = random(this.control.minSpeed, this.control.maxSpeed);
  var particleAcceleration = createVector(
    random(this.control.minAccelerationX, this.control.maxAccelerationX),
    random(this.control.minAccelerationY, this.control.maxAccelerationY));

  return new ParticleSpawn(
    createVector(this.originX, this.originY),
    particleDirection.copy().mult(particleSpeed),
    particleAcceleration,
  );
}

ParticleSystem.prototype.circularEmissor = function () {
  var newParticle = this.pointEmissor();

  // TODO: Move particle position based on it's direction * radius (radius can also vary)

  return newParticle;
}

function ParticleSpawn(pos, vec, acc) {
  this.position = pos.copy();
  this.velocity = vec.copy();
  this.acceleration = acc.copy();
}