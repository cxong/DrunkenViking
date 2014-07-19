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
  if (dir == 'up') {
    this.grid.y--;
  } else if (dir == 'down') {
    this.grid.y++;
  } else if (dir == 'left') {
    this.grid.x--;
  } else if (dir == 'right') {
    this.grid.x++;
  } else {
    assert(false);
  }
  var pos = g2p(this.grid);
  this.x = pos.x;
  this.y = pos.y;
};
