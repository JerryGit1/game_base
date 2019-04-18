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
var AH_HallModel = (function (_super) {
    __extends(AH_HallModel, _super);
    function AH_HallModel(userModel, urlInfoModel) {
        var _this = _super.call(this) || this;
        _this.pageRecord = 1;
        _this.pageNews = 1;
        _this.roomType = 1; /*开放模式 1房主 2代开*/
        _this.currentReplaceRoomModelGroup = []; //当前已代开房间(未结束)
        _this.historyReplaceRoomModelGroup = []; //已代开房间(已结束)
        _this.urlInfoModel = urlInfoModel;
        _this.userModel = userModel;
        /*------------接收--------------*/
        /*查询战绩信息*/
        BaseModel.getInstance().addEventListener("getRecordInfo", _this.getRecordInfo, _this);
        // 查询系统消息
        BaseModel.getInstance().addEventListener("getNewsInfo", _this.getNewsInfo, _this);
        //查询联系我们信息
        BaseModel.getInstance().addEventListener("getUsInfo", _this.getUsInfo, _this);
        //反馈信息
        BaseModel.getInstance().addEventListener("getFeedback", _this.seedFeedback, _this);
        //创建房间
        BaseModel.getInstance().addEventListener("createRoom", _this.createRoom, _this);
        //加入房间
        BaseModel.getInstance().addEventListener("joinRoom", _this.joinRoom, _this);
        //同意用户协议
        BaseModel.getInstance().addEventListener("consentUA", _this.consentUA, _this);
        /*------------获取--------------*/
        /*接收到战绩信息*/
        _this.addRadioEvent(BaseModel.PORT_DATA_CONFIG.hall_achievement, _this.receiveRecordInfo.bind(_this));
        // 接收到反馈消息
        _this.addRadioEvent(BaseModel.PORT_DATA_CONFIG.hall_feedback, _this.feedbackInfo.bind(_this));
        //接收到的创建房间消息
        _this.addRadioEvent(BaseModel.PORT_DATA_CONFIG.hall_createRoom, _this.createOrJoinRoomOK.bind(_this));
        //接收到的加入房间消息
        _this.addRadioEvent(BaseModel.PORT_DATA_CONFIG.hall_joinRoom, _this.createOrJoinRoomOK.bind(_this));
        //接收已代开房间信息
        _this.addRadioEvent(BaseModel.PORT_DATA_CONFIG.hall_currentReplaceRoom, _this.createCurrentReplaceRoom.bind(_this));
        //接收代开房间历史记录
        _this.addRadioEvent(BaseModel.PORT_DATA_CONFIG.hall_historyReplaceRoom, _this.createHistoryReplaceRoom.bind(_this));
        return _this;
    }
    /*查询战绩信息*/
    AH_HallModel.prototype.getRecordInfo = function () {
        this.webSocketModel.getResult(this.userModel.userId, this.pageRecord);
    };
    // 查询系统消息
    AH_HallModel.prototype.getNewsInfo = function () {
        this.webSocketModel.getNews(this.userModel.userId, this.pageNews);
    };
    //查询联系我们信息
    AH_HallModel.prototype.getUsInfo = function () {
        this.webSocketModel.getUs(this.userModel.userId);
    };
    //获取反馈意见返回数据
    AH_HallModel.prototype.seedFeedback = function (e) {
        var content = e.data.content;
        var tel = e.data.tel;
        this.webSocketModel.sendFeedbackMsg(this.userModel.userId, content, tel);
    };
    /*创建房间*/
    AH_HallModel.prototype.createRoom = function (e) {
        var data = e.data;
        data["userId"] = this.userModel.userId;
        this.roomType = data.roomType;
        this.webSocketModel.getCreateRoomMsg(data);
    };
    // 加入房间
    AH_HallModel.prototype.joinRoom = function (e) {
        var data = e.data;
        this.webSocketModel.getjoinRoomMsg(this.userModel.userId, data.roomSn);
    };
    /*接收到战绩信息*/
    AH_HallModel.prototype.receiveRecordInfo = function (data) {
        this.dispatchEventWith("addRecordPopupView", false, data);
    };
    // 收到反馈消息
    AH_HallModel.prototype.feedbackInfo = function (data) {
        this.dispatchEventWith("alertMsg", false, data);
    };
    /*同意用户协议*/
    AH_HallModel.prototype.consentUA = function () {
        this.webSocketModel.hall_consentUA(this.userModel.userId);
    };
    // 创建房间成功之后
    AH_HallModel.prototype.createOrJoinRoomOK = function (info, interfaceId) {
        var reqState = Number(info.reqState);
        switch (reqState) {
            case 1:
                if (Number(interfaceId) == Number(BaseModel.PORT_DATA_CONFIG.hall_createRoom.interfaceId)) {
                    //开房统计
                    if (interfaceId == BaseModel.PORT_DATA_CONFIG.hall_createRoom.interfaceId) {
                        AH_statisticService.getInstance().createRoom(this.userModel.userId);
                    }
                    //测试数据
                    this.webSocketModel.test_mainPortNum(1);
                    if (this.roomType == 2) {
                        //代开模式下 直接发送准备ok 不会经过这
                        this.webSocketModel.settlementWaitOk({
                            userId: this.userModel.userId
                        });
                    }
                    else {
                        //房主模式下 1.7.1要凑齐4个人 才显示确认开局按钮
                        /*获取大接口数据*/
                        this.dispatchEvent(new egret.Event("getMainInfo"));
                    }
                }
                else {
                    //其他玩家直接发送准备ok
                    this.webSocketModel.settlementWaitOk({
                        userId: this.userModel.userId
                    });
                }
                break;
            case 3:
                /*获取大接口数据*/
                this.dispatchEvent(new egret.Event("getMainInfo"));
                break;
            case 2:
                PopupLayer.getInstance().addHintView("房卡不足，请联系代理", null, true, "min");
                break;
            case 4:
                if (this.urlInfoModel.shareJoining == 2) {
                    this.urlInfoModel.shareJoining = 3;
                    /*获取大接口数据*/
                    this.dispatchEvent(new egret.Event("getMainInfo"));
                }
                else {
                    PopupLayer.getInstance().floatAlert("房间不存在", 2000);
                }
                break;
            case 5:
                if (this.urlInfoModel.shareJoining == 2) {
                    this.urlInfoModel.shareJoining = 3;
                    /*获取大接口数据*/
                    this.dispatchEvent(new egret.Event("getMainInfo"));
                }
                else {
                    PopupLayer.getInstance().floatAlert("房间人员已满", 2000);
                }
                break;
            case 10:
                PopupLayer.getInstance().hall_replaceCreateRoomView(this);
                break;
        }
        if (info.money) {
            this.userModel.money = info.money;
            this.userModel.dispatchEvent(new egret.Event("updateMoney"));
        }
    };
    /*=============发起 获取未结束代开房间信息===============*/
    AH_HallModel.prototype.getCurrentReplaceInfo = function () {
        this.webSocketModel.getCurrentReplaceRoomInfo(this.userModel.userId);
    };
    AH_HallModel.prototype.createCurrentReplaceRoom = function (info) {
        this.currentReplaceRoomModelGroup = [];
        for (var i in info) {
            var model = new H_replaceRoomModel();
            model.setParams(info[i]);
            this.currentReplaceRoomModelGroup.push(model);
        }
        this.dispatchEvent(new egret.Event(BaseModel.GAME_CHANGE_VIEW_currentReplace));
    };
    /*=====================发起 获取已结束代开房间信息====================*/
    AH_HallModel.prototype.getHistoryReplaceInfo = function (pageNum) {
        var data = { userId: this.userModel.userId, page: pageNum };
        this.webSocketModel.getHistoryReplaceRoomInfo(data);
    };
    AH_HallModel.prototype.createHistoryReplaceRoom = function (info) {
        this.historyReplaceRoomModelGroup = [];
        for (var i in info.roomInfo) {
            var model = new H_replaceRoomModel();
            model.setParams(info.roomInfo[i]);
            this.historyReplaceRoomModelGroup.push(model);
        }
        this.dispatchEventWith(BaseModel.GAME_CHANGE_VIEW_historyReplace, false, info.pages);
    };
    /*==================解散代开房间===================*/
    AH_HallModel.prototype.dissolveReplaceRoom = function (roomId) {
        PopupLayer.getInstance().addHintView("游戏未开，,解散房间不扣房卡，是否解散？", function () {
            //退出房间
            this.webSocketModel.quitReplaceRoom({
                roomSn: roomId
            });
        }.bind(this), true, "min");
    };
    /*==================房主踢人===================*/
    AH_HallModel.prototype.deleteUser = function (userId, userName, roomId) {
        PopupLayer.getInstance().addHintView("是否将玩家【" + userName + "】踢出本房间？", function () {
            //退出房间
            this.webSocketModel.deleteUser({
                roomSn: roomId,
                userId: userId
            });
        }.bind(this), true, "min");
    };
    return AH_HallModel;
}(BaseModel));
__reflect(AH_HallModel.prototype, "AH_HallModel");
