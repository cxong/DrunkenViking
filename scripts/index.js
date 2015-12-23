(function() { setTimeout(function () {
    document.getElementById('fontLoader').style.display = 'none';
    console.log(document.getElementsByTagName('body')[0].clientWidth, document.getElementsByTagName('body')[0].clientHeight);
    console.log(window.innerWidth, window.innerHeight);
    var game = new Phaser.Game(SCREEN_WIDTH, SCREEN_HEIGHT, Phaser.AUTO,
                               'gameContainer', null, false,
                               false);
    game.state.add('boot', BasicGame.Boot);
    game.state.add('preload', BasicGame.Preload);
    game.state.add('game', GameState);
    game.state.start('boot');
}, 1000); })();
