LEN = 4;//Number of rows/cols in grid.
SIZE = 120;//Size of each square in grid.
BORDER = 10;
canvas = document.getElementById("game");
canvas.width = LEN*SIZE + (LEN+1)*BORDER;
canvas.height = LEN*SIZE + (LEN+1)*BORDER;
ctx = canvas.getContext("2d");
ctx.font = "bold 48pt Arial";
ctx.textAlign = "center";
ctx.textBaseline = "middle";

vx = 0;
vy = 0;
VEL = 10;

numWorking = 0;

newSquare = null;

squares = new Array(LEN);
for(r=0; r<LEN; r++) {
  squares[r] = new Array(LEN);
  for(c=0; c<LEN; c++) {
    squares[r][c] = null;
  }
}
squares[3][3] = {"offsetX":0,"offsetY":0,"val":2};

t = setInterval(updateGame, 1000/30);

window.addEventListener('keydown', input, true);

function input(e) {
  if(working) return;
  switch(e.keyCode) {
    case 38:
      vx = 0;
      vy = -1;
      break;
    case 40:
      vx = 0;
      vy = 1;
    case 37:
      vy = 0;
      vx = -1;
      break;
    case 39:
      vy = 0;
      vx = 1;
      break;
  }
  newSquare = {"offsetX":0,"offsetY":0,"val":2};
}

function updateGame() {
  ctx.fillStyle = "rgb(174,157,142)";
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
        if(r+vy<LEN && r+vy>=0 && c+vx<LEN && c+vx>=0 &&
           (squares[r+vy][c+vx] == null ||
            squares[r+vy][c+vx].val ==
            squares[r][c].val)) {
          numWorking++;
          squares[r][c].offsetX += vx*VEL;
          squares[r][c].offsetY += vy*VEL;
          if(Math.abs(squares[r][c].offsetX) >= SIZE) {
            if(squares[r][c+vx] != null) {
              squares[r][c].val *= 2;
            }
            squares[r][c].offsetX = 0;
            squares[r][c+vx] = squares[r][c];
            squares[r][c] = null;
            numWorking--;
          }
          else if(Math.abs(squares[r][c].offsetY) >= SIZE){
            if(squares[r+vy][c] != null) {
              squares[r][c].val *= 2;
            }
            squares[r][c].offsetY = 0;
            squares[r+vy][c] = squares[r][c];
            squares[r][c] = null;
            numWorking--;
          }
        }
      }
    }
  }
  if(numWorking==0) {
    vx = 0;
    vy = 0;
    if(newSquare != null) {
      do {
        newR = Math.floor(Math.random() * LEN);
        newC = Math.floor(Math.random() * LEN);
      } while(squares[newR][newC] != null);
      squares[newR][newC] = newSquare;
      newSquare = null;
    }
  }
  //working = false;
}

function draw(row, col, sq) {
  bg = "";
  fontColor = "";
  switch(sq.val) {
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
  ctx.fillStyle = bg;
  roundRect(col*SIZE+(col+1)*BORDER+sq.offsetX, row*SIZE+(row+1)*BORDER+sq.offsetY,
               SIZE, SIZE);
  ctx.fillStyle = fontColor;
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
