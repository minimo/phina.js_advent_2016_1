/*

  phina.js と pixi.ja 連携テスト

*/

var SC_W = 640;
var SC_H = 640;

//テストするスプライトのタイプ "phina" or "pixi"
var testType = "phina";

phina.define('MainScene', {
  superClass: 'phina.display.DisplayScene',
  init: function() {
    this.superInit({width:SC_W, height: SC_H});

    this.phinaLayer = phina.display.DisplayElement().addChildTo(this);
    this.pixiLayer = phina.display.PixiLayer({width: SC_W, height: SC_H}).addChildTo(this);

    var that = this;
    phina.display.Label()
      .setPosition(SC_W*0.5, 20)
      .addChildTo(this)
      .update = function() {
        this.text = "tomapiko: "+ (that.pixiLayer.children.length + that.phinaLayer.children.length);
      }

    //Tomapiko読み込み
    this.finish = false;
    var that = this;
    var url = "tomapiko_ss.png";
    this.texture = phina.asset.Texture();
    this.texture.load(url).then(function() {
      for (var i = 0; i < 10; i++) {
        that.addSprite(testType);
      }
      this.finish = true;
    }.bind(this));
  },

  update: function() {
    if (!this.finish) return;

    var p = app.pointer;
    if (p.getPointing()) {
      for (var i = 0; i < 10; i++) {
        this.addSprite(testType, p);
      }
    }
  },

  addSprite: function(type, position) {
    position = position || {x: SC_W*0.5, y: SC_H*0.5};
    var sp;
    if (type == "phina") {
      sp = phina.display.Sprite(this.texture, 64, 64)
        .addChildTo(this.phinaLayer)
        .setFrameTrimming(192, 128, 192, 64)
        .setFrameIndex(0)
        .setPosition(position.x, position.y);
    } else {
      sp = phina.pixi.Sprite(this.texture, 64, 64)
        .addChildTo(this.pixiLayer)
        .setFrameTrimming(192, 128, 192, 64)
        .setFrameIndex(0)
        .setPosition(position.x, position.y);
    }
    sp.vec = phina.geom.Vector2(Math.randint(-10, 10), Math.randint(-10, 10));
    sp.alpha = Math.randfloat(0.2, 1.0);
    sp.update = function(e) {
      this.frameIndex++;
      this.rotation++;
      this.position.add(this.vec);
      if (this.x < 0 || this.x > SC_W) this.vec.x *= -1;
      if (this.y < 0 || this.y > SC_H) this.vec.y *= -1;
    }
    return sp;
  },
});

phina.main(function() {
  app = phina.game.GameApp({
    startLabel: 'main',
    width: SC_W,
    height: SC_H,
    backgroundColor: "#ccc",
  });
  app.fps = 60;
  app.enableStats();
  app.run();
});

