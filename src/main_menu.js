/**
 * Displays the main menu.
 * 
 * @param Phaser game
 * @param Object Play
 */
module.exports = function(game, Play) {
    Play.MainMenu = function(game) {
        this.music = null;
    };
    
    Play.MainMenu.prototype = {
        preload: function() {
            // Set the background
            this.stage.backgroundColor = 0xd2f8ff;
            
            // Center the logo to the top of the screen
            var logo = this.add.sprite(game.width/2, 40, 'main_logo');
            logo.anchor.setTo(0.5, 0);
        },
        
        create: function() {
            // Set the music to loop at half volume
            this.music = this.add.audio('main_menu_music', 0.5, true);
            this.music.play();
        }
    }
}