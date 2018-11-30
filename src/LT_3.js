var i, j, k;
var colors = new Array(); // 配列を新しく作るにはこうします。
for(i = 0; i < 5; i++){
  // カラーのイメージを取得
  color = new Image();
  color.src = "./images/color_" + i.toString() + ".png";
  // カラー配列に追加
  colors.push(color);
}

// contextの取得
function getctx(){
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");
  return ctx;
}

function drawAllDots(){
  ctx = getctx();
  for(i = -5; i <= 5; i++){
    ctx.drawImage(colors[0], 248, 248 + i * 10);
    ctx.drawImage(colors[0], 248 + i * 10, 248);
  }
  for(i = 1; i <= 5; i++){
    for(j = 1; j <= 5; j++){
      ctx.drawImage(colors[1], 248 + i * 10, 248 + j * 10);
      ctx.drawImage(colors[2], 248 - i * 10, 248 + j * 10);
      ctx.drawImage(colors[3], 248 + i * 10, 248 - j * 10);
      ctx.drawImage(colors[4], 248 - i * 10, 248 - j * 10);
    }
  }
}
function drawTransformedDots(a, b, c, d){
  ctx = getctx();
  for(i = -5; i <= 5; i++){
    ctx.drawImage(colors[0], 247 + i * a * 10, 247 + i * c * 10);
    ctx.drawImage(colors[0], 247 + i * b * 10, 247 + i * d * 10);
  }
  for(i = 1; i <= 5; i++){
    for(j = 1; j <= 5; j++){
      ctx.drawImage(colors[1], 247 + (i * a + j * b) * 10, 247 + (i * c + j * d) * 10);
      ctx.drawImage(colors[2], 247 + (-i * a + j * b) * 10, 247 + (-i * c + j * d) * 10);
      ctx.drawImage(colors[3], 247 + (i * a - j * b) * 10, 247 + (i * c - j * d) *10);
      ctx.drawImage(colors[4], 247 + (-i * a - j * b) * 10, 247 + (-i * c - j * d) * 10);
    }
  }
}

function init(){
  ctx = getctx();
  ctx.beginPath();
  ctx.arrow(250, 500, 250, 0, [0, 1, -10, 1, -10, 5]);
  ctx.arrow(0, 250, 500, 250, [0, 1, -10, 1, -10, 5]);
  ctx.fillStyle = "#ccc";
  ctx.fill();
  //drawAllDots();
  drawTransformedDots(2, 1, 1, 3);
}
