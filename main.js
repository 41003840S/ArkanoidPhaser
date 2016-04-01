var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="phaser/phaser.d.ts"/>
var game = PIXI.game;
var Point = Phaser.Point;
var mainState = (function (_super) {
    __extends(mainState, _super);
    function mainState() {
        _super.apply(this, arguments);
        this.MAX_SPEED = 2000; // pixels/second
        this.puntuacion = 0;
        this.vidas = 3;
    }
    mainState.prototype.preload = function () {
        _super.prototype.preload.call(this);
        //Cargamos los assets
        this.load.image('barra', 'assets/barraArkanoid_low.png');
        this.load.image('fondo', 'assets/fondoArkanoid_low.png');
        this.load.image('bola', 'assets/ballGrey.png');
        this.load.image('ladrillo_amarillo', 'assets/ladrillos/amarillo-manu.png');
        this.load.image('ladrillo_azul', 'assets/ladrillos/azul-manu.png');
        this.load.image('ladrillo_celeste', 'assets/ladrillos/celeste-manu.png');
        this.load.image('ladrillo_lila', 'assets/ladrillos/lila-manu.png');
        this.load.image('ladrillo_naranja', 'assets/ladrillos/naranja-manu.png');
        this.load.image('ladrillo_rojo', 'assets/ladrillos/rojo-manu.png');
        this.load.image('ladrillo_rosa', 'assets/ladrillos/rosa-manu.png');
        this.load.image('ladrillo_verde', 'assets/ladrillos/verde-manu.png');
        this.load.image('ladrillo_violeta', 'assets/ladrillos/violeta-manu.png');
        //Cargamos las fisicas que se aplicaran
        this.physics.startSystem(Phaser.Physics.ARCADE);
    };
    mainState.prototype.create = function () {
        _super.prototype.create.call(this);
        this.fondo = this.add.sprite(this.world.centerX, this.world.centerY, 'fondo');
        this.physics.arcade.checkCollision.down = false;
        this.crearTextos();
        this.crearBarra();
        this.crearLadrillos();
        this.crearBola();
        this.cursor = this.input.keyboard.createCursorKeys();
    };
    mainState.prototype.crearTextos = function () {
        var width = this.scale.bounds.width;
        var height = this.scale.bounds.height;
        this.textoPuntuacion = this.add.text(50, 560, 'Score: ' + this.puntuacion, { font: "15px Arial", fill: "#ffffff" });
        this.textoPuntuacion.fixedToCamera = true;
        this.textoVidas = this.add.text(width - 500, 560, 'Lives: ' + this.vidas, { font: "30px Arial", fill: "#ffffff" });
        this.textoVidas.anchor.setTo(1, 0);
        this.textoVidas.fixedToCamera = true;
        /* this.stateText = this.add.text(width / 2, height / 2, '', {font: '84px Arial', fill: '#fff'});
         this.stateText.anchor.setTo(0.5, 0.5);
         this.stateText.visible = false;
         this.stateText.fixedToCamera = true;*/
    };
    ;
    mainState.prototype.crearBarra = function () {
        //Cargar el Sprite y poscionarlo
        this.barra = this.add.sprite(this.world.centerX, 550, 'barra');
        this.barra.anchor.setTo(0.5, 0.5);
        //Fisicas de la barra
        this.physics.enable(this.barra, Phaser.Physics.ARCADE);
        this.barra.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED); // x, y
        //Para que colisione con el resto del mundo
        this.barra.body.collideWorldBounds = true;
        this.barra.body.bounce.set(0.0);
        this.barra.body.immovable = true;
    };
    mainState.prototype.crearLadrillos = function () {
        // Anadimos el recolectable a un grupo
        this.grupoLadrillos = this.add.group();
        this.grupoLadrillos.enableBody = true;
        // Posiciones en las que generaremos los ladrillos
        var ladrillosPorLinea = 12;
        var numeroFilas = 8;
        // Tamanyo de los ladrillos
        var anchuraLadrillo = 57;
        var alturaLadrillo = 29;
        var colores = [
            'ladrillo_rojo',
            'ladrillo_naranja',
            'ladrillo_amarillo',
            'ladrillo_verde',
            'ladrillo_azul',
            'ladrillo_violeta',
            'ladrillo_lila',
            'ladrillo_rosa'
        ];
        for (var posFila = 0; posFila < numeroFilas; posFila++) {
            for (var posColumna = 0; posColumna < ladrillosPorLinea; posColumna++) {
                var x = (anchuraLadrillo + 1) * posColumna;
                var y = posFila * (alturaLadrillo + 1);
                var ladrillo = new Ladrillo(this.game, x + 190, y + 50, colores[posFila % colores.length], 0);
                this.add.existing(ladrillo);
                this.grupoLadrillos.add(ladrillo);
            }
        }
    };
    mainState.prototype.crearBola = function () {
        this.bola = this.add.sprite(this.world.centerX, 500, 'bola'); //527
        this.bola.anchor.setTo(0.5, 0.5);
        this.physics.enable(this.bola, Phaser.Physics.ARCADE);
        this.bola.body.collideWorldBounds = true;
        this.bola.body.bounce.set(1);
        this.bola.body.velocity.x = 300;
        this.bola.body.velocity.y = 300;
        this.bola.body.maxVelocity.setTo(500, 500);
    };
    mainState.prototype.update = function () {
        _super.prototype.update.call(this);
        //this.game.debug.bodyInfo(this.barra, 0, 0);
        this.bola.events.onOutOfBounds.add(this.bolaCaida, this);
        this.colisiones();
        this.updateBarra();
    };
    mainState.prototype.bolaCaida = function () {
        if (this.vidas > 0) {
            this.vidas -= 1;
        }
        else {
            this.game.state.restart();
        }
    };
    mainState.prototype.updateBarra = function () {
        if (this.cursor.left.isDown) {
            this.barra.body.velocity.x = -this.MAX_SPEED;
        }
        else if (this.cursor.right.isDown) {
            this.barra.body.velocity.x = this.MAX_SPEED;
        }
        else {
            this.barra.body.velocity.x = 0;
            this.barra.body.velocity.y = 0;
        }
    };
    mainState.prototype.colisiones = function () {
        this.physics.arcade.collide(this.barra, this.bola);
        this.physics.arcade.collide(this.bola, this.grupoLadrillos, this.petarLadrillo, null);
    };
    mainState.prototype.petarLadrillo = function (bola, ladrillo) {
        ladrillo.kill();
        this.puntuacion += 1;
        //this.textoPuntuacion.setText('Score: ' + this.puntuacion);
    };
    return mainState;
})(Phaser.State);
var Ladrillo = (function (_super) {
    __extends(Ladrillo, _super);
    function Ladrillo(game, x, y, key, frame) {
        _super.call(this, game, x, y, key, frame);
        // Activamos las fisicas
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.immovable = true;
    }
    return Ladrillo;
})(Phaser.Sprite);
var SimpleGame = (function () {
    function SimpleGame() {
        this.game = new Phaser.Game(1067, 600, Phaser.AUTO, 'gameDiv');
        this.game.state.add('main', mainState);
        this.game.state.start('main');
    }
    return SimpleGame;
})();
window.onload = function () {
    var game = new SimpleGame();
};
//# sourceMappingURL=main.js.map