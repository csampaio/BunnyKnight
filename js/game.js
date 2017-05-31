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
    this.level1.addTilesetImage('tiles','mapTiles');
    this.wallsLayerBg = this.level1.createLayer('Bg');
    this.wallsLayer = this.level1.createLayer('Walls');
    this.lavaLayer = this.level1.createLayer('Lava');
    this.wallsLayer.resizeWorld();

    //som    
    this.jumpSound = this.game.add.audio('jumpSound');
    this.pickupSound = this.game.add.audio('pickupSound');
    this.hurtSound = this.game.add.audio('hurtSound');
    this.enemyDeathSound= this.game.add.audio('enemyDeathSound');
    
    this.level1.setCollisionByExclusion([9,10,11,12,17,18,19,20],true,this.wallsLayer);
    this.level1.setCollision([5,6,13],true,this.lavaLayer);
    
    // Player
    // Inicializando jogador  
    this.player = this.game.add.sprite(160, 64, 'player', 5);
    this.player.anchor.setTo(0.5, 0.5);
    this.game.physics.enable(this.player);
    this.player.body.gravity.y = 750;
    this.player.body.collideWorldBounds = true;
    
    this.game.camera.follow(this.player);
    
    this.player.animations.add('walk',[0, 1, 2, 1],6);
    this.player.animations.add('idle',[5, 5, 5, 5, 5, 5, 6, 5, 6, 5],6);
    this.player.animations.add('jump',[4],6);
        
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
        
//    //Grupo de raposas lanceiras
    this.spearfox= this.game.add.physicsGroup();
    
//    //Criando raposas lanceiras do tiled
    this.level1.createFromObjects('Enemies','spearfox','spearfoxSS', 6, true, false, this.spearfox); 
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
        var sensor = spearfox.addChild(game.make.sprite(32,0,'sensor'));
        sensor.anchor.setTo(0.5,0.5);
        game.physics.enable(sensor);
        //console.debug(spearfox.getChildIndex(sensor));
    });
    
    
    //Game State
    this.totalDiamonds = this.diamonds.length;
    this.collectedDiamonds = 0;
    game.global.score = 0

    
//    this.scoreText = this.game.add.text(350,50, "Score: 0", {font: "25px Ariak",fill:'#ffffff'});
//    this.scoreText.fixedToCamera = true;        
    
    this.textScore = this.game.add.text(180, 10, game.global.score, {font: "bold 32px Arial", fill: "#fff", boundsAlignH: "right"});
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
};
GameState.prototype.update = function () {
	
    this.spearfox.forEach(function(spearfox){
        if (spearfox.body.velocity.x != 0){
            spearfox.scale.x = 1 * Math.sign(spearfox.body.velocity.x);
        }
    });
    //this.spearfox.forEach(function teste(spearfox));
    //teste(this.player);
    //console.debug(this.spearfox.forEach());    
    //console.debug(this.game.physics.arcade.distanceBetween(this.spearfox,this.player));
    this.game.physics.arcade.collide(this.player, this.wallsLayer);
    this.game.physics.arcade.overlap(this.player, this.diamonds, coletarItem, null, this);
    this.game.physics.arcade.collide(this.player, this.lavaLayer, colisaoMortal, null, this);

    this.game.physics.arcade.collide(this.spearfox, this.wallsLayer);
    this.game.physics.arcade.collide(this.player, this.spearfox, colisaoInimigo, null, this);
    this.game.physics.arcade.collide(this.player, this.spearfox.chilren, onReach, null, this);
    
    
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
        this.player.body.velocity.y = -400;
        this.jumpSound.play();
    }
    
    if (!this.player.body.touching.down && !this.player.body.onFloor()){
                this.player.animations.play('jump');
    }    
};
function teste(player){
	console.debug(player.x);
}
