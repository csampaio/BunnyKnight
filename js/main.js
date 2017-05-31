var game = new Phaser.Game(840, 480, Phaser.AUTO, 'phaser-canvas');

game.global = {
    score : 0,
    music : -1,
    sound_sprite: 'sound_on'
}
game.player;

game.state.add('functions', FunctionsGame);
game.state.add('menu', MenuState);
game.state.add('game', GameState);
game.state.add('credits',CreditsState);
game.state.add('lose', LoseState);
game.state.add('splash', SplashState);
game.state.start('functions');

