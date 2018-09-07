//including the namespace mojoSpace 
var mojoSpace = mojoSpace || {};

mojoSpace.GameState = {

    //initiate game settings
    init: function(currentLevel) {
        //fit to screen
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        //enabling physics
        this.game.physics.startSystem(Phaser.Physics.ARCADE); 

        //decalring and initiaizing constant variables
        this.PLAYER_SPEED = 200;
        this.BULLET_SPEED = -1000;

        //level data
        this.numLevels = 3;
        this.currentLevel = currentLevel ? currentLevel : 1;
        console.log('current level: ' + this.currentLevel);

    },

    //load the game asstes
    preload: function() {
        this.load.image('spaceBg', 'assets/images/backgrounds/purple.png');
        this.load.image('player', 'assets/images/playerShips/playerShip1_orange.png');
        this.load.image('playerLaser', 'assets/images/lasers/laserRed01.png');
        this.load.image('enemyLaser', 'assets/images/lasers/enemyLaser.png');
        this.load.image('blackEnemy', 'assets/images/enemyShips/enemyBlack1.png');
        this.load.image('greenEnemy', 'assets/images/enemyShips/enemyGreen2.png');
        this.load.image('blueEnemy', 'assets/images/enemyShips/enemyBlue3.png');
        this.load.image('enemyParticle', 'assets/images/particles/enemyShip_damage.png');

        //load the levels json files
        this.load.text('level1', 'assets/data/level1.json');
        this.load.text('level2', 'assets/data/level2.json');
        this.load.text('level3', 'assets/data/level3.json');
    
        //load the audio
        this.load.audio('spaceAudio', 'assets/audio/through_space.ogg');
         this.load.audio('playerLaserAudio', 'assets/audio/playerLaser.ogg');
    },

    //executed after everything is loaded
    create: function() {
        //creating the background
        this.background = this.add.tileSprite(0, 0, this.game.world.width, this.game.world.height,'spaceBg');
        //scroll background
        this.background.autoScroll(0, 30);

        //adding the player
        this.player = this.add.sprite(this.game.world.centerX, this.game.world.height - 50, 'player');
        this.player.anchor.setTo(0.5); //setting the at the middle
        this.player.scale.setTo(0.5); //reducing the player size
        this.game.physics.arcade.enable(this.player); //adding physics for collison
        this.player.body.collideWorldBounds = true; //preventing the player from leaving the screen

        //decalring the bullet function
        this.initBullets();
        this.shootingTimer = this.game.time.events.loop(Phaser.Timer.SECOND/4,
        this.createPlayerBullet, this);

        //creating an enemy function
        this.initEnemies();

        //load level function
        this.loadLevel();

        //starting the audio
        this.spaceAudio = this.add.audio('spaceAudio');
        this.spaceAudio.play(); //playing the audio

         //creating the player shoot audio
         this.playerLaserAudio = this.add.audio('playerLaserAudio');
         
        
    },

    //this fucntion is executed multiple times per seconds
    update: function() { 

        //checking if playerBullets collide with enemy 
        this.game.physics.arcade.overlap(this.playerBullets, this.enemies,
                    this.damageEnemy, null, this);
        
        //checking if enemyBullets collide with player 
        this.game.physics.arcade.overlap(this.enemyBullets, this.player,
            this.killPlayer, null, this);

        //the player is not moving by default 
        this.player.body.velocity.x = 0; 

        //checking if the screen is been touched
        if(this.game.input.activePointer.isDown){
            //this holds the movement of the player on the x axis
            var targetX = this.game.input.activePointer.position.x;

            //checking if the moves left or right
            var direction = targetX >= this.game.world.centerX ? 1 : -1;

            //setting the player velocity to the direction 
            this.player.body.velocity.x = direction * this.PLAYER_SPEED;
        }
    },
    //bullet function
    initBullets: function() {
        //variables
        this.playerBullets = this.add.group(); 
        this.playerBullets.enableBody = true; //enabling physics
    },
    //create bullet method
    createPlayerBullet: function(){
        var bullet = this.playerBullets.getFirstExists(false);

        if(!bullet) {
            bullet = new mojoSpace.PlayerBullet(this.game, this.player.x, this.player.top);
            this.playerBullets.add(bullet); //adding the bullet
            this.playerLaserAudio.play(); //playing the audio
        }
        else{
            //reset position
            bullet.reset(this.player.x, this.player.top);
            this.playerLaserAudio.play(); //playing the audio
        }

        //set velocity
        bullet.body.velocity.y = this.BULLET_SPEED;
    },
    //enemies function
    initEnemies: function(){

        this.enemies = this.add.group(); //creating an enemy group
        this.enemies.enableBody = true; //enabling physics on this group

        //enemy bullets group and enabling physics on it
        this.enemyBullets = this.add.group();
        this.enemyBullets.enableBody = true;

        // this.enemy = new mojoSpace.Enemy(this.game, 100, 100, 'blackEnemy', 10, this.enemyBullets);
        // this.enemies.add(this.enemy); //adding an existing object to the group
    
        //setting the velocity of (x) and (y)
        // this.enemy.body.velocity.x = 0;
        // this.enemy.body.velocity.y = 0;
    },
    //damage mfunction
    damageEnemy: function(bullet, enemy){
        enemy.damage(1); //reducing the enemy's health by 1
        bullet.kill(); //destroy bullet when it hits enemy
    },
    //kill player function
    killPlayer: function(){
        this.player.kill(); //killing the player
        this.spaceAudio.stop(); //stop the audio
        this.game.state.start('GameState'); //restarting the game state
        this.spaceAudio.play(); //playing the audio
    },
    //create  new enemy function
    createEnemy: function(x, y, health, key, scale, speedX, speedY){

        //dead enemy pool
        var deadEnemy = this.enemies.getFirstExists(false);

        //checking if an enemy is not dead
        if(!deadEnemy){
            enemy = new mojoSpace.Enemy(this.game, x, y, key, health, this.enemyBullets);
            this.enemies.add(enemy);
        }
        //reset the enemy
        enemy.reset(x, y, health, key, scale, speedX, speedY);
    },
    //load level function
    loadLevel: function(){

        //tracking the current enemy index
        this.currentEnemyIndex = 0;

        //level data 
        this.levelData = JSON.parse(this.game.cache.getText('level' + this.currentLevel));

        //end of level timer
        this.endOfLevelTimer = this.game.time.events.add(this.levelData.duration * 1000,
        function(){
            console.log('level ended');
            this.spaceAudio.stop(); //stop the audio
            //checking if the current level is lesser than the actual level
            if(this.currentLevel < this.numLevels) {
                this.currentLevel++; //incrementing the level
            } else {
                this.currentLevel = 1; 
            }
            //restarting the game at the current level
            this.game.state.start('GameState', true, false, this.currentLevel);
        }, this);

        //calling the next enemy function
        this.scheduleNextEnemy();
    },

    //scheduleNextEnemy function
    scheduleNextEnemy: function(){
        //declaring variable
        var nextEnemy = this.levelData.enemies[this.currentEnemyIndex];

        //checking if thier is a next enemy
        if(nextEnemy){
            var nextTime = 1000 * (nextEnemy.time - (this.currentEnemyIndex == 0 ? 0 : this.levelData.enemies[this.currentEnemyIndex -1].time));
        
            this.nextEnemyTimer = this.game.time.events.add(nextTime, function(){
                this.createEnemy(nextEnemy.x * this.game.world.width, -100, nextEnemy.health,
                nextEnemy.key, nextEnemy.scale, nextEnemy.speedX, nextEnemy.speedY);
            
                //incrementing the current enemy index
                this.currentEnemyIndex++ ;
                //calling the schedule enemy function again
                this.scheduleNextEnemy();
            }, this);

        }
    }
};