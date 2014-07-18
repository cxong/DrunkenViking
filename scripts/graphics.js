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
