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
 */
var AH_GameModel = (function (_super) {
    __extends(AH_GameModel, _super);
    function AH_GameModel(userGroupModel) {
        var _this = _super.call(this) || this;
        /*当前场景*/
        _this.currentScene = -1;
        _this.currentScene = BaseModel.GAME_SCENE_loading; /*设置游戏场景关闭*/
        _this.userGroupModel = userGroupModel;
        _this.roomInfoModel = new Game_RoomInfoModel();
        _this.backLayerModel = new Game_backLayerModel(_this.roomInfoModel, _this.userGroupModel);
        _this.playingModel = new Game_playingModel(_this.roomInfoModel, _this.userGroupModel);
        /*---------------------接收-------------------*/
        //改变玩家游戏中状态
        _this.playingModel.addEventListener("changePlayerStatus", _this.updatePlayerStatus, _this);
        //接收 表情文字语音
        _this.addRadioEvent(BaseModel.PORT_DATA_CONFIG.game_chatAni, _this.updatePlayerChatStatus.bind(_this));
        //接收 解散所有玩家实时操作信息
        _this.addRadioEvent(BaseModel.PORT_DATA_CONFIG.game_dissolveRoom, _this.dissolveRoomAgree.bind(_this));
        _this.addRadioEvent(BaseModel.PORT_DATA_CONFIG.game_dissolveRoomAgree, _this.dissolveRoomAgree.bind(_this));
        //接收 解散房间最终结果消息
        _this.addRadioEvent(BaseModel.PORT_DATA_CONFIG.game_quitRoom, _this.dissolveRoomResult.bind(_this));
        //接收 小结算推送
        _this.addRadioEvent(BaseModel.PORT_DATA_CONFIG.game_smallSettlement, _this.smallSettlement.bind(_this));
        //接收大结算推送
        _this.addRadioEvent(BaseModel.PORT_DATA_CONFIG.game_bigSettlement, _this.bigSettlement.bind(_this));
        //接受被踢提示
        _this.addRadioEvent(BaseModel.PORT_DATA_CONFIG.game_beRemovedPlayer, _this.removePlayerResult.bind(_this));
        //动作ID出错
        _this.addRadioEvent(BaseModel.PORT_DATA_CONFIG.game_actionIDError, _this.updateMainInfo.bind(_this));
        /*---------------------发起-------------------*/
        //发起 发送表情
        BaseModel.getInstance().addEventListener("changeChatStatus", _this.sendPlayerChatStatus, _this);
        //发起----解散房间
        BaseModel.getInstance().addEventListener("sponsorGameKillRoom", _this.sponsorGameKillRoom, _this);
        //点击大小结算界面确认按钮
        BaseModel.getInstance().addEventListener("settlement_waitOk", _this.settlement_waitOk, _this);
        //发起 同意或拒绝解散房间
        BaseModel.getInstance().addEventListener("agreeDissolveRoom", _this.agreeDissovleRoom, _this);
        //发起 解散房间成功 发起大结算
        BaseModel.getInstance().addEventListener("sponsorBigSettlement", _this.sponsorBigSettlement, _this);
        /*大结算 分享*/
        BaseModel.getInstance().addEventListener("settlementShare", _this.settlementShare, _this);
        /*等待开局阶段 进入游戏发起准备成功*/
        BaseModel.getInstance().addEventListener("settlementWaitOk", _this.settlementWaitOk, _this);
        return _this;
    }
    AH_GameModel.prototype.updateGameInfo = function (info) {
        if (info === void 0) { info = null; }
        if (!info)
            info = this.linshiData; //没办法 被动刷新
        var status = Number(info.roomInfo.status);
        this.judgeSceneStatus(status); //判断场景状态
        switch (this.currentScene) {
            case BaseModel.GAME_SCENE_loading:
                //保存数据
                this.linshiData = info;
                //開局初始化
                this.newGameInit();
                //更新房间信息
                this.updateRoomInfo(info.roomInfo);
                break;
            case BaseModel.GAME_SCENE_cutScene:
                MyConsole.getInstance().trace("开始切换游戏内部场景");
                //保存数据
                this.linshiData = info;
                //更新房间信息
                this.updateRoomInfo(info.roomInfo);
                //播放背景音效
                SoundModel.playBackSound("g_bg_sound");
                //開始切换场景
                this.judgeCutScene(status);
                //zpb测试代碼
                this.webSocketModel.createRoomOk(this.roomInfoModel.roomSn);
                break;
            case BaseModel.GAME_SCENE_prepare:
                //保存数据
                this.linshiData = info;
                //是否需要切换场景
                if (!this.judgeCutScene(status)) {
                    //更新房间信息
                    this.updateRoomInfo(info.roomInfo);
                    //更新玩家基础信息
                    this.backLayerModel.updatePlayerInfo(info.anotherUsers);
                    //房主 等待4人凑齐弹出 开局按钮
                    this.userGroupModel.playerTogetherInfo();
                }
                break;
            case BaseModel.GAME_SCENE_playing:
                //保存数据
                this.linshiData = info;
                //是否需要切换场景
                if (!this.judgeCutScene(status)) {
                    //更新房间信息
                    this.updateRoomInfo(info.roomInfo);
                    //更新玩家基础信息
                    this.backLayerModel.updatePlayerInfo(info.anotherUsers);
                    //更新玩家牌信息
                    this.playingModel.updatePlayerInfo();
                    //解散房间信息
                    this.setDissolveRoom(info.roomInfo.dissolveRoom);
                    //测试
                    if (this.userGroupModel.user1Model.zhuang) {
                        //測試更新牌
                        egret["AH_setSystemSendCard"] = this.webSocketModel.setSystemSendCard.bind(this.webSocketModel);
                        //更新测试页面房间号
                        this.webSocketModel.systemSendCardOk(this.roomInfoModel.roomSn, this.userGroupModel.user1Model.position);
                    }
                    else {
                        egret["AH_setSystemSendCard"] = null;
                    }
                }
                break;
            case BaseModel.GAME_SCENE_waiting:
                //保存数据
                this.linshiData = info;
                //是否需要切换场景
                if (!this.judgeCutScene(status)) {
                    //更新房间信息
                    this.updateRoomInfo(info.roomInfo);
                    //更新玩家基础信息
                    this.backLayerModel.updatePlayerInfo(info.anotherUsers);
                    //清理玩家脏数据
                    this.userGroupModel.initUserCardInfo();
                    //解散房间信息
                    this.setDissolveRoom(info.roomInfo.dissolveRoom);
                }
                break;
            default:
                MyConsole.getInstance().trace("游戏场景-没有此类型场景" + this.currentScene, 0);
                break;
        }
    };
    /*判断场景状态是否合法*/
    AH_GameModel.prototype.judgeSceneStatus = function (status) {
        switch (status) {
            case BaseModel.GAME_SCENE_loading:
                break;
            case BaseModel.GAME_SCENE_cutScene:
                break;
            case BaseModel.GAME_SCENE_prepare:
                MyConsole.getInstance().trace("要刷新的场景是 等待玩家凑齐开局中");
                break;
            case BaseModel.GAME_SCENE_playing:
                MyConsole.getInstance().trace("要刷新的场景是 游戏打牌过程中");
                //this.updateMainInfoModel.resetTimer(UpdateMainInfoModel.playingMaxNum);
                break;
            case BaseModel.GAME_SCENE_waiting:
                MyConsole.getInstance().trace("要刷新的场景是 准备下一局开始中");
                break;
            default:
                MyConsole.getInstance().trace("要刷新的场景是-不存在" + status, 0);
                break;
        }
    };
    /*开局初始化*/
    AH_GameModel.prototype.newGameInit = function () {
        this.roomInfoModel.initData();
    };
    /*切换场景判断*/
    AH_GameModel.prototype.judgeCutScene = function (status) {
        /*切换场景*/
        if (this.currentScene != Number(status)) {
            this.currentScene = Number(status);
            this.dispatchEvent(new egret.Event(this.currentScene + ""));
            return true;
        }
        return false;
    };
    /*解散房间处理*/
    AH_GameModel.prototype.setDissolveRoom = function (data) {
        if (data && data.othersAgree) {
            //填充玩家信息
            this.userGroupModel.setSettlementUserInfo(data.othersAgree);
            //填充发起人信息
            var userModel = this.userGroupModel.userIdGetUserModel(data.userId);
            data["userName"] = userModel.openName;
            data["userImg"] = userModel.openImg;
            //更新解散房间信息
            this.roomInfoModel.updateKillRoomInfo(data, this.userGroupModel.user1Model.userId);
        }
    };
    /*-----------------------------大小结算------------------*/
    /*判断是否荒庄*/
    AH_GameModel.prototype.checkIsHuang = function (info) {
        var isHuang = true;
        for (var i in info.userInfos) {
            if (info.userInfos[i].winInfo) {
                isHuang = false;
            }
        }
        info["isHuang"] = isHuang;
    };
    /*判断当前用户小结算是否赢了*/
    AH_GameModel.prototype.checkSmallSettleIsWin = function (info) {
        var currentUserWin = false;
        var selfUserId = this.userGroupModel.user1Model.userId;
        for (var i in info.userInfos) {
            if (info.userInfos[i].userId == selfUserId) {
                currentUserWin = info.userInfos[i].isWin;
            }
        }
        info["currentUserWin"] = currentUserWin;
        info["currentId"] = selfUserId;
    };
    /*小结算-推送*/
    AH_GameModel.prototype.smallSettlement = function (info) {
        if (this.currentScene == BaseModel.GAME_SCENE_playing) {
            if (info && info.userInfos) {
                var huUser;
                /*设置所有玩家状态*/
                this.updatePlayerStatus({ data: { type: "settlement" } });
                this.checkIsHuang(info);
                this.checkSmallSettleIsWin(info);
                /*填充数据*/
                var data = this.userGroupModel.setSettlementUserInfo(info.userInfos);
                huUser = data[0];
                info.userInfos = data[1];
                /*更新剩余局数*/
                this.roomInfoModel.lastNum = Number(info.lastNum);
                MyConsole.getInstance().trace("剩余圈数" + this.roomInfoModel.lastNum);
                /*小结算要播放胡的动画*/
                if (huUser && huUser.userId)
                    this.playingModel.cpgMessage(huUser);
                /*玩家游戏信息初始化*/
                this.userGroupModel.initUserCardInfo();
                /*最新出牌信息初始化*/
                this.roomInfoModel.initLastCardModel();
                /*等待 2秒出现弹窗*/
                setTimeout(function () {
                    /*处理数据*/
                    PopupLayer.getInstance().addSmallSettleView(info.userInfos, info.isHuang, info.currentUserWin, info.currentId);
                }, 2000);
            }
        }
        else {
            MyConsole.getInstance().trace("重大失误 小结算场景 不对" + this.currentScene, 0);
        }
    };
    /*大结算-推送*/
    AH_GameModel.prototype.bigSettlement = function (info) {
        /*处理数据 正常情况下是在等待状态大结算 如果解散房间状态下的话 大结算是在游戏中*/
        if (this.currentScene == BaseModel.GAME_SCENE_waiting || this.currentScene == BaseModel.GAME_SCENE_playing) {
            if (info) {
                /*设置所有玩家状态*/
                this.updatePlayerStatus({ data: { type: "settlement" } });
                /*填充数据*/
                for (var i in info) {
                    var userModel = this.userGroupModel.userIdGetUserModel(info[i].userId);
                    info[i]["userName"] = userModel.openName;
                    info[i]["userImg"] = userModel.openImg;
                }
                /*处理数据*/
                PopupLayer.getInstance().addMaxSettleView(info, this.userGroupModel.user1Model.userId);
            }
            else {
                MyConsole.getInstance().trace("重大失误 大结算场景 没数据", 0);
            }
        }
        else {
            MyConsole.getInstance().trace("重大失误 大结算场景 不对" + this.currentScene, 0);
        }
    };
    /*小结算大结算 完成 点击确认按钮的处理*/
    AH_GameModel.prototype.settlement_waitOk = function (e) {
        var type = e.data;
        if (type == "small") {
            //小结算准备ok
            if (this.roomInfoModel.lastNum < 0) {
                this.sponsorBigSettlement();
            }
            else {
                //发起准备成功接口
                this.settlementWaitOk();
            }
        }
        else {
            //大结算准备ok 发动大接口 返回大厅
            this.updateMainInfo();
        }
    };
    /*小结算完毕发起准备成功*/
    AH_GameModel.prototype.settlementWaitOk = function () {
        //发起准备成功接口
        this.webSocketModel.settlementWaitOk({
            roomSn: this.roomInfoModel.roomSn,
            userId: this.userGroupModel.user1Model.userId
        });
    };
    /*发起 大结算*/
    AH_GameModel.prototype.sponsorBigSettlement = function () {
        //发起大结算
        this.webSocketModel.bigSettlement({
            roomSn: this.roomInfoModel.roomSn
        });
    };
    /*大结算分享按钮*/
    AH_GameModel.prototype.settlementShare = function (e) {
        var userList = e.data;
        WeiXinJSSDK.getInstance().settlementShare(this.roomInfoModel.roomSn, userList);
    };
    /*----------------------------数据更新----------------------*/
    //scene调用--刷新场景
    AH_GameModel.prototype.updateSceneInfo = function () {
        this.dispatchEvent(new egret.Event(this.currentScene + ""));
    };
    /*更新房间信息*/
    AH_GameModel.prototype.updateRoomInfo = function (info) {
        /*设置基础信息*/
        this.roomInfoModel.setParams(info);
        /*设置最新出牌信息*/
        this.roomInfoModel.setNewPlayHandUserInfo(info.lastPai, info.lastUserId);
        //设置分享
        var totalNum = this.roomInfoModel.totalNum;
        var maxScore = this.roomInfoModel.maxScore;
        WeiXinJSSDK.getInstance().gameShare(this.roomInfoModel.roomSn, totalNum, maxScore, this.roomInfoModel.openName);
    };
    /*玩家出牌 和 系统发牌时更新玩家状态*/
    AH_GameModel.prototype.updatePlayerStatus = function (e) {
        var info = e.data;
        var userModel, type = info.type, userId = info.userId;
        if (type == "systemSendHand") {
            for (var i = 1; i <= 4; i++) {
                userModel = this.userGroupModel.numIdGetUserModel(i);
                if (userModel.userId == Number(userId)) {
                    //当前用户为出牌状态
                    userModel.playStatus = BaseModel.PLAYER_CHU;
                }
                else {
                    //其他人等待状态
                    userModel.playStatus = BaseModel.PLAYER_WAIT;
                }
            }
        }
        else if (type == "userPlayHand") {
            for (var i = 1; i <= 4; i++) {
                userModel = this.userGroupModel.numIdGetUserModel(i);
                //所有人都为等待状态
                userModel.playStatus = BaseModel.PLAYER_WAIT;
            }
        }
        else if (type == "settlement") {
            for (var i = 1; i <= 4; i++) {
                userModel = this.userGroupModel.numIdGetUserModel(i);
                //所有人都为等待状态
                userModel.playStatus = BaseModel.PLAYER_WAIT;
            }
        }
        //更新风向
        this.backLayerModel.updateClock();
    };
    //接收-播放玩家聊天表情文字语音
    AH_GameModel.prototype.updatePlayerChatStatus = function (data) {
        if (this.currentScene != BaseModel.GAME_SCENE_loading) {
            if (data && data.userId) {
                var model = this.userGroupModel.userIdGetUserModel(data.userId);
                data.point = this.backLayerModel.headPos[model.num_id - 1];
                model.dispatchEventWith(BaseModel.GAME_CHANGE_VIEW_chatStatus, false, data);
            }
            else {
                MyConsole.getInstance().trace("重大错误，表情数据为空", 0);
            }
        }
        else {
            MyConsole.getInstance().trace("当前状态，无法显示表情", 0);
        }
    };
    //玩家发起聊天表情文字语音
    AH_GameModel.prototype.sendPlayerChatStatus = function (e) {
        var current = egret.getTimer();
        if (current - this.backLayerModel.lastChatTime >= 2000) {
            this.backLayerModel.lastChatTime = current;
            var info = {}, sendInfo = {};
            info["userId"] = sendInfo["userId"] = this.userGroupModel.user1Model.userId;
            info["roomSn"] = sendInfo["roomSn"] = this.roomInfoModel.roomSn;
            info["idx"] = sendInfo["idx"] = e.data.idx;
            info["type"] = sendInfo["type"] = e.data.type;
            //本地播放
            this.updatePlayerChatStatus(info);
            //发送数据
            this.webSocketModel.sendChatInfo(sendInfo);
        }
        else {
            PopupLayer.getInstance().floatAlert("聊天过于频繁");
        }
    };
    /*-----------------------------解散房间--------------------*/
    /*发起解散房间 或者发起退出房间操作*/
    AH_GameModel.prototype.sponsorGameKillRoom = function () {
        if (this.currentScene == BaseModel.GAME_SCENE_prepare) {
            //房主自己
            if (this.userGroupModel.user1Model.houseOwner) {
                PopupLayer.getInstance().addHintView("当前解散房间，不消耗房卡!", function () {
                    //退出房间
                    this.webSocketModel.quitRoom({
                        roomSn: this.roomInfoModel.roomSn,
                        userId: this.userGroupModel.user1Model.userId
                    });
                }.bind(this), true, "min");
            }
            else {
                //退出房间
                this.webSocketModel.quitRoom({
                    roomSn: this.roomInfoModel.roomSn,
                    userId: this.userGroupModel.user1Model.userId
                });
            }
        }
        else if (this.currentScene == BaseModel.GAME_SCENE_playing || this.currentScene == BaseModel.GAME_SCENE_waiting) {
            //游戏中 或者小结算/等待
            //发起解散房间
            this.webSocketModel.sponsorDissolveRoom({
                roomSn: this.roomInfoModel.roomSn,
                userId: this.userGroupModel.user1Model.userId
            });
        }
        else {
            PopupLayer.getInstance().addHintView("当前阶段无法发起解散房间", null, true, "min");
        }
    };
    /*接收 解散房间时所有玩家实时操作信息*/
    AH_GameModel.prototype.dissolveRoomAgree = function (data) {
        if (data) {
            if (Number(data.reqState) == 4) {
                this.updateMainInfo(); //返回大厅
            }
            else if (data.othersAgree) {
                /*处理解散房间*/
                this.setDissolveRoom(data);
            }
            else {
                MyConsole.getInstance().trace("重大失误 解散房间时所有玩家实时操作信息为空-2", 0);
            }
        }
        else {
            MyConsole.getInstance().trace("重大失误 解散房间时所有玩家实时操作信息为空-1", 0);
        }
    };
    /*发起 同意或者拒绝解散房间*/
    AH_GameModel.prototype.agreeDissovleRoom = function (e) {
        if (e.data) {
            this.webSocketModel.dissolveRoomOperation({
                roomSn: this.roomInfoModel.roomSn,
                userId: this.userGroupModel.user1Model.userId,
                userAgree: e.data.agree
            });
        }
        else {
            MyConsole.getInstance().trace("发起 同意或者拒绝解散房间 没数据", 0);
        }
    };
    /*接收 解散房间最终结果*/
    AH_GameModel.prototype.dissolveRoomResult = function (info) {
        if (info) {
            switch (info.type) {
                case "exist":
                    this.updateMainInfo(); //返回大厅
                    break;
                case "dissolve":
                    //房主自己
                    if (this.userGroupModel.user1Model.houseOwner) {
                        this.updateMainInfo(); //返回大厅
                    }
                    else {
                        PopupLayer.getInstance().addHintView("该房间已被房主解散!", this.updateMainInfo.bind(this), false, "min");
                    }
                    break;
                default:
                    MyConsole.getInstance().trace("重大失误 解散房间最终结果 类型不存在" + info.type, 0);
                    break;
            }
        }
        else {
            MyConsole.getInstance().trace("重大失误 解散房间最终结果信息为空", 0);
        }
    };
    /*接收 踢人結果提示*/
    AH_GameModel.prototype.removePlayerResult = function (info) {
        if (info) {
            switch (info.type) {
                case "exist":
                    if (Number(info.userId) == Number(this.userGroupModel.user1Model.userId)) {
                        PopupLayer.getInstance().addHintView("你已被房主踢出本房间!", this.updateMainInfo.bind(this), false, "min");
                    }
                    else {
                        var name = this.userGroupModel.userIdGetUserModel(info.userId).openName;
                        PopupLayer.getInstance().floatAlert("<font color='#ffff00'>" + name + "</font> 已被房主踢出本房间", 1900);
                        this.updateMainInfo();
                    }
                    break;
                case "dissolve":
                    PopupLayer.getInstance().addHintView("该房间已被房主解散!", this.updateMainInfo.bind(this), false, "min");
                    break;
                default:
                    MyConsole.getInstance().trace("重大失误 解散房间或踢出玩家最终结果 类型不存在" + info.type, 0);
                    break;
            }
        }
        else {
            MyConsole.getInstance().trace("重大失误 解散房间或踢出玩家最终结果信息为空", 0);
        }
    };
    /*---------------------------------------------------------*/
    /*被动请求大接口数据 强制刷新*/
    AH_GameModel.prototype.updateMainInfo = function () {
        this.dispatchEvent(new egret.Event("getMainInfo"));
    };
    /*清理事件和数据*/
    AH_GameModel.prototype.clear = function () {
        _super.prototype.clear.call(this);
    };
    return AH_GameModel;
}(BaseModel));
__reflect(AH_GameModel.prototype, "AH_GameModel");
