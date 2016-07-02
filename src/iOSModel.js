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








