/// <reference path="phaser/phaser.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var game = PIXI.game;
var Point = Phaser.Point;
var mainState = (function (_super) {
    __extends(mainState, _super);
    function mainState() {
        _super.apply(this, arguments);
        this.MAX_SPEED = 500; // pixels/second
        this.ACCELERATION = 800; // pixels/second/second
    }
    mainState.prototype.preload = function () {
        _super.prototype.preload.call(this);
        //Cargamos los assets
        this.load.image('barra', 'assets/barraArkanoid_low.png');
        this.load.image('fondo', 'assets/fondoArkanoid_low.png');
        this.load.image('fondo', 'assets/fondoArkanoid_low.png');
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
        this.crearBarra();
        this.crearLadrillos();
        this.cursor = this.input.keyboard.createCursorKeys();
    };
    mainState.prototype.crearBarra = function () {
        this.barra = this.add.sprite(this.world.centerX, 550, 'barra');
        this.barra.anchor.setTo(0.5, 0.5);
        //Fisicas de la barra
        this.physics.enable(this.barra, Phaser.Physics.ARCADE);
        this.barra.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED); // x, y
        //Para que colisione con el resto del mundo
        this.barra.body.collideWorldBounds = true;
        this.barra.body.bounce.set(0.0);
    };
    mainState.prototype.crearLadrillos = function () {
        // Anadimos el recolectable a un grupo
        this.grupoLadrillos = this.add.group();
        this.grupoLadrillos.enableBody = true;
        // Posiciones en las que generaremos los ladrillos
        var ladrillosPorLinea = 15;
        var numeroFilas = 8;
        // Tamanyo de los ladrillos
        var anchuraLadrillo = 57;
        var alturaLadrillo = 29;
        // Array que contiene las coordenadas de los ladrillos
        var positions = [];
        // For para llenar array de coordeandas
        for (var posFila = 0; posFila < numeroFilas; posFila++) {
            for (var posColumna = 0; posColumna < ladrillosPorLinea; posColumna++) {
                positions.push(new Point(anchuraLadrillo * posColumna, posFila * (alturaLadrillo + 1)));
            }
        }
        // Colocamos los sprites en sus coordenadas a traves de un for
        for (var i = 0; i < positions.length; i++) {
            var position = positions[i];
            // instanciamos el Sprite
            var ladrillo = new Ladrillo(this.game, position.x, position.y, 'ladrillo', 0);
            // mostramos el Sprite por pantalla
            this.add.existing(ladrillo);
            this.grupoLadrillos.add(ladrillo);
        }
    };
    mainState.prototype.update = function () {
        _super.prototype.update.call(this);
        this.game.debug.bodyInfo(this.barra, 0, 0);
        if (this.cursor.left.isDown) {
            this.barra.body.acceleration.x = -this.ACCELERATION;
        }
        else if (this.cursor.right.isDown) {
            this.barra.body.acceleration.x = this.ACCELERATION;
        }
        else {
            this.barra.body.acceleration.x = 0;
            this.barra.body.acceleration.y = 0;
            this.barra.body.velocity.x = 0;
            this.barra.body.velocity.y = 0;
        }
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