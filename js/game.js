"use strict";

var GameState = function (game) {};

GameState.prototype.preload = function () {
    
};

GameState.prototype.create = function () {
    
//Musica
    if (game.global.music != 2){
        game.global.music = 2;
        game.sound.stopAll();
        this.music_game = this.game.add.music = this.add.audio('music_game');        
        this.music_game.loopFull();
    }    
    
    game.paused = false;  
    
//Som    
    this.jumpSound = this.game.add.audio('jumpSound');
    this.pickupSound = this.game.add.audio('pickupSound');
    this.hurtSound = this.game.add.audio('hurtSound');
    this.enemyDeathSound= this.game.add.audio('enemyDeathSound');

//Ativar sistema de física
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.stage.backgroundColor = "#5c82bc";
        
//Teclas
    this.leftKey  = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    this.shootKey = this.game.input.keyboard.addKey(Phaser.Keyboard.CTRL);
    this.jumpKey  = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    if (game.global.level_atual == 1){
//Level1
        this.levelAtual = this.game.add.tilemap('tileMapFase1');
        game.global.tiles_level_atual = 'tiles_level1';            
        this.levelAtual.addTilesetImage(game.global.tiles_level_atual,'tileImageFase1');
    }
    else{
        if (game.global.level_atual == 2){
//Level2 -> AJUSTAR
            this.levelAtual = this.game.add.tilemap('tileMapFase2');
            game.global.tiles_level_atual = 'tiles_level2';            
            this.levelAtual.addTilesetImage(game.global.tiles_level_atual,'tileImageFase2');
        }
        else{
//Level3 -> AJUSTAR
            this.levelAtual = this.game.add.tilemap('tileMapFase3');
            game.global.tiles_level_atual = 'tiles_level1';            
            this.levelAtual.addTilesetImage(game.global.tiles_level_atual,'tileImageFase3');            
        }
        
    }
        
    this.layerBackground = this.levelAtual.createLayer('Background');
    this.layerArmadilha  = this.levelAtual.createLayer('Armadilha');
    this.layerSaida      = this.levelAtual.createLayer('Saida');
    this.layerPlataforma = this.levelAtual.createLayer('Plataforma');
    this.layerPlataforma.resizeWorld();

//Colisoes    
    if (game.global.level_atual == 1){
//Level1
        this.levelAtual.setCollisionByExclusion([23,24,25, 29,30, 31,32,33,34,35,39,40], true, this.layerPlataforma);
        this.levelAtual.setCollision([23],true,this.layerArmadilha);
        this.levelAtual.setCollision([52,53,62,63],true,this.layerSaida);
    }
    else{
        if (game.global.level_atual == 1){
//Level2 -> AJUSTAR
            this.levelAtual.setCollisionByExclusion([23,24,25, 29,30, 31,32,33,34,35,39,40], true, this.layerPlataforma);
            this.levelAtual.setCollision([23],true,this.layerArmadilha);
            this.levelAtual.setCollision([52,53,62,63],true,this.layerSaida);
        }
        else{
//Level3 -> AJUSTAR
            this.levelAtual.setCollisionByExclusion([23,24,25, 29,30, 31,32,33,34,35,39,40], true, this.layerPlataforma);
            this.levelAtual.setCollision([23],true,this.layerArmadilha);        
            this.levelAtual.setCollision([52,53,62,63],true,this.layerSaida);
        }        
    }
    
//Player
    this.player = this.game.add.sprite(160, 2600, 'player', 5); 
    this.player.anchor.setTo(0.5, 0.5);
    this.game.physics.enable(this.player);
    this.game.camera.follow(this.player);    
    this.player.body.gravity.y = 750;
    this.player.body.collideWorldBounds = true;
    this.player.animations.add('walk',[3, 4, 5, 6, 7],6);
    this.player.animations.add('idle',[8,9],2);
    this.player.animations.add('jump',[11,12],2);
        
    this.keys = this.game.input.keyboard.createCursorKeys();
    this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    
//Grupo Items
    this.Items = this.game.add.physicsGroup();
    this.levelAtual.createFromObjects('Items', 'item', 'tiles_items', 5 ,true, false, this.Items);
    this.Items.forEach(function(item){
//        item.anchor.setTo(0.5,0.5);
        item.body.immovable = true;
        item.animations.add('spin', [4, 5, 6, 7, 6, 5], 6, true);
        item.animations.play('spin');    
    }); 
    
//Grupo Plataformas
    this.platforms = this.game.add.physicsGroup();
//    this.levelAtual.createFromObjects('Platforms', 'platform', 'tiles_level1'               , 23, true, false, this.platforms);
    this.levelAtual.createFromObjects('Platforms', 'platform', 'tiles_platform_level1', 23, true, false, this.platforms); 
    this.platforms.forEach( function (platform) {
        platform.body.immovable = true;
    });

//Grupo Raposas Lanceiras
    this.spearfox = this.game.add.physicsGroup();
    this.levelAtual.createFromObjects('Enemies', 'spearfox', 'tiles_spearfox', 6, true, false, this.spearfox); 
    this.spearfox.forEach(function(spearfox){
        spearfox.anchor.setTo(0.5,0.5);
        spearfox.body.immovable = true;
        spearfox.body.gravity.y = 750;
        spearfox.animations.add('walk', [5, 6, 7, 8, 9], 6, true);
        spearfox.animations.add('attack',[14,13,12,11,12,13,14],6,false);
        spearfox.animations.play('walk');    
        spearfox.body.velocity.x = 100;
        spearfox.body.setSize(64,64,23,0);
        spearfox.body.bounce.x = 1;
//        var sensor = spearfox.addChild(game.make.sprite(32,0,'sensor'));
//        sensor.anchor.setTo(0.5,0.5);
//        game.physics.enable(sensor);
        //console.debug(spearfox.getChildIndex(sensor));
    });
    
//Game State
    this.totalItems = this.Items.length;
    this.totalItemsCapturados = 0;

//HUD    
    this.moldura = this.game.add.sprite(0, 0, 'bgMoldura') 
    this.moldura.fixedToCamera = true;  
    
    this.textScore = this.game.add.text(280, 20, this.totalItems - this.totalItemsCapturados, {font: "bold 32px Arial", fill: "#fff", boundsAlignH: "right"});
    this.textScore.anchor.x = 0.5; 
    this.textScore.fixedToCamera = true;  
   
    //menu
    this.menu = this.game.add.sprite(10, 10, 'menu')
    this.menu.scale.x = 1.1
    this.menu.scale.y = 1.1
    this.menu.inputEnabled = true;
    this.menu.events.onInputDown.add(gotoMenu, this);
    this.menu.fixedToCamera = true;  

    //som
    this.sound = this.game.add.sprite(785, 10, game.global.sound_sprite)
    this.sound.scale.x = 1.1
    this.sound.scale.y = 1.1
    this.sound.inputEnabled = true;
    this.sound.events.onInputDown.add(setarSound, this);        
    this.sound.fixedToCamera = true;  

    //pausar
    this.pause = this.game.add.sprite(735, 10, 'pause')
    this.pause.scale.x = 1.1
    this.pause.scale.y = 1.1
    this.pause.inputEnabled = true;
    this.pause.events.onInputDown.add(setarPause, this);           
    this.pause.fixedToCamera = true;  

    //life
//    this.life = this.game.add.sprite(80, 5, 'life', 0);
//    this.life.fixedToCamera = true;  
//    this.life.scale.x = 0.6
//    this.life.scale.y = 0.6
};

GameState.prototype.update = function () {
    this.spearfox.forEach(function(spearfox){
        if (spearfox.body.velocity.x != 0){
            spearfox.scale.x = 1 * Math.sign(spearfox.body.velocity.x);
        }
    });    
    
    this.game.physics.arcade.collide(this.player, this.layerPlataforma);
    this.game.physics.arcade.collide(this.player, this.platforms, platformFall, null, this);    
    this.game.physics.arcade.overlap(this.player, this.Items, coletarItem, null, this);
    this.game.physics.arcade.collide(this.player, this.layerArmadilha, colisaoMortal, null, this);
    this.game.physics.arcade.collide(this.player, this.layerSaida, proximoNivel, null, this);
    this.game.physics.arcade.collide(this.spearfox, this.layerPlataforma);
    this.game.physics.arcade.collide(this.player, this.spearfox, colisaoInimigo, null, this);    
    
    if(this.keys.left.isDown){
        this.player.body.velocity.x = -150;
        if(this.player.scale.x == 1) this.player.scale.x = -1;
        this.player.animations.play('walk');
    }
    else if(this.keys.right.isDown){
        this.player.body.velocity.x = 150;
        if(this.player.scale.x == -1) this.player.scale.x = 1;
        this.player.animations.play('walk');
    }
    else {
        this.player.body.velocity.x = 0;
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
