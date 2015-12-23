var BasicGame = {};
BasicGame.Preload = function (game) {
    this.preloadBar = null;
};

BasicGame.Preload.prototype = {
    preload: function () {
        this.preloadBar = this.add.sprite((SCREEN_WIDTH - TILE_SIZE) / 2,
                                          (SCREEN_HEIGHT - TILE_SIZE) / 2,
                                          'platino');
        this.preloadBar.width = TILE_SIZE;
        this.preloadBar.height = TILE_SIZE;
        this.preloadBar.animations.add('bob', [0, 1], 4, true);
        this.preloadBar.animations.play('bob');
        this.load.setPreloadSprite(this.preloadBar);

        this.game.load.tilemap('level1', 'scripts/levels/level1.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.tilemap('level2', 'scripts/levels/level2.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.tilemap('level3', 'scripts/levels/level3.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.tilemap('level4', 'scripts/levels/level4.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.tilemap('level5', 'scripts/levels/level5.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.tilemap('level6', 'scripts/levels/level6.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.tilemap('level7', 'scripts/levels/level7.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles', 'images/Objects/tiles_dark.png');
        this.game.load.image('tiles_light', 'images/Objects/tiles_light.png');
        this.game.load.image('tiles_before', 'images/Objects/items_before.png');
        this.game.load.image('tiles_after', 'images/Objects/items_after.png');
        this.game.load.image('tiles_bed', 'images/Objects/bed.png');
        this.game.load.image('decor', 'images/decor.png');
        for (var i = 0; i < 7; i++) {
            this.game.load.image('button' + i, 'images/buttons/' + i + '.png');
        }
        this.game.load.spritesheet('viking', 'images/viking.png', 16, 16);
        this.game.load.spritesheet('dialog', 'images/dialog.png', 192, 48);
        this.game.load.spritesheet('arrows', 'images/arrows.png', 52, 34);
        this.game.load.image('win', 'images/win.png');

        this.game.load.audio('birds', 'sounds/birds.mp3');
        this.game.load.audio('crickets', 'sounds/crickets.mp3');
        this.game.load.audio('fanfare', 'sounds/fanfare.mp3');
        this.game.load.audio('tada', 'sounds/tada.mp3');

        this.game.load.audio('step', 'sounds/step.wav');
        this.game.load.audio('bump', 'sounds/bump.wav');
        this.game.load.audio('hic', 'sounds/hiccup.wav');
        this.game.load.audio('hrrng', 'sounds/hrrng.wav');
        this.game.load.audio('groan', 'sounds/groan.wav');
        this.game.load.audio('break', 'sounds/break.wav');
        this.game.load.audio('pickup', 'sounds/pickup.wav');
        this.game.load.audio('cat', 'sounds/cat.wav');
        this.game.load.audio('glass', 'sounds/glass.wav');
        this.game.load.audio('vomit', 'sounds/vomit.wav');
        this.game.load.audio('smash', 'sounds/smash.wav');
        this.game.load.audio('beep', 'sounds/beep.wav');
    },

    create: function () {
        //this.preloadBar.cropEnabled = false;

        this.state.start('game');
    }
};
