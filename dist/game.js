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
},{}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
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
},{"./entities/helicopter.js":2,"./entities/player.js":3}],5:[function(require,module,exports){
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
},{"./logos_intro.js":5}],8:[function(require,module,exports){
window.onload = function()
{
    var game = new Phaser.Game(960, 640, Phaser.AUTO, 'game', null, false);
    var Play = {};
    
    require('./boot.js')(game, Play);
    
    game.state.add('launch', Play.Launch);
    game.state.start('launch');
};

},{"./boot.js":1}]},{},[8]);
