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
