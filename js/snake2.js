

$(document).ready(function(){
    //Canvas shortcuts
    var canvas = $("#canvas")[0];
    var ctx = canvas.getContext("2d");
    var w = $("#canvas").width();
    var h = $("#canvas").height();

    //cell width and variables
    var cw = 10;
    var d;
    var food;
    var score;

    //Create the snake
    var snakeArray;  //snake is going to be an array of cells

    var startGame = function() {
        d = "right"; //starting default direction
        createSnake();
        createFood();
        score = 0;

        //This is a timer 60ms to move the snake
        if(typeof game_loop != "undefined") {
            clearInterval(game_loop); //modified syntax, tutorial is weird
        }
        game_loop = setInterval(paint, 60);
    }


    var createSnake = function() {
        var length = 5;
        snakeArray = [];
        for(var i = length-1; i>=0; i--) {
            snakeArray.push({x:i, y:0}); //need to understand syntax - new Object()
        }
    }

    var createFood = function() {
        food = {
            x: Math.round(Math.random()*(w-cw)/cw),
            y: Math.round(Math.random()*(h-cw)/cw)
        }
    }

    var paint = function() {
        //painting canvas on every frame
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = "black";
        ctx.strokeRect(0, 0, w, h);

        //this is for movement of snake
        //current position of head
        var nx = snakeArray[0].x;
        var ny = snakeArray[0].y;
        //increment based on direction
        if(d === "right") {
            nx++;
        }else if(d === "left") {
            nx--;
        }else if(d === "up") {
            ny--;
        }else if(d === "down") {
            ny++;
        }

        //game over conditions
        if(nx === -1 || nx == w/cw || ny === -1 || ny === h/cw || checkCollision(nx,ny,snakeArray)) {
            startGame();
            console.log("collision");
            return; // why is return necessary?
        }

        //snake eating food code
        //if head = food then eat
        //var tail;
        if(nx === food.x && ny === food.y) {
            var tail = {x: nx,y: ny};
            score++;
            createFood();
        } else {
            var tail = snakeArray.pop(); //removes last cell of array
            tail.x = nx;
            tail.y = ny;
        }

        snakeArray.unshift(tail); //adds tail to beginning of array

        //paint the snake
        for(var i=0; i<snakeArray.length; i++){
            var c = snakeArray[i];
            if (i === 0){
                paintCell(c.x,c.y,"red")
            }else{
                paintCell(c.x, c.y);
            }
        }

        paintCell(food.x,food.y,"green");
        var scoreText = "Score: "+score;
        ctx.fillStyle = "blue";
        ctx.fillText(scoreText, 5, h-5);
    }

    var paintCell = function(x,y,color) {
        color = color || "blue"
        ctx.fillStyle = color;
        ctx.fillRect(x*cw, y*cw, cw, cw);
        ctx.strokeStyle = "white";
        ctx.strokeRect(x*cw, y*cw, cw, cw);
    }

    var checkCollision = function(x, y, array) {
        for(var i = 0; i<array.length-1; i++) {
            if(array[i].x === x && array[i].y === y) {
                return true;
            }
        }
    }

    //controls
    $(document).keydown(function(e){
        var key = e.which; console.log(key);
        //cant go back into self
        if(key === 37 && d !== "right") {
            d = "left";
        }else if(key === 38 && d !== "down") {
            d = "up";
        }else if(key === 39 && d !== "left") {
            d = "right";
        }else if(key === 40 && d !== "up") {
            d = "down";
        }
    })
    startGame();
})

