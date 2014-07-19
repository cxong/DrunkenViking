var HICCUP_DELAY = 300;
var Player = function(game, grid, sounds) {
  this.grid = grid;
  var pixel = g2p(grid);
  Phaser.Sprite.call(this,
                     game,
                     pixel.x, pixel.y,
                     'viking');
  this.width = TILE_SIZE;
  this.height = TILE_SIZE;
  this.animations.add('bob', [0, 1], 4, true);
  this.animations.play('bob');
  
  this.sounds = sounds;
  this.soundCounter = (Math.random() + 0.5) * HICCUP_DELAY;
};
Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.move = function(grid) {
  this.grid = grid;
  var pos = g2p(this.grid);
  this.x = pos.x;
  this.y = pos.y;
};

Player.prototype.update = function() {
  this.soundCounter--;
  if (this.soundCounter < 0) {
    // play a random hiccup sound
    var sound = this.sounds[Math.floor(Math.random() * this.sounds.length)];
    sound.play('', 0, 0.3);
    console.log('hic');
    this.soundCounter = (Math.random() + 0.5) * HICCUP_DELAY;
  }
};
