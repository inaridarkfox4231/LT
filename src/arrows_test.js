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
var ind = new Array();  // 0~100の長さの相対値（指標）（scaleだとなぜかエラー吐いたのでindにした）
for(i = 0; i <= 20; i++){
  dist.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  dx.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  dy.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  ind.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
}

// R,G,Bの配列（色で長さを表現するのに使う）（立方体の辺の上を移動する感じ）
var col_R = new Array(), col_G = new Array(), col_B = new Array();
for(i = 0; i <= 100; i++){
  col_R.push(0), col_G.push(0), col_B.push(0);
}
col_R[0] = 215, col_G[0] = 15, col_B[0] = 205;
for(i = 1; i <= 20; i++){
  col_R[i] = 225 - 10 * i,    col_G[i] = 15,                col_B[i] = 215;
  col_R[i + 20] = 15,         col_G[i + 20] = 5 + 10 * i,   col_B[i + 20] = 215;
  col_R[i + 40] = 15,         col_G[i + 40] = 215,          col_B[i + 40] = 225 - 10 * i;
  col_R[i + 60] = 5 + 10 * i, col_G[i + 60] = 215,          col_B[i + 60] = 15;
  col_R[i + 80] = 215,        col_G[i + 80] = 225 - 10 * i, col_B[i + 80] = 15;
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
  var max_of_dist = 0;
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
      if(max_of_dist < dist[i][j]){
        console.log("更新されました");
        max_of_dist = dist[i][j];
      }
    }
  }
  console.log("終了");
  console.log(max_of_dist);
  max_of_dist = Math.floor(max_of_dist); // 整数にしておく
  // 無事MAXが出たので、これを使って指標を計算する
  for(i = 0; i <= 20; i++){
    for(j = 0; j <= 20; j++){
      if(max_of_dist > 0){
        ind[i][j] = Math.floor(Math.floor(dist[i][j]) * 100 / max_of_dist);
      }else{
        ind[i][j] = 0;
      }
    }
  }
  // 指標が計算できたので、太さをいじる。
}

// 各点における移動方向の矢印を求める（できれば長さを色で表したいけど）
// flag=0: 太さで表現、flag=1: 色で表現
function drawSingleArrow(ctx, i, j, flag){
  var x = 20 * i, y = 400 - 20 * j;
  ctx.beginPath();
  // スケールに基づいて太さを調節する。
  if(flag == 0){
    var diff = (ind[i][j] * 5) / 100;
    ctx.arrow(x, y, x + dx[i][j], y + dy[i][j], [0, 0.5 + diff, -3 - diff, 0.5 + diff, -6 - diff, 7]);
    ctx.fillStyle = "#000";
  }else{
    ctx.arrow(x, y, x + dx[i][j], y + dy[i][j], [0, 2, -4.5, 2, -7.5, 7]);
    ctx.fillStyle = "rgb(" + col_R[ind[i][j]] + ", " + col_G[ind[i][j]] + ", " + col_B[ind[i][j]] + ")";
  }
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
      drawSingleArrow(ctx, i, j, 1);
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

// 行列表示用のコード生成関数
function makeMatText(a, b, c, d){
  var str = "";
  str += "\\[ \\begin{CD} @> \\left( \\begin{array}{cc} {" + a + "} & {" + b + "} \\\\";
  str += "{" + c + "} & {" + d + "} \\end{array} \\right) >> \\end{CD} \\]";
  return str;
}

// シフトとエンターを押したときの処理
document.addEventListener("keydown", function(e){
  // エンターキーを押したときに行われること：（行列と矢印の表示、）afterに結果の表示。
  if(e.keyCode == K_ENTER){
    var a = getValue(0, 0), b = getValue(0, 1), c = getValue(1, 0), d = getValue(1, 1);
    // 空欄があったら反応しないようにしたい。
    if(a == "" || b == "" || c == "" || d == ""){ return; }
    a = Number(a), b = Number(b), c = Number(c), d = Number(d);
    if(isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d)){
       return;
     }else{
       elem[0] = a, elem[1] = b, elem[2] = c, elem[3] = d;
       // TODO:ここにTeX形式で矢印と行列を生成する命令を書き込む
       document.getElementById("arrow").innerHTML = makeMatText(a, b, c, d);
       MathJax.Hub.Queue(["Typeset", MathJax.Hub, "arrow"]);
     }
    showResult(elem, 1);
  }
})
