window.addEventListener("load", function () {
    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
        preload: preload,
        create: create,
        update: update
    });

    var paddle1, paddle2;
    var ball;
    var ball_velocity;
    var ball_launched;

    //text object
    var score1_text;
    var score2_text;
    var score1,score2 =0;
    function preload() {
        game.load.image('paddle', 'assets/paddle.png');
        game.load.image('ball', 'assets/ball.png');

        game.load.bitmapFont('font','assets/font.png','assets/font.xml')
        game.load.audio('biep', ['assets/biep.wav']);
        game.load.audio('biep2', ['assets/biep2.wav']);
    };

    function create() {
        ball_launched = false;
        ball_velocity = 500;
        paddle1 = create_paddle(0, game.world.centerY);
        paddle2 = create_paddle(game.world.width - 8, game.world.centerY);

        ball = create_ball(game.world.centerX, game.world.centerY);

        game.input.onDown.add(launch_ball, this);

        //text object (heavier that bitmap

        // score1_text = game.add.text(game.world.width-128,128,'0', {
        //     font: "64px Gabriella",
        //     fill:"#fff",
        //     align: "center"
        // });
        // score2_text = game.add.text(128,128,'0', {
        //     font: "64px Gabriella",
        //     fill:"#fff",
        //     align: "center"
        //    });

        //bitmap text
        score1_text = game.add.bitmapText(128,128,'font','0',64);
        score2_text = game.add.bitmapText(game.world.width-128,128,'font','0',64);
        score1 =0;
        score2 =0;
    };

    function update() {

        score1_text.text = score1;
        score2_text.text = score2;

        input_paddle(paddle1, game.input.y);
        game.physics.arcade.collide(paddle1,ball, function (){
            game.sound.play('biep');
            redirect_ball(paddle1,ball);
        } );
        game.physics.arcade.collide(paddle2,ball, function (){
            game.sound.play('biep2');
            redirect_ball(paddle2,ball);
        } );

        if(ball.body.blocked.left){
            score2++;
            reset_ball();
            console.log('player 2 scores!');
        }
        else if (ball.body.blocked.right){
            score1++;
            reset_ball();
            console.log('player 1 scores!');
        }

        if(ball.y > paddle2.y+ paddle2.height/3){
            paddle2.body.velocity.y = 300;
        }
        else if (ball.y < paddle2.y- paddle2.height/3){
            paddle2.body.velocity.y = -300;
        }
        else
        {
            paddle2.body.velocity.y = 0;
        }
    };
    function redirect_ball(paddle,ball){
        var dx = -paddle.x + ball.x;
        var dy = (-paddle.y + ball.y)/2;
        var root = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));
        dx /= root;
        dy /= root;
        ball.body.velocity.x = dx*ball_velocity;
        ball.body.velocity.y = dy*ball_velocity;

    }
    function create_paddle(x, y) {
        var paddle = game.add.sprite(x, y, 'paddle');
        paddle.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(paddle); //creates body for object
        paddle.body.collideWorldBounds = true;
        paddle.body.immovable = true;
        paddle.scale.setTo(.5,.5);
        return paddle;
    }
    function launch_ball(){
        if(!ball_launched){
            ball.body.velocity.x = -ball_velocity;
            ball.body.velocity.y = 0;
            ball_launched = true;
        }
    }
    function reset_ball() {
        ball.body.velocity.setTo(0,0);
        ball.x = game.world.centerX;
        ball.y = game.world.centerY;
        ball_launched = false;
    }
    function create_ball(x, y) {
        var ball = game.add.sprite(x, y, 'ball');
        ball.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(ball); //creates body for object
        ball.body.collideWorldBounds = true;
        ball.body.bounce.setTo(1, 1);
        return ball;
    }

    function input_paddle(paddle, y) {
        paddle.y = y;
        if (paddle.y < paddle.height / 2) {
            paddle.y = paddle.height / 2;
        } else if (paddle.y > game.world.height - paddle.height / 2) {
            paddle.y = game.world.height - paddle.height / 2
        }
    }

}, false);