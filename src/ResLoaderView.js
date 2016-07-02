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









