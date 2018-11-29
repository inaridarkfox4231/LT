var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
ctx.strokeStyle = "red";
ctx.strokeRect(40, 40, 20, 20);
var rad = 15 * Math.PI / 180;
ctx.setTransform(Math.cos(rad), Math.sin(rad), -Math.sin(rad), Math.cos(rad), 0, 0);  // 15°の回転
ctx.strokeStyle = "blue";
ctx.strokeRect(40, 40, 20, 20);
ctx.setTransform(3, 1, -1, 3, 0, 0);  // 線型変換を定義し直す
ctx.strokeStyle = "black";
ctx.strokeRect(30, 30, 10, 10);
ctx.setTransform(1, 0, 0, 1, 0, 0); // リセットする。
ctx.beginPath();
ctx.arrow(0, 0, 200, 100, [0, 1, -10, 1, -10, 5]);
ctx.arrow(30, 30, 45, 45, [0, 1, -10, 1, -10, 5]);
ctx.fill();
