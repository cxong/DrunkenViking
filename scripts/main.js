var GameState = function(game){};

GameState.prototype.preload = function() {
};

GameState.prototype.create = function() {
  this.game.stage.backgroundColor = 0x664a33;
  
  this.sounds = {
    step: this.game.add.audio("step"),
    bump: this.game.add.audio("bump"),
    breakSound: this.game.add.audio("break"),
    pickup: this.game.add.audio("pickup"),
    cat: this.game.add.audio("cat"),
    glass: this.game.add.audio("glass"),
    vomit: this.game.add.audio("vomit"),
    crickets: this.game.add.audio("crickets")
  };

  this.groups = {
    bg: this.game.add.group(),
    sprites: this.game.add.group()
  };
  
  this.map = new Map(this.game, this.groups.bg, 'level1');

  this.player = new Player(this.game,
                           this.map.getBed(),
                           ['hrrng', 'hic', 'groan']);
  this.groups.sprites.add(this.player);
  
  var registerKey = function(thegame, keycode, dir) {
    var key = thegame.game.input.keyboard.addKey(keycode);
    key.onDown.add(function(k) { thegame.move(dir); }, thegame);
  };
  registerKey(this, Phaser.Keyboard.UP, 'up');
  registerKey(this, Phaser.Keyboard.DOWN, 'down');
  registerKey(this, Phaser.Keyboard.LEFT, 'left');
  registerKey(this, Phaser.Keyboard.RIGHT, 'right');
  
  this.sounds.crickets.play('', 0, 0.02, true);
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
  if (this.map.isWall(grid)) {
    this.sounds.bump.play('', 0, 0.7);
  } else {
    this.player.move(grid);
    this.sounds.step.play('', 0, 0.7);
  }
  // Destroy items
  var indices = this.map.destroyAt(grid);
  if (indices[0] >= 0) {
    if (indices[0] == 363) {
      this.sounds.cat.play();
    } else if (indices[0] == 354 || indices[0] == 355 || indices[0] == 386) {
      this.sounds.glass.play();
    } else {
      this.sounds.breakSound.play();
    }
  } else if (indices[1] >= 0) {
    if (indices[1] == 311) {
      this.sounds.vomit.play();
    } else {
      this.sounds.pickup.play();
      this.player.clothe();
    }
  }
};
