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
    smash: this.game.add.audio("smash")
  };

  this.groups = {
    bg: this.game.add.group(),
    sprites: this.game.add.group(),
    dialogs: this.game.add.group()
  };
  
  this.map = new Map(this.game, this.groups.bg, 'level1');

  this.player = new Player(this.game,
                           this.map.getBed(),
                           ['hrrng', 'hic', 'groan']);
  this.groups.sprites.add(this.player);
  
  var texts = [
    'By Thor, what a headache!',
    'I must have drank too much mead last night,',
    'but I cannot remember how I got here!',
    '...',
    '...wait, it\'s all coming back now...',
    '(Retrace your trail of destruction to the front gate)'
  ];
  this.dialog = new Dialog(this.game,
                           SCREEN_WIDTH / 2, SCREEN_HEIGHT - 64,
                           texts);
  this.groups.dialogs.add(this.dialog);
  
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
  // If there are dialog boxes alive, move them instead
  if (this.dialog.alpha > 0) {
    if (!this.dialog.next()) {
      this.dialog.alpha = 0;
      this.map.switchTiles();
    }
    return;
  }
  
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
  var indices = this.map.destroyAt(grid, dir);
  if (indices[0] >= 0) {
    if (indices[0] == 187) {
      this.sounds.cat.play();
    } else if (indices[0] >= 178 && indices[0] <= 183) {
      this.sounds.glass.play();
    } else if (indices[0] >= 189 && indices[0] <= 194) {
      this.sounds.smash.play();
    }else {
      this.sounds.breakSound.play();
    }
  } else if (indices[1] >= 0) {
    if (indices[1] == 135) {
      this.sounds.vomit.play();
    } else {
      this.sounds.pickup.play();
      this.player.clothe();
    }
  }
};
