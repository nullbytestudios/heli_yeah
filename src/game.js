window.onload = function()
{
    var game = new Phaser.Game(960, 640, Phaser.AUTO, 'game', null, false);
    var Play = {};
    
    require('./boot.js')(game, Play);
    
    game.state.add('launch', Play.Launch);
    game.state.start('launch');
};
