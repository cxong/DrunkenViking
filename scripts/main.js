// Level name and day
var levels = [
  {
    level:'level1',
    day:'Sunnudagr',
    texts: [
      'By Thor, what a headache!',
      'I must have drank too much mead last night,',
      'but I cannot remember how I got here!',
      '...',
      '...wait, it\'s all coming back now...',
      '(Retrace your trail of destruction to the front gate)'
    ]
  }
];

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
    smash: this.game.add.audio("smash"),
    fanfare: this.game.add.audio("fanfare")
  };

  this.groups = {
    bg: this.game.add.group(),
    sprites: this.game.add.group(),
    dialogs: this.game.add.group()
  };
  
  this.levelIndex = 0;
  this.map = new Map(this.game, this.groups.bg, levels[this.levelIndex].level);

  this.player = new Player(this.game,
                           this.map.getBed(),
                           ['hrrng', 'hic', 'groan']);
  this.groups.sprites.add(this.player);
  this.dialog = new Dialog(this.game,
                           SCREEN_WIDTH / 2, SCREEN_HEIGHT - 64,
                           levels[this.levelIndex].texts);
  this.groups.dialogs.add(this.dialog);
  this.instantReplay = this.game.add.text(48, 48, 'Instant Replay', {
    font: "32px VT323", fill: "#ff6666", align: "left"
  });
  this.instantReplayTween = this.game.add.tween(this.instantReplay)
    .to({alpha: 0.2}, 300, Phaser.Easing.Sinusoidal.InOut)
    .to({alpha: 1}, 300, Phaser.Easing.Sinusoidal.InOut)
    .loop();
  this.instantReplay.alpha = 0;
  
  var registerKey = function(thegame, keycode, dir) {
    var key = thegame.game.input.keyboard.addKey(keycode);
    key.onDown.add(function(k) { thegame.move(dir); }, thegame);
  };
  registerKey(this, Phaser.Keyboard.UP, 'up');
  registerKey(this, Phaser.Keyboard.DOWN, 'down');
  registerKey(this, Phaser.Keyboard.LEFT, 'left');
  registerKey(this, Phaser.Keyboard.RIGHT, 'right');
  this.moves = [];
  this.movesIndex = -1;
};

GameState.prototype.update = function() {
  // If we're showing instant replay
  if (this.instantReplay.alpha > 0) {
    // Check for end
    if (this.movesIndex < 0) {
      this.instantReplayTween.stop();
      this.instantReplay.alpha = 0;
      // Show next level
      if (this.levelIndex < levels.length) {
        this.dialog.setTexts([getScoreText(this.map, levels[this.levelIndex].day)]);
        this.map.switchTiles();
        this.dialog.alpha = 1;
      }
      this.moves = [];
      return;
    }
    // Replay the moves in reverse order
    if (this.instantReplayCounter > 10) {
      this.move(this.moves[this.movesIndex]);
      this.movesIndex--;
      this.instantReplayCounter = 0;
    }
    this.instantReplayCounter++;
  }
};

GameState.prototype.move = function(dir) {
  // If there are dialog boxes alive, move them instead
  if (this.dialog.alpha > 0) {
    if (!this.dialog.next()) {
      // Check if we haven't showed the instant replay yet
      if (this.moves.length > 0) {
        this.instantReplayTween.start();
        this.instantReplayCounter = 0;
        this.dialog.alpha = 0;
        return;
      }
      if (this.levelIndex >= levels.length) {
        // Show end game screen
        return;
      }
      this.dialog.alpha = 0;
      this.map.switchTiles();
    }
    return;
  }
  
  // Find new grid position to move to
  var grid = {x:this.player.grid.x, y:this.player.grid.y};
  addDir(grid, dir);
  
  // Normal game movement
  if (this.movesIndex < 0) {
    // Check for out of bounds
    if (grid.x < 0 || grid.y < 0 ||
        grid.x >= SCREEN_WIDTH / TILE_SIZE || grid.y >= SCREEN_HEIGHT / TILE_SIZE) {
      this.sounds.fanfare.play();
      this.dialog.setTexts([getScoreText(this.map, levels[this.levelIndex].day)]);
      this.dialog.alpha = 1;
      this.levelIndex++;
      this.movesIndex = this.moves.length - 1;
      return;
    }
    // Check for wall collision
    if (this.map.isWall(grid)) {
      this.sounds.bump.play('', 0, 0.7);
      this.moves.push(dir);
    } else {
      this.player.move(grid);
      this.sounds.step.play('', 0, 0.7);
      this.moves.push(dirReverse(dir));
    }
  } else {
    // Reverse game movement
    if (this.map.isRealWall(grid)) {
      this.sounds.bump.play('', 0, 0.7);
    } else {
      this.player.move(grid);
      this.sounds.step.play('', 0, 0.7);
    }
  }
  // Destroy items
  var indices = [null];
  if (this.movesIndex < 0) {
    indices = this.map.destroyAt(grid, dir);
  } else {
    // Restore items
    indices = this.map.restoreAt(grid, dir);
  }
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
      if (this.movesIndex < 0) {
        this.player.clothe();
      } else {
        this.player.strip();
      }
    }
  }
};
