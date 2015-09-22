/**
 * Player control object
 * 
 * @param Phaser game
 * @param Sprite sprite
 */
module.exports = function (game) {
    
    var Player = function(x, y) {
        Phaser.Sprite.call(this, game, x, y, 'player');

        // Set player directions
        this.directions = {
            UP: 'up',
            DOWN: 'down',
            LEFT: 'left',
            RIGHT: 'right'
        };
        this.actions = {
            IDLE: 'idle',
            RUNNING: 'running',
            JUMPING: 'jumping'
        };
        
        this.is_facing = this.directions.RIGHT;
        this.action = this.actions.IDLE;
        
        // Set event handlers
        this.keys = game.input.keyboard.createCursorKeys();
    };
    
    Player.prototype = Object.create(Phaser.Sprite.prototype);
    Player.prototype.constructor = Player;
    
    Player.prototype.update = function() {
        if (this.keys.right.isDown) {
            this.moveRight();
        } else if (this.keys.left.isDown) {
            this.moveLeft();
        }
        
        if (this.keys.up.isDown) {
            this.moveUp();
        } else if (this.keys.down.isDown) {
            this.moveDown();
        }
    };
    
    Player.prototype.moveUp = function() {

    };
        
    Player.prototype.moveDown = function() {
            
    };
        
    Player.prototype.moveLeft = function() {
        this.is_facing = this.directions.LEFT;
        this.x--;
    };
        
    Player.prototype.moveRight = function() {
        this.is_facing = this.directions.RIGHT;
        this.x++;
    };
    
    return Player;
};