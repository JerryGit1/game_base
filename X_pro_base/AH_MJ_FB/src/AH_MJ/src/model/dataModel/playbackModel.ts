/**
 * 创建者 伟大的周鹏斌大王  on 2017/10/23.
 */
class AH_playbackModel extends BaseModel{

    public allGameStepDataList=[];/*所有数据*/
    public gameStepNum=0;/*步骤 进度*/
    public currentUserId:number=0;/*第一人称视角 玩家ID*/
    public init_roomInfo;/*初始化房间信息*/
    public init_userInfo;/*初始化玩家信息*/
    public init_anotherUsers;/*初始化其他玩家信息*/
    public speedTimer=500;/*回放速度*/
    public _isPlay=true;/*是否播放*/
    public currentPauseInfo;/*暂停时候*/
    public over=0;//结束
    public startActionId = 1;
    public circleNum:number;//当前局数
    public createTime:number;//房间创建时间
    public constructor(data,currentUserId,circleNum,cTime){
        super();
        BaseModel.PLAYBACK_PAUSE = false;
        this.allGameStepDataList=data;
        this.currentUserId=currentUserId;
        this.circleNum = circleNum;
        this.createTime = cTime;
        this.over=0;
        this.webSocketModel.addEventListener("nextPlaybackInfo",this.nextPlaybackInfo,this);
        /*初始房间信息*/
        if(this.allGameStepDataList[0].jsonStr.roomInfo){
            this.init_roomInfo=this.allGameStepDataList[0].jsonStr.roomInfo;
        }else{
            alert("初始房间信息异常");
        }
        /*初始玩家信息*/
        if(this.allGameStepDataList[0].jsonStr.userInfos){
            var list=this.allGameStepDataList[0].jsonStr.userInfos;
            this.init_anotherUsers=[];
            for(var i in list){
                if(Number(list[i].userId)==this.currentUserId){
                    this.init_userInfo=list[i];
                }else{
                    this.init_anotherUsers.push(list[i]);
                }
            }
            //不存在 默认第一个
            if(!this.init_userInfo){
                this.init_userInfo=list[0];
                this.init_anotherUsers.splice(0,1);
            }
        }else{
            alert("初始玩家信息异常");
        }
    }
    /*---------------------------回放过程---------------------------------*/
    public nextPlaybackInfo(e){
        if(e&&e.data){
            var requestInterfaceId;
            if(this.over==1){
                requestInterfaceId=BaseModel.PORT_DATA_CONFIG.game_smallSettlement.interfaceId;
                //播放小结算
                this.over=2;
            }else if(this.over==2) {
                //小结算播放中
                return;
            }else{
                requestInterfaceId=e.data.interfaceId;
            }
            this.gameStepNum++;
            if(this.getVersionType() != "release") this.dispatchEvent(new egret.Event("updateStep"));

            var data=this.allGameStepDataList[this.gameStepNum];
            if(data.interfaceId == Number(BaseModel.PORT_DATA_CONFIG.game_bigSettlement.interfaceId)){
                requestInterfaceId = BaseModel.PORT_DATA_CONFIG.game_bigSettlement.interfaceId;
            }
            if(data.interfaceId == Number(BaseModel.PORT_DATA_CONFIG.game_smallSettlement.interfaceId)){
                requestInterfaceId = BaseModel.PORT_DATA_CONFIG.game_smallSettlement.interfaceId;
            }
            switch(requestInterfaceId){
                case  BaseModel.PORT_DATA_CONFIG.game_requestSystemSendHand.interfaceId://推送系统发牌
                    this.fapai(data,this.sendData.bind(this));
                    break;
                case  BaseModel.PORT_DATA_CONFIG.game_playHand.interfaceId://推送玩家出牌
                    this.chupai(data,this.sendData.bind(this));
                    break;
                case  BaseModel.PORT_DATA_CONFIG.game_action.interfaceId://推送玩家动作执行操作
                    this.action(data,this.sendData.bind(this));
                    break;
                case  BaseModel.PORT_DATA_CONFIG.game_smallSettlement.interfaceId://推送玩家小结算
                    this.xjs(data,this.sendData.bind(this));
                    break;
                case  BaseModel.PORT_DATA_CONFIG.game_bigSettlement.interfaceId://推送大结算
                    PopupLayer.getInstance().addHintView("该房间已解散，不再生成回放数据！",function () {
                        BaseModel.getInstance().eventRadio("playbackOver");
                    },false);
                    break;
                default:
                    MyConsole.getInstance().trace("重大失誤->回放模式下 拦截的请求没可执行操作---1"+requestInterfaceId,0);
                    break;
            }
        }else{
            MyConsole.getInstance().trace("重大失誤->回放模式下 拦截的请求没可执行操作---2"+requestInterfaceId,0);
        }
    }
    /*請求發牌處理*/
    public fapai(jsonData,sendDataFun){
        //请求系统发牌-》 系统推送发牌
        if(jsonData.interfaceId==BaseModel.PORT_DATA_CONFIG.game_systemSendHandHandAni.interfaceId){
            var info=jsonData.jsonStr.faPaiUser;
            if(jsonData.jsonStr.hasActionUser){
                if(!info)info=jsonData.jsonStr.hasActionUser;
                info.actionUserId=jsonData.jsonStr.hasActionUser.userId;//动作人ID
                info.actionInfo=jsonData.jsonStr.hasActionUser.actionInfo;//动作
                info.paiInfo=jsonData.jsonStr.hasActionUser.paiInfo;//牌信息
                info.playStatus=jsonData.jsonStr.hasActionUser.playStatus;//牌信息
                MyConsole.getInstance().trace("回放功能-請求發牌完有动作");
            }else if(info.actionInfo){
                info.actionUserId=info.userId;//动作人ID
            }
            sendDataFun(jsonData.interfaceId,info);
        }else{
            MyConsole.getInstance().trace("【"+BaseModel.PORT_DATA_CONFIG.game_systemSendHandHandAni.interfaceId+"】重大失誤->回放模式下 數據不匹配【請求發牌處理】"+jsonData.interfaceId,0);
        }
    }
    /*玩家出牌*/
    public chupai(jsonData,sendDataFun){
        //玩家出牌 -》系统推送玩家出牌
        if(jsonData.interfaceId==BaseModel.PORT_DATA_CONFIG.game_playHandAni.interfaceId){
            var info=jsonData.jsonStr.chuUser;
            info.actionUserId=info.userId;
            if(jsonData.jsonStr.hasActionUser){
                if(!info)info=jsonData.jsonStr.hasActionUser;
                info.actionUserId=jsonData.jsonStr.hasActionUser.userId;//动作人ID
                info.actionInfo=jsonData.jsonStr.hasActionUser.actionInfo;//动作
                info.paiInfo=jsonData.jsonStr.hasActionUser.paiInfo;//牌信息
                MyConsole.getInstance().trace("回放功能-出完牌有动作");
            }else if(jsonData.jsonStr.needFaUser){
                info.needFaPai=true;//有动作时不需要请求系统发牌
            }
            sendDataFun(jsonData.interfaceId,info);
        }else{
            MyConsole.getInstance().trace("【"+BaseModel.PORT_DATA_CONFIG.game_playHandAni.interfaceId+"】重大失誤->回放模式下 數據不匹配【請求打牌處理】"+jsonData.interfaceId,0);
        }
    }
    /*玩家动作执行操作*/
    public action(jsonData,sendDataFun){
        //玩家动作操作 -》系统推送玩家动作操作
        if(jsonData.interfaceId==BaseModel.PORT_DATA_CONFIG.game_CPGAni.interfaceId){
            var info=jsonData.jsonStr.actionUser;
            if(jsonData.jsonStr.hasActionUser){
                if(!info)info=jsonData.jsonStr.hasActionUser;
                info.actionUserId=jsonData.jsonStr.hasActionUser.userId;//动作人ID
                info.actionInfo=jsonData.jsonStr.hasActionUser.actionInfo;//动作
                info.paiInfo=jsonData.jsonStr.hasActionUser.paiInfo;//牌信息
                info.needFaPai=false;//有动作时不需要请求系统发牌
                MyConsole.getInstance().trace("回放功能-动作执行完有动作");
            }else if(jsonData.jsonStr.needFaUser){
                info.needFaPai=true;//有动作时不需要请求系统发牌
            }
            sendDataFun(jsonData.interfaceId,info);
        }else{
            MyConsole.getInstance().trace("【"+BaseModel.PORT_DATA_CONFIG.game_playHandAni.interfaceId+"】重大失誤->回放模式下 數據不匹配【請求动作處理】"+jsonData.interfaceId,0);
        }
    }
    /*小结算*/
    public xjs(jsonData,sendDataFun){
        var info=jsonData.jsonStr;
        //切换场景
        this.dispatchEvent(new egret.Event("xjs"));
        //发送数据
        sendDataFun(jsonData.interfaceId,info);
    }
    /*发送数据*/
    public sendData(interfaceId,info){
        setTimeout(function () {
            if(this&&this._isPlay){
                //判断小结算
                if(this.over==0&&this.allGameStepDataList[this.gameStepNum+1]&&this.allGameStepDataList[this.gameStepNum+1].interfaceId==BaseModel.PORT_DATA_CONFIG.game_smallSettlement.interfaceId){
                    this.over=1;
                    setTimeout(function () {
                        if(this)this.nextPlaybackInfo({data:1});
                    }.bind(this),2000);
                }
                this.webSocketModel.playbackModelRadioServiceInfo(interfaceId,info,this.gameStepNum);

                this.currentPauseInfo={interfaceId:interfaceId,info:info};
            }else{
                this.currentPauseInfo={
                    interfaceId:interfaceId,
                    info:info
                }
            }
        }.bind(this),this.speedTimer);
    }
    /*---------------------------回放流程控制---------------------------------*/
    /*播放*/
    public play(){
        if(!this._isPlay){
            this._isPlay=true;
            BaseModel.PLAYBACK_PAUSE = false;
            //恢复
            if(this.currentPauseInfo){
                this.sendData(this.currentPauseInfo.interfaceId,this.currentPauseInfo.info);
                this.currentPauseInfo=null;
            }
        }
    }
    /*暂停*/
    public pause(){
        if(this._isPlay) this._isPlay=false;
        BaseModel.PLAYBACK_PAUSE = true;
    }
    /*切换速度*/
    public setSpeed(speed=1500){
        this.speedTimer=speed;
    }
    public clear(){
        this.allGameStepDataList=this.init_roomInfo=this.init_userInfo=this.init_anotherUsers=null;
        this.gameStepNum=0;
        this.currentUserId=0;
        this.speedTimer=500;
        this._isPlay=true;
        this.currentPauseInfo = null;
        this.over = 0;
        this.startActionId = 1;
        this.webSocketModel.removeEventListener("nextPlaybackInfo",this.nextPlaybackInfo,this);
    }
}