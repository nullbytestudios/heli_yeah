/**
 * Displays the preloader and heads into the logo intro.
 * 
 * @param Phaser game
 * @param Object Play
 */
;(function () {
  'use strict';
module.exports = function(game, Play) {
    require('./logos_intro.js')(game, Play);
    
    Play.Preloader = function(game) {
        this.background = null;
        this.loading_bar = null;
    };
    
    Play.Preloader.prototype = {
        preload: function() {
            // Set a main menu state
            this.state.add('logos_intro', Play.LogosIntro);
            
            // Set the background and loading bar available from boot
            this.background = this.add.sprite(0, 0, 'preloader_bg');
            
            // Place the loading bar just below the center
            this.loading_bar = this.add.sprite(game.world.centerX, game.world.centerY + 20, 'preloader_bar');
            this.loading_bar.anchor.setTo(0.5);
            
            // Set the loading bar as the preloading sprite, automatically animating it as content is loaded
            this.load.setPreloadSprite(this.loading_bar);
            
            // Load additional assets
            this.load.image('nullbyte_studios', 'assets/sprites/logos/nullbyte_logo.png');
        },
        
        create: function() {
            // Ensure the loading bar is cropped as content is loaded (i.e. the "animation" of the bar increasing)
            this.loading_bar.cropEnabled = true;
            
            // Head to the logo intro
            this.state.start('logos_intro');
        }
    };
};
})();