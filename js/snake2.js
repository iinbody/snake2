//started 3/25/2017 snake 2 player
$(document).ready(function(){
    //Canvas shortcuts
    var canvas = $("#canvas")[0];
    var ctx = canvas.getContext("2d");
    var w = $("#canvas").width();
    var h = $("#canvas").height();

    var cw = 10;
    var foods = [];
    var score;
    var snakes = [];

    var startGame = function() {
        snakes[0] = new newSnake(10,1,5,"right");
        createFood();createFood();
        if(typeof game_loop != "undefined") {
            clearInterval(game_loop);
        }
        game_loop = setInterval(doGame, 60);
    }

    var doGame = function(){
        paint();
        moveSnakes();

    }

    var newSnake = function(x,y,length,direction){
        this.x = x;
        this.y = y;
        this.length = length;
        this.direction = direction;
        this.body = [{x:x, y:y}];
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
        //painting canvas on every frame
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = "black";
        ctx.strokeRect(0, 0, w, h);

        //game over conditions
        /*if(nx === -1 || nx == w/cw || ny === -1 || ny === h/cw || checkCollision(nx,ny,snakeArray)) {
            startGame();
            console.log("collision");
            return; // why is return necessary?
        }*/

        //paint the snakes
        for(var i=0; i<snakes.length; i++){
            for(var j=0; j<snakes[i].body.length; j++){
                var c = snakes[i].body[j];
                if (j === 0){
                    paintCell(c.x,c.y,"red");
                }else{
                    paintCell(c.x, c.y);
                }
            }
        }

        for(var i=0; i<foods.length; i++){
            paintCell(foods[i].x,foods[i].y,"green");
        }
        var scoreText = "Score: "+score;
        ctx.fillStyle = "blue";
        ctx.fillText(scoreText, 5, h-5);
    }

    var printSnake = function(num){
        num = num || 0;
        for(var i=0; i<snakes[num].body.length; i++){
            console.log(i, snakes[num].body[i].x, snakes[num].body[i].y);
        }
    }

    var moveSnakes = function() {
        //console.log("startingmove:");printSnake();
        if(map[87] && snakes[0].direction !== "down"){
            snakes[0].direction = "up";
        }else if(map[83] && snakes[0].direction !== "up"){
            snakes[0].direction = "down";
        }else if(map[65] && snakes[0].direction !== "right"){
            snakes[0].direction = "left";
        }else if(map[68] && snakes[0].direction !== "left"){
            snakes[0].direction = "right";
        }
        /*if(map[38]){
            snakes[1].direction = "up";
        }else if(map[40]){
            snakes[1].direction = "down";
        }else if(map[37]){
            snakes[1].direction = "left";
        }else if(map[39]){
            snakes[1].direction = "right";
        }*/

        for (var i=0; i<snakes.length; i++){
            var newHead = snakes[i].body.pop();
            //console.log("removedtail: ");printSnake();
            //console.log(newHead);
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
            //console.log("movednewhead: ");printSnake();
            //console.log(newHead);
            snakes[i].body.unshift(newHead);
            //console.log("justmoved: ");printSnake();
            for (var j=0; j<foods.length; j++){
                //console.log("eat?");
                if (foods[j].x === snakes[i].body[0].x && foods[j].y === snakes[i].body[0].y){
                    //snakes[i].body.push(snakes[i].body[snakes[i].body.length]); //duplicate the tail of the snake
                    //console.log("beforeeat: ");printSnake();
                    snakes[i].eatFood();
                    foods.splice(j,1);
                    createFood();
                    console.log(foods);
                    console.log("eat=======================================================");
                    console.log("aftereat: ");printSnake();
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

    var checkCollision = function(x, y, array) {
        for(var i = 0; i<array.length-1; i++) {
            if(array[i].x === x && array[i].y === y) {
                return true;
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

    startGame();
})

