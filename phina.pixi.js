phina.pixi = phina.pixi || {};

phina.define('phina.display.PixiLayer', {
  superClass: 'phina.display.Layer',

  stage: null,
  renderer: null,

  /** 子供を 自分のCanvasRenderer で描画するか */
  renderChildBySelf: true,

  init: function(options) {
    this.superInit();
    options = (options || {}).$safe({
      width: 640,
      height: 640
    });

    this.stage = new PIXI.Container();
    this.renderer = PIXI.autoDetectRenderer(options.width, options.height, {transparent: true});

    this.on('enterframe', function() {
      this.renderer.render(this.stage);
    });
  },

  draw: function(canvas) {
    var domElement = this.renderer.view;
    canvas.context.drawImage(domElement, 0, 0, domElement.width, domElement.height);
  },

  addChild: function(child){
    if (child.pixiObject) {
      this.stage.addChild(child.pixiObject);
    }
    return phina.display.Layer.prototype.addChild.apply(this, arguments);
  },

  removeChild: function(child){
    if (child.pixiObject) {
      this.stage.removeChild(child.pixiObject);
    }
    return phina.display.Layer.prototype.removeChild.apply(this, arguments);
  }
});

phina.define('phina.pixi.Sprite', {
  superClass: 'phina.display.Sprite',

  pixiObject: null,

  init: function(image, width, height) {
    this.superInit(image, width, height);

    this.pixiObject = new PIXI.Sprite.fromImage(this.image.src);
    this.pixiObject.anchor.set(0.5, 0.5);

    // pixi.jsの仕様かバクかわからない現象回避
    this.pixiObject.texture.baseTexture.width = this.image.domElement.width;
    this.pixiObject.texture.baseTexture.height = this.image.domElement.height;

    this.on('enterframe', function(e) {
      // Elementと必要な情報を同期
      this.pixiObject.position.set(this.x, this.y);
      this.pixiObject.rotation = this.rotation.toRadian();
      this.pixiObject.scale.set(this.scaleX, this.scaleY);
      this.pixiObject.anchor.set(this.originX, this.originY);
      this.pixiObject.alpha = this.alpha;
    });
  },

  setFrameIndex: function(index, width, height) {
    phina.display.Sprite.prototype.setFrameIndex.apply(this, arguments);
    this.pixiObject.texture.frame = new PIXI.Rectangle(this.srcRect.x, this.srcRect.y, this.srcRect.width, this.srcRect.height);
    return this;
  },

  setImage: function(newImage, width, height) {
    this._image = newImage;
    this.pixiObject = new PIXI.Sprite.fromImage(newImage.src);
    this.pixiObject.texture.baseTexture.width = this.image.domElement.width;
    this.pixiObject.texture.baseTexture.height = this.image.domElement.height;
    this.pixiObject.texture.frame = new PIXI.Rectangle(this.srcRect.x, this.srcRect.y, this.srcRect.width, this.srcRect.height);
    return this;
  },

  setPosition: function(x, y) {
    this.pixiObject.position.set(x, y);
    return phina.display.Sprite.prototype.setPosition.apply(this, arguments);
  },

  setOrigin: function(x, y) {
    this.pixiObject.anchor.set(x, y);
    return phina.display.Sprite.prototype.setOrigin.apply(this, arguments);
  },

  setScale: function(x, y) {
    y = y || x;
    this.pixiObject.scale.set(x, y);
    return phina.display.Sprite.prototype.setOrigin.apply(this, arguments);
  },
});
