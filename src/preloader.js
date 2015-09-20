/**
 * Displays the preloader and enters the Main Menu.
 * 
 * @param Phaser game
 * @param Object Play
 */
module.exports = function(game, Play) {
    Play.Preloader = function(game) {
        this.background = null;
        this.loading_bar = null;
        this.is_ready = false;
    };
    
    Play.Preloader.prototype = {
        preload: function() {
            // Set the background and loading bar available from boot
            this.background = this.add.sprite(0, 0, 'preloader_bg');
            // Center the loading bar, knowing it's image width is 432px (432/2 = 216)
            this.loading_bar = this.add.sprite(game.width/2 - 216, game.height/2, 'preloader_bar');
            
            // Set the loading bar as the preloading sprite, automatically animating it as content is loaded
            this.load.setPreloadSprite(this.loading_bar);
            
            // Load additional assets
            this.load.image('nullbyte_studios', 'assets/sprites/logos/nullbyte_logo.png');
        },
        
        create: function() {
            // Ensure the loading bar is cropped as content is loaded (i.e. the "animation" of the bar increasing)
            this.loading_bar.cropEnabled = true;
        },
        
        update: function() {
            
        }
    }
}