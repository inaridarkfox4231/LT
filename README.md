# LT  
線型変換の実験。→https://inaridarkfox4231.github.io/LT/  
2画面にする。左と右。左に最初いくつかの点。10pxを1として合計121個の点が表示されている。  
数字入力箇所が2×2で4つ、数字を入れられる（デフォルトは1, 0, 0, 1）。  
Enterキーでその場合の線型変換の実行結果が右側の座標平面に表示される。  
Shiftキーを押すと、モードチェンジが行われる。モードは３つ。  
1. デフォルト（移動先の点が表示される）  
![sampleimage](https://github.com/inaridarkfox4231/LT/blob/gh-pages/images/sample_0.PNG)
2. 格子（表示が格子になる。変換後の格子と、あとベクトルの変化が表示される。(1, 0)と(0, 1)の移った先。）  
![sampleimage](https://github.com/inaridarkfox4231/LT/blob/gh-pages/images/sample_1.PNG)
3. 矢印1（移動する方向を表示、長さを太さで表している）  
![sampleimage](https://github.com/inaridarkfox4231/LT/blob/gh-pages/images/sample_2.PNG)
4. 矢印2（移動する方向を表示、長さを色で表している（赤いほど長い））
![sampleimage](https://github.com/inaridarkfox4231/LT/blob/gh-pages/images/sample_3.PNG)

これらのモードがShiftキーを押すごとに順繰りに移り変わる。  
Special Thanks：  
　このコードは、結城浩先生の著作：数学ガールの秘密ノート「行列が描くもの」に登場するリサという少女が会話の中で説明に用いている画像をモチーフにして考え出されたものです。点が移動する様子や格子の移り方についてはそれを参考にしています。矢印については同じようにしたら若干見づらくなってしまったので、方向だけ表すように書き直しました（矢印が突き抜けてどっちに移動してるのか分からなくなったりしたので・・）。着想をいただいた結城先生に感謝いたします。それと、矢印の表現についてはfrogcat様のサイト→https://github.com/frogcat/canvas-arrow のcanvas-arrowを使わせていただきました。ありがとうございました。  
　どう書けばいいのか分かんない。。こんなところでいいのかな・・
