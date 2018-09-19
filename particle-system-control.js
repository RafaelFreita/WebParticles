var ParticleSystemControl = function () {

  //////////////////
  // Basic Options
  //////////////////

  this.size = 40;
  this.sizeLifetime = true;
  this.lifespan = 3;
  this.format = 'Ellipse';

  //////////////////
  // Fill
  //////////////////

  this.fill = true;
  this.fillColor = [255, 0, 0];
  this.fillEndColor = [255, 100, 50];
  this.fillTransparency = 1;
  this.fillLifetime = false;

  //////////////////
  // Stroke
  //////////////////

  this.stroke = true;
  this.strokeWeight = 0.1;
  this.strokeColor = [255, 255, 255]
  this.strokeEndColor = [128, 128, 128];
  this.strokeTransparency = 0.5;
  this.strokeLifetime = false;

  ////////////////////////////////////
  // Speed // Rotation // Acceleration
  ////////////////////////////////////
  this.minSpeed = 0.1;
  this.maxSpeed = 1.0;

  this.minRotation = 0;
  this.maxRotation = 360;

  this.minAccelerationX = 0.01;
  this.maxAccelerationX = 0.1;
  this.minAccelerationY = 0.01;
  this.maxAccelerationY = 0.1;

};