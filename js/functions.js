"use strict"; 

var FunctionsGame = function(game) {};


FunctionsGame.prototype.preload = function() {
    this.game.load.image('bgMenu'       , 'Assets/initial_screen.png');
    this.game.load.image('start'        , 'Assets/big_button_play_on.png');
    this.game.load.image('credits'      , 'Assets/big_button_credits_on.png');       
    this.game.load.image('sound_on'     , 'Assets/button_sound_on.png');
    this.game.load.image('sound_off'    , 'Assets/button_sound_off.png');
    this.game.load.spritesheet('player' , 'Assets/', 0, 0, 0);
    
    this.game.load.image('menu'         , 'Assets/button_home_on.png');
    this.game.load.image('pause'        , 'Assets/button_pause.png');
    this.game.load.image('play'         , 'Assets/button_play.png');
    this.game.load.image('bgGameOver'   , 'Assets/game_over_screen.png');
    this.game.load.image('restart'      , 'Assets/button_back_off.png');
    this.game.load.image('bgCredits'    , 'Assets/credits_screen.png');    
    this.game.load.image('bgSplash'     , 'Assets/splash_screen.png');
  
    
    
    this.game.load.audio('music_menu',    ['assets/audio/']);
    this.game.load.audio('music_game',    ['assets/audio/']);
    
    this.game.load.audio('button_click' , ['assets/audio/Button-SoundBible.com-1420500901_01.ogg']);
    this.game.load.audio('button_switch', ['assets/audio/Switch-SoundBible.com-350629905_01.ogg']);

    game.sound.mute = false;
};

FunctionsGame.prototype.create = function() {
    this.game.state.start("splash");
};

FunctionsGame.prototype.update = function() {
};


function gotoGame(item) {
    this.button_click = this.game.add.music = this.add.audio('button_click');        
    this.button_click.play();
    this.game.time.events.add(Phaser.Timer.SECOND * 1, startGame, this);
};

function startGame() {
    this.game.state.start("game");
};

function gotoCredits(item) {
    this.button_click = this.game.add.music = this.add.audio('button_click');        
    this.button_click.play();    
    this.game.state.start("credits");
};

function gotoLose(item) {
    this.game.state.start('lose');
};


function gotoMenu(item) {
    this.button_click = this.game.add.music = this.add.audio('button_click');
    if (this.game.state.current !== "splash") this.button_click.play();    
    game.paused = false;
    this.game.time.events.add(Phaser.Timer.SECOND * 1, startMenu, this);
};

function startMenu() {
    this.game.state.start("menu");
};

function setarSound(item) {
    this.button_switch = this.game.add.music = this.add.audio('button_switch');        
    this.button_switch.play();
    if (game.sound.mute) {
        game.sound.mute = false;
        game.global.sound_sprite = 'sound_on';
        this.sound.loadTexture('sound_on');
    }
    else {
        game.sound.mute = true;
        game.global.sound_sprite = 'sound_off';
        this.sound.loadTexture('sound_off');
    }    
};

function setarPause(item) {
    this.button_switch = this.game.add.music = this.add.audio('button_switch');        
    this.button_switch.play();
    if (game.paused) {
        game.paused = false;
        this.pause.loadTexture('pause');
    }
    else {
//    while (this.button_switch.isPlaying){}
        game.paused = true;
        this.pause.loadTexture('play');
    }        
};