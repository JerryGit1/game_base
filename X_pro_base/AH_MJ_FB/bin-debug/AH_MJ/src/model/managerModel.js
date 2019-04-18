var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * 创建者 伟大的周鹏斌大王 on 2017/6/19.
 */
var AH_ManagerModel = (function (_super) {
    __extends(AH_ManagerModel, _super);
    function AH_ManagerModel() {
        var _this = _super.call(this) || this;
        _this.currentScene = ""; /*当前场景*/
        /*设置默认场景*/
        _this.currentScene = BaseModel.SCENE_LOAD;
        /*事件侦听*/
        _this.addRadioEvent(BaseModel.PORT_DATA_CONFIG.mainInfo, _this.mainInterface.bind(_this)); //大接口数据侦听
        /*重复登录*/
        _this.addRadioEvent(BaseModel.PORT_DATA_CONFIG.repetitionLogin, _this.repetitionLogin.bind(_this));
        return _this;
    }
    /*初始化配置*/
    AH_ManagerModel.prototype.initConfig = function (stage) {
        this.urlInfoModel = new UrlDataModel(); //url信息
        this.setWebPageBackTips();
        this.setUrlParam();
        this.setStageScaleMode(stage);
    };
    /*开始启动socket连接*/
    AH_ManagerModel.prototype.startWebSocket = function () {
        this.userGroupModel = new UserGroupModel();
        this.gameModel = new GameModel(this.userGroupModel);
        this.hallModel = new HallModel(this.userGroupModel.user1Model, this.urlInfoModel);
        /*侦听服务器连接*/
        BaseModel.getInstance().addEventListener("webSocketOpen", this.webSocketOpen, this);
        //强制刷新 大接口数据
        this.gameModel.addEventListener("getMainInfo", this.getMainInfo, this);
        this.hallModel.addEventListener("getMainInfo", this.getMainInfo, this);
        this.webSocketModel.addEventListener("getMainInfo", this.getMainInfo, this);
        //连接服务器
        this.webSocketModel.startConnect();
    };
    /*webSocket 连接成功*/
    AH_ManagerModel.prototype.webSocketOpen = function () {
        /*主数据*/
        this.getMainInfo(null, true);
        /*发送心跳*/
        this.webSocketModel.heartbeat(); //一开始就调用一次
        setInterval(function () {
            this.webSocketModel.heartbeat();
        }.bind(this), 5000);
    };
    /*主动请求大接口数据*/
    AH_ManagerModel.prototype.getMainInfo = function (e, _isOpenIdLogin) {
        if (_isOpenIdLogin === void 0) { _isOpenIdLogin = false; }
        MyConsole.getInstance().trace("---主动请求大接口数据");
        var openId = this.urlInfoModel.openId, userId, cId = this.urlInfoModel.cId;
        if (!_isOpenIdLogin) {
            openId = null;
            userId = this.hallModel.userModel.userId;
        }
        /*获取大接口数据*/
        this.webSocketModel.getMainInfo(openId, userId, cId, _isOpenIdLogin);
    };
    /*接收到大接口数据 （主动，被动接口）*/
    AH_ManagerModel.prototype.mainInterface = function (info) {
        /*设置用户信息*/
        this.userGroupModel.setSelfBaseInfo(info.currentUser);
        /*判定场景*/
        if (this.userGroupModel.getSelfStatus() == BaseModel.PLAYER_DATING) {
            /*分享房间号码*/
            if (this.urlInfoModel.state && this.urlInfoModel.shareJoining == 1) {
                var roomSn = this.urlInfoModel.state;
                //注销分享房间信息
                this.urlInfoModel.shareJoining = 2;
                //尝试加入房间
                this.hallModel.joinRoom({ data: { roomSn: roomSn } });
            }
            else {
                //玩家在大厅场景
                if (this.currentScene != BaseModel.SCENE_HALL) {
                    this.currentScene = BaseModel.SCENE_HALL;
                    //关闭所有弹窗
                    PopupLayer.getInstance().removePopupViewAll();
                    //切换大厅场景
                    this.dispatchEvent(new egret.Event("addHallScene"));
                }
            }
        }
        else {
            //玩家在游戏场景
            /*更新大厅数据*/
            this.gameModel.updateGameInfo(info); /*更新游戏信息*/
            if (this.currentScene != BaseModel.SCENE_GAME) {
                this.currentScene = BaseModel.SCENE_GAME;
                //初始化其他玩家数据
                this.userGroupModel.initOtherModel();
                //关闭所有弹窗
                PopupLayer.getInstance().removePopupViewAll();
                //切换游戏场景
                this.dispatchEvent(new egret.Event("addGameScene"));
            }
        }
        //统计信息
        AH_statisticService.getInstance().login(this.userGroupModel.user1Model.userId);
    };
    /*重复登录*/
    AH_ManagerModel.prototype.repetitionLogin = function () {
        BaseModel.USER_repetitionLogin = true;
        PopupLayer.getInstance().addHintView("您的账号已经其他地方登录", null, true, "min");
    };
    /*---------------------配置信息------------------------*/
    /*获取url参数配置*/
    AH_ManagerModel.prototype.setUrlParam = function () {
        if (window["AH_param"] && window["AH_param"] != "null") {
            egret.localStorage.setItem("AH_param", window["AH_param"]);
            var data = JSON.parse(decodeURIComponent(window["AH_param"]));
            this.urlInfoModel.setParams(data); /*设置属性*/
        }
        else if (egret.localStorage.getItem("AH_param")) {
            var data = JSON.parse(decodeURIComponent(egret.localStorage.getItem("AH_param")));
            this.urlInfoModel.setParams(data);
        }
        else {
            alert("非法登录");
        }
    };
    /*配置返回按钮点击提示*/
    AH_ManagerModel.prototype.setWebPageBackTips = function () {
        window.history.pushState({
            title: document.title,
            url: ""
        }, document.title, "");
        setTimeout(function () {
            window.addEventListener("popstate", onPushBack, false),
                window.addEventListener("onbeforeunload", onPushBack, false);
            function onPushBack() {
                return window.history.pushState({
                    title: document.title,
                    url: ""
                }, document.title, ""), void alert("如果要退出请点击关闭");
            }
        }, 300);
        /*屏幕旋转刷新*/
        window.onorientationchange = function () {
            window.location.reload(); /*重新加载*/
        };
    };
    /*适配配置*/
    AH_ManagerModel.prototype.setStageScaleMode = function (stage) {
        //设置旋转模式为自动
        stage.stage.orientation = egret.OrientationMode.LANDSCAPE_FLIPPED;
        var ua = navigator.userAgent;
        var isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1; //android终端
        var isiOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        var iPad = (ua.match(/iPad/i) != null) ? true : false; //ipad终端
        var Pad = (ua.match(/Pad/i) != null) ? true : false; //安卓平板终端
        if (isAndroid || isiOS) {
            /*适配*/
            //不是平板
            if (!Pad && !iPad) {
                stage.stage.scaleMode = egret.StageScaleMode.FIXED_WIDTH;
            }
        }
        Main.stageWidth = stage.stage.stageWidth;
        Main.stageHeight = stage.stage.stageHeight;
        //音乐信息缓存
        SoundModel.getLocalStorage();
        MyConsole.getInstance().trace("舞台信息" + "宽：" + Main.stageWidth + "高:" + Main.stageHeight);
        MyConsole.getInstance().trace("一号机版本:" + Main.AH_MJ_version);
        MyConsole.getInstance().trace("当前代号:" + Main.pro_name);
        MyConsole.getInstance().trace("当前版本:" + Main.version);
    };
    return AH_ManagerModel;
}(BaseModel));
__reflect(AH_ManagerModel.prototype, "AH_ManagerModel");
