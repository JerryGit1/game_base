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
var AH_WebSocketService = (function (_super) {
    __extends(AH_WebSocketService, _super);
    function AH_WebSocketService() {
        var _this = _super.call(this) || this;
        //ws://192.168.1.21:51000 本保
        //ws://192.168.1.16:51000 周聰
        //ws://192.168.1.26:51000 张思全
        _this.demo_url_zc = "ws://192.168.1.16:51000";
        _this.demo_url_sbb = "ws://47.93.227.111:51000";
        _this.demo_url_zsc = "ws://192.168.1.26:51000";
        //远程链接
        _this.alpha_url = "ws://47.93.61.29:51000";
        _this.release_url = "ws://47.93.227.111:51000";
        _this.game_url = "";
        //唯一id
        _this.wsw_sole_main_id = 0; /*唯一的大接口id*/
        _this.wsw_sole_action_id = 0; /*唯一的动作（系统出牌，玩家出牌，玩家吃碰杠胡操作）*/
        //循环发送数据
        _this.loopSendInfoTimer = {};
        /*发牌后刷新 剩余牌*/
        _this.currentPosition = 0; //当前风向测试用
        /*广播后端信息*/
        _this.linshiMainInfo = {};
        _this.mainNum = 0;
        return _this;
    }
    /*配置url*/
    AH_WebSocketService.prototype.setGameUrl = function (vId, service_id) {
        switch (vId) {
            case 1:
                AH_baseService.host = "http://www.aoh5.com/";
                if (service_id) {
                    this.game_url = this["demo_url_" + service_id];
                }
                this.setVersionType("demo");
                MyConsole.getInstance().trace("-----本地测试模式-----");
                break;
            case 2:
                AH_baseService.host = "http://www.aoh5.com/";
                this.game_url = this.alpha_url;
                this.setVersionType("alpha");
                MyConsole.getInstance().trace(">----线上测试模式----<");
                break;
            case 3:
                AH_baseService.host = "http://flfy58.cn/";
                this.game_url = this.release_url;
                this.setVersionType("release");
                MyConsole.getInstance().trace(">****线上发布模式****<");
                break;
            default:
                MyConsole.getInstance().trace(">****未知的模式****<");
                break;
        }
    };
    /*------------------------------------------测试数据-------------------------------------*/
    AH_WebSocketService.prototype.testPort = function (interfaceId, data) {
        if (this.getVersionType() != "release") {
            this.radioServiceInfo(interfaceId, data);
        }
    };
    /*测试数据*/
    AH_WebSocketService.prototype.createRoomOk = function (roomId) {
        if (this.getVersionType() != "release") {
            if (egret["AH_createRoomOk"]) {
                egret["AH_createRoomOk"](roomId);
            }
        }
    };
    /* 测试大接口次数统计*/
    AH_WebSocketService.prototype.test_mainPortNum = function (num) {
        if (num === void 0) { num = 0; }
        if (this.getVersionType() != "release") {
            if (egret["AH_mainInfoNum"]) {
                egret["AH_mainInfoNum"](num);
            }
        }
    };
    AH_WebSocketService.prototype.systemSendCardOk = function (roomSn, position) {
        if (this.getVersionType() != "release") {
            if (egret["AH_systemSendCard"]) {
                this.currentPosition = position;
                this.sendData({
                    interfaceId: BaseModel.PORT_DATA_CONFIG.getSystemCard.interfaceId,
                    roomSn: roomSn
                }, false);
            }
        }
    };
    /*设置剩余牌*/
    AH_WebSocketService.prototype.setSystemSendCard = function (roomSn, list) {
        if (this.getVersionType() != "release") {
            this.sendData({
                interfaceId: BaseModel.PORT_DATA_CONFIG.setSystemCard.interfaceId,
                currentMjs: list,
                roomSn: roomSn
            }, false);
        }
    };
    /*------------------------数据接口------------------------------------*/
    /*连接socket*/
    AH_WebSocketService.prototype.startConnect = function () {
        if (this.game_url) {
            this.connection(this.game_url);
        }
        else {
            if (this.getVersionType() == "demo") {
                this.onSocketOpen();
            }
        }
    };
    /*主动获取大接口数据*/
    AH_WebSocketService.prototype.getMainInfo = function (openId, userId, cId, _isLoading) {
        if (userId === void 0) { userId = null; }
        if (cId === void 0) { cId = null; }
        if (_isLoading === void 0) { _isLoading = false; }
        if (!this.game_url) {
            this.radioServiceInfo(BaseModel.PORT_DATA_CONFIG.mainInfo.interfaceId, TestDataModel.mainInfo3);
        }
        else {
            this.sendData({
                interfaceId: BaseModel.PORT_DATA_CONFIG.mainInfo.interfaceId,
                openId: openId, userId: userId, cId: cId
            }, _isLoading);
        }
    };
    /*获取战绩*/
    AH_WebSocketService.prototype.getResult = function (userId, pageRecord) {
        if (this.game_url) {
            this.sendData({
                interfaceId: BaseModel.PORT_DATA_CONFIG.hall_achievement.interfaceId,
                userId: userId, page: pageRecord
            }, true);
        }
    };
    /*获取系统消息*/
    AH_WebSocketService.prototype.getNews = function (userId, pageRecord) {
        if (this.game_url) {
            this.sendData({
                interfaceId: BaseModel.PORT_DATA_CONFIG.hall_managerList.interfaceId,
                userId: userId, page: pageRecord
            }, true);
        }
    };
    // 获取联系我们信息
    AH_WebSocketService.prototype.getUs = function (userId) {
        if (this.game_url) {
            this.sendData({
                interfaceId: BaseModel.PORT_DATA_CONFIG.hall_contactUs.interfaceId,
                userId: userId
            }, true);
        }
    };
    //获取反馈消息
    AH_WebSocketService.prototype.sendFeedbackMsg = function (userId, content, tel) {
        if (this.game_url) {
            this.sendData({
                interfaceId: BaseModel.PORT_DATA_CONFIG.hall_feedback.interfaceId,
                userId: userId, content: content, tel: tel
            }, true);
        }
    };
    //同意用户协议
    AH_WebSocketService.prototype.hall_consentUA = function (userId) {
        if (this.game_url) {
            this.sendData({
                interfaceId: BaseModel.PORT_DATA_CONFIG.hall_consentUA.interfaceId,
                userId: userId
            }, true);
        }
    };
    //获取创建房间信息
    AH_WebSocketService.prototype.getCreateRoomMsg = function (data) {
        data.interfaceId = BaseModel.PORT_DATA_CONFIG.hall_createRoom.interfaceId;
        if (this.game_url) {
            this.sendData(data, true);
        }
    };
    //获取加入房间信息
    AH_WebSocketService.prototype.getjoinRoomMsg = function (userId, roomSn) {
        if (this.game_url) {
            this.sendData({
                interfaceId: BaseModel.PORT_DATA_CONFIG.hall_joinRoom.interfaceId,
                userId: userId, roomSn: roomSn
            }, true);
        }
    };
    //获取未结束代开房间
    AH_WebSocketService.prototype.getCurrentReplaceRoomInfo = function (userId) {
        if (!this.game_url) {
        }
        else {
            this.sendData(({
                interfaceId: BaseModel.PORT_DATA_CONFIG.hall_currentReplaceRoom.interfaceId,
                userId: userId
            }), false);
        }
    };
    //获取已结束房间
    AH_WebSocketService.prototype.getHistoryReplaceRoomInfo = function (data) {
        data.interfaceId = BaseModel.PORT_DATA_CONFIG.hall_historyReplaceRoom.interfaceId;
        if (!this.game_url) {
        }
        else {
            this.sendData(data, false);
        }
    };
    //解散代开房间
    AH_WebSocketService.prototype.quitReplaceRoom = function (data) {
        data.interfaceId = BaseModel.PORT_DATA_CONFIG.hall_dissolveReplaceRoom.interfaceId;
        if (!this.game_url) {
        }
        else {
            this.sendData(data, false);
        }
    };
    //房主踢人
    AH_WebSocketService.prototype.deleteUser = function (data) {
        data.interfaceId = BaseModel.PORT_DATA_CONFIG.hall_deleteUser.interfaceId;
        if (!this.game_url) {
        }
        else {
            this.sendData(data, false);
        }
    };
    /*---------游戏---------*/
    //请求系统发牌
    AH_WebSocketService.prototype.requestSystemSendHand = function (data) {
        if (this.game_url) {
            data.interfaceId = BaseModel.PORT_DATA_CONFIG.game_requestSystemSendHand.interfaceId;
            data.wsw_sole_action_id = this.wsw_sole_action_id; /*唯一id注入*/
            this.loopSend(data, false);
        }
    };
    //吃碰杠胡操作完毕
    AH_WebSocketService.prototype.cpghAction = function (data) {
        if (this.game_url) {
            data.interfaceId = BaseModel.PORT_DATA_CONFIG.game_action.interfaceId;
            data.wsw_sole_action_id = this.wsw_sole_action_id; /*唯一id注入*/
            this.loopSend(data, false);
        }
    };
    //出牌
    AH_WebSocketService.prototype.playHand = function (data) {
        if (this.game_url) {
            data.interfaceId = BaseModel.PORT_DATA_CONFIG.game_playHand.interfaceId;
            data.wsw_sole_action_id = this.wsw_sole_action_id; /*唯一id注入*/
            //MyConsole.getInstance().trace("发起---出牌ID:"+this.wsw_sole_action_id,"custom1");
            this.loopSend(data, false);
        }
    };
    //小结算 准备按钮点击
    AH_WebSocketService.prototype.settlementWaitOk = function (data) {
        data.interfaceId = BaseModel.PORT_DATA_CONFIG.game_settlementWaitOk.interfaceId;
        if (this.game_url) {
            this.sendData(data, true);
        }
    };
    //获取大结算数据
    AH_WebSocketService.prototype.bigSettlement = function (data) {
        data.interfaceId = BaseModel.PORT_DATA_CONFIG.game_bigSettlement.interfaceId;
        if (this.game_url) {
            this.sendData(data, true);
        }
    };
    //等待阶段 退出房间
    AH_WebSocketService.prototype.quitRoom = function (data) {
        data.interfaceId = BaseModel.PORT_DATA_CONFIG.game_quitRoom.interfaceId;
        if (this.game_url) {
            this.sendData(data, true);
        }
    };
    //发起解散房间
    AH_WebSocketService.prototype.sponsorDissolveRoom = function (data) {
        data.interfaceId = BaseModel.PORT_DATA_CONFIG.game_dissolveRoom.interfaceId;
        if (this.game_url) {
            this.sendData(data, true);
        }
    };
    //同意/拒绝 解散房间操作
    AH_WebSocketService.prototype.dissolveRoomOperation = function (data) {
        data.interfaceId = BaseModel.PORT_DATA_CONFIG.game_dissolveRoomAgree.interfaceId;
        if (this.game_url) {
            this.sendData(data, true);
        }
    };
    //发送表情文字语音
    AH_WebSocketService.prototype.sendChatInfo = function (data) {
        data.interfaceId = BaseModel.PORT_DATA_CONFIG.game_chatAni.interfaceId;
        if (this.game_url) {
            this.sendData(data, false);
        }
    };
    //心跳
    AH_WebSocketService.prototype.heartbeat = function () {
        var data = {};
        data.interfaceId = BaseModel.PORT_DATA_CONFIG.heartbeat.interfaceId;
        if (this.game_url) {
            this.sendData(data, false);
        }
    };
    /*-----------------------需要循环发送的接口-----------------------------*/
    AH_WebSocketService.prototype.loopSend = function (data, _isLoading, time) {
        if (time === void 0) { time = 2500; }
        var self = this;
        //保险起见先清理一次
        this.clearLoopSend(data.interfaceId);
        //持续发送
        this.loopSendInfoTimer[data.interfaceId] = setInterval(send, time);
        function send() {
            MyConsole.getInstance().trace(data.interfaceId + "循环刷新:" + self.wsw_sole_action_id, "custom2");
            self.sendData(data, _isLoading);
        }
        send();
    };
    /*清理循环发送接口*/
    AH_WebSocketService.prototype.clearLoopSend = function (interfaceId) {
        if (this.loopSendInfoTimer[interfaceId]) {
            clearInterval(this.loopSendInfoTimer[interfaceId]);
            this.loopSendInfoTimer[interfaceId] = null;
        }
    };
    /*清理全部循环发送接口*/
    AH_WebSocketService.prototype.clearAllLoopSend = function () {
        for (var i in this.loopSendInfoTimer) {
            this.clearLoopSend(i);
        }
        this.loopSendInfoTimer = [];
    };
    /*-------------------------------------------------------*/
    /*接收消息查询*/
    AH_WebSocketService.prototype.selectSendInfoTips = function (data) {
        var interfaceId = Number(data["interfaceId"]), consoleId = 100000;
        if (interfaceId) {
            if (interfaceId == Number(BaseModel.PORT_DATA_CONFIG.mainInfo.interfaceId))
                consoleId = 100100;
            for (var i in BaseModel.PORT_DATA_CONFIG) {
                if (Number(BaseModel.PORT_DATA_CONFIG[i].interfaceId) == interfaceId) {
                    MyConsole.getInstance().trace("<---收到服务器-" + this.cSocketUrl + "-v:" + BaseModel.SERVICE_VERSION + "   [" + BaseModel.PORT_DATA_CONFIG[i].tips + "]  --->", consoleId);
                    break;
                }
            }
            MyConsole.getInstance().trace(data, consoleId); //打印日志
        }
    };
    /*获取到数据*/
    AH_WebSocketService.prototype.onReceiveMessageOk = function (info, interfaceId) {
        //处理数据 广播后端信息
        this.radioServiceInfo(interfaceId, info);
    };
    AH_WebSocketService.prototype.radioServiceInfo = function (interfaceId, info) {
        for (var i in BaseModel.PORT_DATA_CONFIG) {
            if (Number(BaseModel.PORT_DATA_CONFIG[i].interfaceId) == Number(interfaceId)) {
                var _isEvent = false;
                /*唯一id处理*/
                switch (BaseModel.PORT_DATA_CONFIG[i].interfaceId) {
                    case BaseModel.PORT_DATA_CONFIG.mainInfo.interfaceId:
                        for (var name in info) {
                            this.linshiMainInfo[name] = info[name];
                        }
                        /*凑齐3种数据在推送大接口*/
                        if (this.linshiMainInfo.currentUser && this.linshiMainInfo.currentUser.playStatus == BaseModel.PLAYER_DATING) {
                            //大厅
                            _isEvent = true;
                            info = this.linshiMainInfo;
                            this.linshiMainInfo = {};
                            this.wsw_sole_main_id = this.wsw_sole_action_id = 0;
                            //统计追踪
                            AH_statisticService.getInstance().mainPortNum("ah");
                            //测试数据
                            this.test_mainPortNum();
                        }
                        else if (this.linshiMainInfo.roomInfo && this.linshiMainInfo.currentUser && this.linshiMainInfo.anotherUsers) {
                            //游戏
                            if (!this.wsw_sole_main_id || (info.wsw_sole_main_id >= this.wsw_sole_main_id)) {
                                _isEvent = true;
                                info = this.linshiMainInfo;
                                this.linshiMainInfo = {};
                                if (info.wsw_sole_main_id)
                                    this.wsw_sole_main_id = info.wsw_sole_main_id; //更新id
                                if (info.wsw_sole_action_id)
                                    this.wsw_sole_action_id = info.wsw_sole_action_id;
                                this.mainNum++;
                                //MyConsole.getInstance().trace("大接口编号ID:"+this.wsw_sole_main_id+" 累计次数:"+this.mainNum,"custom1");
                                //MyConsole.getInstance().trace("  动作编号ID:"+this.wsw_sole_action_id,"custom1");
                                //统计追踪
                                AH_statisticService.getInstance().mainPortNum("ah");
                                //测试数据
                                this.test_mainPortNum();
                            }
                            else {
                                MyConsole.getInstance().trace("  大接口id不符:当前id=" + this.wsw_sole_main_id + "  服务器：" + info.wsw_sole_main_id, "custom1");
                            }
                        }
                        break;
                    case BaseModel.PORT_DATA_CONFIG.game_systemSendHandHandAni.interfaceId:
                        //清理循环发送的数据
                        this.clearLoopSend(BaseModel.PORT_DATA_CONFIG.game_requestSystemSendHand.interfaceId);
                        if (info.wsw_sole_action_id && this.wsw_sole_action_id < info.wsw_sole_action_id) {
                            if (Number(info.wsw_sole_action_id) - Number(this.wsw_sole_action_id) != 1) {
                                //异常跟踪统计
                                AH_statisticService.getInstance().wswIDError();
                                this.dispatchEvent(new egret.Event("getMainInfo"));
                            }
                            else {
                                _isEvent = true;
                                this.wsw_sole_action_id = info.wsw_sole_action_id;
                            }
                        }
                        else {
                        }
                        break;
                    case BaseModel.PORT_DATA_CONFIG.game_CPGHAction.interfaceId:
                        if (info.wsw_sole_action_id && this.wsw_sole_action_id < info.wsw_sole_action_id) {
                            if (Number(info.wsw_sole_action_id) - Number(this.wsw_sole_action_id) != 1) {
                                //异常跟踪统计
                                AH_statisticService.getInstance().wswIDError();
                                this.dispatchEvent(new egret.Event("getMainInfo"));
                            }
                            else {
                                _isEvent = true;
                                this.wsw_sole_action_id = info.wsw_sole_action_id;
                            }
                        }
                        else {
                        }
                        break;
                    case BaseModel.PORT_DATA_CONFIG.game_playHandAni.interfaceId:
                        //清理循环发送的数据
                        this.clearLoopSend(BaseModel.PORT_DATA_CONFIG.game_playHand.interfaceId);
                        if (info.wsw_sole_action_id && this.wsw_sole_action_id < info.wsw_sole_action_id) {
                            if (Number(info.wsw_sole_action_id) - Number(this.wsw_sole_action_id) != 1) {
                                //异常跟踪统计
                                AH_statisticService.getInstance().wswIDError();
                                this.dispatchEvent(new egret.Event("getMainInfo"));
                            }
                            else {
                                _isEvent = true;
                                this.wsw_sole_action_id = info.wsw_sole_action_id;
                            }
                        }
                        else {
                        }
                        break;
                    case BaseModel.PORT_DATA_CONFIG.game_CPGAni.interfaceId:
                        //清理循环发送的数据
                        this.clearLoopSend(BaseModel.PORT_DATA_CONFIG.game_action.interfaceId);
                        if (info.wsw_sole_action_id && this.wsw_sole_action_id < info.wsw_sole_action_id) {
                            if (Number(info.wsw_sole_action_id) - Number(this.wsw_sole_action_id) != 1) {
                                //异常跟踪统计
                                AH_statisticService.getInstance().wswIDError();
                                this.dispatchEvent(new egret.Event("getMainInfo"));
                            }
                            else {
                                _isEvent = true;
                                this.wsw_sole_action_id = info.wsw_sole_action_id;
                            }
                        }
                        else {
                        }
                        break;
                    case BaseModel.PORT_DATA_CONFIG.game_actionIDError.interfaceId:
                        //清理全部循环动作
                        this.clearAllLoopSend();
                        _isEvent = true;
                        break;
                    case BaseModel.PORT_DATA_CONFIG.game_smallSettlement.interfaceId:
                        //清理全部循环动作
                        this.clearAllLoopSend();
                        _isEvent = true;
                        break;
                    case BaseModel.PORT_DATA_CONFIG.game_bigSettlement.interfaceId:
                        //清理全部循环动作
                        this.clearAllLoopSend();
                        _isEvent = true;
                        break;
                    case BaseModel.PORT_DATA_CONFIG.getSystemCard.interfaceId:
                        if (egret["AH_systemSendCard"]) {
                            egret["AH_systemSendCard"](info, BaseModel.SERVICE_VERSION, this.currentPosition);
                        }
                        break;
                    default:
                        _isEvent = true;
                        break;
                }
                if (_isEvent)
                    this.eventRadio(BaseModel.SOCKET_DATA_EVENT + interfaceId, info); //数据广播出去
                return;
            }
        }
        MyConsole.getInstance().trace("未知推送信息" + interfaceId, 3); //打印异常
    };
    return AH_WebSocketService;
}(AH_baseService));
__reflect(AH_WebSocketService.prototype, "AH_WebSocketService");
