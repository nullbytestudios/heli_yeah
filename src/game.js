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
