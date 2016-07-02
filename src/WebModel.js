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








