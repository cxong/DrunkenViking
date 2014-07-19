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
    crickets: this.game.add.audio("crickets")
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
  map.addTilesetImage('Good', 'tiles_before');
  this.before = map.createLayer('Good');
  this.before.scale = {x:2, y:2};
  this.groups.bg.add(this.before);
  map.addTilesetImage('Broken', 'tiles_after');
  this.after = map.createLayer('Broken');
  this.after.scale = {x:2, y:2};
  this.groups.bg.add(this.after);
  map.addTilesetImage('Objects', 'objects');
  var objects = map.createLayer('Objects');
  objects.scale = {x:2, y:2};
  this.groups.bg.add(objects);

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
  
  this.sounds.crickets.play('', 0, 0.02, true);
  
  
  // Set all "before" tiles to invisible
  for (var y = 0; y < SCREEN_HEIGHT / TILE_SIZE; y++) {
    for (var x = 0; x < SCREEN_WIDTH / TILE_SIZE; x++) {
      var tilePos = {x:x * TILE_SIZE / 2, y:y * TILE_SIZE / 2};
      var objectsBefore = this.before.getTiles(tilePos.x, tilePos.y, 0, 0);
      objectsBefore[0].alpha = 0;
    }
  }
  this.before.dirty = true;
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
  var tilePos = {x:pos.x / 2, y:pos.y / 2};
  var walls = this.walls.getTiles(tilePos.x, tilePos.y, 0, 0);
  if (walls[0].index < 0) {
    this.player.move(grid);
    this.sounds.step.play('', 0, 0.7);
  } else {
    this.sounds.bump.play('', 0, 0.7);
  }
  // Destroy items
  var objects = this.after.getTiles(tilePos.x, tilePos.y, 0, 0);
  if (objects[0].index >= 0) {
    var index = objects[0].index;
    objects[0].index = -1;
    objects[0].alpha = 0;
    this.after.dirty = true;
    var objectsBefore = this.before.getTiles(tilePos.x, tilePos.y, 0, 0);
    objectsBefore[0].alpha = 1;
    this.before.dirty = true;
    if (objectsBefore[0].index >= 0) {
      if (objectsBefore[0].index == 333) {
        this.sounds.cat.play();
      } else {
        this.sounds.breakSound.play();
      }
    } else {
      this.sounds.pickup.play();
    }
    console.log('destroy ' + objectsBefore[0].index);
  }
};
