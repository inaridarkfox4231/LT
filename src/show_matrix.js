// お蔵入り（そのうち使うかも）
$(function(){
  function showMatrix(a, b, c, d){
    $('#arrow').html("\\[ \\begin{CD} @> \\fourmat{" + a + "}{" + b + "}{" + c + "}{" + d + "} >> \\end{CD} \\]");
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, "arrow"]);
  }
  $(window).keydown(function(e){
    if(e.keyCode == 13){
      var a = $('#elem00').val(), b = $('#elem01').val(), c = $('#elem10').val(), d = $('#elem11').val();
      if(a == "" || b == "" || c == "" || d == ""){ return; } // 空欄があったらだめ
      a = Number(a), b = Number(b), c = Number(c), d = Number(d);
      if(isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d)){ return; } // 数字でないとだめ
      showMatrix(a, b, c, d);
    }
  })
})
