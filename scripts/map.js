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
  
  this.sounds = [game.add.audio("birds"), game.add.audio("crickets")];
  this.currentTileIndex = 0;
  
  this.reset();
  
  // Switch to daytime
  if (this.currentTileIndex !== 0) {
    this.switchTiles();
  }
};

Map.prototype.reset = function() {
  // Make sure we are at night
  if (this.currentTileIndex != 1) {
    this.switchTiles();
  }
  
  var x;
  var y;
  var tilePos;
  
  // Set all "before" tiles to invisible
  var objectsBefore = this.before.getTiles(0, 0,
                                           this.before.width,
                                           this.before.height);
  for (var i = 0; i < objectsBefore.length; i++) {
    objectsBefore[i].alpha = 0;
  }
  this.before.dirty = true;
  
  // Set all "after" tiles to visible
  var objectsAfter = this.after.getTiles(0, 0,
                                         this.after.width,
                                         this.after.height);
  for (var i = 0; i < objectsAfter.length; i++) {
    objectsAfter[i].alpha = 1;
  }
  this.after.dirty = true;
};

Map.prototype.switchTiles = function() {
  if (this.sounds[this.currentTileIndex].isPlaying) {
    this.sounds[this.currentTileIndex].stop();
  }
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
  var tiles1 = layer1.getTiles(0, 0, layer1.width, layer1.height);
  var tiles2 = layer2.getTiles(0, 0, layer2.width, layer2.height);
  for (var i = 0; i < tiles1.length; i++) {
    if (cond(tiles1[i], tiles2[i])) {
      count++;
    }
  }
  return count;
};

// Get the position of the bed
// So we can place the player here
Map.prototype.getBed = function() {
  var beds = this.bed.getTiles(0, 0, this.bed.width, this.bed.height);
  for (var i = 0; i < beds.length; i++) {
    if (beds[i].index >= 0) {
      return {x:i % this.map.width, y:Math.floor(i / this.map.width)};
    }
  }
  assert(false);
  return null;
};

Map.prototype.isRealWall = function(grid) {
  var wall = this.map.getTile(grid.x, grid.y, this.walls);
  return wall !== null && wall.index >= 0;
};

Map.prototype.isWall = function(grid) {
  if (this.isRealWall(grid)) {
    return true;
  }
  
  // Also check already-unbroken items
  // These shouldn't be broken again
  var unbroken = this.map.getTile(grid.x, grid.y, this.before);
  return unbroken !== null && unbroken.index >= 0 && unbroken.alpha > 0;
};

// Returns tile indices for before, after
Map.prototype.destroyAt = function(grid, dir) {
  var object = this.map.getTile(grid.x, grid.y, this.after);
  var isWall = this.isWall(grid);
  // Can only destroy wall-mounted objects from below
  if (object !== null && object.index >= 0 && object.alpha === 1 &&
      (!isWall || dir == 'up')) {
    var indexAfter = object.index;
    object.alpha = 0;
    this.after.dirty = true;
    var objectBefore = this.map.getTile(grid.x, grid.y, this.before);
    var indexBefore = -1;
    if (objectBefore !== null) {
      objectBefore.alpha = 1;
      this.before.dirty = true;
      indexBefore = objectBefore.index;
    }
    //console.log('destroy ' + indexBefore + ':' + indexAfter);
    return [indexBefore, indexAfter];
  }
  return [-1, -1];
};

// Returns tile indices for before, after
Map.prototype.restoreAt = function(grid, dir) {
  var object = this.map.getTile(grid.x, grid.y, this.after);
  var isWall = this.isRealWall(grid);
  // Can only destroy wall-mounted objects from below
  if (object !== null && object.index >= 0 && object.alpha === 0 &&
      (!isWall || dir == 'up')) {
    var indexAfter = object.index;
    object.alpha = 1;
    this.after.dirty = true;
    var objectBefore = this.map.getTile(grid.x, grid.y, this.before);
    var indexBefore = -1;
    if (objectBefore !== null) {
      objectBefore.alpha = 0;
      this.before.dirty = true;
      indexBefore = objectBefore.index;
    }
    //console.log('restore ' + indexBefore + ':' + indexAfter);
    return [indexBefore, indexAfter];
  }
  return [-1, -1];
};

Map.prototype.stop = function() {
  this.sounds[this.currentTileIndex].stop();
};