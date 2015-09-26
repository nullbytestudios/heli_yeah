/**
 * Helicopter control object
 * 
 * @param Phaser game
 * @param Sprite sprite
 */
module.exports = function (game) {
    
    var Helicopter = function(x, y) {
        Phaser.Sprite.call(this, game, x, y, 'heli_cg');
        
        // Set event handlers
        this.keys = game.input.keyboard.createCursorKeys();
        this.acceleration = 0.5;
        this.speed_x = 0;
        this.speed_y = 0;
        this.max_speed_x = 20;
        this.max_speed_y = 10;
        this.velocities = {
            right:0.1,
            left:0.1,
            up:0.1,
            down:0.05
        };
        
        this.animations.add('heli_cg_fly', Phaser.Animation.generateFrameNames('heli_cg_spin', 1, 4), 40, true, false);
        this.animations.play('heli_cg_fly');
    };
    
    Helicopter.prototype = Object.create(Phaser.Sprite.prototype);
    Helicopter.prototype.constructor = Helicopter;
    
    Helicopter.prototype.update = function() {
        if (this.keys.right.isDown) {
            this.x += this.move('right');
        } else if (this.keys.left.isDown) {
            this.x -= this.move('left');
        }
        
        if (this.keys.up.isDown) {
            this.y -= this.move('up');
        } else if (this.keys.down.isDown) {
            this.y += this.move('down');
        }
    };
    
    Helicopter.prototype.move = function(direction) {
        var speed = 0;
        
        switch (direction) {
            case 'left':
            case 'down':
                speed = Math.max(
                    this.velocities[direction] + (this.acceleration * this.speed_y),
                    this.max_speed_y
                );
                this.speed_y = speed;
                break;
            case 'right':
            case 'up':
                speed = Math.max(
                    this.velocities[direction] + (this.acceleration * this.speed_x),
                    this.max_speed_x
                );
                this.speed_x = speed;
                break;
        }
        
        return speed;
    };
    
    return Helicopter;
};