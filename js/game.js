"use strict";

var GameState = function (game) {};

GameState.prototype.preload = function () {
    
};

GameState.prototype.create = function () {
    
    if (game.global.music != 2){
        game.global.music = 2;
        game.sound.stopAll();
        this.music_game = this.game.add.music = this.add.audio('music_game');        
        this.music_game.loopFull();
    }    
    
    game.paused = false;  
    
//ativar sistema de física
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.stage.backgroundColor = "#5c82bc";
        
 

//teclas
    this.shootKey = this.game.input.keyboard.addKey(Phaser.Keyboard.CTRL);
    this.jumpKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    
    
    
    
    
    
    this.level1 =  this.game.add.tilemap('level1');
    this.level1.addTilesetImage('tiles_level1','mapTiles');
    this.wallsLayerBg = this.level1.createLayer('Bg');
    this.wallsLayer = this.level1.createLayer('Walls');
    this.espinhosLayer = this.level1.createLayer('Lava');
    this.wallsLayer.resizeWorld();

    //som    
    this.jumpSound = this.game.add.audio('jumpSound');
    this.pickupSound = this.game.add.audio('pickupSound');
    this.hurtSound = this.game.add.audio('hurtSound');
    this.enemyDeathSound= this.game.add.audio('enemyDeathSound');
    
    this.level1.setCollisionByExclusion([23,24,25, 29,30, 31,32,33,34,35,39,40], true, this.wallsLayer);
    this.level1.setCollision([23],true,this.espinhosLayer);
    
    
    // Player
    // Inicializando jogador  
    this.player = this.game.add.sprite(160, 2600, 'player', 5);
    this.player.anchor.setTo(0.5, 0.5);
    this.game.physics.enable(this.player);
    this.player.body.gravity.y = 750;
    this.player.body.collideWorldBounds = true;
    
    this.game.camera.follow(this.player);
    
    this.player.animations.add('walk',[3, 4, 5, 6, 7],6);
    this.player.animations.add('idle',[8,9],2);
    this.player.animations.add('jump',[11,12],2);
        
    this.keys = this.game.input.keyboard.createCursorKeys();
    this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    
    //Grupo diamonds
    this.diamonds= this.game.add.physicsGroup();
    //criando objetos do tiled
    this.level1.createFromObjects('Items','diamond', 'items', 5, true, false, this.diamonds);

    this.diamonds.forEach(function(diamond){
//        diamond.anchor.setTo(0.5,0.5);
        diamond.body.immovable = true;
        diamond.animations.add('spin', [4, 5, 6, 7, 6, 5], 6, true);
        diamond.animations.play('spin');    
    });
    
    //Criando plataformas
    this.platforms = this.game.add.physicsGroup();
    this.level1.createFromObjects('Platforms','platform', 'tiles_level1', 23, true, false, this.platforms);
    this.platforms.forEach( function (platform) {
        platform.body.immovable = true;
    });

        
//    //Grupo inimigos
    this.inimigos= this.game.add.physicsGroup();
//    //criando objetos do tiled
    this.level1.createFromObjects('Enemies','Gosma', 'enemies', 5, true, false, this.inimigos); 
    this.inimigos.forEach(function(inimigo){
        inimigo.anchor.setTo(0.5,0.5);
        inimigo.body.immovable = true;
        inimigo.animations.add('spin', [8, 9, 10], 6, true);
        inimigo.animations.play('spin');    
        inimigo.body.velocity.x = 100;
        inimigo.body.bounce.x = 1;
    });        
    
    //Game State
    this.totalDiamonds = this.diamonds.length;
    this.collectedDiamonds = 0;
    game.global.score = 0

    
//    this.scoreText = this.game.add.text(350,50, "Score: 0", {font: "25px Ariak",fill:'#ffffff'});
//    this.scoreText.fixedToCamera = true;        
    
    this.moldura = this.game.add.sprite(0, 0, 'bgMoldura') 
    this.moldura.fixedToCamera = true;  
    
    this.textScore = this.game.add.text(280, 20, game.global.score, {font: "bold 32px Arial", fill: "#fff", boundsAlignH: "right"});
    this.textScore.anchor.x = 0.5; 
    this.textScore.fixedToCamera = true;  
   
    this.menu = this.game.add.sprite(10, 10, 'menu')
    this.menu.scale.x = 1.1
    this.menu.scale.y = 1.1
    this.menu.inputEnabled = true;
    this.menu.events.onInputDown.add(gotoMenu, this);
    this.menu.fixedToCamera = true;  

//sound
    this.sound = this.game.add.sprite(785, 10, game.global.sound_sprite)
    this.sound.scale.x = 1.1
    this.sound.scale.y = 1.1
    this.sound.inputEnabled = true;
    this.sound.events.onInputDown.add(setarSound, this);        
    this.sound.fixedToCamera = true;  

//pause
    this.pause = this.game.add.sprite(735, 10, 'pause')
    this.pause.scale.x = 1.1
    this.pause.scale.y = 1.1
    this.pause.inputEnabled = true;
    this.pause.events.onInputDown.add(setarPause, this);           
    this.pause.fixedToCamera = true;  

    this.life = this.game.add.sprite(80, 5, 'life', 0);
    this.life.scale.x = 0.6
    this.life.scale.y = 0.6

};

GameState.prototype.update = function () {
    this.inimigos.forEach(function(inimigo){
        if (inimigo.body.velocity.x != 0){
            inimigo.scale.x = 1 * Math.sign(inimigo.body.velocity.x);
        }
    });    
    
    this.game.physics.arcade.collide(this.player, this.wallsLayer);
    this.game.physics.arcade.collide(this.player, this.platforms, platformFall, null, this);    
    this.game.physics.arcade.overlap(this.player, this.diamonds, coletarItem, null, this);
    this.game.physics.arcade.collide(this.player, this.espinhosLayer, colisaoMortal, null, this);

    this.game.physics.arcade.collide(this.inimigos, this.wallsLayer);
    this.game.physics.arcade.collide(this.player, this.inimigos, colisaoInimigo, null, this);
    
    
    if(this.keys.left.isDown){
        this.player.body.velocity.x = -150; // Ajustar velocidade
        // Se o jogador estiver virado para a direita, inverter a escala para que ele vire para o outro lado
        if(this.player.scale.x == 1) this.player.scale.x = -1;
        this.player.animations.play('walk');
    }
    // Se a tecla direita estiver pressionada (this.keys.right.isDown == true),
    // mover o sprite para a direita
    else if(this.keys.right.isDown){
        // se a tecla direita estiver pressionada
        this.player.body.velocity.x = 150;  // Ajustar velocidade
        // Se o jogador estiver virado para a direita, inverter a escala para que ele vire para o outro lado
        if(this.player.scale.x == -1) this.player.scale.x = 1;
        this.player.animations.play('walk');
    }
    else {
        // Se nenhuma tecla estiver sendo pressionada:
        // Ajustar velocidade para zero
        this.player.body.velocity.x = 0;
        // Executar animação 'idle'
        this.player.animations.play('idle');
    }

    // Se o a barra de espaço ou a tecla cima estiverem pressionadas, e o jogador estiver com a parte de baixo tocando em alguma coisa
    if((this.jumpButton.isDown || this.keys.up.isDown) && (this.player.body.touching.down || this.player.body.onFloor())){
        // Adicione uma velocidade no eixo Y, fazendo o jogador pular
        this.player.body.velocity.y = -500;
        this.jumpSound.play();
    }
    
    if (!this.player.body.touching.down && !this.player.body.onFloor()){
                this.player.animations.play('jump');
    }    
};
