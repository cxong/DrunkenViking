var Indicator = function(thegame, pos) {
  Phaser.Sprite.call(this, thegame.game,
                     pos.x, pos.y, "indicator");
  this.width = PIXEL_SIZE;
  this.height = PIXEL_SIZE;
  this.timer = thegame.game.time;
  this.counter = 0;
};
Indicator.prototype = Object.create(Phaser.Sprite.prototype);
Indicator.prototype.constructor = Indicator;
Indicator.prototype.update = function() {
  var PULSE_FRAMES = 20;
  this.counter++;
  if (this.counter > PULSE_FRAMES) {
    this.counter = 0;
  }
  var efrac = this.counter / (PULSE_FRAMES / 2);
  if (efrac < 1.0) {
    this.alpha = Phaser.Easing.Cubic.In(efrac);
  } else {
    this.alpha = 1 - Phaser.Easing.Cubic.Out(efrac - 1);
  }
  this.alpha *= 0.5;
};