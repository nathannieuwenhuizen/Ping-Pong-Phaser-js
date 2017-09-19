class SimpleGame {

    ball_velocity:number = 100;
    game: Phaser.Game;
    ball:Ball;
    paddle1:Paddle;
    paddle2:Paddle;
    score1:number = 0;
    score2:number = 0;
    score1_text;
    score2_text;
    constructor() {
        this.game = new Phaser.Game(1000, 600, Phaser.AUTO, '', {
            preload: this.preload,
            create: this.create,
            update: this.update,
            input_paddle: this.input_paddle,
            redirect_ball: this.redirect_ball,
            collission_detection: this.collission_detection,
            input_AI:this.input_AI
        });
        this.ball;


    }

    preload() {
        this.game.load.image('ball', 'assets/ball.png');
        this.game.load.image('paddle', 'assets/paddle.png');
        this.game.load.bitmapFont('font','assets/font.png','assets/font.xml')
        this.game.load.audio('biep', ['assets/biep.wav']);
        this.game.load.audio('biep2', ['assets/biep2.wav']);
    }

    create() {
        this.paddle1 = new Paddle(16, this.game.world.centerY, this);
        this.paddle2 = new Paddle(this.game.world.width - 16, this.game.world.centerY, this);
        this.ball = new Ball( this.game.world.centerX, this.game.world.centerY, this)
        this.game.input.onDown.add(this.ball.launch, this.ball);
        this.score1 = this.score2 = 0;
        this.score1_text = this.game.add.bitmapText(this.game.world.width/2 -128,60,'font','0',64);
        this.score2_text = this.game.add.bitmapText(this.game.world.width/2+128,60,'font','0',64);
    }
    update() {
        this.score1_text.text = this.score1;
        this.score2_text.text = this.score2;
        this.input_paddle(this.paddle1, this.game.input.y);
        this.collission_detection();
        this.input_AI();
    }
    //collision of the ball with the paddles and ball with the two edges are handled here.
    collission_detection(){
        this.game.physics.arcade.collide(this.paddle1.paddle,this.ball.ball,
            (function(scope){
                return function(){
                    //scope.game.sound.play('biep2');
                    scope.redirect_ball(scope.paddle1,scope.ball);
                };
            })(this));
        this.game.physics.arcade.collide(this.paddle2.paddle,this.ball.ball,
            (function(scope){
                return function(){
                    //scope.game.sound.play('biep');
                    scope.redirect_ball(scope.paddle2,scope.ball);
                };
            })(this));
        if(this.ball.ball.body.blocked.left){
            this.score2++;
            this.ball.reset(this.game);
            this.paddle2.paddle.y = this.game.world.height/2;
        }
        else if (this.ball.ball.body.blocked.right){
            this.score1++;
            this.ball.reset(this.game);
            this.paddle2.paddle.y = this.game.world.height/2;
        }
    }
    //inputs the user has on the paddle
    input_paddle(obj:Paddle, y:number) {
        let paddle = obj.paddle;
        paddle.y = y;
        if (paddle.y < paddle.height / 2) {
            paddle.y = paddle.height / 2;
        } else if (paddle.y > this.game.world.height - paddle.height / 2) {
            paddle.y = this.game.world.height - paddle.height / 2
        }
    }
    input_AI(){

        //console.log(this.paddle2.paddle.body.velocity.y);
        //this.paddle2.paddle.body.velocity.x = -50;
        if(this.ball.ball.y > this.paddle2.paddle.y+ this.paddle2.paddle.height/3){
            this.paddle2.paddle.body.velocity.y = this.ball.ball.body.velocity.y;
        }
        else if (this.ball.ball.y < this.paddle2.paddle.y- this.paddle2.paddle.height/3){
            this.paddle2.paddle.body.velocity.y = this.ball.ball.body.velocity.y;
        }
        else
        {
            //this.paddle2.paddle.body.velocity.y = 0;
        }
    }
    //gives the ball an angle of direction based on where the ball is hitted
    redirect_ball(pad:Paddle,b:Ball){
        let ball = b.ball;
        let paddle = pad.paddle;
        var dx = -paddle.x + ball.x;
        var dy = (-paddle.y + ball.y)/2;
        var root = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));
        dx /= root;
        dy /= root;
        ball.body.velocity.setTo(
            dx*b.ball_velocity,
            dy*b.ball_velocity
        )
    }

}

window.onload = () => {
    var game = new SimpleGame();
};


class Ball{
    ball_velocity:number = 1000
    ball_launched:boolean = false;
    ball;
    constructor(x:number, y:number, game:SimpleGame){
        var ball= game.game.add.sprite(x,y, 'ball');
        ball.anchor.setTo(0.5, 0.5);
        game.game.physics.arcade.enable(ball); //creates body for object
        ball.body.collideWorldBounds = true;
        ball.body.bounce.setTo(1, 1);
        this.ball = ball;
    }

    launch(){
        if(!this.ball_launched)
        {

            this.ball.body.velocity.x = this.ball_velocity;
            //this.ball.body.velocity.y = -this.ball_velocity;
            this.ball_launched = true;
        }
    }
    reset(game:Phaser.game) {
        this.ball.body.velocity.setTo(0,0);
        this.ball.x = game.world.centerX;
        this.ball.y = game.world.centerY;
        this.ball_launched = false;
    }
}
class Paddle{
    paddle;
    constructor(x:number, y:number, game:SimpleGame){
        var paddle = game.game.add.sprite(x, y, 'paddle');
        paddle.anchor.setTo(0.5, 0.5);
        game.game.physics.arcade.enable(paddle); //creates body for object
        paddle.body.collideWorldBounds = true;
        paddle.body.immovable = true;
        paddle.scale.setTo(.35,.35);
        this.paddle = paddle;
    }
}

