(function() { setTimeout(function () {
    document.getElementById('fontLoader').style.display = 'none';
    var game = new Phaser.Game(SCREEN_WIDTH, SCREEN_HEIGHT, Phaser.AUTO,
                               'gameContainer', null, false,
                               false);
    game.state.add('boot', BasicGame.Boot);
    game.state.add('preload', BasicGame.Preload);
    game.state.add('game', GameState);
    game.state.start('boot');
}, 1000); })();
