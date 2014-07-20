var TILE_SIZE = 32;
var SCREEN_WIDTH = 640;
var SCREEN_HEIGHT = 480;

// Grid / pixel conversions
function g2p(grid) {
  return {x:Math.floor(grid.x) * TILE_SIZE, y:Math.floor(grid.y) * TILE_SIZE};
}
function p2g(pixel) {
  return {
    x:Math.floor(pixel.x / TILE_SIZE),
    y:Math.floor(pixel.y / TILE_SIZE)
  };
}

function addDir(grid, dir) {
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
  return grid;
}

function dirReverse(dir) {
  if (dir == 'up') {
    return 'down';
  } else if (dir == 'down') {
    return 'up';
  } else if (dir == 'left') {
    return 'right';
  } else if (dir == 'right') {
    return 'left';
  } else {
    assert(false);
    return null;
  }
}
