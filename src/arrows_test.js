var i, j, k;
var colors = new Array(); // 配列を新しく作るにはこうします。
for(i = 0; i < 5; i++){
  // カラーのイメージを取得
  color = new Image();
  color.src = "./images/color_" + i.toString() + ".png";
  // カラー配列に追加
  colors.push(color);
}

// dist, dx, dyの配列（0で初期化する）
var dist = new Array();
var dx = new Array();
var dy = new Array();
for(i = 0; i <= 20; i++){
  dist.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  dx.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  dy.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
}

// キーコード
const K_ENTER = 13;
const K_SHIFT = 16;

// まっさらの画像
var blank = new Image();
blank.src = "./images/blank.png";

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

// 座標軸を描く
function drawAxis(ctx){
  ctx.beginPath();
  ctx.arrow(200, 400, 200, 0, [0, 1, -10, 1, -10, 5]);
  ctx.arrow(0, 200, 400, 200, [0, 1, -10, 1, -10, 5]);
  ctx.fillStyle = "#000";
  ctx.fill();
}

// 軸ベクトルを描く
function drawAxisVector(ctx, x1, y1, x2, y2){
  ctx.beginPath();
  ctx.arrow(200, 200, 200 + x1, 200 + y1, [0, 1, -10, 1, -10, 5]);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.beginPath();
  ctx.arrow(200, 200, 200 + x2, 200 + y2, [0, 1, -10, 1, -10, 5]);
  ctx.fillStyle = "blue";
  ctx.fill();
}

// 行列(a, b; c, d)で変換した結果を表示する（ドット表示）
function drawDots(elem, pos){
  // posが0のときは左側、1のときは右側。
  var ctx = getctx(pos);
  // ここで一度まっさらにする
  ctx.drawImage(blank, 0, 0);
  // ここで座標軸を表示する
  drawAxis(ctx);
}

// dist, dx, dyを計算する
function calc_dist(a, b, c, d){
  var x1, y1, x2, y2;
  for(i = 0; i <= 20; i++){
    for(j = 0; j <= 20; j++){
      x1 = 20 * i, y1 = 400 - 20 * j;
      x2 = 200 * (1 - a - b) + 20 * (a * i + b * j);
      y2 = 200 * (1 + c + d) - 20 * (c * i + d * j);
      dist[i][j] = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
      if(dist[i][j] > 0){
        dx[i][j] = (15 * (x2 - x1)) / dist[i][j];
        dy[i][j] = (15 * (y2 - y1)) / dist[i][j];
      }else{
        dx[i][j] = 0, dy[i][j] = 0;
      }
      // console.log('%d %d %d %d %d', i, j, dist[i][j], dx[i][j], dy[i][j]);
    }
  }
}

// 各点における移動方向の矢印を求める（できれば長さを色で表したいけど）
function drawSingleArrow(ctx, i, j){
  var x = 20 * i, y = 400 - 20 * j;
  ctx.beginPath();
  ctx.arrow(x, y, x + dx[i][j], y + dy[i][j], [0, 1, -3, 1, -6, 5]);
  ctx.fillStyle = "#000";
  ctx.fill();
  // グラデーションテストをエクセルでおこなったので使うかどうか決める（後で）
}

// 線型変換による移動の様子を描画する
function drawArrows(elem, pos){
  var ctx = getctx(pos);
  ctx.drawImage(blank, 0, 0);
  var a = elem[0], b = elem[1], c = elem[2], d = elem[3];
  // 変化の矢印を描く
  // ここでa, b, c, dを元にしてdistの配列に数字を放り込む（dist[i][j]）
  // dx, dyの配列も作ろうかな・・そうすればiとjを渡すだけで済むし。
  // さらにdistのMAXを計算してこれとは別にスケール配列（scale[i][j]）に0~100を放り込む
  // 以上の情報から太さを表現する。計算式は作ってある（0.01刻み）
  calc_dist(a, b, c, d);
  ctx.beginPath();
  for(i = 0; i <= 20; i++){
    for(j = 0; j <= 20; j++){
      drawSingleArrow(ctx, i, j);
    }
  }
  // 座標軸を描く
  drawAxis(ctx);
}

// 初期化ですべきこと：beforeにデフォルトのドットを表示する。afterにも、一応。
// それと、00のマスにフォーカスして直接編集可能にする。
function init(){
  drawDots([1, 0, 0, 1], 0);
  drawDots([1, 0, 0, 1], 1);
  document.getElementById("elem00").focus();
}

// modeが0, 1, 2のいずれかに応じて変換結果を表示する関数
function showResult(elem, pos){
  drawArrows([1, 0, 0, 1], 0);
  drawArrows(elem, pos);
}

// シフトとエンターを押したときの処理
document.addEventListener("keydown", function(e){
  // エンターキーを押したときに行われること：（行列と矢印の表示、）afterに結果の表示。
  if(e.keyCode == K_ENTER){
    var a = getValue(0, 0), b = getValue(0, 1), c = getValue(1, 0), d = getValue(1, 1);
    a = Number(a), b = Number(b), c = Number(c), d = Number(d);
    if(isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d)){
       return;
     }else{
       elem[0] = a, elem[1] = b, elem[2] = c, elem[3] = d;
     }
    showResult(elem, 1);
  }
})
