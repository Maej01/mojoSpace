 //including the namespace of our game
 var mojoSpace = mojoSpace || {};

 //this is the enemyBullet constructor
 mojoSpace.EnemyBullet = function(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'enemyLaser');

    this.anchor.setTo(0.5);
    this.scale.setTo(0.5); //reducing the bullets size
    this.checkWorldBounds = true; //track bullet will moving
    this.outOfBoundsKill = true; //destroy bullet when it leaves the screen
 };

 mojoSpace.EnemyBullet.prototype = Object.create(Phaser.Sprite.prototype);
 mojoSpace.EnemyBullet.prototype.constructor = mojoSpace.EnemyBullet;