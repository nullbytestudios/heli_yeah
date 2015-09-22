/**
 * Plays the game.
 * 
 * @param Phaser game
 * @param Object Play
 */
module.exports = function(game, Play) {
    var Player = require('./entities/player.js')(game);
    
    Play.GameManager = function(game) {
        this.levels = {};
        this.player = null;
        this.heli_frame_back
    };
    
    Play.GameManager.prototype = {
        preload: function() {
            // Remove anti-aliasing
            this.stage.smoothed = false;
            
            this.load.text('levels', 'assets/data/levels.json');
            this.load.image('player', 'assets/sprites/entities/player/default.png');
            this.load.atlasJSONHash('helicopter', 'assets/sprites/entities/heli/helicopter.png', 'assets/sprites/entities/heli/helicopter.json');
        },
        
        create: function() {
            // Load level data
            this.levels = JSON.parse(game.cache.getText('levels'));
            
            // Create the player
            this.player = new Player(this.levels.level1.player_start.x, this.levels.level1.player_start.y);
            this.player.anchor.setTo(0.5, 1);
            game.add.existing(this.player);
            
            this.player = new Player(this.levels.level1.player_start.x, 640);
            this.player.anchor.setTo(0.5, 1);
            this.player.scale.setTo(2);
            game.add.existing(this.player);
            
            
            
            
            // Add helicopter (example)
            this.heli_frame_back = game.add.sprite(100, 100, 'helicopter', 'heli_frame_back');
            var heli_frame = game.add.sprite(-73, -15, 'helicopter', 'heli_frame');
            var heli_rear_blade = game.add.sprite(-62, 12, 'helicopter', 'heli_rear_blade');
            var heli_top_blade = game.add.sprite(-59, -8, 'helicopter', 'heli_top_blade');
            
            this.heli_frame_back.addChild(heli_frame);
            this.heli_frame_back.addChild(heli_rear_blade);
            this.heli_frame_back.addChild(heli_top_blade);
            
            // Helicopter 2
            var heli_frame_back = game.add.sprite(300, 100, 'helicopter', 'heli_frame_back');
            var heli_frame = game.add.sprite(-73, -15, 'helicopter', 'heli_frame');
            var heli_rear_blade = game.add.sprite(-62, 12, 'helicopter', 'heli_rear_blade_spin');
            var heli_top_blade = game.add.sprite(-59, -8, 'helicopter', 'heli_top_blade_spin1');
            heli_top_blade.animations.add('top_blade', Phaser.Animation.generateFrameNames('heli_top_blade_spin', 1, 3), 30, true, false);
            heli_top_blade.animations.play('top_blade');
            
            heli_frame_back.addChild(heli_frame);
            heli_frame_back.addChild(heli_rear_blade);
            heli_frame_back.addChild(heli_top_blade);
            
            // Helicopter 3
            var heli_frame_back = game.add.sprite(300, 550, 'helicopter', 'heli_frame_back');
            var heli_frame = game.add.sprite(-73, -15, 'helicopter', 'heli_frame');
            var heli_rear_blade = game.add.sprite(-62, 12, 'helicopter', 'heli_rear_blade_spin');
            var heli_top_blade = game.add.sprite(-59, -8, 'helicopter', 'heli_top_blade_spin1');
            heli_top_blade.animations.add('top_blade', Phaser.Animation.generateFrameNames('heli_top_blade_spin', 1, 3), 40, true, false);
            heli_top_blade.animations.play('top_blade');
            
            heli_frame_back.addChild(heli_frame);
            heli_frame_back.addChild(heli_rear_blade);
            heli_frame_back.addChild(heli_top_blade);
            heli_frame_back.scale.setTo(2);
        },
        
        update: function() {
            if (game.input.keyboard.createCursorKeys().right.isDown) {
                this.heli_frame_back.x++;
            }
        }
    };
};