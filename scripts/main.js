var GameState = function(game){};

GameState.prototype.preload = function() {
};

GameState.prototype.create = function() {
  this.game.stage.backgroundColor = 0x664a33;
  
  this.sounds = {
    step: this.game.add.audio("step"),
    bump: this.game.add.audio("bump")
  };

  this.groups = {
    bg: this.game.add.group(),
    sprites: this.game.add.group()
  };
  
  var map = this.game.add.tilemap('level1');
  map.addTilesetImage('Tiles', 'tiles');
  var layerBack = map.createLayer('Background');
  layerBack.scale = {x:2, y:2};
  this.groups.bg.add(layerBack);
  this.walls = map.createLayer('Walls');
  this.walls.scale = {x:2, y:2};
  this.groups.bg.add(this.walls);
  map.addTilesetImage('Objects', 'objects');
  var layerObjects = map.createLayer('Objects');
  layerObjects.scale = {x:2, y:2};
  this.groups.bg.add(layerObjects);

  this.player = new Player(this.game, {x:5, y:6}, ['hrrng', 'hic', 'groan']);
  this.groups.sprites.add(this.player);
  
  var registerKey = function(thegame, keycode, dir) {
    var key = thegame.game.input.keyboard.addKey(keycode);
    key.onDown.add(function(k) { thegame.move(dir); }, thegame);
  };
  registerKey(this, Phaser.Keyboard.UP, 'up');
  registerKey(this, Phaser.Keyboard.DOWN, 'down');
  registerKey(this, Phaser.Keyboard.LEFT, 'left');
  registerKey(this, Phaser.Keyboard.RIGHT, 'right');
};

GameState.prototype.update = function() {
  // Move to next level
  if (this.game.input.activePointer.justPressed()) {
    console.log("Clicked");
    //this.sounds.newLevel.play('', 0, 0.3);
  }
  
  // Move player
};

GameState.prototype.move = function(dir) {
  // Find new grid position to move to
  var grid = {x:this.player.grid.x, y:this.player.grid.y};
  if (dir == 'up') {
    grid.y--;
  } else if (dir == 'down') {
    grid.y++;
  } else if (dir == 'left') {
    grid.x--;
  } else if (dir == 'right') {
    grid.x++;
  } else {
    assert(false);
  }
  // Check for out of bounds
  if (grid.x < 0 || grid.y < 0 ||
      grid.x >= SCREEN_WIDTH / TILE_SIZE || grid.y >= SCREEN_HEIGHT / TILE_SIZE) {
    return;
  }
  // Check for wall collision
  var pos = g2p(grid);
  var walls = this.walls.getTiles(pos.x / 2, pos.y / 2, 0, 0);
  if (walls[0].index < 0) {
    this.player.move(grid);
    this.sounds.step.play('', 0, 0.3);
  } else {
    this.sounds.bump.play('', 0, 0.3);
  }
};
