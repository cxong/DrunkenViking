var HICCUP_DELAY = 300;
var HICCUP_TEXT_DURATION = 100;
var Player = function(game, grid, soundStrings) {
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
  
  this.sounds = [];
  for (var i = 0; i < soundStrings.length; i++) {
    var str = soundStrings[i];
    this.sounds.push({str:str, sound:game.add.audio(str)});
  }
  this.soundCounter = (Math.random() + 0.5) * HICCUP_DELAY;
  var speechStyle = { font: "18px VT323", fill: "#ffffff", align: "center" };
  this.speechBubble = game.add.text(0, 0, '', speechStyle);
  this.speechBubble.alpha = 0;
  this.speechBubbleCounter = HICCUP_TEXT_DURATION;
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
    sound.sound.play('', 0, 0.3);
    this.soundCounter = (Math.random() + 0.5) * HICCUP_DELAY;
    this.speechBubble.x = this.x;
    this.speechBubble.y = this.y - 16;
    this.speechBubbleCounter = 0;
    this.speechBubble.alpha = 1;
    this.speechBubble.text = '*' + sound.str + '*';
  }
  this.speechBubbleCounter++;
  var t = (HICCUP_TEXT_DURATION - this.speechBubbleCounter) / HICCUP_TEXT_DURATION;
  if (t < 1) {
    this.speechBubble.alpha = Phaser.Easing.Cubic.In(t);
  } else {
    this.speechBubble.alpha = 0;
  }
};
