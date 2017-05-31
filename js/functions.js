"use strict"; 

var FunctionsGame = function(game) {};


FunctionsGame.prototype.preload = function() {
//spritesheets
    this.game.load.spritesheet('player'   , 'Assets/spritesheets/bunny_52x75.png' , 52, 75, 13);
    this.game.load.spritesheet('items'    , 'Assets/spritesheets/items.png'  , 32, 32, 16);
    this.game.load.spritesheet('enemies'  , 'Assets/spritesheets/enemies.png', 32, 32, 12);
    this.game.load.spritesheet('life'     , 'Assets/spritesheets/HUD388x352.png', 194, 88, 8);

//tile
//    this.game.load.image      ('mapTiles' ,'Assets/spritesheets/tiles.png');
//    this.game.load.tilemap    ('level1'   ,'Assets/maps/level1.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image      ('mapTiles' ,'Assets/tileset/TileSet_Fase1_Floresta.png');
    this.game.load.tilemap    ('level1'   ,'Assets/maps/level1_caverna.json', null, Phaser.Tilemap.TILED_JSON);

//sounds
    this.game.load.audio('button_click' , ['assets/audio/Button-SoundBible.com-1420500901_01.ogg']);
    this.game.load.audio('button_switch', ['assets/audio/Switch-SoundBible.com-350629905_01.ogg']);

//old
    this.game.load.audio('jumpSound'      ,'Assets/sounds/jump.wav');
    this.game.load.audio('pickupSound'    ,'Assets/sounds/pickup.wav');
    this.game.load.audio('hurtSound'      ,'Assets/sounds/hurt3.ogg');
    this.game.load.audio('enemyDeathSound','Assets/sounds/hit2.ogg');
    this.game.load.audio('music'          ,'Assets/sounds/mystery.wav');
    
//screens
    this.game.load.image('bgCredits'    , 'Assets/screens/screen_credits.png');    
    this.game.load.image('bgSplash'     , 'Assets/screens/splash_screen.png');
    this.game.load.image('bgMenu'       , 'Assets/screens/screen_title.png');
    this.game.load.image('bgGameOver'   , 'Assets/screens/screen_game_over.png');
    this.game.load.image('bgMoldura'    , 'Assets/screens/moldura.png');
    
//HUD
    this.game.load.image('start'        , 'Assets/HUD/big_button_play_on.png'); 
    this.game.load.image('credits'      , 'Assets/HUD/big_button_credits_on.png');       
    this.game.load.image('sound_on'     , 'Assets/HUD/button_sound_on.png');
    this.game.load.image('sound_off'    , 'Assets/HUD/button_sound_off.png');
    this.game.load.image('menu'         , 'Assets/HUD/button_home_on.png');
    this.game.load.image('pause'        , 'Assets/HUD/button_pause.png');
    this.game.load.image('play'         , 'Assets/HUD/button_play.png');
    this.game.load.image('restart'      , 'Assets/HUD/button_back_off.png'); 
    
//old    
//    this.game.load.spritesheet('player' , 'Assets/', 0, 0, 0);    
    this.game.load.audio('music_menu',    ['assets/audio/Super Circus_01.ogg']);
    this.game.load.audio('music_game',    ['assets/audio/Circus Tent_01.ogg']);
    

    game.sound.mute = false;
};

FunctionsGame.prototype.create = function() {
    this.game.state.start("splash");
};

FunctionsGame.prototype.update = function() {
};

//Navegação
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

//botoes jogo
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

//jogo
function coletarItem(player, item){
    this.pickupSound.play();
    item.kill();

//score a definir
    this.collectedDiamonds++;
    game.global.score += 100;
//    this.scoreText.text = "Score: " + game.global.score; 
    this.textScore.setText(game.global.score);

//se o total de itens essenciais for alcançado, liberar a porta de saída    
    if (this.collectedDiamonds == this.totalDiamonds){
//        this.textScore = this.game.add.text(400,100,"GANHOU!!", {fill: '#fff'});
//        this.textScore.fixedToCamera = true;    
        this.game.state.start('win');
    }
}

function colisaoMortal(player, lava){
    this.hurtSound.play();    
    this.level1.setCollision([5,6,13],false,this.lavaLayer);
//    this.textScore = this.game.add.text(400,300,"PERDEU!!", {fill: '#fff'});
//    this.textScore.fixedToCamera = true;   
    this.game.time.events.add(Phaser.Timer.SECOND * 1.5, gotoLose, this);
}

function colisaoInimigo(player, inimigo){
    if (player.body.touching.right && inimigo.body.touching.left){
        this.enemyDeathSound.play();
//        this.player.body.velocity.y = -200;
        game.global.score += 100;
//        this.scoreText.text = "Score: " + game.global.score;
        this.textScore.setText(game.global.score);
        
        inimigo.kill();
    }
    else this.game.state.start('lose');
}  