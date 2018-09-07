 //including the namespace of our game
 var mojoSpace = mojoSpace || {};

 //this is the playerBullet constructor
 mojoSpace.PlayerBullet = function(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'playerLaser');

    this.anchor.setTo(0.5);
    this.scale.setTo(0.5);
    this.checkWorldBounds = true; //track bullet will moving
    this.outOfBoundsKill = true; //destroy bullet when it leaves the screen
 };

 mojoSpace.PlayerBullet.prototype = Object.create(Phaser.Sprite.prototype);
 mojoSpace.PlayerBullet.prototype.constructor = mojoSpace.PlayerBullet;