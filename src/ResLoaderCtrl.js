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







