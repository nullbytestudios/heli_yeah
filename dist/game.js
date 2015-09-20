(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Performs start up procedures.
 * Configures settings and preloads the game.
 * 
 * @param Phaser game
 * @param Object Play
 */
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
    }
}
},{"./preloader.js":4}],2:[function(require,module,exports){
/**
 * Displays the logos at the start of the game and enters the Main Menu.
 * 
 * @param Phaser game
 * @param Object Play
 */
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
            var nullbyte = this.add.sprite(game.width/2, game.height/2, 'nullbyte_studios');
            nullbyte.anchor.setTo(0.5);
            
            // Create a timer for how long to play the logo
            this.timer = game.time.create();
            this.timer.add(3000, this.endTimer, this);
            
            // Load additional assets for the menu
            this.load.audio('main_menu_music', ['assets/audio/music/main_menu.mp3']);
            this.load.image('main_logo', 'assets/sprites/logos/logo.png');
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
    }
}
},{"./main_menu.js":3}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
/**
 * Displays the preloader and heads into the logo intro.
 * 
 * @param Phaser game
 * @param Object Play
 */
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
            this.loading_bar = this.add.sprite(game.width/2, game.height/2 + 20, 'preloader_bar');
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
    }
}
},{"./logos_intro.js":2}],5:[function(require,module,exports){
window.onload = function()
{
    var game = new Phaser.Game(960, 640, Phaser.AUTO, 'game');
    var Play = {};
    
    require('./boot.js')(game, Play);
    
    game.state.add('launch', Play.Launch);
    game.state.start('launch');
};

},{"./boot.js":1}]},{},[5]);
