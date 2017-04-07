//started 3/25/2017 snake 2 player
$(document).ready(function(){
    //Canvas shortcuts
    var canvas = $("#canvas")[0];
    var ctx = canvas.getContext("2d");
    var w = $("#canvas").width();
    var scoreArea = 40;
    var h = $("#canvas").height() - scoreArea;
    var cw = 10;
    var foods = [];
    var score = [0,0];
    var snakes = [];
    var startButton = document.getElementById("startButton");
    startButton.addEventListener("click", function(){startGame()});


    var startGame = function() {
        startButton.style.display = 'none';
        restartGame();

        if(typeof game_loop != "undefined") {
            clearInterval(game_loop);
        }
        game_loop = setInterval(doGame, 60);
    }

    var restartGame = function(){
        console.log("restarting");
        snakes = [];
        foods = [];
        createFood();createFood();
        snakes[0] = new newSnake(10,1,5,"right","blue","red");
        snakes[1] = new newSnake(34,43,5,"left","purple","teal");
    }

    var doGame = function(){
        paint();
        moveSnakes();
        paintScores();

    }

    var newSnake = function(x,y,length,direction,color1,color2){
        this.x = x;
        this.y = y;
        this.length = length;
        this.direction = direction;
        this.body = [{x:x, y:y}];
        this.color1 = color1;
        this.color2 = color2;
        if (this.direction === "right") {
            for (var i=1; i<this.length; i++){
                this.body.push({x:x-i,y:y});
            }
        }else if(this.direction === "left"){
            for (var i=1; i<this.length; i++){
                this.body.push({x:x+i,y:y});
            }
        }
        this.eatFood = function(){
            //this.body.push(this.body[this.length-1]);
            this.body[this.length] = {x:this.body[this.length-1].x, y:this.body[this.length-1].y};
            this.length++;
        }
    }

    var createFood = function() {
        foods.push({
            x: Math.round(Math.random()*(w-cw)/cw),
            y: Math.round(Math.random()*(h-cw)/cw)
        })
    }

    var paint = function() {
        //paint canvas
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = "black";
        ctx.strokeRect(0, 0, w, h);
        //paint the snakes
        for(var i=0; i<snakes.length; i++){
            for(var j=0; j<snakes[i].body.length; j++){
                var c = snakes[i].body[j];
                if (j === 0){
                    paintCell(c.x, c.y, snakes[i].color2);
                }else{
                    paintCell(c.x, c.y, snakes[i].color1);
                }
            }
        }
        //paint the food
        for(var i=0; i<foods.length; i++){
            paintCell(foods[i].x,foods[i].y,"green");
        }
    }

    var paintScores = function(){
        ctx.fillStyle = "grey";
        ctx.fillRect(0, h, w, scoreArea);
        ctx.fillStyle = "blue";
        ctx.font="30px sans-serif";
        ctx.fillText("Player 1: "+score[0], 10, h+scoreArea-10);
        ctx.fillText("Player 2: "+score[1], w-150, h+scoreArea-10);
    }

    var printSnake = function(num){
        num = num || 0;
        for(var i=0; i<snakes[num].body.length; i++){
            console.log(i, snakes[num].body[i].x, snakes[num].body[i].y);
        }
    }

    var moveSnakes = function() {

        //direction of snakes
        if(map[87] && snakes[0].direction !== "down"){
            snakes[0].direction = "up";
        }else if(map[83] && snakes[0].direction !== "up"){
            snakes[0].direction = "down";
        }else if(map[65] && snakes[0].direction !== "right"){
            snakes[0].direction = "left";
        }else if(map[68] && snakes[0].direction !== "left"){
            snakes[0].direction = "right";
        }
        if(map[38] && snakes[1].direction !== "down"){
            snakes[1].direction = "up";
        }else if(map[40] && snakes[1].direction !== "up"){
            snakes[1].direction = "down";
        }else if(map[37] && snakes[1].direction !== "right"){
            snakes[1].direction = "left";
        }else if(map[39] && snakes[1].direction !== "left"){
            snakes[1].direction = "right";
        }

        //pop off tail and put it in incremented head position
        for (var i=0; i<snakes.length; i++){
            var tail = snakes[i].body.pop();
            var newHead = {x:tail.x, y:tail.y};
            // console.log("Snake "+i+": ",newHead.x,newHead.y);
            if (snakes[i].direction === "right"){
                newHead.x = snakes[i].body[0].x + 1;
                newHead.y = snakes[i].body[0].y;
            }else if (snakes[i].direction === "left"){
                newHead.x = snakes[i].body[0].x - 1;
                newHead.y = snakes[i].body[0].y;
            }else if (snakes[i].direction === "up"){
                newHead.x = snakes[i].body[0].x;
                newHead.y = snakes[i].body[0].y - 1;
            }else{
                newHead.x = snakes[i].body[0].x;
                newHead.y = snakes[i].body[0].y + 1;
            }

            newHead.x = newHead.x.mod(w/cw);
            newHead.y = newHead.y.mod(h/cw);
            /*//turn wrap off
            if (newHead.x === -1 || newHead.x === w/cw  || newHead.y === -1 || newHead.y === h/cw){
                //newHead = {x:10, y:2};
                restartGame();
                return;
            }*/
            snakes[i].body.unshift(newHead);
            //check for food collision
            for (var j=0; j<foods.length; j++){
                if (foods[j].x === snakes[i].body[0].x && foods[j].y === snakes[i].body[0].y){
                    //snakes[i].body.push(snakes[i].body[snakes[i].body.length]); //duplicate the tail of the snake
                    snakes[i].eatFood();
                    foods.splice(j,1);
                    createFood();
                }
            }

            //check for collision with other snake
            for(var j=0; j<snakes.length; j++){
                if(checkCollision(j)){
                    console.log("collide");
                    restartGame();
                }
            }
        }
    }

    var paintCell = function(x,y,color) {
        color = color || "blue"
        ctx.fillStyle = color;
        ctx.fillRect(x*cw, y*cw, cw, cw);
        ctx.strokeStyle = "white";
        ctx.strokeRect(x*cw, y*cw, cw, cw);
    }

    //check if snake collides
    var checkCollision = function(numSnake) {
        for(var i = 0; i<snakes.length; i++){
            for(var j = 0; j<snakes[i].body.length; j++) {
                if(snakes[numSnake].body[0].x === snakes[i].body[j].x && snakes[numSnake].body[0].y === snakes[i].body[j].y  && snakes[numSnake].body[0] !== snakes[i].body[j] ) {
                    return true;
                }
            }
        }
    }

    //improved controls
    var map = [];
    onkeydown = onkeyup = function(e){
        e = e || event; // to deal with IE
        console.log(e.keyCode);
        map[e.keyCode] = e.type === 'keydown'; //don't understand
    }

    Number.prototype.mod = function(n) {
        return ((this%n)+n)%n;
    }

    //startGame();
})