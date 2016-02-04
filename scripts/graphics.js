var TILE_SIZE = 32;

// Modified Code //
var scaleFactor = Number((window.screen.height / 480) - 0.1);
var SCREEN_WIDTH = 640 * scaleFactor; //this.screen.width;
var SCREEN_HEIGHT = 480 * scaleFactor; //this.screen.height;

// --END-- ?//


// Grid / pixel conversions
function g2p(grid) {
    return {
        x: Math.floor(grid.x) * TILE_SIZE,
        y: Math.floor(grid.y) * TILE_SIZE
    };
}

function p2g(pixel) {
    return {
        x: Math.floor(pixel.x / TILE_SIZE),
        y: Math.floor(pixel.y / TILE_SIZE)
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

/*

*/

function dirReverse(dir) {
    if (dir == 'up') {
        return 'down';
    } else if (dir == 'down') {
        return 'up';
    } else if (dir == 'left') {
        return 'right';
    } else if (dir == 'right') {
        return 'left';
    } else if (dir == 'topleft') {
        return 'topleft';
    } else if (dir == 'topright') {
        return 'topright';
    } else if (dir == 'bottomleft') {
        return 'bottomleft';
    } else if (dir == 'bottomright') {
        return 'bottomright';
    } else {
        assert(false);
        return null;
    }
}

/*

    */
