/**
 * Displays the main menu.
 * 
 * @param Phaser game
 * @param Object Play
 */
module.exports = function(game, Play) {
    require('./game_manager.js')(game, Play);
    
    Play.MainMenu = function(game) {
        this.music = null;
    };
    
    Play.MainMenu.prototype = {
        preload: function() {
            // Set a level manager state
            this.state.add('game_manager', Play.GameManager);
            
            // Set the background
            this.stage.backgroundColor = 0xd2f8ff;
            
            // Center the logo to the top of the screen
            this.add.sprite(game.world.centerX, 40, 'main_logo').anchor.setTo(0.5, 0);
        },
        
        create: function() {
            // Set the music to loop at half volume
            this.music = this.add.audio('main_menu_music', 0.5, true).play();
            
            this.add.button(game.world.centerX, game.world.centerY, 'main_menu_play_button', this.start, this, "hover", "up", "down", "hover")
                    .anchor.setTo(0.5);
        },
        
        start: function() {
            this.music.stop();
            
            // Start up the game
            this.state.start('game_manager');
        }
    };
};