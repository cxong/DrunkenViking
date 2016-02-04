var Dialog = function(game, group, x, y, texts) {
    Phaser.Sprite.call(this,
        game,
        x, y,
        'dialog');

    this.width *= 2.1 * 1.5;
    this.height *= 2.3 * 1.5;
    this.x -= this.width / 2;
    this.y -= this.height / 1.5;
    this.animations.add('bob', [0, 1], 4, true);
    this.animations.play('bob');


    var textStyle = {
        font: "40px VT323",
        fill: "#ffffff",
        align: "left",
        wordWrap: true,
        wordWrapWidth: this.width - 60 - 96
    };

    this.textSprite = game.add.text(this.x + 65, this.y + 15, '', textStyle);
    this.setTexts(texts);
    this.sound = game.add.sound('beep');

    group.add(this);
    group.add(this.textSprite);
};

Dialog.prototype = Object.create(Phaser.Sprite.prototype);
Dialog.prototype.constructor = Dialog;

Dialog.prototype.next = function() {
    this.textCounter++;
    this.sound.play();
    if (this.textCounter >= this.texts.length) {
        this.textSprite.text = '';
        return false;
    }
    this.textSprite.text = this.texts[this.textCounter];
    return true;
};

Dialog.prototype.setTexts = function(texts) {
    this.textCounter = 0;
    this.texts = texts;
    this.textSprite.text = this.texts[this.textCounter];
};
