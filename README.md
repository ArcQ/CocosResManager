# CocosResLoader

CocosResLoader is a module that overrides default preloader function in the cocos2djs opensrc library. It has the following functions:
- Lazy loading of resources to split out the loading large resource libraries
- Easy customization of loading scene and loading bar
- Load with loading bar animation or none(for quick loads)

#Setup
- Download the project
- Create a reference to Resloader/ResLoader.js in your project.json list (under "jsList").

Resloader source files are compiled using browserify + uglify into Resloader/ResLoader.js. ResLoader() is an object that is added to the window. Simply replace the preloader scene in main.js with:
```javascript
var resLoader = new winodw.ResLoader();
var resView = resLoaderTwo.ctrl.view;

cc.director.runScene(resView);


var logoLayer = new LogoLayer();
resView.addChild(logoLayer);
resView.loadingBar = logoLayer.loadingBar;

resLoader.loadResources.call(
  resloader,
  "Init", //key to avoid reloading same resources
  load_resources, //resources you want to load
  true, //set to false if you don't want to show anything during load process, a black sreen will show up
  function(){
    //your code
  }
)
```
Note that for native devices, ResLoader will simply exit since preloading is not required for mobile devices.
