/**
 * Plays the game.
 * 
 * @param Phaser game
 * @param Object Play
 */
;(function () {
  'use strict';
module.exports = function(game, Play) {
    var Helicopter = require('./entities/helicopter.js')(game);
    var helicopter_acceleration = {
        x:600,
        y:300
    };
    var helicopter_volume = {
        idle:0.25,
        fly:0.5
    };
    var helicopter_max_angle = 25;
    var sounds = {};
    
    Play.GameManager = function(game) {
        this.levels = {};
        this.helicopter = null;
        this.bg = {};
        this.invisible_walls = {
            left:80,
            right:game.world.centerX
        };
    };
    
    Play.GameManager.prototype = {
        preload: function() {
            // Remove anti-aliasing
            this.stage.smoothed = false;
            
            this.load.text('levels', 'assets/data/levels.json');
            this.load.audio('helicopter_flying', ['assets/audio/sounds/helicopter_flying.mp3']);
            this.load.atlasJSONArray('heli_cg', 'assets/sprites/entities/heli/heli_cg.png', 'assets/sprites/entities/heli/heli_cg.json');
            this.load.atlasJSONArray('bg', 'assets/sprites/backgrounds/background.png', 'assets/sprites/backgrounds/background.json');
        },
        
        create: function() {
            console.log(this.invisible_walls);
            // Load level data
            this.levels = JSON.parse(game.cache.getText('levels'));
            
            sounds.helicopter_flying = game.add.audio('helicopter_flying', helicopter_volume.idle, true);
            sounds.helicopter_flying.play();
            game.physics.startSystem(Phaser.Physics.Arcade);
            game.physics.arcade.gravity.y = 50;
            
            this.bg = game.add.group();
            this.bg.enableBody = true;
            this.bg.add(this.add.tileSprite(0, game.height - 32,  game.width, 32, 'bg', 'bottom'));
            this.bg.add(this.add.tileSprite(0, 0, game.width, 32, 'bg', 'top'));
            this.bg.add(this.add.tileSprite(0, 32, game.width, game.height - 64, 'bg', 'background'));
            
            var heli = new Helicopter(200, 200);
            this.helicopter = game.add.existing(heli);
            this.helicopter.anchor.setTo(0.5, 1);
            
            game.physics.arcade.enable([this.helicopter, this.bg], true);
            
            // Ensure the background doesn't move
            this.bg.forEach(function(bg) {
                bg.body.moves = false;
                bg.body.allowGravity = false;
                
                // The 'background' frame should not collide with the helicopter
                if (bg.frameName === 'background') {
                    bg.body.immovable = true;
                }
            }, this);
            
            //this.helicopter.body.bounce.set(0.5);
            this.helicopter.body.gravity.y = 25;
            this.helicopter.body.collideWorldBounds = true;
            this.helicopter.body.allowRotation = true;
            this.helicopter.body.allowBounce = false;
            //this.helicopter.body.immovable = true;
            
            this.helicopter.body.maxVelocity.setTo(200, 200);
            this.helicopter.body.drag.setTo(200, 200);
            this.helicopter.body.angularDrag = 20;
            
            this.helicopter.fly();
            
            this.cursors = game.input.keyboard.createCursorKeys();
        },
        
        update: function() {
            // Check collision between the helicopter and the background top/bottom
            game.physics.arcade.collide(this.helicopter, this.bg, function(helicopter, bg) {
                // Move the helicopter back slightly to avoid getting stuck in the background
                helicopter.body.velocity.y *= -0.1;
            });
            
            this.flyHelicopter();
            this.scrollBackground();
        },
        
        scrollBackground: function() {
            var velocity = this.helicopter.body.velocity.x;
            this.bg.forEach(function(bg) {
                bg.stopScroll();
            }, this);
            
            // Scroll at the helicopter's speed once it has reached the invisible wall
            if (velocity > 0 && this.helicopter.x >= this.invisible_walls.right) {
                this.bg.forEach(function(bg) {
                   bg.autoScroll(-velocity, 0);
                }, this);
            }
        },
        
        flyHelicopter: function() {
            // Reset volume, acceleration
            this.helicopter.body.acceleration.setTo(0,0);
            sounds.helicopter_flying.volume = helicopter_volume.fly;
            
            // Move left/right
            if (this.cursors.left.isDown) {
                this.helicopter.body.acceleration.x = -helicopter_acceleration.x;
            } else if (this.cursors.right.isDown) {
                this.helicopter.body.acceleration.x = helicopter_acceleration.x;
            }

            // Move up/down
            if (this.cursors.up.isDown) {
                this.helicopter.body.acceleration.y = -helicopter_acceleration.y;
            } else if (this.cursors.down.isDown) {
                this.helicopter.body.acceleration.y = helicopter_acceleration.y;
            }
            
            // Not moving, decrease helicopter volume
            if (!this.cursors.down.isDown && !this.cursors.up.isDown && !this.cursors.right.isDown && !this.cursors.left.isDown) {
                sounds.helicopter_flying.volume = helicopter_volume.idle;
            }
            
            // Set imaginary boundaries
            if (this.helicopter.x > this.invisible_walls.right) {
                this.helicopter.x = this.invisible_walls.right;
            } else if (this.helicopter.x < this.invisible_walls.left) {
                this.helicopter.x = this.invisible_walls.left;
            }
            
            // Change angle of helicopter
            this.helicopter.angle = (this.helicopter.body.velocity.x / this.helicopter.body.maxVelocity.x) * helicopter_max_angle;
        }
    };
};
})();