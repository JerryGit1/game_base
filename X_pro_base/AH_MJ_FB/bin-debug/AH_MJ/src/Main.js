var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AH_Main = (function (_super) {
    __extends(AH_Main, _super);
    function AH_Main() {
        var _this = _super.call(this) || this;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    AH_Main.prototype.onAddToStage = function (event) {
        /*数据类*/
        this.model = new ManagerModel();
        this.model.initConfig(this);
        /*-------------初始化层级--------------------*/
        /*游戏层-最底层*/
        this.gameLayer = new BaseView();
        this.addChild(this.gameLayer);
        /*弹框-浮框层*/
        this.addChild(PopupLayer.getInstance());
        /*加载层*/
        this.addChild(LoadLayer.getInstance());
        /*-------------初始化事件--------------------*/
        //大厅场景
        this.model.addEventListener("addHallScene", this.cutScene, this);
        //游戏场景
        this.model.addEventListener("addGameScene", this.cutScene, this);
        //退出游戏
        BaseModel.getInstance().addEventListener("quitGame", this.quitGame, this);
        //抖屏动画
        BaseModel.getInstance().addEventListener("shakeAni", this.shakeAni, this);
        /*-------------启动资源加载--------------------*/
        //加载配置文件
        LoadLayer.getInstance().loadResourceFile(this.cutScene.bind(this, { type: "loading" }));
    };
    /*切换场景*/
    AH_Main.prototype.cutScene = function (e) {
        this.clearScene(); //清空场景
        switch (e.type) {
            case "loading":
                //加载基础资源
                this.subsectionLoadScene("loading", function () {
                    //连接服务器
                    this.model.startWebSocket();
                }.bind(this), 0);
                break;
            case "addHallScene":
                //加载基础资源
                this.subsectionLoadScene("hall", this.addHallScene.bind(this));
                break;
            case "addGameScene":
                this.subsectionLoadScene("game", this.addGameScene.bind(this));
                break;
        }
    };
    /*显示大厅场景*/
    AH_Main.prototype.addHallScene = function () {
        MyConsole.getInstance().trace("显示大厅场景", 3);
        this.hallScene = new HallScene(this.model.hallModel);
        /*属性*/
        /*事件*/
        this.gameLayer.addChild(this.hallScene);
    };
    /*显示游戏场景*/
    AH_Main.prototype.addGameScene = function () {
        MyConsole.getInstance().trace("显示游戏场景", 3);
        this.gameScene = new GameScene(this.model.gameModel);
        /*属性*/
        /*事件*/
        this.gameLayer.addChild(this.gameScene);
    };
    /*清空场景*/
    AH_Main.prototype.clearScene = function () {
        if (this.hallScene) {
            /*移除事件侦听*/
            /*清空内部视图*/
            this.hallScene.clear();
            /*从游戏层移除*/
            this.gameLayer.removeChild(this.hallScene);
            this.hallScene = null;
        }
        if (this.gameScene) {
            this.model.gameModel.currentScene = BaseModel.GAME_SCENE_loading; /*设置游戏场景关闭*/
            /*移除事件侦听*/
            /*清空内部视图*/
            this.gameScene.clear();
            /*从游戏层移除*/
            this.gameLayer.removeChild(this.gameScene);
            this.gameScene = null;
        }
    };
    /*分段加载资源*/
    AH_Main.prototype.subsectionLoadScene = function (name, backFun, loadingType) {
        if (loadingType === void 0) { loadingType = 1; }
        LoadLayer.getInstance().addEventListener("UILoadOk", UILoadOk, this);
        //加载load基础资源
        LoadLayer.getInstance().loadingGroup(name, loadingType);
        function UILoadOk() {
            LoadLayer.getInstance().removeEventListener("UILoadOk", UILoadOk, this);
            backFun();
        }
    };
    /*退出游戏*/
    AH_Main.prototype.quitGame = function () {
        WeiXinJSSDK.getInstance().closeWindow();
        window.opener = null;
        window.open('', '_self');
        window.close();
    };
    /*抖屏动画*/
    AH_Main.prototype.shakeAni = function () {
        egret.Tween.removeTweens(this);
        var X = this.x;
        var Y = this.y;
        egret.Tween.get(this).to({ x: X - 5 }, 60).to({ x: X }, 60).to({ y: Y + 5 }, 60).to({ y: Y }, 30);
    };
    return AH_Main;
}(egret.DisplayObjectContainer));
AH_Main.AH_MJ_version = "2.0.1"; /*一号机母包版本号*/
__reflect(AH_Main.prototype, "AH_Main");
