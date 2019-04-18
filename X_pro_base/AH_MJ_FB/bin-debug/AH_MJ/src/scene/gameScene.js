var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * 创建者 伟大的周鹏斌大王 on 2017/6/17.
 *
 * 游戏场景主类
 */
var AH_GameScene = (function (_super) {
    __extends(AH_GameScene, _super);
    function AH_GameScene(model) {
        var _this = _super.call(this, model) || this;
        _this.init();
        return _this;
    }
    /*----------------初始化------------------------------*/
    AH_GameScene.prototype.init = function () {
        /*背景最底层*/
        this.backgroundView = new BackgroundView(this.model.backLayerModel);
        this.addChild(this.backgroundView);
        this.backgroundUpView = new BackgroundUpView(this.model.backLayerModel);
        this.addChild(this.backgroundUpView);
        /*打牌 表情 吃碰杠胡动画层*/
        this.aniView = new Game_playingAniView(this.model);
        this.addChild(this.aniView);
        /*添加事件*/
        //切换准备加入场景
        this.model.addEventListener(BaseModel.GAME_SCENE_prepare + "", this.addPrepareScene, this);
        //切换等待场景
        this.model.addEventListener(BaseModel.GAME_SCENE_waiting + "", this.addWaitScene, this);
        //切换游戏场景
        this.model.addEventListener(BaseModel.GAME_SCENE_playing + "", this.addPlayingScene, this);
        //刷新场景
        this.model.currentScene = BaseModel.GAME_SCENE_cutScene;
        this.model.updateGameInfo();
    };
    /*----------------------场景-----------------------*/
    /*添加准备个场景*/
    AH_GameScene.prototype.addPrepareScene = function () {
        MyConsole.getInstance().trace("游戏内部场景---2切换等待玩家阶段", 2);
        this.clearScene();
        this.prepareScene = new PrepareScene(this.model.backLayerModel);
        this.addChildAt(this.prepareScene, 1);
        this.updateGameView();
        //顯示按鈕
        this.prepareScene.addBtns();
        //隐藏风向
        this.backgroundView.setWindView(false);
    };
    /*添加游戏中打牌个场景*/
    AH_GameScene.prototype.addPlayingScene = function () {
        MyConsole.getInstance().trace("游戏内部场景---2切换打牌阶段", 2);
        this.clearScene();
        /*跑马灯，三遍之后取消*/
        this.backgroundUpView.noticeView.visible = true;
        this.backgroundUpView.noticeView.setTextByTimes(this.model.backLayerModel.userGroupModel.numIdGetUserModel(1).notice, 3);
        this.playingScene = new PlayingScene(this.model.playingModel);
        this.addChildAt(this.playingScene, 1);
        this.updateGameView();
        //风向
        this.backgroundView.setWindView(true);
        //ip冲突
        this.playingScene.ipSameTips();
        //发牌动画
        this.playingScene.startLicensingAnimation();
    };
    /*等待下一局准备场景*/
    AH_GameScene.prototype.addWaitScene = function () {
        MyConsole.getInstance().trace("游戏内部场景---3切换等待下局开始阶段", 2);
        this.clearScene();
        this.waitScene = new WaitScene(this.model.backLayerModel);
        this.addChildAt(this.waitScene, 1);
        this.updateGameView();
        //风向
        this.backgroundView.setWindView(true);
    };
    /*断线重连 统一更新一次数据*/
    AH_GameScene.prototype.updateGameView = function () {
        //数据统一更新视图
        this.model.updateGameInfo();
        //统一更新一次玩家头像信息
        this.model.userGroupModel.updateBaseInfo();
    };
    /*清空场景*/
    AH_GameScene.prototype.clearScene = function () {
        this.removeScene(this.playingScene); /*准备场景*/
        this.removeScene(this.prepareScene); /*打牌场景*/
        this.removeScene(this.waitScene); /*等待场景*/
        this.playingScene = this.prepareScene = this.waitScene = null;
    };
    /*移除一个场景*/
    AH_GameScene.prototype.removeScene = function (scene) {
        if (scene) {
            scene.clear();
            this.removeChild(scene);
            scene = null;
        }
    };
    /*-----------------------解散房间-------------------------*/
    AH_GameScene.prototype.clear = function () {
        _super.prototype.clear.call(this);
        //切换准备加入场景
        this.model.removeEventListener(BaseModel.GAME_SCENE_prepare + "", this.addPrepareScene, this);
        //切换等待场景
        this.model.removeEventListener(BaseModel.GAME_SCENE_waiting + "", this.addWaitScene, this);
        //切换游戏场景
        this.model.removeEventListener(BaseModel.GAME_SCENE_playing + "", this.addPlayingScene, this);
        this.backgroundView.clear();
        this.backgroundUpView.clear();
        this.clearScene();
    };
    return AH_GameScene;
}(BaseScene));
__reflect(AH_GameScene.prototype, "AH_GameScene");
