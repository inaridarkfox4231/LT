var i, j, k;
var colors = new Array(); // 配列を新しく作るにはこうします。
for(i = 0; i < 5; i++){
  // カラーのイメージを取得
  color = new Image();
  color.src = "./images/color_" + i.toString() + ".png";
  // カラー配列に追加
  colors.push(color);
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

// 各点における移動方向の矢印を求める（できれば長さを色で表したいけど）
function drawSingleArrow(ctx, x1, y1, x2, y2){
  var dist = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
  var dx = (15 * (x2 - x1)) / dist, dy = (15 * (y2 - y1)) / dist;
  ctx.beginPath();
  ctx.arrow(x1, y1, x1 + dx, y1 + dy, [0, 1, -3, 1, -6, 5]);
  ctx.fillStyle = "#000";
  ctx.fill();
  // グラデーションテストをエクセルでおこなったので使うかどうか決める（後で）
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
    t = Math.ceil((300 * Math.sqrt(a * a + c * c) + 10 * Math.abs(a * b + c * d) * n) / (Math.abs(a * d - b * c)));
    s = Math.ceil((300 * Math.sqrt(b * b + d * d) + 10 * Math.abs(a * b + c * d) * m) / (Math.abs(a * d - b * c)));
    for(i = -n; i <= n; i++){
      ctx.moveTo(200 + a * t + 10 * i * b, 200 - c * t - 10 * i * d);
      ctx.lineTo(200 - a * t + 10 * i * b, 200 + c * t - 10 * i * d);
      ctx.stroke();
    }
    for(i = -m; i <= m; i++){
      ctx.moveTo(200 + b * t + 10 * i * a, 200 - d * t - 10 * i * c);
      ctx.lineTo(200 - b * t + 10 * i * a, 200 + d * t - 10 * i * c);
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
function drawArrows(elem, pos){
  var ctx = getctx(pos);
  ctx.drawImage(blank, 0, 0);
  var a = elem[0], b = elem[1], c = elem[2], d = elem[3];
  // 変化の矢印を描く
  var target = [0, 0];
  ctx.beginPath();
  for(i = -10; i <= 10; i++){
    for(j = -10; j <= 10; j++){
      drawSingleArrow(ctx, 200 + 20 * i, 200 - 20 * j, 200 + 20 * (a * i + b * j), 200 - 20 * (c * i + d * j));
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
  if(mode == 0){
    drawDots(elem, pos);
  }else if(mode == 1){
    drawLattice(elem, pos);
  }else if(mode == 2){
    drawArrows(elem, pos);
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
    mode = (mode + 1) % 3;
    showResult([1, 0, 0, 1], 0);
    showResult(elem, 1);
  }
})
// シフトボタンの追加。
document.getElementById("Shiftbutton").addEventListener("click", function(){
  console.log("シフトボタンで操作しました");
  mode = (mode + 1) % 3;
  showResult([1, 0, 0, 1], 0);
  showResult(elem, 1);
  // document.getElementById("elem00").focus(); // なんか、フォーカスがボタンに移っちゃうので、外す。
  // じゃないとEnterキーで反応しちゃうんだって（てかよく気付いたなおい）
  document.getElementById("Shiftbutton").blur(); // blurで外すという対策もある。勉強になるなー。
})
