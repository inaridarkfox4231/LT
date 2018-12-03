var i, j, k;

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
  // ここをいじる
  // 第1段階：座標軸の像としての直線を2本引く
  var u = Math.max(Math.abs(a), Math.abs(c)), v = Math.max(Math.abs(b), Math.abs(d));
  var t;
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

  // 第2段階：座標軸に平行な直線群を順に引く（まずx軸、次いでy軸）

  //for(i = 1; i < 40; i++){
  //  ctx.moveTo(b * i * 10 + 200 * (1 - a - b), -d * i * 10 + 200 * (1 + c + d));
  //  ctx.lineTo(b * i * 10 + 200 * (1 + a - b), -d * i * 10 + 200 * (1 - c + d));
  //  ctx.stroke();
  //  ctx.moveTo(a * i * 10 + 200 * (1 - a - b), -c * i * 10 + 200 * (1 + c + d));
  //  ctx.lineTo(a * i * 10 + 200 * (1 - a + b), -c * i * 10 + 200 * (1 + c - d));
  //  ctx.stroke();
  //}
  // 座標軸を描く
  drawAxis(ctx);
  // 軸ベクトルの描画。二つの矢印（x方向の赤とy方向の青）を表示。
  drawAxisVector(ctx, 50 * a, -50 * c, 50 * b, -50 * d);
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
  drawLattice([1, 0, 0, 1], 0);
  drawLattice(elem, pos);
}

// エンターを押したときの処理
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
