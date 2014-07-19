var GameState = function(game){};

GameState.prototype.preload = function() {
};

GameState.prototype.create = function() {
  this.game.stage.backgroundColor = 0x664a33;
  
  this.sounds = {
    //place: this.game.add.audio("place")
  };

  this.groups = {
    bg: this.game.add.group(),
    sprites: this.game.add.group()
  };
  //this.bg = this.game.add.group();
  
  var map = this.game.add.tilemap('level1');
  map.addTilesetImage('Tiles', 'tiles');
  var layer = map.createLayer('Map1');
  layer.scale = {x:2, y:2};
  this.groups.bg.add(layer);

  var player = new Player(this.game, {x:5, y:6});
  this.groups.sprites.add(player);
  
  var registerKey = function(thegame, keycode, player, dir) {
    var key = thegame.game.input.keyboard.addKey(keycode);
    key.onDown.add(function(k)
    {
      player.move(dir);
    }, thegame);
  };
  registerKey(this, Phaser.Keyboard.UP, player, 'up');
  registerKey(this, Phaser.Keyboard.DOWN, player, 'down');
  registerKey(this, Phaser.Keyboard.LEFT, player, 'left');
  registerKey(this, Phaser.Keyboard.RIGHT, player, 'right');
};

GameState.prototype.update = function() {
  // Move to next level
  if (this.game.input.activePointer.justPressed()) {
    console.log("Clicked");
    //this.sounds.newLevel.play('', 0, 0.3);
  }
  
  // Move player
};
