/**
 * Helicopter control object
 * 
 * @param Phaser game
 * @param Sprite sprite
 */
module.exports = function (game) {
    var Helicopter = function(x, y) {
        Phaser.Sprite.call(this, game, x, y, 'heli_cg');
        
        this.animations.add('heli_cg_fly', Phaser.Animation.generateFrameNames('heli_cg_spin', 1, 4), 40, true, false);
        this.animations.add('heli_cg_still', Phaser.Animation.generateFrameNames('heli_cg_still'), 1, false, false);
    };
    
    Helicopter.prototype = Object.create(Phaser.Sprite.prototype);
    Helicopter.prototype.constructor = Helicopter;
    
    Helicopter.prototype.fly = function() {
        this.animations.stop('heli_cg_still');
        this.animations.play('heli_cg_fly');
    };
    
    Helicopter.prototype.land = function() {
        this.animations.stop('heli_cg_fly');
        this.animations.play('heli_cg_still');
    };
    
    return Helicopter;
};