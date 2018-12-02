var i, j, k;
var colors = new Array(); // 配列を新しく作るにはこうします。
for(i = 0; i < 5; i++){
  // カラーのイメージを取得
  color = new Image();
  color.src = "./images/color_" + i.toString() + ".png";
  // カラー配列に追加
  colors.push(color);
}

// まっさらの画像
var blank = new Image();
blank.src = "./images/blank.png";

// モード変数（0:Dots, 1:Lattice, 2:arrows）
var mode = 0;

// 変換が行われる数字の列（エンターキーを押すと登録される）
var elem = [1, 0, 0, 1];

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
}

// 格子を表示する（格子線、ベクトルの両方）
function drawLattice(elem, pos){
  var ctx = getctx(pos);
  // 一度まっさらにする
  ctx.drawImage(blank, 0, 0);
  // 線を引く
  ctx.beginPath();
  for(i = 1; i < 40; i++){
    ctx.moveTo(0, i * 10);
    ctx.lineTo(400, i * 10);
    ctx.stroke();
    ctx.moveTo(i * 10, 0);
    ctx.lineTo(i * 10, 400);
    ctx.stroke();
  }
  // 色についてはのちのち考える・・・
}

// 初期化ですべきこと：beforeにデフォルトのドットを表示する。afterにも、一応。
function init(){
  drawDots([1, 0, 0, 1], 0);
  drawDots([1, 0, 0, 1], 1);
}

// modeが0, 1, 2のいずれかに応じて変換結果を表示する関数
function showResult(elem, pos){
  if(mode == 0){
    drawDots(elem, pos);
  }else if(mode == 1){
    drawLattice(elem, pos);
  }
  // 1と2はそのうち用意する
}

// スペースとエンターを押したときの処理
document.addEventListener("keydown", function(e){
  // エンターキーを押したときに行われること：（行列と矢印の表示、）afterに結果の表示。
  if(e.keyCode == "13"){
    var a = getValue(0, 0), b = getValue(0, 1), c = getValue(1, 0), d = getValue(1, 1);
    a = Number(a), b = Number(b), c = Number(c), d = Number(d);
    if(isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d)){
       return;
     }else{
       elem[0] = a, elem[1] = b, elem[2] = c, elem[3] = d;
     }
    showResult(elem, 1);
  }
  // スペースキーを押したときの反応。modeが0, 1, 2で回る、2つの画像も再描画。
  if(e.keyCode == "32"){
    mode = (mode + 1) % 2;
    showResult([1, 0, 0, 1], 0);
    showResult(elem, 1);
  }
})
