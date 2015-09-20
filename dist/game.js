(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Performs start up procedures.
 * Configures settings and preloads the game.
 * 
 * @param Phaser game
 * @param Object Play
 */
module.exports = function(game, Play) {
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
},{}],2:[function(require,module,exports){
/**
 * Displays the preloader and enters the Main Menu.
 * 
 * @param Phaser game
 * @param Object Play
 */
module.exports = function(game, Play) {
    Play.Preloader = function(game) {
        this.background = null;
        this.loading_bar = null;
        this.is_ready = false;
    };
    
    Play.Preloader.prototype = {
        preload: function() {
            // Set the background and loading bar available from boot
            this.background = this.add.sprite(0, 0, 'preloader_bg');
            // Center the loading bar, knowing it's image width is 432px (432/2 = 216)
            this.loading_bar = this.add.sprite(game.width/2 - 216, game.height/2, 'preloader_bar');
            
            // Set the loading bar as the preloading sprite, automatically animating it as content is loaded
            this.load.setPreloadSprite(this.loading_bar);
            
            // Load additional assets
            this.load.image('nullbyte_studios', 'assets/sprites/logos/nullbyte_logo.png');
        },
        
        create: function() {
            // Ensure the loading bar is cropped as content is loaded (i.e. the "animation" of the bar increasing)
            this.loading_bar.cropEnabled = true;
        },
        
        update: function() {
            
        }
    }
}
},{}],3:[function(require,module,exports){
window.onload = function()
{
    var game = new Phaser.Game(960, 640, Phaser.AUTO, 'game'/*, { preload: preload, create: create, update: update, render: render}*/);
    var Play = {};
    
    require('./boot.js')(game, Play);
    require('./preloader.js')(game, Play);
    //require('./levels/level1.js')(game, Play);
    
    game.state.add('launch', Play.Launch);
    //game.state.add('preloader', Play.Preloader);
    
    game.state.start('launch');
/*
    function preload()
    {
        //game.load.atlasJSONHash('helicopter', 'assets/heli/helicopter.png', 'assets/heli/helicopter.json');
        game.state.start('launch');
        game.stage.backgroundColor = 0xffffff;
        game.load.image('helicopter', 'assets/sprites/heli/coastguard.png');
    }

    function create()
    {
        var heli = game.add.sprite(50, 50, 'helicopter');
        
        //var heli = game.add.sprite(50, 50, 'helicopter');
        //heli.scale.setTo(0.9, 0.9);

        //var fly = heli.animations.add('fly');
        //heli.animations.play('fly', 30, true);
    }

    function update()
    {

    }

    function render()
    {

    }
    */
};

},{"./boot.js":1,"./preloader.js":2}]},{},[3]);
