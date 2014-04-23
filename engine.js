LEN = 5;//Number of rows/cols in grid.
SIZE = 120;//Size of each square in grid.
BORDER = 10;
canvas = document.getElementById("game");
canvas.width = LEN*SIZE + (LEN+1)*BORDER;
canvas.height = LEN*SIZE + (LEN+1)*BORDER;
ctx = canvas.getContext("2d");
ctx.textAlign = "center";
ctx.textBaseline = "middle";

gameOver = false;

VEL = 30;

vx = 0;
vy = 0;

numWorking = 0;
newSquare = null;
squares = new Array(LEN);
timer = null;

STD_BG = "rgb(174,157,142)";

function init() {
	numWorking = 0;

	newSquare = null;

	squares = new Array(LEN);
	for(r=0; r<LEN; r++) {
	    squares[r] = new Array(LEN);
	    for(c=0; c<LEN; c++) {
	        squares[r][c] = null;
	    }
	}
	squares[2][2] = {"offsetX":0,"offsetY":0,"val":-1,"opacity":1.0,"block":true};
	squares[3][3] = makeSquare();

	timer = setInterval(updateGame, 1000/60);
}

init();
window.addEventListener('keydown', input, true);
canvas.addEventListener('click', restart, true);

function restart() {
	if(gameOver) {
		init();
	}
	gameOver = false;
}

touchStartX = touchStartY = (LEN*SIZE+(LEN+1)*BORDER)/2;

canvas.addEventListener('touchstart', touchStart, true);
canvas.addEventListener('touchend', touchEnd, true);

canvas.addEventListener('touchmove', function(e){e.preventDefault();}, true);

function touchStart() {
	touchStartX = e.changedTouches[0].pageX;
	touchStartY = e.changedTouches[0].pageY;
}

function touchEnd() {
	touchEndX = e.changedTouches[0].pageX;
	touchEndY = e.changedTouches[0].pageY;
	delta_x = touchStartX-touchEndX;
	deltay_y = touchStartY-touchEndY;
	if(delta_x >= delta_y) {
		if(delta_x > 0) {
			vx = 1;
			vy = 0;
		}
		else if(delta_x < 0) {
			vx = -1;
			vy = 0;
		}
	}
	else {
		if(delta_y > 0) {
			vx = 0;
			vy = 1;
		}
		else if(delta_y < 0) {
			vx = 0;
			vy = 1;
		}
	}
}

function makeSquare() {
    return {"offsetX":0,"offsetY":0,"val":2,"opacity":0.0,"block":false};
}

function input(e) {
    if(numWorking > 0) return;
    switch(e.keyCode) {
        case 38:
            vx = 0;
            vy = -1;
            break;
        case 40:
            vx = 0;
            vy = 1;
            break;
        case 37:
            vy = 0;
            vx = -1;
            break;
        case 39:
            vy = 0;
            vx = 1;
            break;
        default:
            return;
            break;
    }
    newSquare = makeSquare();
}

function increment(sq) {
	squares[r][c].val *= 2.0;
}

function updateGame() {
    ctx.fillStyle = STD_BG;
    ctx.fillRect(0,0,canvas.width,canvas.height);
    
    ctx.fillStyle="rgb(193,179,163)";
    for(r=0;r<LEN;r++) {
        for(c=0;c<LEN;c++) {
        	roundRect(c*SIZE+(c+1)*BORDER, r*SIZE+(r+1)*BORDER, SIZE, SIZE, 10);
        }
    }
    
    numWorking = 0;
    
    for(r=0; r<LEN; r++) {
        for(c=0; c<LEN; c++) {
            if(squares[r][c] != null) {
            	draw(r, c, squares[r][c]);
                
                if(squares[r][c].block) {
                	continue;
                }
                
                if(squares[r][c].opacity < 1.0) {
                    squares[r][c].opacity += 0.01;
                }
                if(r+vy<LEN && r+vy>=0 && c+vx<LEN && c+vx>=0 &&
                   (squares[r+vy][c+vx] == null || squares[r+vy][c+vx].val == squares[r][c].val)) {
                    
                    if(vx!=0 || vy!=0) {
                        numWorking++;
                    }
                    squares[r][c].offsetX += vx*VEL;
                    squares[r][c].offsetY += vy*VEL;
                    console.log(vx+","+vy);
                    if(Math.abs(squares[r][c].offsetX) >= SIZE) {
                        if(squares[r][c+vx] != null) {
                            increment(squares[r][c]);
                        }
                        squares[r][c].offsetX = 0;
                        squares[r][c+vx] = squares[r][c];
                        squares[r][c] = null;
                        
                        //Check if it will move again.
                        numWorking--;
                        if(r+2*vy<LEN && r+2*vy>=0 && c+2*vx<LEN && c+2*vx>=0 &&
                           (squares[r+2*vy][c+2*vx] == null || squares[r+2*vy][c+2*vx].val == squares[r+vy][c+vx].val)) {
                            numWorking++;
                        }
                    }
                    else if(Math.abs(squares[r][c].offsetY) >= SIZE){
                        if(squares[r+vy][c] != null) {
                            increment(squares[r][c]);
                        }
                        squares[r][c].offsetY = 0;
                        squares[r+vy][c] = squares[r][c];
                        squares[r][c] = null;
                        
                        //Check if it will move again.
                        numWorking--;
                        if(r+2*vy<LEN && r+2*vy>=0 && c+2*vx<LEN && c+2*vx>=0 &&
                           (squares[r+2*vy][c+2*vx] == null || squares[r+2*vy][c+2*vx].val == squares[r+vy][c+vx].val)) {
                            numWorking++;
                        }
                    }
                }
            }
        }
    }
    
    full = true;
    for(r=0;r<LEN;r++) {
    	for(c=0;c<LEN;c++) {
    		full = full && (squares[r][c] == null);
    	}
    }
    
    if(numWorking==0) {
        vx = 0;
        vy = 0;
        if(newSquare != null) {
            do {
                newR = Math.floor(Math.random() * LEN);
                newC = Math.floor(Math.random() * LEN);
            } while(squares[newR][newC] != null && !full);
            squares[newR][newC] = newSquare;
            newSquare = null;
        }
    }
    
    gameContinuing = false;
    for(r=0;r<LEN;r++) {
        for(c=0;c<LEN;c++) {
            val = squares[r][c].val;
            if(r+1 < LEN && squares[r+1][c].val==val) {
                gameContinuing = true;
                break;
            }
            if(r-1 >=0 && squares[r-1][c].val==val) {
                gameContinuing = true;
                break;
            }
            if(c+1 < LEN && squares[r][c+1].val==val) {
                gameContinuing = true;
                break;
            }
            if(c-1 >=0 && squares[r][c-1].val==val) {
                gameContinuing = true;
                break;
            }
        }
    }
    
    if(!gameContinuing) {
        clearInterval(timer);
        gameOver = true;
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(0,0,LEN*SIZE+(LEN+1)*BORDER,LEN*SIZE+(LEN+1)*BORDER);
        ctx.fillStyle = "#FFF";
        
        ctx.font = "bold 36pt Arial";
        ctx.fillText("Game Over", (LEN*SIZE + (LEN+1)*BORDER)/2, LEN*SIZE/3);
        
        ctx.font = "18pt Arial";
        ctx.fillText("Click to Restart", (LEN*SIZE + (LEN+1)*BORDER)/2, LEN*SIZE/2);
        return;
    }
}

function draw(row, col, sq) {
    bg = "";    
    switch(sq.val) {
    	case -1:
    	    bg = STD_BG;
            fontColor = "rgba(0,0,0,0)";
            break;
        case 2:
            bg = "rgb(234,222,208)";
            fontColor = "#3D352A";
            break;
        case 4:
            bg = "rgb(233,218,186)";
            fontColor = "#3D352A";
            break;
        case 8:
            bg = "rgb(241,162,96)";
            fontColor = "rgb(248,234,238)";
            break;
        case 16:
            bg = "rgb(245,130,74)";
            fontColor = "rgb(248,234,238)";
            break;
        case 32:
            bg = "#000";
            fontColor = "rgb(248,234,238)";
            break;
        default:
            bg = "#000";
            fontColor = "rgb(248,234,238)";
    }
    if(sq.opacity < 1.0) {
        bg = bg.replace("rgb","rgba").replace(")",","+(sq.opacity*255)+")");
        fontColor = fontColor.replace("rgb","rgba").replace(")",","+(sq.opacity*255)+")");
    }
    ctx.fillStyle = bg;
    roundRect(col*SIZE+(col+1)*BORDER+sq.offsetX, row*SIZE+(row+1)*BORDER+sq.offsetY,
              SIZE, SIZE);
    
    ctx.fillStyle = fontColor;
    fontSize = 49;//One greater than the default.
    do {
        fontSize--;
        ctx.font = "bold " + fontSize + "pt Arial";
    } while(ctx.measureText(""+sq.val).width > SIZE);
    ctx.fillText(""+squares[r][c].val, col*SIZE+(col+1)*BORDER+SIZE/2+sq.offsetX, row*SIZE+(row+1)*BORDER+SIZE/2+sq.offsetY);
}

function roundRect(x, y, width, height, radius) {
    if (typeof radius === "undefined") {
        radius = 5;
    }
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
}