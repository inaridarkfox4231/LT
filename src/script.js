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

// モード変数（0:Dots, 1:Lattice, 2:Arrows）
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
  // 成分に基づいて点を描画する。まずは座標軸上の点（か、それを移した点）
  var a = elem[0], b = elem[1], c = elem[2], d = elem[3];
  for(i = -5; i <= 5; i++){
    ctx.drawImage(colors[0], 197 + i * a * 10, 197 - i * c * 10);
    ctx.drawImage(colors[0], 197 + i * b * 10, 197 - i * d * 10);
  }
  // 次いで、第1～第4象限の点（か、それを移した点）（y座標を逆にするの注意）
  for(i = 1; i <= 5; i++){
    for(j = 1; j <= 5; j++){
      ctx.drawImage(colors[1], 197 + (i * a + j * b) * 10, 197 - (i * c + j * d) * 10);
      ctx.drawImage(colors[2], 197 + (-i * a + j * b) * 10, 197 - (-i * c + j * d) * 10);
      ctx.drawImage(colors[3], 197 + (i * a - j * b) * 10, 197 - (i * c - j * d) *10);
      ctx.drawImage(colors[4], 197 + (-i * a - j * b) * 10, 197 - (-i * c - j * d) * 10);
    }
  }
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
        max_of_dist = dist[i][j];
      }
    }
  }
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
  // スケールに基づいて太さ、もしくは色を調節する（flagで制御）
  if(flag == 0){
    var diff = (ind[i][j] * 5) / 100;
    ctx.arrow(x, y, x + dx[i][j], y + dy[i][j], [0, 0.5 + diff, -3 - diff, 0.5 + diff, -6 - diff, 7]);
    ctx.fillStyle = "#000";
  }else{
    ctx.arrow(x, y, x + dx[i][j], y + dy[i][j], [0, 2, -4.5, 2, -7.5, 7]);
    ctx.fillStyle = "rgb(" + col_R[ind[i][j]] + ", " + col_G[ind[i][j]] + ", " + col_B[ind[i][j]] + ")";
  }
  ctx.fill();
}

// 格子を表示する（格子線、ベクトルの両方）
function drawLattice(elem, pos){
  var ctx = getctx(pos);
  // 一度まっさらにする
  ctx.drawImage(blank, 0, 0);
  // 変数を用意する
  var a = elem[0], b = elem[1], c = elem[2], d = elem[3];
  // 線を引く
  ctx.beginPath();
  ctx.strokeStyle = "#bbb";
  // ad-bcが0でないならすべての軸を移す、0なら座標軸の像だけでいい。
  var n, m, t, s;
  if(a * d - b * c != 0){
    // この辺の計算はちゃんと意味があるけど割愛（アイデアとしては正方形を包む円で考える）
    n = Math.ceil((30 * Math.sqrt(a * a + c * c)) / (Math.abs(a * d - b * c)));
    m = Math.ceil((30 * Math.sqrt(b * b + d * d)) / (Math.abs(a * d - b * c)));
    t = Math.ceil((300 * Math.sqrt(a * a + c * c) + 10 * Math.abs(a * b + c * d) * n) / (a * a + c * c));
    s = Math.ceil((300 * Math.sqrt(b * b + d * d) + 10 * Math.abs(a * b + c * d) * m) / (b * b + d * d));
    for(i = -n; i <= n; i++){
      ctx.moveTo(200 + a * t + 10 * i * b, 200 - c * t - 10 * i * d);
      ctx.lineTo(200 - a * t + 10 * i * b, 200 + c * t - 10 * i * d);
      ctx.stroke();
    }
    for(i = -m; i <= m; i++){
      ctx.moveTo(200 + b * s + 10 * i * a, 200 - d * s - 10 * i * c);
      ctx.lineTo(200 - b * s + 10 * i * a, 200 + d * s - 10 * i * c);
      ctx.stroke();
    }
  }else{
    var u = Math.max(Math.abs(a), Math.abs(c)), v = Math.max(Math.abs(b), Math.abs(d));
    if(u > 0){
      t = Math.ceil(200 / u);
      ctx.moveTo(200 - a * t, 200 + c * t);
      ctx.lineTo(200 + a * t, 200 - c * t);
      ctx.stroke();
    }
    if(v > 0){
      t = Math.ceil(200 / v);
      ctx.moveTo(200 - b * t, 200 + d * t);
      ctx.lineTo(200 + b * t, 200 - d * t);
      ctx.stroke();
    }
  }
  // 座標軸を描く
  drawAxis(ctx);
  // 軸ベクトルの描画。二つの矢印（x方向の赤とy方向の青）を表示。
  drawAxisVector(ctx, 50 * a, -50 * c, 50 * b, -50 * d);
}

// 線型変換による移動の様子を描画する
function drawArrows(elem, pos, flag){
  var ctx = getctx(pos);
  ctx.drawImage(blank, 0, 0);
  var a = elem[0], b = elem[1], c = elem[2], d = elem[3];
  // dist, dx, dyを計算する
  calc_dist(a, b, c, d);
  ctx.beginPath();
  // 座標軸を描く
  drawAxis(ctx);
  // 変化の矢印を描く
  for(i = 0; i <= 20; i++){
    for(j = 0; j <= 20; j++){
      drawSingleArrow(ctx, i, j, flag);
    }
  }
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
  if(mode == 0){
    drawDots(elem, pos);
  }else if(mode == 1){
    drawLattice(elem, pos);
  }else if(mode == 2){
    drawArrows(elem, pos, 0);
  }else if(mode == 3){
    drawArrows(elem, pos, 1);
  }
  // 1と2はそのうち用意する
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
  // シフトキーを押したときの反応。modeが0, 1, 2で回る、2つの画像も再描画。
  if(e.keyCode == K_SHIFT){
    console.log("シフトキーが押されました");
    mode = (mode + 1) % 4;
    showResult([1, 0, 0, 1], 0);
    showResult(elem, 1);
  }
})
// シフトボタンの追加。
document.getElementById("Shiftbutton").addEventListener("click", function(){
  console.log("シフトボタンで操作しました");
  mode = (mode + 1) % 4;
  showResult([1, 0, 0, 1], 0);
  showResult(elem, 1);
  // document.getElementById("elem00").focus(); // なんか、フォーカスがボタンに移っちゃうので、外す。
  // じゃないとEnterキーで反応しちゃうんだって（てかよく気付いたなおい）
  document.getElementById("Shiftbutton").blur(); // blurで外すという対策もある。勉強になるなー。
})
