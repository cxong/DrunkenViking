BasicGame.Boot = function (game) {
};

BasicGame.Boot.prototype = {

    preload: function () {
        this.game.load.spritesheet('platino', 'images/platino.png', 16, 16);
    },

    create: function () {
        this.game.stage.backgroundColor = 0x555577;
        this.input.maxPointers = 1;

        this.state.start('preload');
    }
};
