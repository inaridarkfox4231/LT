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
    ctx.drawImage(colors[0], 249, 249 + i * 10);
    ctx.drawImage(colors[0], 249 + i * 10, 249);
  }
  for(i = 1; i <= 5; i++){
    for(j = 1; j <= 5; j++){
      ctx.drawImage(colors[1], 249 + i * 10, 249 + j * 10);
      ctx.drawImage(colors[2], 249 - i * 10, 249 + j * 10);
      ctx.drawImage(colors[3], 249 + i * 10, 249 - j * 10);
      ctx.drawImage(colors[4], 249 - i * 10, 249 - j * 10);
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
  drawAllDots();
}
