var BasicGame = {};
BasicGame.Preload = function (game) {
    this.preloadBar = null;
};

BasicGame.Preload.prototype = {
    preload: function () {
        this.preloadBar = this.add.sprite(SCREEN_WIDTH / 2,
                                          SCREEN_HEIGHT / 2,
                                          'platino');
        this.preloadBar.width = TILE_SIZE;
        this.preloadBar.height = TILE_SIZE;
        this.preloadBar.animations.add('bob', [0, 1], 4, true);
        this.preloadBar.animations.play('bob');
        this.load.setPreloadSprite(this.preloadBar);
        
        
        //this.game.load.image('bg', 'images/bg.png');

        //this.game.load.audio('place', 'audio/place.mp3');
    },

    create: function () {
        //this.preloadBar.cropEnabled = false;

        this.state.start('game');
    }
};
