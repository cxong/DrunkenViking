var Title = function(game, group, gameState) {
  var text = game.add.text(SCREEN_WIDTH / 2,
                           SCREEN_HEIGHT * 0.4,
                           'Drunken Viking',
                           {font: "96px VT323",
                           fill: "#aaa"});
  text.anchor.setTo(0.5);
  text.stroke = '#000';
  text.strokeThickness = 6;
  text.setShadow(3, 3, 'rgba(0,0,0,0.9)', 5);
  group.add(text);
  
  var instr = game.add.text(SCREEN_WIDTH / 2,
                            SCREEN_HEIGHT * 0.7,
                            'Press       to start',
                            {font: "48px VT323",
                            fill: "#fff"});
  instr.anchor.setTo(0.5);
  instr.stroke = '#000';
  instr.strokeThickness = 3;
  instr.setShadow(3, 3, 'rgba(0,0,0,0.9)', 5);
  group.add(instr);
  
  var arrows = game.add.sprite(SCREEN_WIDTH * 0.455,
                               SCREEN_HEIGHT * 0.7,
                               'arrows');
  arrows.width *= 2;
  arrows.height *= 2;
  arrows.anchor.setTo(0.5);
  arrows.animations.add('bob', [0, 1], 4, true);
  arrows.animations.play('bob');
  group.add(arrows);
  
  for (var i = 0; i < 7; i++) {
    var spacing = 76;
    var button = game.add.button(SCREEN_WIDTH / 2 - (3 - i) * spacing,
                                 SCREEN_HEIGHT * 0.88,
                                 'button' + i);
    button.width *= 2;
    button.height *= 2;
    button.anchor.setTo(0.5);
    button.onInputOver.add(function(b) {
      b.tint = 0xffaa00;
    }, this);
    button.onInputOut.add(function(b) {
      b.tint = 0xffffff;
    }, this);
    button.onInputDown.add(function(level) {
      return function() {
        gameState.loadLevel(level);
      }
    }(i), this);
    group.add(button);
  }
  
  this.group = group;
  this.sound = game.add.sound('beep');
};

Title.prototype.hide = function() {
  this.group.alpha = 0;
  this.sound.play();
};