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
