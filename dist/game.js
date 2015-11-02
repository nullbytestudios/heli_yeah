(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Performs start up procedures.
 * Configures settings and preloads the game.
 * 
 * @param Phaser game
 * @param Object Play
 */
;(function () {
  'use strict';
module.exports = function(game, Play) {
    require('./preloader.js')(game, Play);
    
    Play.Launch = function(game) {};
    
    Play.Launch.prototype = {
        init: function() {
            // Set a preloader state
            this.state.add('preloader', Play.Preloader);
            
            // Only allow one pointer to be active
            this.input.maxPointers = 1;
        },
        
        preload: function() {
            // Load assets required by the preloader
            this.load.image('preloader_bg', 'assets/sprites/preloader/background.png');
            this.load.image('preloader_bar', 'assets/sprites/preloader/bar.png');
        },
        
        create: function() {
            // Start the preloader
            this.state.start('preloader');
        }
    };
};
})();
},{"./preloader.js":7}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
window.onload = function()
{
    var game = new Phaser.Game(960, 640, Phaser.AUTO, 'game', null, false);
    var Play = {};
    
    require('./boot.js')(game, Play);
    
    game.state.add('launch', Play.Launch);
    game.state.start('launch');
};

},{"./boot.js":1}],4:[function(require,module,exports){
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
        this.rocks = null;
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
            this.load.atlasJSONArray('rock', 'assets/sprites/entities/rock/rock.png', 'assets/sprites/entities/rock/rock.json');
            this.load.atlasJSONArray('bg', 'assets/sprites/backgrounds/background.png', 'assets/sprites/backgrounds/background.json');
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
            //this.bg.add(this.add.tileSprite(0, 0, game.width, 32, 'bg', 'top'));
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
            this.helicopter.body.mass = 2;
            
            this.helicopter.fly();
            
            this.cursors = game.input.keyboard.createCursorKeys();
            
            this.rocks = game.add.group();
            this.rocks.enableBody = true;
            game.physics.arcade.enable([this.rocks, this.bg, this.helicopter], true);
            
            for (var i = 0; i < 10; i++) {
                //var rock_sprite = game.add.sprite(game.rnd.integerInRange(0, game.width), game.rnd.integerInRange(1, game.height) * -32, 'rock');
                //var rock_sprite = game.add.sprite(32, 32 + i*32, 'rock');
                var rock = this.rocks.create(game.rnd.integerInRange(0, game.width), game.rnd.integerInRange(1, game.height) * -1, 'rock', 'rock1');
                
                rock.body.collideWorldBounds = false;
                rock.body.mass = 3;
                rock.body.gravity.x = game.rnd.integerInRange(-50, 50);
                rock.body.gravity.y = game.rnd.integerInRange(0, 200) + 100;
                rock.body.bounce.set(0);
            }
        },
        
        update: function() {
            // Check collision between the helicopter and the background top/bottom
            game.physics.arcade.collide(this.helicopter, this.bg, function(helicopter, bg) {
                // Move the helicopter back slightly to avoid getting stuck in the background
                helicopter.body.velocity.y *= -0.1;
            });
            
            //game.physics.arcade.collide(this.rocks, this.bg);
            game.physics.arcade.collide(this.rocks, this.helicopter);
            
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
},{"./entities/helicopter.js":2}],5:[function(require,module,exports){
/**
 * Displays the logos at the start of the game and enters the Main Menu.
 * 
 * @param Phaser game
 * @param Object Play
 */
;(function () {
  'use strict';
module.exports = function(game, Play) {
    require('./main_menu.js')(game, Play);
    
    Play.LogosIntro = function(game) {
        this.is_ready = false;
        this.timer = null;
    };
    
    Play.LogosIntro.prototype = {
        preload: function() {
            // Set a main menu state
            this.state.add('main_menu', Play.MainMenu);
            
            // Use a black background
            game.backgroundColor = 0x000000;
            
            // Center the logo to the middle of the screen
            this.add.sprite(game.world.centerX, game.world.centerY, 'nullbyte_studios').anchor.setTo(0.5);
            
            // Create a timer for how long to play the logo
            this.timer = game.time.create();
            this.timer.add(1000, this.endTimer, this);
            
            // Load additional assets for the menu
            this.load.audio('main_menu_music', ['assets/audio/music/main_menu.mp3']);
            this.load.image('main_logo', 'assets/sprites/logos/logo.png');
            this.load.atlas('main_menu_play_button', 'assets/sprites/buttons/play.png', 'assets/sprites/buttons/play.json');
        },
        
        create: function() {
            // Start the logo timer
            this.timer.start();
        },
        
        update: function() {
            // Wait for the audio to finish loading before continuing
            if (this.cache.isSoundDecoded('main_menu_music') && this.is_ready === true) {
                this.state.start('main_menu');
            }
        },
        
        endTimer: function() {
            this.is_ready = true;
        }
    };
};
})();
},{"./main_menu.js":6}],6:[function(require,module,exports){
/**
 * Displays the main menu.
 * 
 * @param Phaser game
 * @param Object Play
 */
;(function () {
  'use strict';
module.exports = function(game, Play) {
    require('./game_manager.js')(game, Play);
    
    Play.MainMenu = function(game) {
        this.music = null;
    };
    
    Play.MainMenu.prototype = {
        preload: function() {
            // Set a level manager state
            this.state.add('game_manager', Play.GameManager);
            
            // Set the background
            this.stage.backgroundColor = 0xd2f8ff;
            
            // Center the logo to the top of the screen
            this.add.sprite(game.world.centerX, 40, 'main_logo').anchor.setTo(0.5, 0);
        },
        
        create: function() {
            // Set the music to loop at half volume
            this.music = this.add.audio('main_menu_music', 0.5, true).play();
            
            this.add.button(game.world.centerX, game.world.centerY, 'main_menu_play_button', this.start, this, "hover", "up", "down", "hover")
                    .anchor.setTo(0.5);
        },
        
        start: function() {
            this.music.stop();
            
            // Start up the game
            this.state.start('game_manager');
        }
    };
};
})();
},{"./game_manager.js":4}],7:[function(require,module,exports){
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
},{"./logos_intro.js":5}]},{},[3]);
