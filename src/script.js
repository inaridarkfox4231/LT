var i, j, k;
var colors = new Array(); // 配列を新しく作るにはこうします。
for(i = 0; i < 5; i++){
  // カラーのイメージを取得
  color = new Image();
  color.src = "./images/color_" + i.toString() + ".png";
  // カラー配列に追加
  colors.push(color);
}

var blank = new Image();
blank.src = "./images/blank.png";

// canvasのcontextの取得
function getctx(pos){
  var canvas;
  // posが0のときは左側、1のときは右側
  if(pos == 0){
    canvas = document.getElementById("before");
  }else{
    canvas = document.getElementById("after");
  }
  var ctx = canvas.getContext("2d");
  return ctx;
}

// 文字列{elem[0]}{elem[1]}{elem[2]}{elem[3]}を生成するだけの関数
function makeParams(elem, size){
  var str = "";
  for(i = 0; i < size; i++){
    str += "{" + elem[i].toString() + "}"
  }
  return str;
}

// テキストボックスから文字を取得する。(00, 01, 10, 11)
function getValue(i, j){
  var str_id = "elem" + i.toString() + j.toString();
  return document.getElementById(str_id).value;
}

// 行列(a, b; c, d)で変換した結果を表示する（ドット表示）
function drawDots(elem, pos){
  // posが0のときは左側、1のときは右側。
  var ctx = getctx(pos);
  // ここで一度まっさらにする
  ctx.drawImage(blank, 0, 0);
  // ここで座標軸を表示する
  ctx.beginPath();
  ctx.arrow(200, 400, 200, 0, [0, 1, -10, 1, -10, 5]);
  ctx.arrow(0, 200, 400, 200, [0, 1, -10, 1, -10, 5]);
  ctx.fillStyle = "#999";
  ctx.fill();
  // 成分に基づいて点を描画する。まずは座標軸上の点（か、それを移した点）
  var a = elem[0], b = elem[1], c = elem[2], d = elem[3];
  for(i = -5; i <= 5; i++){
    ctx.drawImage(colors[0], 197 + i * a * 10, 197 - i * c * 10);
    ctx.drawImage(colors[0], 197 + i * b * 10, 197 - i * d * 10);
  }
  // 次いで、第1～第4象限の点（か、それを移した点）
  for(i = 1; i <= 5; i++){
    for(j = 1; j <= 5; j++){
      ctx.drawImage(colors[1], 197 + (i * a + j * b) * 10, 197 - (i * c + j * d) * 10);
      ctx.drawImage(colors[2], 197 + (-i * a + j * b) * 10, 197 - (-i * c + j * d) * 10);
      ctx.drawImage(colors[3], 197 + (i * a - j * b) * 10, 197 - (i * c - j * d) *10);
      ctx.drawImage(colors[4], 197 + (-i * a - j * b) * 10, 197 - (-i * c - j * d) * 10);
    }
  }
  // 最後に、posが1の場合に矢印の上に行列を出す（出ない・・なぜだ・・）
  // どうやら無理みたいです。最初に読み込まないと適用されないようで・・
}

// 初期化ですべきこと：beforeにデフォルトのドットを表示する。
function init(){
  drawDots([1, 0, 0, 1], 0);
}

// テキストボックス4つに数字を入れたい。
// エンターキーを押したときに行われること：行列と矢印の表示、afterにドットの表示。
document.addEventListener("keydown", function(e){
  if(e.keyCode == "13"){
    var a = getValue(0, 0), b = getValue(0, 1), c = getValue(1, 0), d = getValue(1, 1);
    a = Number(a), b = Number(b), c = Number(c), d = Number(d);
    if(isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d)){ return; }
    drawDots([a, b, c, d], 1);
  }
})
