var Player = function(game, grid) {
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
};
Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.move = function(dir) {
  var grid = {x:this.grid.x, y:this.grid.y};
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
  this.grid = grid;
  var pos = g2p(this.grid);
  this.x = pos.x;
  this.y = pos.y;
};
