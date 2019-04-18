/**
 * 创建者 伟大的周鹏斌大王 on 2017/6/17.
 */
class AH_BaseModel extends egret.EventDispatcher{
    public webSocketModel:WebSocketService;
    public httpServiceModel:HttpService;/*2.1.4新增*/
    /*版本类型【demo（日志不会上传） alpha release】*/
    protected versionType="release";
    protected radioEventList=[];/*事件侦听储存*/
    public constructor(_addSocket=true,httpService=false){
        super();
        if(_addSocket)this.webSocketModel=WebSocketService.getInstance();
        if(httpService)this.httpServiceModel=HttpService.getInstance();
    }
    /*事件广播*/
    public eventRadio(eventName,data=null){
        BaseModel.getInstance().dispatchEventWith(eventName,false,data);
    }
    /*广播事件侦听*/
    public addRadioEvent(eventInfo,backFun){
        /*这可能会出现脏数据*/
        var myEvent;
        if(eventInfo.interfaceId){
            myEvent={//webSocket通信
                name:BaseModel.SOCKET_DATA_EVENT+eventInfo.interfaceId,
                fun:function (e){
                    backFun(e.data,eventInfo.interfaceId);
                }
            }
        }else{//http通信
            myEvent={
                name:BaseModel.SOCKET_DATA_EVENT+eventInfo,
                fun:function (e){
                    backFun(e.data);
                }
            }
        }
        this.radioEventList.push(myEvent);
        BaseModel.getInstance().addEventListener(myEvent.name,myEvent.fun,this);
    }
    /*设置版本类型*/
    public setVersionType(str){
        if(str){
            BaseModel.getInstance().versionType=str;
            /*启动测试*/
            MyConsole.getInstance().start(this.getVersionType());
        }
    }
    /*获取版本类型*/
    public getVersionType():string{
        return BaseModel.getInstance().versionType;
    }
    /*批量设置属性*/
    public setParams(data){
        for(var i in data){
            this[i]=data[i];
        }
    }
    /*清理事件和数据*/
    public clear(){
        /*移除广播事件侦听*/
        for(var i in this.radioEventList){
            BaseModel.getInstance().removeEventListener(this.radioEventList[i].name,this.radioEventList[i].fun,this);
        }
        this.radioEventList=null;
    }
    /*清理指定事件和数据*/
    public clearEvent(fun){
        /*移除广播事件侦听*/
        for(var i in this.radioEventList){
            if(fun==this.radioEventList[i].fun){
                BaseModel.getInstance().removeEventListener(this.radioEventList[i].name,this.radioEventList[i].fun,this);
                this.radioEventList.splice(Number(i),1);
                break;
            }
        }

    }
    /*-------------所有静态常量----------------------*/
    /*场景定义*/
    public static SCENE_LOAD="loadScene";//加载场景
    public static SCENE_HALL="hallScene";//大厅场景
    public static SCENE_GAME="gameScene";//游戏场景
    /*玩家场景状态*/
    public static PLAYER_DATING="dating";/*大厅状态*/
    public static PLAYER_IN="in";/*刚进入房间，等待状态*/
    public static PLAYER_PREPARED="prepared";/* 准备状态*/
    public static PLAYER_CHU="chu";/* 出牌状态（该出牌了）*/
    public static PLAYER_WAIT="wait";/*  等待状态（非出牌状态）*/
    public static PLAYER_XJS="xjs";/*小结算*/
    public static PLAYER_NONE="none";/*这个位置没人（等待阶段 掉线或者退出房间）*/
    /*玩家游戏在线状态*/
    public static PLAYER_OUT="out";/*离线状态*/
    public static PLAYER_INLINE="inline";/*在线状态*/
    /*接口定义*/
    public static SOCKET_DATA_EVENT="socket_event_";//数据返回事件
    public static PORT_DATA_CONFIG:any={
        "mainInfo":{//大接口定义
            interfaceId:"100100",
            tips:"大接口数据"
        },
        "hall_managerList":{/*大厅-查看系统消息列表*/
            interfaceId:"100003",
            tips:"大厅-系统消息"
        },
	    "hall_achievement":{/*大厅-战绩查询*/
            interfaceId:"100002",
            tips:"大厅-战绩查询"
        },
        "hall_contactUs":{/*大厅-联系我们*/
            interfaceId:"100004",
            tips:"大厅-联系我们"
        },
        "hall_feedback":{/*大厅-反馈*/
            interfaceId:"100006",
            tips:"大厅-反馈"
        },
        "hall_createRoom":{/*大厅-创建房间*/
            interfaceId:"100007",
            tips:"大厅-创建房间"
        },
        "hall_joinRoom":{/*大厅-加入房间*/
            interfaceId:"100008",
            tips:"大厅-加入房间"
        },
        "hall_consentUA":{/*大厅-发起-同意用户协议*/
            interfaceId:"100009",
            tips:"大厅-发起-同意用户协议"
        },
        "hall_currentReplaceRoom":{/*大厅-发起-获取代开房间信息*/
            interfaceId:"100010",
            tips:"大厅-发起-获取代开房间信息"
        },
        "hall_historyReplaceRoom":{/*大厅-发起-获取代开房间历史记录*/
            interfaceId:"100011",
            tips:"大厅-发起-获取代开房间历史记录"
        },
        "hall_dissolveReplaceRoom":{/*大厅-发起-代开模式房主解散房间*/
            interfaceId:"100013",
            tips:"大厅-发起-代开模式房主解散房间"
        },
        "hall_deleteUser":{/*大厅-发起-房主踢人*/
            interfaceId:"100012",
            tips:"大厅-发起-房主踢人"
        },
        "hall_orderDissolveReplaceRoom":{/*发起-代开-强制解散房间*/
            interfaceId:"100015",
            tips:"发起-代开-强制解散房间"
        },
        "hall_roomPlaybackList":{/*---某个房间每小局数据列表*/
            interfaceId:"100014",
            tips:"大厅-某个房间每小局数据列表"
        },
        "game_smallSettlement":{/*游戏-小结算*/
            interfaceId:"100102",
            tips:"游戏-小结算"
        },
        "game_bigSettlement":{/*游戏-大结算*/
            interfaceId:"100103",
            tips:"游戏-大结算"
        },
        "game_playHand":{/*---发起 出牌接口*/
            interfaceId:"100201",
            tips:"游戏-当前玩家出牌"
        },
        "game_action":{/*---发起 吃碰杠胡的动作接口*/
            interfaceId:"100202",
            tips:"游戏-发起吃碰杠胡的动作"
        },
        "game_playHandAni":{/*---接收 玩家出牌动画*/
            interfaceId:"100105",
            tips:"游戏-其他玩家出牌动作"
        },
        "game_chatAni":{/*---接收 其他玩家的表情文字语音*/
            interfaceId:"100206",
            tips:"游戏-其他玩家的表情文字语音消息"
        },
        "game_requestSystemSendHand":{/*---请求 系统发牌动作*/
            interfaceId:"100207",
            tips:"游戏-请求系统发牌"
        },
        "game_systemSendHandHandAni":{/*---接收 系统发牌动作*/
            interfaceId:"100101",
            tips:"游戏-系统发牌"
        },
        "game_CPGHAction":{/*---接收 有吃碰杠胡动作可执行 1.9.5舍弃*/
            interfaceId:"100110",
            tips:"游戏-有吃碰杠胡动作可执行"
        },
        "game_CPGAni":{/*---接收 吃碰杠动作操作完毕回应*/
            interfaceId:"100104",
            tips:"游戏-吃碰杠动作操作完毕回应"
        },
        "game_settlementWaitOk":{/*---发起 小局结束 准备下一局*/
            interfaceId:"100200",
            tips:"游戏-当前玩家小结算确认"
        },
        "game_dissolveRoom":{/*---发起解散房间*/
            interfaceId:"100203",
            tips:"游戏-发起解散房间"
        },
        "game_dissolveRoomAgree":{/*---接收解散房间时，其他玩家的同意状态*/
            interfaceId:"100204",
            tips:"游戏-解散房间 玩家(包括自己) 同意/拒绝 操作"
        },
        "game_quitRoom":{/*---接收解散房间时，其他玩家的同意状态*/
            interfaceId:"100205",
            tips:"游戏-等待阶段退出房间"
        },
        "game_actionIDError":{/*---动作ID或大接口ID 出错（过时）*/
            interfaceId:"100108",
            tips:"动作ID或大接口ID 出错（过时）"
        },
        "game_beRemovedPlayer":{/*----玩家被踢提示---*/
            interfaceId:"100107",
            tips:"玩家被踢提示"
        },
        "game_systemDissolveRoom":{/*----系统主动推送解散房间通知----*/
            interfaceId:"100111",
            tips:"系统主动推送解散房间通知"
        },
        "game_onLineState":{/*---玩家在线状态切换*/
            interfaceId:"100109",
            tips:"游戏-玩家在线状态切换"
        },
        "heartbeat":{/*---心跳连接*/
            interfaceId:"100000",
            tips:"游戏-心跳"
        },
        "repetitionLogin":{/*---重复登录*/
            interfaceId:"100106",
            tips:"游戏-重复登录警告"
        },
        "getSystemCard":{/*---获取系统剩余牌*/
            interfaceId:"999998",
            tips:"游戏-获取系统剩余牌"
        },
        "setSystemCard":{/*---设置系统剩余牌*/
            interfaceId:"999999",
            tips:"游戏-获取系统剩余牌"
        },
        "setStopCard":{/*---设置玩家手牌*/
            interfaceId:"999997",
            tips:"游戏-设置玩家手牌"
        }
    }
    /*游戏场景类型定义*/
    public static GAME_SCENE_loading=-1;/*等待游戏场景素材加载*/
    public static GAME_SCENE_cutScene=1000;/*等待切换场景*/
    public static GAME_SCENE_prepare=1;/*等待 开局*/
    public static GAME_SCENE_waiting=3;/*小局结束准备 场景*/
    public static GAME_SCENE_playing=2;/*游戏中 场景*/

    public static Port_ID = 51000;/*端口号*/
    /*游戏场景 视图更新事件定义*/
    public static GAME_CHANGE_VIEW_circleWind="circleWind";/*刷新圈风*/
    public static GAME_CHANGE_VIEW_lastNum="lastNum";/*刷新剩余圈数*/
    public static GAME_CHANGE_VIEW_cnrrMJNum="cnrrMJNum";/*刷新剩余麻将数量*/
    public static GAME_CHANGE_VIEW_clock="clock";//风向指向
    public static GAME_CHANGE_VIEW_ipSame="ipSame";//ip冲突
    public static GAME_CHANGE_VIEW_countdown="countdown";//出牌倒计时
    public static GAME_CHANGE_VIEW_twinkleAni="twinkleAni";//出牌闪烁动画
    public static GAME_CHANGE_VIEW_playerState="playerState";/*玩家状态刷新*/
    public static GAME_CHANGE_VIEW_playerLineState="playerLineState";/*玩家在线状态刷新*/
    public static GAME_CHANGE_VIEW_currentReplace="showCurrentReplaceRoom";/*显示未结束代开房间*/
    public static GAME_CHANGE_VIEW_historyReplace="showHistoryReplaceRoom";/*显示已结束代开房间*/
    public static GAME_CHANGE_VIEW_network="network";/*网络质量*/
    public static GAME_CHANGE_VIEW_checkNetWork="checkNetWork";/*发起网络质量检测*/
    public static GAME_CHANGE_VIEW_playerBadNet="plaerBadNet";/*提示玩家网络不佳*/

    public static GAME_CHANGE_VIEW_playerBaseInfo="playerBaseInfo";/*玩家基础信息更新*/
    public static GAME_CHANGE_VIEW_playerStopCard="playerStopCard";/*刷新（所有玩家）手牌数据*/
    public static GAME_CHANGE_VIEW_playerPlayCard="playerPlayCard";/*刷新（所有玩家）桌牌数据*/
    public static GAME_CHANGE_VIEW_stopNewCard="stopNewCard";/*桌面最新出的那种牌更新*/
    public static GAME_CHANGE_VIEW_playerChooseAction="playerChooseAction";/*玩家执行吃碰杠胡的动作指令*/
    public static GAME_CHANGE_VIEW_playerChooseActionOk="playerChooseActionOk";/*玩家选择吃碰杠胡的动作指令成功*/
    public static GAME_CHANGE_VIEW_playerCPGHAni="playerCPGHAni";/*吃碰杠胡动画*/
    public static GAME_CHANGE_VIEW_playerSendCard="playerSendCard";/*玩家出一张牌*/
    public static GAME_CHANGE_VIEW_playerSendCardAni="playerSendCardAni";/*玩家出一张牌动画*/
    public static GAME_CHANGE_VIEW_updatePLayCardArrows="pdatePLayCardArrows";/*玩家出一张牌动画*/
    public static GAME_CHANGE_VIEW_removeSendCardAni="removeSendCardAni";/*移除出牌动画*/
    //public static GAME_CHANGE_VIEW_updatePlayCard="updatePlayCard";/*单个玩家出一张牌 插入数据后 刷新视图 刷新桌牌*/
    public static GAME_CHANGE_VIEW_chatStatus="chatStatus";/*聊天的状态显示*/
    public static GAME_CHANGE_VIEW_chatVoiceStatus="chatVoiceStatus";/*语音状态更新*/
    public static GAME_CHANGE_VIEW_updateClock="updateClock";/*移除出牌动画*/
    public static GAME_CHANGE_VIEW_requestSendCard="requestSendCard";/*请求发牌*/
    /*关键变量*/
    public static USER_CARD_WIDTH=Math.floor(Main.stageWidth/14);//玩家自己手牌大小设定
    public static USER_CARD_WIDTH2=350;//2号玩家 和 3号玩家 手牌距离舞台的距离
    public static USER_repetitionLogin=false;//重复登录
    public static USER_turnLogin = false;//切换登录
    public static BASE_sound_url="";//基础声音地址
    public static GAME_NAME="富乐棋牌";//游戏名称
    public static HEART_TIME=8;/*秒*/
    public static PLAYBACK_MODEL=false;/*回放模式下*/
    public static PLAYBACK_PAUSE=false;/*回放模式是否暂停*/
    public static PLAYBACK_SHARE_USERID;/*回放模式下分享人的id*/
    public static CLUB_SHARE_ID;/*俱乐部Id*/
    public static SERVICE_VERSION="";//后端版本
    public static IOS=false;//是否是ios手機
    public static ISSCREEEN=false;//是否是锁定屏幕竖屏模式 横屏下会提示 旋转
    public static login_statistic = false;/*玩家登录统计*/
    public static ActionType=0;/*玩家发起的动作类型*/
    public static ActionStartTime=0;/*玩家发起动作时间*/
    public static ActionEndTime=0;/*玩家接收动作回应时间*/
    public static ChuPaiStartTime=0;/*出牌发起时间*/
    public static ChuPaiEndTime=0;/*出牌回应时间*/
    public static FaPaiStartTime=0;/*发牌发起时间*/
    public static FaPaiEndTime=0;/*发牌回应时间*/
    public static RoundEndTime=0;/*小局结束时间*/
}