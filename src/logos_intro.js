/**
 * Displays the logos at the start of the game and enters the Main Menu.
 * 
 * @param Phaser game
 * @param Object Play
 */
module.exports = function(game, Play) {
    require('./main_menu.js')(game, Play);
    
    Play.LogosIntro = function(game) {
        this.is_ready = false;
        this.timer = null;
    };
    
    Play.LogosIntro.prototype = {
        preload: function() {
            // Set a main menu state
            this.state.add('main_menu', Play.MainMenu);
            
            // Use a black background
            game.backgroundColor = 0x000000;
            
            // Center the logo to the middle of the screen
            var nullbyte = this.add.sprite(game.width/2, game.height/2, 'nullbyte_studios');
            nullbyte.anchor.setTo(0.5);
            
            // Create a timer for how long to play the logo
            this.timer = game.time.create();
            this.timer.add(3000, this.endTimer, this);
            
            // Load additional assets for the menu
            this.load.audio('main_menu_music', ['assets/audio/music/main_menu.mp3']);
            this.load.image('main_logo', 'assets/sprites/logos/logo.png');
        },
        
        create: function() {
            // Start the logo timer
            this.timer.start();
        },
        
        update: function() {
            // Wait for the audio to finish loading before continuing
            if (this.cache.isSoundDecoded('main_menu_music') && this.is_ready === true) {
                this.state.start('main_menu');
            }
        },
        
        endTimer: function() {
            this.is_ready = true;
        }
    }
}