/**
 * Transitions to the given level.
 * 
 * @param Phaser game
 * @param Object Play
 */
module.exports = function(game, Play) {
    require('./level_1.js')(game, Play);
    
    Play.LevelManager = function(game) {
        this.current_level = null;
        this.level_prefix = 'level_';
    };
    
    Play.LevelManager.prototype = {
        init: function(level_name) {
            level_name = (level_name == "manager" ? null : level_name);
            this.current_level = (level_name !== null ? this.level_prefix + level_name : null);
        },
        
        preload: function() {
            // Set the background
            this.stage.backgroundColor = 0x000000;
            this.state.add(this.current_level, Play.Level1);
        },
        
        create: function() {
            // Start the level
            if (this.current_level !== null) {
                this.state.start(this.current_level);
            } else {
                this.state.start('main_menu');
            }
        }
    };
};