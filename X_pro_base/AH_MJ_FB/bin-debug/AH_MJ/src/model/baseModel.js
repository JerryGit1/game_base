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
var AH_BaseModel = (function (_super) {
    __extends(AH_BaseModel, _super);
    function AH_BaseModel(_addSocket) {
        if (_addSocket === void 0) { _addSocket = true; }
        var _this = _super.call(this) || this;
        /*版本类型【demo（日志不会上传） alpha release】*/
        _this.versionType = "release";
        _this.radioEventList = []; /*事件侦听储存*/
        if (_addSocket)
            _this.webSocketModel = WebSocketService.getInstance();
        return _this;
    }
    /*事件广播*/
    AH_BaseModel.prototype.eventRadio = function (eventName, data) {
        if (data === void 0) { data = null; }
        BaseModel.getInstance().dispatchEventWith(eventName, false, data);
    };
    /*广播事件侦听*/
    AH_BaseModel.prototype.addRadioEvent = function (eventInfo, backFun) {
        /*这可能会出现脏数据*/
        var myEvent = {
            name: BaseModel.SOCKET_DATA_EVENT + eventInfo.interfaceId,
            fun: function (e) {
                backFun(e.data, eventInfo.interfaceId);
            }
        };
        this.radioEventList.push(myEvent);
        BaseModel.getInstance().addEventListener(myEvent.name, myEvent.fun, this);
    };
    /*设置版本类型*/
    AH_BaseModel.prototype.setVersionType = function (str) {
        if (str) {
            BaseModel.getInstance().versionType = str;
            /*启动测试*/
            MyConsole.getInstance().start(this.getVersionType());
        }
    };
    /*获取版本类型*/
    AH_BaseModel.prototype.getVersionType = function () {
        return BaseModel.getInstance().versionType;
    };
    /*批量设置属性*/
    AH_BaseModel.prototype.setParams = function (data) {
        for (var i in data) {
            this[i] = data[i];
        }
    };
    /*清理事件和数据*/
    AH_BaseModel.prototype.clear = function () {
        /*移除广播事件侦听*/
        for (var i in this.radioEventList) {
            BaseModel.getInstance().removeEventListener(this.radioEventList[i].name, this.radioEventList[i].fun, this);
        }
        this.radioEventList = null;
    };
    /*清理指定事件和数据*/
    AH_BaseModel.prototype.clearEvent = function (fun) {
        /*移除广播事件侦听*/
        for (var i in this.radioEventList) {
            if (fun == this.radioEventList[i].fun) {
                BaseModel.getInstance().removeEventListener(this.radioEventList[i].name, this.radioEventList[i].fun, this);
                this.radioEventList.splice(Number(i), 1);
                break;
            }
        }
    };
    return AH_BaseModel;
}(egret.EventDispatcher));
/*-------------所有静态常量----------------------*/
/*场景定义*/
AH_BaseModel.SCENE_LOAD = "loadScene"; //加载场景
AH_BaseModel.SCENE_HALL = "hallScene"; //大厅场景
AH_BaseModel.SCENE_GAME = "gameScene"; //游戏场景
/*玩家场景状态*/
AH_BaseModel.PLAYER_DATING = "dating"; /*大厅状态*/
AH_BaseModel.PLAYER_IN = "in"; /*刚进入房间，等待状态*/
AH_BaseModel.PLAYER_PREPARED = "prepared"; /* 准备状态*/
AH_BaseModel.PLAYER_CHU = "chu"; /* 出牌状态（该出牌了）*/
AH_BaseModel.PLAYER_WAIT = "wait"; /*  等待状态（非出牌状态）*/
AH_BaseModel.PLAYER_XJS = "xjs"; /*小结算*/
AH_BaseModel.PLAYER_NONE = "none"; /*这个位置没人（等待阶段 掉线或者退出房间）*/
/*玩家游戏在线状态*/
AH_BaseModel.PLAYER_OUT = "out"; /*离线状态*/
AH_BaseModel.PLAYER_INLINE = "inline"; /*在线状态*/
/*接口定义*/
AH_BaseModel.SOCKET_DATA_EVENT = "socket_event_"; //数据返回事件
AH_BaseModel.PORT_DATA_CONFIG = {
    "mainInfo": {
        interfaceId: "100100",
        tips: "大接口数据"
    },
    "hall_managerList": {
        interfaceId: "100003",
        tips: "大厅-系统消息"
    },
    "hall_achievement": {
        interfaceId: "100002",
        tips: "大厅-战绩查询"
    },
    "hall_contactUs": {
        interfaceId: "100004",
        tips: "大厅-联系我们"
    },
    "hall_feedback": {
        interfaceId: "100006",
        tips: "大厅-反馈"
    },
    "hall_createRoom": {
        interfaceId: "100007",
        tips: "大厅-创建房间"
    },
    "hall_joinRoom": {
        interfaceId: "100008",
        tips: "大厅-加入房间"
    },
    "hall_consentUA": {
        interfaceId: "100009",
        tips: "大厅-发起-同意用户协议"
    },
    "hall_currentReplaceRoom": {
        interfaceId: "100010",
        tips: "大厅-发起-获取代开房间信息"
    },
    "hall_historyReplaceRoom": {
        interfaceId: "100011",
        tips: "大厅-发起-获取代开房间历史记录"
    },
    "hall_dissolveReplaceRoom": {
        interfaceId: "100013",
        tips: "大厅-发起-代开模式房主解散房间"
    },
    "hall_deleteUser": {
        interfaceId: "100012",
        tips: "大厅-发起-房主踢人"
    },
    "game_smallSettlement": {
        interfaceId: "100102",
        tips: "游戏-小结算"
    },
    "game_bigSettlement": {
        interfaceId: "100103",
        tips: "游戏-大结算"
    },
    "game_playHand": {
        interfaceId: "100201",
        tips: "游戏-当前玩家出牌"
    },
    "game_action": {
        interfaceId: "100202",
        tips: "游戏-发起吃碰杠胡的动作"
    },
    "game_playHandAni": {
        interfaceId: "100105",
        tips: "游戏-其他玩家出牌动作"
    },
    "game_chatAni": {
        interfaceId: "100206",
        tips: "游戏-其他玩家的表情文字语音消息"
    },
    "game_requestSystemSendHand": {
        interfaceId: "100207",
        tips: "游戏-请求系统发牌"
    },
    "game_systemSendHandHandAni": {
        interfaceId: "100101",
        tips: "游戏-系统发牌"
    },
    "game_CPGHAction": {
        interfaceId: "100110",
        tips: "游戏-有吃碰杠胡动作可执行"
    },
    "game_CPGAni": {
        interfaceId: "100104",
        tips: "游戏-吃碰杠动作操作完毕回应"
    },
    "game_settlementWaitOk": {
        interfaceId: "100200",
        tips: "游戏-当前玩家小结算确认"
    },
    "game_dissolveRoom": {
        interfaceId: "100203",
        tips: "游戏-发起解散房间"
    },
    "game_dissolveRoomAgree": {
        interfaceId: "100204",
        tips: "游戏-解散房间 玩家(包括自己) 同意/拒绝 操作"
    },
    "game_quitRoom": {
        interfaceId: "100205",
        tips: "游戏-等待阶段退出房间"
    },
    "game_actionIDError": {
        interfaceId: "100108",
        tips: "动作ID或大接口ID 出错（过时）"
    },
    "game_beRemovedPlayer": {
        interfaceId: "100107",
        tips: "玩家被踢提示"
    },
    "game_onLineState": {
        interfaceId: "100109",
        tips: "游戏-玩家在线状态切换"
    },
    "heartbeat": {
        interfaceId: "100000",
        tips: "游戏-心跳"
    },
    "repetitionLogin": {
        interfaceId: "100106",
        tips: "游戏-重复登录警告"
    },
    "getSystemCard": {
        interfaceId: "999998",
        tips: "游戏-获取系统剩余牌"
    },
    "setSystemCard": {
        interfaceId: "999999",
        tips: "游戏-获取系统剩余牌"
    },
};
/*游戏场景类型定义*/
AH_BaseModel.GAME_SCENE_loading = -1; /*等待游戏场景素材加载*/
AH_BaseModel.GAME_SCENE_cutScene = 1000; /*等待切换场景*/
AH_BaseModel.GAME_SCENE_prepare = 1; /*等待 开局*/
AH_BaseModel.GAME_SCENE_waiting = 3; /*小局结束准备 场景*/
AH_BaseModel.GAME_SCENE_playing = 2; /*游戏中 场景*/
/*游戏场景 视图更新事件定义*/
AH_BaseModel.GAME_CHANGE_VIEW_circleWind = "circleWind"; /*刷新圈风*/
AH_BaseModel.GAME_CHANGE_VIEW_lastNum = "lastNum"; /*刷新剩余圈数*/
AH_BaseModel.GAME_CHANGE_VIEW_cnrrMJNum = "cnrrMJNum"; /*刷新剩余麻将数量*/
AH_BaseModel.GAME_CHANGE_VIEW_clock = "clock"; //风向指向
AH_BaseModel.GAME_CHANGE_VIEW_countdown = "countdown"; //出牌倒计时
AH_BaseModel.GAME_CHANGE_VIEW_twinkleAni = "twinkleAni"; //出牌闪烁动画
AH_BaseModel.GAME_CHANGE_VIEW_playerState = "playerState"; /*玩家状态刷新*/
AH_BaseModel.GAME_CHANGE_VIEW_playerLineState = "playerLineState"; /*玩家在线状态刷新*/
AH_BaseModel.GAME_CHANGE_VIEW_currentReplace = "showCurrentReplaceRoom"; /*显示未结束代开房间*/
AH_BaseModel.GAME_CHANGE_VIEW_historyReplace = "showHistoryReplaceRoom"; /*显示已结束代开房间*/
AH_BaseModel.GAME_CHANGE_VIEW_playerBaseInfo = "playerBaseInfo"; /*玩家基础信息更新*/
AH_BaseModel.GAME_CHANGE_VIEW_playerStopCard = "playerStopCard"; /*刷新（所有玩家）手牌数据*/
AH_BaseModel.GAME_CHANGE_VIEW_playerPlayCard = "playerPlayCard"; /*刷新（所有玩家）桌牌数据*/
AH_BaseModel.GAME_CHANGE_VIEW_stopNewCard = "stopNewCard"; /*桌面最新出的那种牌更新*/
AH_BaseModel.GAME_CHANGE_VIEW_playerChooseAction = "playerChooseAction"; /*玩家执行吃碰杠胡的动作指令*/
AH_BaseModel.GAME_CHANGE_VIEW_playerChooseActionOk = "playerChooseActionOk"; /*玩家选择吃碰杠胡的动作指令成功*/
AH_BaseModel.GAME_CHANGE_VIEW_playerCPGHAni = "playerCPGHAni"; /*吃碰杠胡动画*/
AH_BaseModel.GAME_CHANGE_VIEW_playerSendCard = "playerSendCard"; /*玩家出一张牌*/
AH_BaseModel.GAME_CHANGE_VIEW_playerSendCardAni = "playerSendCardAni"; /*玩家出一张牌动画*/
AH_BaseModel.GAME_CHANGE_VIEW_updatePLayCardArrows = "pdatePLayCardArrows"; /*玩家出一张牌动画*/
AH_BaseModel.GAME_CHANGE_VIEW_removeSendCardAni = "removeSendCardAni"; /*移除出牌动画*/
//public static GAME_CHANGE_VIEW_updatePlayCard="updatePlayCard";/*单个玩家出一张牌 插入数据后 刷新视图 刷新桌牌*/
AH_BaseModel.GAME_CHANGE_VIEW_chatStatus = "chatStatus"; /*聊天的状态显示*/
AH_BaseModel.GAME_CHANGE_VIEW_chatVoiceStatus = "chatVoiceStatus"; /*语音状态更新*/
AH_BaseModel.GAME_CHANGE_VIEW_updateClock = "updateClock"; /*移除出牌动画*/
AH_BaseModel.GAME_CHANGE_VIEW_requestSendCard = "requestSendCard"; /*请求发牌*/
/*关键变量*/
AH_BaseModel.USER_CARD_WIDTH = Math.floor(Main.stageWidth / 14); //玩家自己手牌大小设定
AH_BaseModel.USER_CARD_WIDTH2 = 350; //2号玩家 和 3号玩家 手牌距离舞台的距离
AH_BaseModel.USER_repetitionLogin = false; //重复登录
AH_BaseModel.BASE_sound_url = ""; //基础声音地址
AH_BaseModel.SERVICE_VERSION = ""; //后端版本
__reflect(AH_BaseModel.prototype, "AH_BaseModel");
