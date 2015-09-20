/**
 * Performs start up procedures.
 * Configures settings and preloads the game.
 * 
 * @param Phaser game
 * @param Object Play
 */
module.exports = function(game, Play) {
    require('./preloader.js')(game, Play);
    
    Play.Launch = function(game) {};
    
    Play.Launch.prototype = {
        init: function() {
            // Set a preloader state
            this.state.add('preloader', Play.Preloader);
            
            // Only allow one pointer to be active
            this.input.maxPointers = 1;
        },
        
        preload: function() {
            // Load assets required by the preloader
            this.load.image('preloader_bg', 'assets/sprites/preloader/background.png');
            this.load.image('preloader_bar', 'assets/sprites/preloader/bar.png');
        },
        
        create: function() {
            // Start the preloader
            this.state.start('preloader');
        }
    }
}