var buttonArr = [];
var count = 0;

var Title = function(game, group, gameState) {
    var text = game.add.text(SCREEN_WIDTH / 2,
        SCREEN_HEIGHT * 0.4,
        'Drunken Viking', {
            font: "100px VT323",
            fill: "#aaa"
        });
    text.anchor.setTo(0.5);
    text.stroke = '#000';
    text.strokeThickness = 6;
    text.setShadow(3, 3, 'rgba(0,0,0,0.9)', 5);
    group.add(text);

    var instrPress = game.add.text(SCREEN_WIDTH / 2,
        SCREEN_HEIGHT * 0.6,
        'Press ', {
            font: "74px VT323",
            fill: "#fff"
        });
    instrPress.anchor.setTo(0, 0.5);
    instrPress.stroke = '#000';
    instrPress.strokeThickness = 3;
    instrPress.setShadow(3, 3, 'rgba(0,0,0,0.9)', 5);

    var arrows = game.add.sprite((SCREEN_WIDTH / 2) + 110,
        SCREEN_HEIGHT * 0.59,
        'arrows');
    arrows.scale = {
        x: 1.5,
        y: 1.5
    }
    arrows.width *= 2;
    arrows.height *= 2;
    arrows.anchor.setTo(0, 0.5);
    arrows.animations.add('bob', [0, 1], 4, true);
    arrows.animations.play('bob');

    group.add(instrPress);
    group.add(arrows);

    /* Modifed code.*/
    var instrToNavigate;
    if (!(localStorage["DrunkenViking.levels"] == null ||
            Number(localStorage["DrunkenViking.levels"]) < this.levelIndex + 1)) {
        instrToNavigate = game.add.text(SCREEN_WIDTH / 2,
            SCREEN_HEIGHT * 0.6,
            ' to navigate level', {
                font: "74px VT323",
                fill: "#fff"
            });
        instrToNavigate.anchor.setTo(0, 0.5);
        instrToNavigate.stroke = '#000';
        instrToNavigate.strokeThickness = 3;
        instrToNavigate.setShadow(3, 3, 'rgba(0,0,0,0.9)', 5);

        var instrToSelectLevel = game.add.text(SCREEN_WIDTH / 2, (SCREEN_HEIGHT * 0.6) + instrToNavigate.height,
            'Press OK to select level', {
                font: "74px VT323",
                fill: "#fff"
            });

        instrToSelectLevel.anchor.setTo(0.5);
        instrToSelectLevel.stroke = '#000';
        instrToSelectLevel.strokeThickness = 3;
        instrToSelectLevel.setShadow(3, 3, 'rgba(0,0,0,0.9)', 5);

        group.add(instrToNavigate);
        group.add(instrToSelectLevel);
    } else {
        instrToNavigate = game.add.text(SCREEN_WIDTH / 2,
            SCREEN_HEIGHT * 0.6,
            ' to start', {
                font: "74px VT323",
                fill: "#fff"
            });
        instrToNavigate.anchor.setTo(0, 0.5);
        instrToNavigate.stroke = '#000';
        instrToNavigate.strokeThickness = 3;
        instrToNavigate.setShadow(3, 3, 'rgba(0,0,0,0.9)', 5);
        group.add(instrToNavigate);
    }


    instrPress.position.x = SCREEN_WIDTH / 2 - (instrPress.width + arrows.width + instrToNavigate.width + 2) / 2;
    arrows.position.x = instrPress.position.x + instrPress.width + 1;
    instrToNavigate.position.x = arrows.position.x + arrows.width + 1;
    this.group = group;
    this.sound = game.add.sound('beep');

    var levelsCompleted =
        parseInt(localStorage["DrunkenViking.levels"]);
    for (var i = 0; i < Math.min(levelsCompleted + 1, levels.length); i++) {
        var spacing = 114;
        var x = SCREEN_WIDTH / 2 - (3 - i) * spacing;
        var y = SCREEN_HEIGHT * 0.88;
        var button = game.add.button(x, y, 'button' + i);
        if (i === 0) {
            button.tint = 0xffaa00;
        }

        button.width *= 2 * 1.5;
        button.height *= 2 * 1.5;
        button.anchor.setTo(0.5);
        buttonArr[i] = button;

        button.onInputOver.add(function(b) {
            b.tint = 0xffaa00;
        }, this);
        button.onInputOut.add(function(b) {
            b.tint = 0xffffff;
        }, this);


        button.onInputDown.add(function(level) {
            return function() {
                gameState.loadLevel(level);
                this.sound.play();
            }
        }(i), this);

        // group.add(button);
        group.add(buttonArr[i]);
        var label = game.add.text(x, y + 20,
            levels[i].day, {
                font: "24px VT323",
                fill: "#fff"
            });
        label.anchor.setTo(0.5);
        label.stroke = '#000';
        label.strokeThickness = 3;
        group.add(label);
    }
};

Title.prototype.hide = function() {
    this.group.alpha = 0;
    this.sound.play();
};
