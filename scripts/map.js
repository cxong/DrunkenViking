var Map = function(game, group, mapName) {
  this.map = game.add.tilemap(mapName);
  this.map.addTilesetImage('Tiles', 'tiles_light');
  this.layerBack = this.map.createLayer('Background');
  this.layerBack.scale = {x:2, y:2};
  group.add(this.layerBack);
  
  this.walls = this.map.createLayer('Walls');
  this.walls.scale = {x:2, y:2};
  group.add(this.walls);
  
  this.map.addTilesetImage('Good', 'tiles_before');
  this.before = this.map.createLayer('Good');
  this.before.scale = {x:2, y:2};
  group.add(this.before);
  
  this.map.addTilesetImage('Broken', 'tiles_after');
  this.after = this.map.createLayer('Broken');
  this.after.scale = {x:2, y:2};
  group.add(this.after);
  
  this.map.addTilesetImage('Bed', 'tiles_bed');
  this.bed = this.map.createLayer('Bed');
  this.bed.scale = {x:2, y:2};
  group.add(this.bed);
  
  this.map.addTilesetImage('Decor', 'decor');
  var decor = this.map.createLayer('Decor');
  decor.scale = {x:2, y:2};
  group.add(decor);
  
  // Set all "before" tiles to invisible
  for (var y = 0; y < SCREEN_HEIGHT / TILE_SIZE; y++) {
    for (var x = 0; x < SCREEN_WIDTH / TILE_SIZE; x++) {
      var tilePos = {x:x * TILE_SIZE / 2, y:y * TILE_SIZE / 2};
      var objectsBefore = this.before.getTiles(tilePos.x, tilePos.y, 0, 0);
      objectsBefore[0].alpha = 0;
    }
  }
  this.before.dirty = true;
  
  this.currentTileIndex = 0;
  this.sounds = [game.add.audio("birds"), game.add.audio("crickets")];
  this.sounds[this.currentTileIndex].play('', 0, 0.05, true);
};

Map.prototype.switchTiles = function() {
  this.sounds[this.currentTileIndex].stop();
  this.currentTileIndex = (this.currentTileIndex + 1) % 2;
  this.sounds[this.currentTileIndex].play('', 0, 0.05, true);
  var tileset = ['tiles_light', 'tiles'][this.currentTileIndex];
  this.map.addTilesetImage('Tiles', tileset);
  this.layerBack.dirty = true;
  this.walls.dirty = true;
};

// Count the number of tiles that satisfy a condition
Map.prototype.countTiles = function(layer1, layer2, cond) {
  var count = 0;
  for (var y = 0; y < SCREEN_HEIGHT / TILE_SIZE; y++) {
    for (var x = 0; x < SCREEN_WIDTH / TILE_SIZE; x++) {
      var tilePos = {x:x * TILE_SIZE / 2, y:y * TILE_SIZE / 2};
      var tiles1 = layer1.getTiles(tilePos.x, tilePos.y, 0, 0);
      var tiles2 = layer2.getTiles(tilePos.x, tilePos.y, 0, 0);
      if (cond(tiles1[0], tiles2[0])) {
        count++;
      }
    }
  }
  return count;
};

// Get the position of the bed
// So we can place the player here
Map.prototype.getBed = function() {
  for (var y = 0; y < SCREEN_HEIGHT / TILE_SIZE; y++) {
    for (var x = 0; x < SCREEN_WIDTH / TILE_SIZE; x++) {
      var tilePos = {x:x * TILE_SIZE / 2, y:y * TILE_SIZE / 2};
      var beds = this.bed.getTiles(tilePos.x, tilePos.y, 0, 0);
      if (beds[0].index >= 0) {
        return {x:x, y:y};
      }
    }
  }
  assert(false);
  return null;
};

Map.prototype.isRealWall = function(grid) {
  var pos = g2p(grid);
  var tilePos = {x:pos.x / 2, y:pos.y / 2};
  var walls = this.walls.getTiles(tilePos.x, tilePos.y, 0, 0);
  if (walls[0].index >= 0) {
    return true;
  }
  
  return false;
};

Map.prototype.isWall = function(grid) {
  if (this.isRealWall(grid)) {
    return true;
  }
  
  var pos = g2p(grid);
  var tilePos = {x:pos.x / 2, y:pos.y / 2};
  // Also check already-unbroken items
  // These shouldn't be broken again
  var unbrokens = this.before.getTiles(tilePos.x, tilePos.y, 0, 0);
  if (unbrokens[0].index >= 0 && unbrokens[0].alpha > 0) {
    return true;
  }
  
  return false;
};

// Returns tile indices for before, after
Map.prototype.destroyAt = function(grid, dir) {
  var pos = g2p(grid);
  var tilePos = {x:pos.x / 2, y:pos.y / 2};
  var objects = this.after.getTiles(tilePos.x, tilePos.y, 0, 0);
  var isWall = this.isWall(grid);
  // Can only destroy wall-mounted objects from below
  if (objects[0].index >= 0 && objects[0].alpha === 1 && (!isWall || dir == 'up')) {
    var indexAfter = objects[0].index;
    objects[0].alpha = 0;
    this.after.dirty = true;
    var objectsBefore = this.before.getTiles(tilePos.x, tilePos.y, 0, 0);
    objectsBefore[0].alpha = 1;
    this.before.dirty = true;
    var indexBefore = objectsBefore[0].index;
    console.log('destroy ' + indexBefore + ':' + indexAfter);
    return [indexBefore, indexAfter];
  }
  return [-1, -1];
};

// Returns tile indices for before, after
Map.prototype.restoreAt = function(grid, dir) {
  var pos = g2p(grid);
  var tilePos = {x:pos.x / 2, y:pos.y / 2};
  var objects = this.after.getTiles(tilePos.x, tilePos.y, 0, 0);
  var isWall = this.isRealWall(grid);
  // Can only destroy wall-mounted objects from below
  if (objects[0].index >= 0 && objects[0].alpha === 0 && (!isWall || dir == 'up')) {
    var indexAfter = objects[0].index;
    objects[0].alpha = 1;
    this.after.dirty = true;
    var objectsBefore = this.before.getTiles(tilePos.x, tilePos.y, 0, 0);
    objectsBefore[0].alpha = 0;
    this.before.dirty = true;
    var indexBefore = objectsBefore[0].index;
    console.log('restore ' + indexBefore + ':' + indexAfter);
    return [indexBefore, indexAfter];
  }
  return [-1, -1];
};