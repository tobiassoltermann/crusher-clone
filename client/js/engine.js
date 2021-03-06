var RoomColors = {
  'blue': 0,
  'green': 1,
  'purple': 2,
  'red': 3,
  'yellow': 4
};
var DiamondColors = {
  'blue': 0,
  'green': 1,
  'purple': 2,
  'red': 3,
  'yellow': 4
};
var MonsterColors = {
  'blue': {
    maxSpeed: 1.5
  },
  'green': {
    maxSpeed: 1
  },
  'purple': {
    maxSpeed: 0.2
  },
  'red': {
    maxSpeed: 0.8
  },
  'yellow': {
    maxSpeed: 0.4
  }
};

var Directions = {
  "UP": {x: 0, y: -1},
  "DOWN": {x: 0, y: 1},
  "RIGHT": {x: 1, y: 0},
  "LEFT": {x: -1, y: 0}
}

var StartPositions = {
  'TOP': {x: 9, y: 0},
  'BOTTOM': {x: 9, y: 12},
  'LEFT': {x: 0, y: 6},
  'RIGHT': {x: 18, y: 6}
}

Position = function(x, y) {
  this.x = x;
  this.y = y;
}
Position.prototype.constructor = Position;

Monster = function(x, y) {
  this.position = new Position(x, y);
  this.lastMoved = Date.now();
  this.direction = getRandomItemValue(Directions);
}

Monster.prototype.constructor = Monster;

inflateRoom = function(roomObj) {
  Object.keys(Room.prototype).forEach(function(item, index) {
    roomObj.prototype = Room.prototype;
  });
}

Room = function(engine) {
  this.engine = engine;
  this.elems = Create2DArray(this.width, this.height);
  this.brickColor = getRandomItemKey(RoomColors);
  this.diamondColor = getRandomItemKey(DiamondColors);
  this.monsterColor = getRandomItemKey(MonsterColors);
  this.monsterSpeed = MonsterColors[this.monsterColor].maxSpeed;
}
Room.prototype.constructor = Room;
Room.prototype.width = 19;
Room.prototype.height = 13;

Room.prototype.getObject = function(x, y) {
  return elems[x][y];
}

Room.prototype.generate = function() {
  this.elems = this.engine.roomGenerator.generate();
}

Room.prototype.getRandomEmptyPosition = function() {
  var possibleResult = [];
  var lines = this.elems;
  for (var crtX = 0; crtX < lines.length; crtX++)
  {
    var crtLine = lines[crtX];
    for (var crtY = 0; crtY < crtLine.length; crtY++)
    {
      var crtElement = crtLine[crtY];
      if(crtElement == "empty")
      {
        possibleResult.push({x: crtX, y: crtY});
      }
    }
  }

  var randomIndex = randomNumber(0, possibleResult.length-1);
  return possibleResult[randomIndex];
}

Room.prototype.onEnter = function() {
  this.monsters = [];
  for (var i = 0; i < this.engine.roomGenerator.numberOfMonsters; i++)
  {
    var randomPos = this.getRandomEmptyPosition();
    var crtMonster = new Monster(randomPos.x, randomPos.y);
    crtMonster.color = this.monsterColor;
    crtMonster.speed = this.monsterSpeed;
    this.monsters.push(crtMonster);
  }
}

RoomGenerator = function(paramObj) {
  if (paramObj)
  {
    this.params = paramObj;
  } else {
    this.params = { // Default probabilities:
      fixed: 0.2105, // 52 of 247
      color: 0.2469, // 61 of 247
      air: 0.005,
      diamond: 0.01, // 6 of 247
      bomb: 0.0040, // 1 of 247
      empty: 0.5344 // 132 of 247
    }
  }
}
RoomGenerator.prototype.constructor = RoomGenerator;
RoomGenerator.prototype.width = 19;
RoomGenerator.prototype.height = 13;
RoomGenerator.prototype.numberOfMonsters = 3;
RoomGenerator.prototype.generate = function() {
  var drng = new DRNG();
  drng.addNumber('fixed', this.params.fixed);
  drng.addNumber('color', this.params.color);
  drng.addNumber('air', this.params.air);
  drng.addNumber('diamond', this.params.diamond);
  drng.addNumber('bomb', this.params.bomb);
  drng.addNumber('empty', this.params.empty);
  var room = Create2DArray(this.width, this.height);
  var lines = room;
  for (var crtX = 0; crtX < lines.length; crtX++)
  {
    var crtLine = lines[crtX];
    for (var crtY = 0; crtY < crtLine.length; crtY++)
    {
      room[crtX][crtY] = drng.getRandomNumber();
    }
  }
  return room;
}

Player = function(engine) {
  this.men = engine.initialLives;
  this.oxygen = engine.initialOxygen;
  this.bombs = engine.initialBombs;
  this.score = engine.initialScore;
  this.bombActivated = false;
}
MiniatureDrawer = function(canvas, saveGame) {
  this.c = canvas;
  this.c2 = canvas.getContext('2d');
  this.rooms = saveGame.rooms;
  this.crtRoom = saveGame.crtRoom;
}
MiniatureDrawer.prototype.constructor = MiniatureDrawer;
MiniatureDrawer.prototype.drawMiniature = function(){
  var crtRoom = this.rooms[this.crtRoom];

  this.fieldSize = 5;
  this.c.width = this.fieldSize * (crtRoom.elems.length+4);
  this.c.height = this.fieldSize * (crtRoom.elems[0].length+4);
  this.c2.fillStyle = "#FFFFFF";
  this.c2.fillRect(0, 0, this.c.width, this.c.height);


  var lines = crtRoom.elems;

  for (var crtX = 0; crtX < lines.length; crtX++)
  {
    var crtLine = lines[crtX];
    for (var crtY = 0; crtY < crtLine.length; crtY++)
    {
      var crtElement = crtLine[crtY];

      switch (crtElement) {
        case 'fixed':
          this.c2.fillStyle = "#808080";
          this.c2.fillRect(2*this.fieldSize + crtX * this.fieldSize, 2*this.fieldSize + crtY * this.fieldSize, this.fieldSize, this.fieldSize);
          break;
        case 'color':
          this.c2.fillStyle = "#ffff00";
          this.c2.fillRect(2*this.fieldSize + crtX * this.fieldSize, 2*this.fieldSize + crtY * this.fieldSize, this.fieldSize, this.fieldSize);
          break;
        case 'air':
          this.c2.fillStyle = "#ffffff";
          this.c2.fillRect(2*this.fieldSize + crtX * this.fieldSize, 2*this.fieldSize + crtY * this.fieldSize, this.fieldSize, this.fieldSize);
          break;
        case 'diamond':
          this.c2.fillStyle = "#00ff00";
          this.c2.fillRect(2*this.fieldSize + crtX * this.fieldSize, 2*this.fieldSize + crtY * this.fieldSize, this.fieldSize, this.fieldSize);
          break;
        case 'bomb':
          this.c2.fillStyle = "#00ffff";
          this.c2.fillRect(2*this.fieldSize + crtX * this.fieldSize, 2*this.fieldSize + crtY * this.fieldSize, this.fieldSize, this.fieldSize);
          break;
        case 'empty':
          this.c2.fillStyle = "#000000";this.c2.fillRect(2*this.fieldSize + crtX * this.fieldSize, 2*this.fieldSize + crtY * this.fieldSize, this.fieldSize, this.fieldSize);
          break;
      }
    }
  }
  // ### DRAW BORDER ###
  this.c2.fillStyle = "#008080";
  // TOP
  this.c2.fillRect(0, 0, this.c.width, this.fieldSize);
  this.c2.fillRect(0, 0, this.fieldSize, this.c.height);
  this.c2.fillRect(this.c.width - this.fieldSize, 0, this.fieldSize, this.c.height);
  this.c2.fillRect(0, this.c.height - this.fieldSize, this.c.width, this.fieldSize);
  // ### DRAW PLAYER ###
  this.c2.fillStyle = "#0000ff";
  this.c2.fillRect(2*this.fieldSize + crtX * this.fieldSize, 2*this.fieldSize + crtY * this.fieldSize, this.fieldSize, this.fieldSize);

  // ### DRAW MONSTERS ###
  this.c2.fillStyle = "#ff0000";
  for (var i = 0; i < crtRoom.monsters.length; i++)
  {
    this.c2.fillRect(2*this.fieldSize + crtX * this.fieldSize, 2*this.fieldSize + crtY * this.fieldSize, this.fieldSize, this.fieldSize);
  }
}

Engine = function(canvas) {
  window.addEventListener('resize', this.resizeGame, false);
  window.addEventListener('orientationchange', this.resizeGame, false);
  this.resizeGame();/**/

  this.roomGenerator = new RoomGenerator();
  this.isReady = false;
  this.mapVisible = false;
  this.savesVisible = false;
  this.gameState = "pre10000"; // forMrX, forMap, forEve, forTed, forQ1, forQ2, forQ3, forSafe
  this.img = {};
  this.c = canvas;
  this.c2 = canvas.getContext('2d');

  this.rooms = {};
  for (i = 0; i < this.numberOfRooms; i++)
  {
    this.rooms[i] = new Room(this);
    this.rooms[i].generate();
  }

  this.crtRoom = 12;

  this.player = new Player(this);
  this.switchRoom(undefined, this.crtRoom);

  this.registerKeyHandlers();
  var _this = this;
  this.preloadImages(function() {
    _this.setGamestate("running");
    _this.showMap(true);
    //_this.stopTick();
  });
}
Engine.prototype.showMap = function(visible) {
  this.mapVisible = visible;
  if (visible)
  {
    this.setGamestate("start");
    $("#mapcontainer").empty();
    for (var i = 0; i < (this.mapWidth * this.mapWidth); i++) {
      if (i == this.crtRoom)
      {
        var item = $('<div class="mapItemCrt" id="mapItem_'+i+'">' + (i+1) + '</div>');
      } else {
        var item = $('<div class="mapItem" id="mapItem_'+i+'">' + (i+1) + '</div>');
      }
      $("#mapcontainer").append(item);
    }
    $("#map").css("display", "inline");
  } else {
    $("#map").css("display", "none");
    this.setGamestate("running");
  }
}

Engine.prototype.showSaves = function(visible) {
  this.savesVisible = visible;
  var _this = this;
  if (visible) {
    $("#saveGameList").empty();
    var savedGames = this.getSavedGames();
    if (savedGames != undefined) {
      for (var i = 0; i < savedGames.length; i++) {
        var item = savedGames[i];
        var crtItem = $('<div class="button" id="save_'+item.name+'">'+item.name+'<br><canvas id="canvas_'+item.name+'"></canvas></div>');
        $("#saveGameList").append(crtItem);
        crtItem.click(function() {
          var itemName = item.name;
          _this.handleEvent("SAVES");
          _this.loadGame(itemName);
        });
        $("#save_" + item.name).ready(function(){
          new MiniatureDrawer($("#canvas_" + item.name)[0], item).drawMiniature();
        });
      }
    } else {
      var msg = $("<div class='noSavegames'>No save games</div>");
      $("#saveGameList").append(msg);
    }
    $("#savedGames").css("display", "inline");
  } else {
    $("#savedGames").css("display", "none");
  }
}
Engine.prototype.resizeGame = function() {
  var wWidth = $("html").width();
  var wHeight = $("html").height();
  var wRatio = wWidth / wHeight;

  var mWidth = $("#main").width();
  var mHeight = $("#main").height();
  var mRatio = mWidth / mHeight;

  var sWidth = $("#statspanel").width();
  var sHeight = $("#statspanel").height();
  var sRatio = sWidth / sHeight;

  var mnWidth;
  var mnHeight;

  if (wRatio > 1) {
    // Max height
    mnHeight = wHeight - sHeight;
    mnWidth = mnHeight * mRatio;
  } else {
    // Max width
    mnWidth = wWidth;
    mnHeight = (mnWidth / mRatio);
  }

  $("#main").width(mnWidth);
  $("#main").height(mnHeight);
}

Engine.prototype.playSound = function(name) {
  $('#snd_' + name )[0].play();
}

Engine.prototype.handleEvent = function(ev) {
  var _this = this;
  function handleEventRunning(event) {
    switch (event) {
      case "UP":
        if (_this.gameState == "running")
        {
          _this.tryMovePlayer(Directions.UP);
        }
        break;
      case "RIGHT":
        if (_this.gameState == "running")
        {
          _this.tryMovePlayer(Directions.RIGHT);
        }
        break;
      case "LEFT":
        if (_this.gameState == "running")
        {
          _this.tryMovePlayer(Directions.LEFT);
        }
        break;
      case "DOWN":
        if (_this.gameState == "running")
        {
          _this.tryMovePlayer(Directions.DOWN);
        }
        break;
      case "SPACE":
        if (_this.gameState == "running"){
          if (_this.player.bombs > 0) {
            _this.player.bombActivated = !_this.player.bombActivated;
            _this.draw();
          }
        }
        break;
    }
  }

  function handleEventStart(event) {
    switch (event) {
      case "UP":
      case "RIGHT":
      case "LEFT":
      case "DOWN":
      case "SPACE":
        if (_this.mapVisible) {
          _this.showMap(false);
        }
        break;
    }
  }
  if (ev == "SAVES") {
    this.showSaves(!this.savesVisible);
    return;
  }
  if (ev == "MAP") {
    this.showMap(!this.mapVisible);
    return;
  }
  switch (this.gameState) {
    case "running":
      handleEventRunning(ev);
      break;
    case "start":
      handleEventStart(ev);
      break;
  }
}
Engine.prototype.thisRoom = function() {
  return this.rooms[this.crtRoom];
}
Engine.prototype.getThisRoomTile = function(x, y) {
  try {
    return this.thisRoom().elems[x][y];
  } catch (exception) {
    return undefined;
  }
}
Engine.prototype.setThisRoomTile = function(x, y, value) {
  return this.thisRoom().elems[x][y] = value;
}
Engine.prototype.isOnMapBorder = function(where) {
  switch (where) {
    case "TOP":
      return (this.crtRoom < this.mapWidth);
      break;
    case "BOTTOM":
      var lastRowFirstRoom = (this.mapWidth * this.mapWidth) - this.mapWidth;
      return (this.crtRoom > lastRowFirstRoom);
      break;
    case "LEFT":
      return (Math.floor(this.crtRoom / this.mapWidth) == (this.crtRoom / this.mapWidth) );
      break;
    case "RIGHT":
      return (Math.floor((this.crtRoom+1) / this.mapWidth) == ((this.crtRoom+1) / this.mapWidth) );
      break;
  }
}

Engine.prototype.tryMovePlayer = function(direction) {

  var newPos = {
    x: (this.player.position.x + direction.x),
    y: (this.player.position.y + direction.y)
  };
  var crtTile = this.getThisRoomTile(newPos.x,newPos.y);

  if (this.player.bombActivated) {
    if (crtTile == "fixed" || crtTile == "color")
    {
      this.movePlayer(newPos);
      this.playSound("blowup");
      this.player.bombActivated = false;
      this.player.bombs = this.player.bombs - 1;
    }
    this.draw();
    return;
  }
  switch (crtTile) {
    case undefined:
      // We've hit the border. We cannot move!
      // TODO: Exceptions for room switch.
      console.log("Border.");
      // Walk start positions
      if (this.player.position.equals(StartPositions['TOP']) && direction.equals(Directions.UP))
      {
          if(!this.isOnMapBorder("TOP")) {
            console.log ("Go room up");
            this.switchRoom(this.crtRoom, this.crtRoom - this.mapWidth);
          }
          return;
      }
      if (this.player.position.equals(StartPositions['BOTTOM']) && direction.equals(Directions.DOWN))
      {
          if (!this.isOnMapBorder("BOTTOM")) {
            console.log ("Go room down");
            this.switchRoom(this.crtRoom, this.crtRoom + this.mapWidth);
          }
          return;
      }
      if (this.player.position.equals(StartPositions['LEFT']) && direction.equals(Directions.LEFT))
      {
          if (!this.isOnMapBorder("LEFT") ){
            console.log ("Go room left");
            this.switchRoom(this.crtRoom, this.crtRoom - 1);
          }
          return;
      }
      if (this.player.position.equals(StartPositions['RIGHT']) && direction.equals(Directions.RIGHT))
      {
          if (!this.isOnMapBorder("RIGHT")) {
            console.log("Go room right");
            this.switchRoom(this.crtRoom, this.crtRoom + 1);
          }
          return;
      }

      break;
    case "empty":
      // We can move on an empty space.
      this.movePlayer(newPos);
      break;
    case "fixed":
      // Do nothing. We cannot move!
      console.log("Fixed object.");
      break;
    case "color":
      // Okay, we're hitting a color block. Is there one behind or border?
      var behindPos = {
        x: (newPos.x + direction.x),
        y: (newPos.y + direction.y)
      };

      if (this.getThisRoomTile(behindPos.x, behindPos.y) == "empty") {
        // If and only if the space behind is empty, we can move the block by one
        // But check if there's a monster first.
        var isMonster = false;
        var monsters = this.thisRoom().monsters;
        for (var crtMonster = 0; crtMonster < monsters.length; crtMonster++){
          var crtMonsterObj = monsters[crtMonster];
          if (crtMonsterObj.position.equals(behindPos)){
            isMonster = true;
          }
        }
        if (!isMonster) {
          this.setThisRoomTile(behindPos.x,behindPos.y,"color");
          this.movePlayer(newPos);
        }
      } else {
        // Otherwise we can't.
        console.log("Cannot move the block.");
      }

      break;
    case "diamond":
      this.movePlayer(newPos);
      this.playSound("diamond");
      this.increaseScore(150);
      break;
    case "air":
      this.movePlayer(newPos);
      this.playSound("air");
      this.increaseScore(15);
      this.player.oxygen += 50;
      break;
    case "bomb":
      this.movePlayer(newPos);
      this.playSound("bomb");
      this.increaseScore(20);
      this.player.bombs += 3;
      break;
  }

  this.draw();
}
Engine.prototype.increaseScore = function(amount) {
  this.player.score += amount;
  if (this.gameState == "pre10000" && this.player.score >= 10000) {
    this.gameState = "forMrX";

  }
}

Engine.prototype.movePlayer = function(newPos) {
  this.setThisRoomTile(newPos.x,newPos.y,"empty");
  this.player.position = newPos;
  this.playSound("step");
  this.player.oxygen = this.player.oxygen - 1;
  this.checkDeath();
}

Engine.prototype.checkDeath = function() {
  if (this.player.oxygen <= 0) {
    this.endGame();
    return;
  }

  var playerPosUp = {
    x: this.player.position.x,
    y: this.player.position.y - 1
  };
  var playerPosDown = {
    x: this.player.position.x,
    y: this.player.position.y + 1
  };
  var playerPosLeft = {
    x: this.player.position.x - 1,
    y: this.player.position.y
  };
  var playerPosRight = {
    x: this.player.position.x + 1,
    y: this.player.position.y
  }
  var surroundingPos = [playerPosUp, playerPosRight, playerPosDown, playerPosLeft];
  for(var crt = 0; crt < surroundingPos.length; crt++) {
    var crtPos = surroundingPos[crt];
    var monsters = this.thisRoom().monsters;
    for (var crtMonster = 0; crtMonster < monsters.length; crtMonster++) {
      var crtMonsterObj = monsters[crtMonster];
      if (crtMonsterObj.position.equals(crtPos)) {
        this.playerDies();
      }
    }
  }
}

Engine.prototype.playerDies = function() {
  this.drawImage("man_sad", this.player.position.x, this.player.position.y);
  this.player.men = this.player.men - 1;
  if (this.player.men <= 0)
  {
    this.endGame();
  } else {
    this.playSound("die");
    this.player.score = 0;
    this.player.position = getRandomItemValue(StartPositions);
    this.setThisRoomTile(this.player.position.x, this.player.position.y,"empty");
    this.showMap(true);
  }
}

Engine.prototype.setGamestate = function(gameState) {
  if (this.gameState == gameState)
    return;
  this.gameState = gameState;
  switch (gameState) {
    case "running":
      this.startTick();
      break;
    case "start":
      this.stopTick();
      break;
  }
}

Engine.prototype.endGame = function() {
  this.gameState = "ended";
  this.playSound("endgame");
  this.stopTick();
  this.draw();
}

Engine.prototype.registerKeyHandlers = function() {
  this.keyListener = new window.keypress.Listener();
  var _this = this;
  var handleUp = function() {_this.handleEvent('UP'); }
  var handleDown = function() { _this.handleEvent('DOWN'); }
  var handleRight = function() {_this.handleEvent('RIGHT'); }
  var handleLeft = function() { _this.handleEvent('LEFT'); }
  var handleMap = function() { _this.handleEvent('MAP'); }
  var handleSpace = function() { _this.handleEvent('SPACE'); }

  var handleSaves = function() { _this.handleEvent('SAVES');  }

  this.keyListener.simple_combo("w", handleUp);
  this.keyListener.simple_combo("up", handleUp);

  this.keyListener.simple_combo("s", handleDown);
  this.keyListener.simple_combo("down", handleDown)

  this.keyListener.simple_combo("a", handleLeft);
  this.keyListener.simple_combo("left", handleLeft)

  this.keyListener.simple_combo("d", handleRight);
  this.keyListener.simple_combo("right", handleRight);

  this.keyListener.simple_combo("x", handleSpace);
  this.keyListener.simple_combo("space", handleSpace);

  this.keyListener.simple_combo("m", handleMap);
  this.keyListener.simple_combo("tab", handleMap);

  this.keyListener.simple_combo("v", handleSaves);

  $("#savedGamesExit").click(function(){
    _this.handleEvent("SAVES");
  });
  $("#newSave").click(function(){
    var name = prompt("Enter name for save", new Date().toISOString());
    _this.saveGame(name);
  });
}
Engine.prototype.switchRoom = function(oldRoom, newRoom) {
  this.crtRoom = newRoom;
  if (oldRoom)
  {
    difference = newRoom - oldRoom;
    switch (difference)
    {
      case this.mapWidth:
        // We went down
        this.player.position = StartPositions["TOP"];
      break;
      case -(this.mapWidth):
        // We went up
        this.player.position = StartPositions["BOTTOM"];
      break;
      case 1:
        // We went right
        this.player.position = StartPositions["LEFT"];
      break;
      case -1:
        // We went left
        this.player.position = StartPositions["RIGHT"];
      break;
    }
  } else {
    this.player.position = getRandomItemValue(StartPositions);
  }

  this.rooms[this.crtRoom].onEnter();
  this.setThisRoomTile(this.player.position.x, this.player.position.y,"empty");
  $("#playerPos").text(this.player.position.x + ", " + this.player.position.y);
  this.showMap(true);
  this.draw();
}


Engine.prototype.preloadImages = function(callback) {
  var toLoad = [
    "brick_blue",
    "brick_green",
    "brick_purple",
    "brick_red",
    "brick_yellow",
    "diamond_blue",
    "diamond_green",
    "diamond_purple",
    "diamond_red",
    "diamond_yellow",
    "brick_fixed",
    "bomb",
    "eve",
    "man_happy",
    "man_sad",
    "question",
    "mrx",
    "map",
    "o2",
    "monster_blue",
    "monster_red",
    "monster_green",
    "monster_purple",
    "monster_yellow",
    "safe",
    "ted"
  ];

  this.img = new Array()
  _this = this;
  new preLoader(toLoad.map(this.addPath), {
    onProgress: function(img, imageEl, length) {
      var interm = img.substring("rsc/".length);
      var toLoadItem = interm.substring(0, interm.length- (".png".length));
      _this.img[toLoadItem] = imageEl;
    },
    onComplete: function(loaded, errors) {
      this.isReady= true;
      callback();
    }
  });
}

Engine.prototype.initialBombs = 4;
Engine.prototype.initialLives = 5;
Engine.prototype.initialOxygen = 150;
Engine.prototype.maximalOxygen = 500;
Engine.prototype.initialScore = 0;
Engine.prototype.tankSize = 10;

Engine.prototype.leftOffset = 30;
Engine.prototype.rightOffset = 30;
Engine.prototype.topOffset = 30;
Engine.prototype.bottomOffset = 30;
Engine.prototype.numberOfRooms = 24;
Engine.prototype.mapWidth = 5;
Engine.prototype.gameState = '10000'

Engine.prototype.monsterChangeDirectionProb = 0.5;

Engine.prototype.fieldSize = 32;
Engine.prototype.addPath = function (current) {
  return "rsc/"  + current + ".png";
}
Engine.prototype.constructor = Engine;

Engine.prototype.draw = function(){

  if (this.gameState == "ended") {
    this.c2.fillStyle = "#000080";
    var windowWidth = 150;
    var windowHeight = 50;
    var windowMargin = 30;
    this.c2.fillRect(this.c.width / 2 - windowWidth / 2, this.c.height / 2 - windowHeight / 2, windowWidth, windowHeight);
    this.c2.font="20px Source Sans Pro";
    this.c2.fillStyle = "#FFFFFF";
    this.c2.fillText("Game Over!",(this.c.width / 2 - windowWidth / 2) + windowMargin, (this.c.height / 2 - windowHeight / 2) + windowMargin);
    return;
  }
  this.c2.fillStyle = "#AAAAAA";
  this.c2.fillRect(0, 0, this.c.width, this.c.height);

  var crtRoom = this.rooms[this.crtRoom];

  var lines = crtRoom.elems;

  for (var crtX = 0; crtX < lines.length; crtX++)
  {
    var crtLine = lines[crtX];
    for (var crtY = 0; crtY < crtLine.length; crtY++)
    {
      var crtElement = crtLine[crtY];

      switch (crtElement) {
        case 'fixed':
          this.drawImage("brick_fixed", crtX, crtY);
          break;
        case 'color':
          this.drawImage("brick_" + crtRoom.brickColor, crtX, crtY);
          break;
        case 'air':
          this.drawImage("o2", crtX, crtY);
          break;
        case 'diamond':
          this.drawImage("diamond_" + crtRoom.diamondColor, crtX, crtY);
          break;
        case 'bomb':
          this.drawImage("bomb", crtX, crtY);
          break;
        case 'empty':
          this.c2.fillStyle = "#000000";
          this.c2.fillRect(this.leftOffset + Math.round(crtX * this.fieldSize), this.topOffset + crtY * this.fieldSize, Engine.prototype.fieldSize, Engine.prototype.fieldSize);
          break;
      }
    }
  }
  // ### DRAW BORDER ###
  this.c2.fillStyle = "#008080";
  // TOP
  this.c2.fillRect(0, 0, this.c.width / 2 - this.fieldSize / 2, this.fieldSize*.8);
  this.c2.fillRect(this.c.width / 2 + this.fieldSize / 2, 0, this.c.width / 2 - this.fieldSize / 2, this.fieldSize*.8);
  if (this.isOnMapBorder("TOP")) {
    this.c2.fillRect(this.c.width / 2 - this.fieldSize / 2, 0, this.fieldSize, this.fieldSize*.8);
  }

  // BOTTOM
  this.c2.fillRect(0, this.c.height - (this.fieldSize*.8), this.c.width / 2 - this.fieldSize / 2, this.fieldSize*.8);
  this.c2.fillRect(this.c.width / 2 + this.fieldSize / 2, this.c.height - (this.fieldSize*.8), this.c.width / 2 - this.fieldSize / 2, this.fieldSize*.8);
  if (this.isOnMapBorder("BOTTOM")) {
    this.c2.fillRect(this.c.width / 2 - this.fieldSize / 2, this.c.height - (this.fieldSize*.8), this.fieldSize, this.fieldSize*.8);
  }


  // LEFT
  this.c2.fillRect(0, 0, this.fieldSize*.8, this.c.height / 2 - this.fieldSize / 2);
  this.c2.fillRect(0, this.c.height / 2 + this.fieldSize / 2, this.fieldSize*.8, this.c.height / 2 - this.fieldSize / 2);
  if (this.isOnMapBorder("LEFT")) {
    this.c2.fillRect(0, this.c.height / 2 - this.fieldSize / 2, this.fieldSize*.8, this.fieldSize);
  }

  // RIGHT
  this.c2.fillRect(this.c.width - (this.fieldSize*.8), 0, this.fieldSize*.8, this.c.height / 2 - this.fieldSize / 2);
  this.c2.fillRect(this.c.width - (this.fieldSize*.8), this.c.height / 2 + this.fieldSize / 2, this.fieldSize*.8, this.c.height / 2 - this.fieldSize / 2);
  if (this.isOnMapBorder("RIGHT")) {
    this.c2.fillRect(this.c.width - (this.fieldSize*.8), this.c.height / 2 - this.fieldSize / 2, this.fieldSize*.8, this.fieldSize);
  }

  // ### DRAW PLAYER ###
  this.drawImage("man_happy", this.player.position.x, this.player.position.y);
  $("#playerPos").text(this.player.position.x + ", " + this.player.position.y);

  $("#score").text(this.player.score);
  $("#men").text(this.player.men);
  $("#bombs").text(this.player.bombs);

  bigSize = (Math.floor(this.player.oxygen / this.tankSize) * this.tankSize ) / this.maximalOxygen * 100;
  smallSize = (this.player.oxygen % this.tankSize) / this.tankSize * 100;
  $("#oxygen").text(this.player.oxygen);
  $("#airbig").css("width", bigSize + "%");
  $("#airsmall").css("height", smallSize + "%");

  $("#bombActivated").css("opacity", this.player.bombActivated ? 1.0 : 0.0);

  // ### DRAW MONSTERS ###
  for (var i = 0; i < this.thisRoom().monsters.length; i++)
  {
    var crtMonster = this.thisRoom().monsters[i];
    this.drawImage("monster_" + crtRoom.monsterColor, crtMonster.position.x, crtMonster.position.y);
  }
}

Engine.prototype.getSavedGames = function() {

  if (localStorage != undefined && Object.keys(localStorage).length > 0) {
    result = Object.keys(localStorage).map(function(item) {
      return JSON.parse(localStorage[item]);
    });
    return result;
  }
  return undefined;
}


Engine.prototype.saveGame = function(name) {
  var crtRooms = $.extend(true, {}, this.rooms);
  Object.keys(crtRooms).map(function(item) {
    delete crtRooms[item].engine;
  })
  localStorage[name] = JSON.stringify({
    player: this.player,
    rooms: this.rooms,
    crtRoom: this.crtRoom,
    gameState: this.gameState,
    monsters: this.monsters,
    name: name
  });
}

Engine.prototype.loadGame = function(name) {
  var saveObj = JSON.parse(localStorage[name]);
  this.rooms = saveObj.rooms;
  this.gameState = saveObj.gameState;
  var _this = this;
  Object.keys(this.rooms).map(function(item) {
    _this.rooms[item].engine = _this;
    inflateRoom(_this.rooms[item]);
  })
  this.player = saveObj.player;
  this.monsters = saveObj.monsters;
}

Engine.prototype.ready = function() {
  return this.isReady;
}

Engine.prototype.drawImage = function(image, posX, posY)
{
  var imageFull = this.img[image];
  try {
    this.c2.drawImage(imageFull, this.leftOffset + Math.round(posX * this.fieldSize), this.topOffset + posY * this.fieldSize, Engine.prototype.fieldSize, Engine.prototype.fieldSize);
  } catch (error) {

  }
}
Engine.prototype.callID = 0;
Engine.prototype.moveMonsters = function() {
  this.callID++;
  var monsterRemoval = [];
  for (var i = 0; i < this.thisRoom().monsters.length; i++)
  {
    var crtMonster = this.thisRoom().monsters[i];
    var isAnySpaceLeft = false;
    var dirKeys = Object.keys(Directions);
    for (var crtDir = 0; crtDir < dirKeys.length; crtDir++) {
      var crtDirection = Directions[dirKeys[crtDir]];
      var newPos = {
        x: crtMonster.position.x + crtDirection.x,
        y: crtMonster.position.y + crtDirection.y
      }
      if (this.getThisRoomTile(newPos.x, newPos.y) == "empty") {
        isAnySpaceLeft = true;
        break;
      }
    }
    if (isAnySpaceLeft) {
      if (((Date.now() - crtMonster.lastMoved)/1000) > crtMonster.speed ) {
        if (Math.random() <= this.monsterChangeDirectionProb) {
          // Change direction
          crtMonster.direction = getRandomItemValue(Directions);
        }
        var newPos = {
          x: crtMonster.position.x + crtMonster.direction.x,
          y: crtMonster.position.y + crtMonster.direction.y
        }
        var crtTile = this.getThisRoomTile(newPos.x,newPos.y);
        if (crtTile == "empty")
        {
          var isOtherMonsterOnNewPos = false;
          for (var otherM = 0; otherM < this.thisRoom().monsters.length; otherM++) {
            // Exclude current monster
            if (otherM != i) {
              var otherMonster = this.thisRoom().monsters[otherM];
              if (otherMonster.position.equals(newPos)){
                isOtherMonsterOnNewPos = true;
                break;
              }
            }
          }
          if (!isOtherMonsterOnNewPos) {
            crtMonster.position.x = newPos.x;
            crtMonster.position.y = newPos.y;
          };
          this.checkDeath();
          crtMonster.lastMoved = Date.now();
        }
      }
    } else {
      // Monster dies!
      monsterRemoval.push(i);
    }
  }

  for (var i = 0; i < monsterRemoval.length; i++) {
    this.thisRoom().monsters.splice(monsterRemoval[i], 1);
    var posAir = this.thisRoom().getRandomEmptyPosition();
    this.setThisRoomTile(posAir.x, posAir.y, "air");
    this.playSound("killmonster");
  }
}
Engine.prototype.stopTick = function() {
  this.tickRunning = false;
}
Engine.prototype.startTick = function() {
  this.tickRunning = true;
  this.tick();
}

Engine.prototype.tick = function(){
  if (this.tickRunning)
  {
    this.moveMonsters();
    this.draw();
    var _this = this;
    setTimeout(
      function() {
        _this.tick();
      }
    , 20);
  }
}
