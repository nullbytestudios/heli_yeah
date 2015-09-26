/**
 * Plays the game.
 * 
 * @param Phaser game
 * @param Object Play
 */
;(function () {
  'use strict';
module.exports = function(game, Play) {
    var Player = require('./entities/player.js')(game);
    var Helicopter = require('./entities/helicopter.js')(game);
    
    Play.GameManager = function(game) {
        this.levels = {};
        this.player = null;
    };
    
    Play.GameManager.prototype = {
        preload: function() {
            // Remove anti-aliasing
            this.stage.smoothed = false;
            
            this.load.text('levels', 'assets/data/levels.json');
            this.load.image('player', 'assets/sprites/entities/player/default.png');
            this.load.atlasJSONArray('heli_cg', 'assets/sprites/entities/heli/heli_cg.png', 'assets/sprites/entities/heli/heli_cg.json');
        },
        
        create: function() {
            // Load level data
            this.levels = JSON.parse(game.cache.getText('levels'));
            
            this.helicopter = new Helicopter(200, 200);
            game.add.existing(this.helicopter);
            //this.helicopter.anchor.setTo(0.5, 1);
            /*
            // Create the player
            this.player = new Player(this.levels.level1.player_start.x, this.levels.level1.player_start.y);
            this.player.anchor.setTo(0.5, 1);
            game.add.existing(this.player);
            
            this.player = new Player(this.levels.level1.player_start.x, 640);
            this.player.anchor.setTo(0.5, 1);
            this.player.scale.setTo(2);
            game.add.existing(this.player);
            */
            
            
            /*
            var heli1 = game.add.sprite(100, 100, 'heli_cg', 'heli_cg_still');
            heli1.scale.setTo(2);
            var heli2 = game.add.sprite(100, 300, 'heli_cg', 'heli_cg_still');
            heli2.scale.setTo(2);
            heli2.animations.add('heli_cg_fly', Phaser.Animation.generateFrameNames('heli_cg_spin', 1, 4), 10, true, false);
            heli2.animations.play('heli_cg_fly');
            var heli3 = game.add.sprite(100, 500, 'heli_cg', 'heli_cg_still');
            heli3.scale.setTo(2);
            heli3.animations.add('heli_cg_fly', Phaser.Animation.generateFrameNames('heli_cg_spin', 1, 4), 40, true, false);
            heli3.animations.play('heli_cg_fly');
            */
        },
        
        update: function() {
            
        }
    };
};
})();