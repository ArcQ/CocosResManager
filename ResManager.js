(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//LoadSceneCtrl serves as a replacement of the default preloader function (CCLoaderScene.js)
//Scenes are used as controllers because running scenes have access to methods that the controller needs, this contradicts with MVC slightly
var WebModel = require('./WebModel');
var iOSModel = require('./iOSModel');
var ResLoaderView = require('./ResLoaderView');
var TextureDict = require('./TextureDict');

var ResLoaderCtrl = function(textureDict){
    this.view = new ResLoaderView();
    this.model = null ;
    this.delayedCb = null;
    this.isShowAnimation = null;
    this.model = (cc.sys.os == "iOS") ? new iOSModel(): new WebModel();
    this.model.textureDict = textureDict;
};

ResLoaderCtrl.prototype.loadResources = function(key,resources,isShowAnimation,cb){
    //native machines don't need preload function, show layer for a few seconds instead
    console.log('loadResources');
    this.isShowAnimation = isShowAnimation;
    if(this.isShowAnimation === true){
        console.log('this.isShowAnimation');
        this.view.delayedCb = cb;
        this.view.startUpdate.call(this.view);
    }
    else{
        console.log('set this.delayedCb');
        this.delayedCb = cb;
    }

    var self = this;
    console.log(this.view.percentResLoaded);

    //,this.resLoadUpdate,this.finishLoad
    var self = this;
    console.log(this.model.load);
    console.log('model');
    this.model.load.call(self.model,self,key,resources,self.resLoadUpdate,self.finishLoad);
};

ResLoaderCtrl.prototype.resLoadUpdate = function(percentLoaded){
    this.view.percentResLoaded = percentLoaded;
};

ResLoaderCtrl.prototype.finishLoad= function(){
            console.log('finish load');

    if(this.isShowAnimation === true){
        //delay the callback until after the loadingAnimation loads to 100 through update();
        this.view.percentResLoaded = 100;

    }
    else{
        console.log('call this.delayedCb');
        this.delayedCb();
    }
};

//built in cocos2d complete cache refresh, (incase of memory issues)
ResLoaderCtrl.prototype.removeAllTextures = function(){
    cc.textureCache.removeAllTextures();
};

//refresh cache only for certain resource sets
ResLoaderCtrl.prototype.removeResTextures = function(resources){
    this.model.removeResTextures(resources);
};

//refresh cache only for certain resource sets
ResLoaderCtrl.prototype.removeResTexturesByKey = function(key){
    this.model.removeResTextures(key);
};

module.exports = ResLoaderCtrl;








},{"./ResLoaderView":2,"./TextureDict":4,"./WebModel":5,"./iOSModel":6}],2:[function(require,module,exports){
//ResLoaderView is a scene that gets added
//you can add customer layers to this making sure you pass a loading bar to this class
var ResLoaderView = cc.Scene.extend({
    percentResLoaded:0,
    percentBarLoaded:0,
    loadingBar:null,
    delayedCb:null,
    onEnter: function () {
        this._super();
    },
    update: function(dt){
        this.setLoadingBarPercentage.call(this,dt);
    }
});

ResLoaderView.prototype.startUpdate = function(){
    this.scheduleUpdate();
};

ResLoaderView.prototype.skipLoad = function(cb){
    this.scheduleOnce(
        function(){
            cb();
        },
        3.0,
        "key"
    );
};

ResLoaderView.prototype.setLoadingBarPercentage = function(dt) {
            console.log(this.percentBarLoaded);

    if (this.percentBarLoaded < this.percentResLoaded){
        this.percentBarLoaded = this.percentBarLoaded +dt/2*100;
        this.loadingBar.setPercentage(this.percentBarLoaded);
    }

    if(this.percentBarLoaded >= 100){
        this.unscheduleUpdate();
        this.delayedCb();
    }
};

module.exports = ResLoaderView;










},{}],3:[function(require,module,exports){
var ResLoaderCtrl = require('./ResLoaderCtrl');
var TextureDict = require('./TextureDict.js'); 
var ResManager = {
    loaderCtrl:null,
    textureDict:null,
    loadedKeysArr:null
};

//private
ResManager.loadedKeysArr = [];
ResManager.textureDict = new TextureDict();

ResManager.loaderCtrl = new ResLoaderCtrl(ResManager.textureDict);

ResManager.addKey = function(key){
    ResManager.loadedKeysArr[ResManager.loadedKeysArr.length] = key;
};

ResManager.isKeyAdded = function(key){
    for( var i = 0; i < ResManager.loadedKeysArr.length; i++ ) {
        if (key == ResManager.loadedKeysArr[i]){
            return true;
        }
    }
    return false;
};

//public

//ResLoader does not track what resources have been loaded or deleted, so avoid loading assets of the same name without removing it first
ResManager.loadResources = function(key,resources,isShowAnimation,cb){
    if(!ResManager.isKeyAdded(key)){
        ResManager.addKey(key,resources);
        ResManager.loaderCtrl.loadResources(key,resources,isShowAnimation,cb);
    }
};

ResManager.resetTextureDict = function(){
    ResMnager.textureDict.removeAllResources();
    ResManger.textureDict = null;
    ResManager.textureDict = new TextureDict();
};

window.ResManager = ResManager;
module.exports = ResManager;

},{"./ResLoaderCtrl":1,"./TextureDict.js":4}],4:[function(require,module,exports){
var TextureDict = function(){};
TextureDict.prototype = new window.dLinkedList();
//WebModel Only
TextureDict.prototype.updateTextureDict = function(key,resources){
    var listObj;
    for(var i; i< resources.length;i++){
        listObj = {name:resName,key:key,texture:texture};
        this.push(listObj);
    }
}

TextureDict.prototype.getTexture = function(resName){
    var findByName = function(node){
        return (node.obj.name == resName);
    };
    var node = this.findFirst(findByName);
    return node.obj.texture;
};

TextureDict.prototype.removeResTextures = function(resources){
    for(var i = 0; i < resources.length; i++){
        var name = this.getNameFromResObj(resources[i])
        this.removeResTextureByName(name);
    }
};

TextureDict.prototype.removeResTexturesByName = function(name){
    var findByName = function(node){
        return (node.obj.name == resName);
    };
    var node = this.findFirst(findByName);
    cc.TextureCache.getInstance().removeTexture(node.obj.texture);
    this.remove(node);
};

TextureDict.prototype.getSprite = function(resStr){
    console.log(resStr);
    var name = this.getNameFromResObj(resStr);
    var findByName = function(node){
        //console.log("testOBJ");
        //console.log(node);
        return (node.obj.name == name);
    };
    console.log(name);
    console.log('this.findFirst');
    console.log(this);
    this.findFirst = this.findFirst.bind(this);
    var node = this.findFirst(findByName);
    return (cc.Sprite.createWithTexture(node.obj.texture));
};

TextureDict.prototype.removeAllResources = function(){
    cc.TextureCache.getInstance().removeAllTextures();
};

TextureDict.prototype.getNameFromResObj = function(str){
    if(str){
        var resName;
        var arr = str.split("/");
        arr = arr[arr.length-1].split(".");
        return arr[0];
    }
    else{
        console.log("Err: Res String cannot be undefined in getSprite()");
    }
}

module.exports = TextureDict;

},{}],5:[function(require,module,exports){
var WebModel = cc.Scene.extend({
    percentResLoaded:0,
    delayedCb:null,
    textureDict:null
});

WebModel.prototype.load = function(ctrl,key,resources,onUpdate,onFinish){
    var model = this;
    console.log('web loading');
    cc.loader.load(
        resources,  
        //callback from actual loading process
        function (result, count, loadedCount) {
            var percentLoaded = (loadedCount / count * 100) | 0;
            percentLoaded = Math.min(percentLoaded, 100);
            onUpdate.call(ctrl,percentLoaded);
        },
        //tell ctrl resources are loaded
        function () {
            model.updateTextureDict(key,resources);
            onFinish.call(ctrl);
        }
    );
};

WebModel.prototype.updateTextureDict = function(key,resources){
    var listObj;
    console.log(resources);
    console.log(resources.length);
    for(var i = 0; i< resources.length;i++){
        console.log('texture');
        console.log(cc);
        var texture = cc.textureCache.textureForKey(resources[i]);
        console.log(texture);
        var resName = this.getNameFromResObj(resources[i]);
        listObj = {name:resName,key:key,texture:texture};
        console.log(listObj);
        console.log('listObj');
        this.textureDict.push(listObj);
        console.log(this.textureDict.head);
    }
}

WebModel.prototype.getTexture = function(resName){
    var sprite = cc.Sprite.create(resName);
    return sprite.getTexture();
};

WebModel.prototype.removeResTextures = function(resources){

  for(var i = 0; i < resources.length; i++){
      var texture = this.getTexture(resources[i]);
      
      cc.TextureCache.getInstance().removeTexture(texture);
      
      var findName = this.getNameFromResObj(resources[i]);
      
      var findCondition = function(node){
        if(node.obj.name == findName){
            return true;
        }
        return false;
      };
      
      this.textureDict.findFirst()
  }
};

WebModel.prototype.removeResTexturesByKey = function(key){
    var findByKey = function(key){
    return (node.obj.key == resName);
  };

  for(var i = 0; i < resources.length; i++){
    var node = this.textureDict.findFirst(findByName);
    cc.TextureCache.getInstance().removeTexture(node.obj.texture);
  }
};

WebModel.prototype.getNameFromResObj = function(str){
  var resName;
  var arr = str.split("/");
  arr = arr[arr.length-1].split(".");
  return arr[0];
};

module.exports = WebModel;









},{}],6:[function(require,module,exports){
var iOSModel = function(){
    this.percentResLoaded = 0;
    this.delayedCb = 0;
    this.currentTextureCache = [];
    this.textureDict = null;
};

iOSModel.prototype.load = function(ctrl,key,resources,onUpdate,onFinish){

    for(var i = 0; i < resources.length; i++){
        console.log('resources[i]' + resources[i]);
        var resName = this.getNameFromResObj(resources[i]);
        console.log("resName: "+ resName);
        var texture = cc.UIImageToTextureConverter.create(resName);     
        var listObj = {name:resName,key:key,texture:texture};
        this.textureDict.push(listObj);
    }
    onFinish.call(ctrl);

};

iOSModel.prototype.getNameFromResObj = function(str){
    var resName;
    var arr = str.split("/");
    arr = arr[arr.length-1].split(".");
    return arr[0];
}

module.exports = iOSModel;









},{}]},{},[3])


//# sourceMappingURL=src/maps/ResManager.js.map
