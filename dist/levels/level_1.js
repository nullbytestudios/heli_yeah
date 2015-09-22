/**
 * Plays level 1
 * 
 * @param Phaser game
 * @param Object Play
 */
module.exports = function(game, Play) {
    Play.Level1 = function(game) {};
    
    Play.Level1.prototype = {
        preload: function() {
            this.stage.backgroundColor = 0xffffff;
            // Load all assets
            this.load.image('heli_coastguard', 'assets/sprites/heli/coastguard.png');
        },
        
        create: function() {
            // Center the logo to the top of the screen
            this.add.sprite(game.width/2, game.height - 50, 'heli_coastguard').anchor.setTo(0.5, 1);
        }
    };
};