var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by Duo Nuo on 2017/1/4.
 * 数据加载
 * 资源加载
 */
var AH_LoadLayer = (function (_super) {
    __extends(AH_LoadLayer, _super);
    function AH_LoadLayer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.loadGroupList = [];
        return _this;
    }
    /*-----------------------------------资源加载---------------------------------------*/
    /*加载资源配置文件*/
    AH_LoadLayer.prototype.loadResourceFile = function (backFun) {
        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
        function onConfigComplete() {
            RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, onConfigComplete, this);
            backFun();
        }
    };
    /*加载一组资源----传说中分段加载*/
    AH_LoadLayer.prototype.loadingGroup = function (loadName, loadingType) {
        if (loadingType === void 0) { loadingType = null; }
        this.loadName = loadName;
        MyConsole.getInstance().trace("加载资源组" + loadName, 2);
        for (var i in this.loadGroupList) {
            if (this.loadGroupList[i] == loadName) {
                MyConsole.getInstance().trace("资源组[" + this.loadName + "]已加载过", 2);
                this.onResourceLoadComplete(null);
                return;
            }
        }
        this.loadGroupList.push(loadName); /*加载资源组*/
        if (loadingType) {
            if (this.loadingView)
                MyConsole.getInstance().trace("多线程加载还没做呢");
            this.loadingView = new LoadingUI();
            this.addChild(this.loadingView);
        }
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup(this.loadName);
    };
    //资源组加载过程中
    AH_LoadLayer.prototype.onResourceProgress = function (event) {
        if (this.loadingView) {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    };
    //资源组加载完成
    AH_LoadLayer.prototype.onResourceLoadComplete = function (event) {
        if (event && event.groupName == this.loadName) {
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            if (this.loadingView) {
            }
            MyConsole.getInstance().trace("资源组[" + this.loadName + "]加载完成", 2);
        }
        this.dispatchEvent(new egret.Event("UILoadOk"));
    };
    //资源组加载出错
    AH_LoadLayer.prototype.onItemLoadError = function (event) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    };
    //资源组加载出错
    AH_LoadLayer.prototype.onResourceLoadError = function (event) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    };
    /*-----------------------------------数据加载---------------------------------------*/
    AH_LoadLayer.prototype.addDataLoading = function (type) {
        if (type === void 0) { type = 1; }
        this.removeDataLoading();
        this.loadDataView = new LoadingDataView("玩命加载中...");
        this.addChild(this.loadDataView);
    };
    /**/
    AH_LoadLayer.prototype.removeDataLoading = function () {
        if (this.loadDataView) {
            this.loadDataView.clear();
            this.removeChild(this.loadDataView);
            this.loadDataView = null;
        }
    };
    /*-----------------------------------加载外部资源---------------------------------------*/
    //加载外部图片
    AH_LoadLayer.prototype.loadExternalBit = function (bit, url, backFun) {
        if (backFun === void 0) { backFun = null; }
        RES.getResByUrl(url, function (texture) {
            //将加载完的资源进行显示
            if (bit)
                bit.texture = texture;
            if (backFun)
                backFun(bit);
        }, this, RES.ResourceItem.TYPE_IMAGE);
    };
    //加载外部音效
    AH_LoadLayer.prototype.loadExternalSound = function (url, backFun) {
        if (backFun === void 0) { backFun = null; }
        RES.getResByUrl(url, function (sound) {
            backFun(sound);
        }, this, RES.ResourceItem.TYPE_SOUND);
    };
    //加载外部音效-原生
    AH_LoadLayer.prototype.loadExternalSound_audio = function (url, backFun) {
        if (backFun === void 0) { backFun = null; }
        var sound = document.createElement("audio");
        sound.src = url;
        backFun(sound);
    };
    return AH_LoadLayer;
}(egret.Sprite));
__reflect(AH_LoadLayer.prototype, "AH_LoadLayer");
