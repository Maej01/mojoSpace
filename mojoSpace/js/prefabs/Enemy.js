//including the namespace
var mojoSpace = mojoSpace || {};

//this is the constructor
mojoSpace.Enemy = function(game, x, y, key, health, enemyBullets) {
    Phaser.Sprite.call(this, game, x, y, key);

    this.game.physics.arcade.enable(this);//enabling physics

    //adding animation
    this.animations.add('getHit', [0, 1, 2, 1, 0], 25, false);//creating an animation
    this.anchor.setTo(0.5);//centering the object
    this.health = health;

    //enemy bullets declaration
    this.enemyBullets = enemyBullets; 

    //enemy shooting timer
    this.enemyBulletTimer = this.game.time.create(false);
    this.enemyBulletTimer.start();

    //scheduling the enemy shooting function
    this.scheduleShooting();

};

//inheriting from the enemy method
mojoSpace.Enemy.prototype = Object.create(Phaser.Sprite.prototype);
mojoSpace.Enemy.prototype.constructor = mojoSpace.Enemy;

//enemy update function
mojoSpace.Enemy.prototype.update = function() {
    //checking if the enemy moves lesser than x
    if(this.x < 0.05 * this.game.world.width) {
        this.x = 0.05 * this.game.world.width + 2;
        this.body.velocity.x *= -1;
    }
    else if(this.x > 0.95 * this.game.world.width){
        this.x = 0.95 * this.game.world.width - 2;
        this.body.velocity.x *= -1;
    }

    if(this.top > this.game.world.height) {
        this.kill(); //kiling the enemy
    }
};

//damage fucnition
mojoSpace.Enemy.prototype.damage = function(amount){
    Phaser.Sprite.prototype.damage.call(this, amount);
    this.play('getHit'); //playing the animation

    //particle explosion
    //checking if the enemies health is lesser than 0 or has reached 0
    if(this.health <= 0) {
        //creating the emitter
        var emitter = this.game.add.emitter(this.x, this.y, 0);
        emitter.makeParticles('enemyParticle'); //making the particle 
        emitter.minParticleSpeed.setTo(-100, -100); //minimum speed
        emitter.maxParticleSpeed.setTo(100, 100); //maximum speed
        emitter.gravity = 0; //null gravitys
        emitter.start(true, 500, null, 2); //starting the emitter
   
        //pausing the timer when the enemy is dead
        this.enemyBulletTimer.pause();     
    }
};

//reseting the enemy function
mojoSpace.Enemy.prototype.reset = function(x, y, health, key, scale, speedX, speedY){
    Phaser.Sprite.prototype.reset.call(this, x, y, health);

    this.loadTexture(key);
    this.scale.setTo(scale);
    this.body.velocity.x = speedX;
    this.body.velocity.y = speedY;

    //resuming the enemy timer 
    this.enemyBulletTimer.resume();
};

//schedule shhoing function
mojoSpace.Enemy.prototype.scheduleShooting = function() {
    this.shoot(); //calling the shoot function

    if(!this.alive){
        this.enemyBulletTimer.pause();
    }

    //adding the time to shoot 
    this.enemyBulletTimer.add(Phaser.Timer.SECOND * 2, this.scheduleShooting, this);
};

//shoot method
mojoSpace.Enemy.prototype.shoot = function() {
    var bullet = this.enemyBullets.getFirstExists(false);

    if(!bullet) {
        bullet = new mojoSpace.EnemyBullet(this.game, this.x, this.bottom);
        this.enemyBullets.add(bullet);
    }
    else{
        //reseting the bullets
        bullet.reset(this.x, this.y);
    }
    //setting the velocity
    bullet.body.velocity.y = 100;
};

