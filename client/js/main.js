
(function (){
  $(document).ready(function(){
    var e = new Engine($('#main')[0]);
    if (e.ready())
      e.draw();
      e.resizeGame();

    window.engine = e;
    setTimeout(e.resizeGame, 100);
    ["UP", "DOWN", "LEFT", "RIGHT", "SPACE", "MAP", "SAVES"].forEach(function(item) {
      $("#vkbd_key_" + item).click(function(){
        e.handleEvent(item);
      });
    });

  });

})();
