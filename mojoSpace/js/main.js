//will hold all data relating to the game
var mojoSpace = mojoSpace || {};

//initiate the phaser frame work. this game will make use of 100% width & height
mojoSpace.game = new Phaser.Game('100%', '100%', Phaser.AUTO);

//adding the state to the game
mojoSpace.game.state.add('GameState', mojoSpace.GameState);

//initiating the game
mojoSpace.game.state.start('GameState'); 