/**
 * Created by 伟大的周鹏斌大王 on 2017/7/6.
 */
class AH_Game_playingModel extends AH_BaseModel{
    /*玩家信息*/
    public userGroupModel:UserGroupModel;
    /*房间信息*/
    public roomInfoModel:Game_RoomInfoModel;
    public playbackModel:PlaybackModel;//2.1.4 回放功能
    public constructor(roomInfoModel,userGroupModel){
        super();
        this.roomInfoModel=roomInfoModel;
        this.userGroupModel=userGroupModel;
        //请求系统发牌
        BaseModel.getInstance().addEventListener(BaseModel.GAME_CHANGE_VIEW_requestSendCard,this.requestSystemSendHand,this);
        //玩家出牌
        BaseModel.getInstance().addEventListener(BaseModel.GAME_CHANGE_VIEW_playerSendCard,this.playerSendCard,this);
        //吃碰杠胡 操作完毕 告诉后台
        BaseModel.getInstance().addEventListener(BaseModel.GAME_CHANGE_VIEW_playerChooseActionOk,this.addChooseActionOk,this);
        //更新 桌牌箭頭提示
        BaseModel.getInstance().addEventListener(BaseModel.GAME_CHANGE_VIEW_updatePLayCardArrows,this.updatePLayCardArrows,this);

        //接收---玩家吃碰杠胡操作指令
        this.addRadioEvent(BaseModel.PORT_DATA_CONFIG.game_CPGHAction,this.cpghAction.bind(this));
        //接收---其他玩家吃碰杠操作 播放动画
        this.addRadioEvent(BaseModel.PORT_DATA_CONFIG.game_CPGAni,this.cpgMessage.bind(this));
        //接收---玩家出牌消息 播放动画
        this.addRadioEvent(BaseModel.PORT_DATA_CONFIG.game_playHandAni,this.playerPlayHand.bind(this));
        //接收---系统发牌消息 播放动画
        this.addRadioEvent(BaseModel.PORT_DATA_CONFIG.game_systemSendHandHandAni,this.playerSystemSendHand.bind(this));
    }
    /*---------------------更新玩家牌信息------------------------*/
    public updatePlayerInfo(){
        //牌信息
        this.userGroupModel.setCardInfo();
        //显示最新出的牌
        this.addNewPlayCard();
    }
    /*----------------------出牌操作-------------------------*/
    //玩家选择打出一张牌
    public playerSendCard(e){
        var info:any=e.data;
        //判断玩家是否是出牌状态
        if(info&&this.userGroupModel.getSelfStatus()==BaseModel.PLAYER_CHU&&!this.userGroupModel.user1Model.needFaPai){
            info=[[info.type,info.num]];
            var data={
                "roomSn":this.roomInfoModel.roomSn,
                "userId":this.userGroupModel.user1Model.userId,
                "paiInfo":JSON.stringify(info)
            }
            /*出牌暂停闪烁动画 停止倒计时 停止声音 hyh*/
            SoundModel.stopAllBackEffect();
            /*出牌动画 1.9.6 再次还原*/
            this.playerPlayHand(data,null,true);

            BaseModel.ChuPaiStartTime = new Date().getTime();//egret.getTimer();

            //发送牌数据
            this.webSocketModel.playHand(data);
        }else{
            //还不能出牌
            this.userGroupModel.user1Model.dispatchEvent(new egret.Event("noneSendCard"));
        }
    }
    /*统计 出牌反应时间*/
    protected sendStatisticChuPai(time){
        BaseModel.ChuPaiStartTime = 0;
        BaseModel.ChuPaiEndTime = 0;
        var level = "";
        if(time <= 100) level = "children1";
        else if(time <=500) level = "children2";
        else if(time <=1000) level = "children3";
        else if(time <= 3000) level = "children4";
        else if(time <= 5000) level = "children5";
        else level = "children6";
        AH_statisticService.getInstance().chuPaiActionTime(level);
    }
    /*接收---玩家出牌消息 出牌动画*/
    protected playerPlayHand(info,interfaceId=null,_isInitiative:any=false){
        if(info&&info.paiInfo){
            if(BaseModel.ChuPaiStartTime != 0){
                BaseModel.ChuPaiEndTime = new Date().getTime();//egret.getTimer();
                var disTime = BaseModel.ChuPaiEndTime - BaseModel.ChuPaiStartTime;
                this.sendStatisticChuPai(disTime);
            }
            var paiInfo;
            if(_isInitiative){
                //自己调用 因为等待玩家出牌消息回应 会有一段时间 如果等回应完了在出动画 会有卡顿显示
                //玩家出牌-》自己调用出牌动画 -》系统告诉玩家自己出牌了
                //其他玩家出牌-》系统告诉玩家他出牌了
                _isInitiative=1;//玩家自己调用
                paiInfo=JSON.parse(info.paiInfo);
            }else{
                paiInfo=info.paiInfo;
                if(this.userGroupModel.user1Model.userId==Number(info.userId)){//后端推送 自己出牌接口
                    //销毁上张牌信息
                    this.userGroupModel.user1Model.newSendCardModel=null;
                    this.userGroupModel.user1Model.lastFaPaiJsonStr="";
                    _isInitiative=2;//玩家自己发牌 收到回应
                }else{
                    _isInitiative=3;//其他玩家自己发牌 收到回应
                }
            }
            //其他人出牌 或者自己主动调用出牌接口
            var cardModel:UserModel=this.userGroupModel.userIdGetUserModel(info.userId);
            if(cardModel) {
                var aniData = {
                    cardInfo: paiInfo,
                    userCardInfo: cardModel,
                    _isAction: false
                }

                //回放模式下
                if(BaseModel.PLAYBACK_MODEL){
                    //销毁系统发的最新牌信息
                    cardModel.newSystemCardInfo = null;
                    //减少手牌
                    cardModel.stopHandRemoveOneCard(aniData.cardInfo[0][0], aniData.cardInfo[0][1]);
                    //增加桌牌
                    cardModel.playHandAddOneCard(aniData.cardInfo[0]);
                    //提示最新出的牌
                    aniData["_isAddMoveCardAni"]=true;//出牌动画
                    aniData["_isAddMaxCardAni"]=false;//大牌动画
                    aniData["_isUpdateCard"]=true;//是否更新牌
                    this.addNewPlayCard(aniData);//播放出牌动画
                }else{
                    if(_isInitiative==1||_isInitiative==3){//玩家自己请求之前 和其他玩家收到之后
                        //销毁系统发的最新牌信息
                        cardModel.newSystemCardInfo = null;
                        //减少手牌
                        cardModel.stopHandRemoveOneCard(aniData.cardInfo[0][0], aniData.cardInfo[0][1]);
                        //增加桌牌
                        cardModel.playHandAddOneCard(aniData.cardInfo[0]);
                        //提示最新出的牌
                        aniData["_isAddMoveCardAni"]=true;//出牌动画
                        aniData["_isAddMaxCardAni"]=false;//大牌动画
                        aniData["_isUpdateCard"]=true;//是否更新牌
                        if(_isInitiative==1)this.addNewPlayCard(aniData);//只播放出牌动画
                    }
                }
                if(_isInitiative==2||_isInitiative==3){//玩家自己收到之后 和其他玩家收到之后
                    /*切换玩家最新状态*/
                    this.userGroupModel.setPlayerStatus(info.playStatus,info.actionUserId);
                    //更新房间信息里的最新出的牌信息
                    this.roomInfoModel.setNewPlayHandUserInfo(aniData.cardInfo, info.userId);
                    //吃碰杠胡动作提示
                    aniData._isAction = this.cpghAction(info.actionInfo);
                    //请求发牌判定
                    if(!aniData._isAction)this.requestSystemSendHand(null, info.needFaPai,500); //MyConsole.getInstance().trace("请求系统发牌-发牌后" + info.needFaPai, "custom3");
                    //更新所有玩家状态
                    this.dispatchEventWith("changePlayerStatus", false, {type: "userPlayHand", userId: cardModel.userId});
                    //提示最新出的牌
                    aniData["_isAddMoveCardAni"]=false;//出牌动画
                    aniData["_isAddMaxCardAni"]=true;//大牌动画
                    aniData["_isUpdateCard"]=false;//是否更新牌
                    if(_isInitiative==3){
                        aniData["_isAddMoveCardAni"]=true;//出牌动画
                        aniData["_isUpdateCard"]=true;
                    }//是否更新牌
                    this.addNewPlayCard(aniData);
                }
            }
        }else{
            MyConsole.getInstance().trace("重大失误 该接口--没有玩家出牌信息",0);
        }
    }
    /*最新出的牌 放大提示*/
    public addNewPlayCard(aniData=null){
        if(!aniData){
            if(this.roomInfoModel.lastUserId&&this.roomInfoModel.lastUserId!=this.userGroupModel.user1Model.userId){
                aniData={
                    cardInfo:[[this.roomInfoModel.lastPaiModel.type,this.roomInfoModel.lastPaiModel.num]],
                    userCardInfo:this.userGroupModel.userIdGetUserModel(this.roomInfoModel.lastUserId),
                    _isAddMoveCardAni:true,
                    _isAddMaxCardAni:true,
                    _isUpdateCard:true
                }
            }
        }
        //播放出牌动画
        if(aniData&&aniData.userCardInfo)this.dispatchEventWith(BaseModel.GAME_CHANGE_VIEW_playerSendCardAni,false,aniData);
    }
    /*最新出的牌 箭頭提示*/
    public updatePLayCardArrows(){
        var pHandNewPoint=null;
        if(this.roomInfoModel.lastUserId){
            var model:UserModel=this.userGroupModel.userIdGetUserModel(this.roomInfoModel.lastUserId);
            pHandNewPoint=model.pHandNewPoint;
        }
        this.dispatchEventWith(BaseModel.GAME_CHANGE_VIEW_updatePLayCardArrows,false,pHandNewPoint);
    }
    /*----------------------系统发牌操作-------------------------*/
    /*请求----系统发牌*/
    protected requestSystemSendHand(e,needFaPai:any=-1,delayTimer=100){
        if(!BaseModel.PLAYBACK_MODEL){
            //正常模式下
            if(needFaPai!=-1)this.userGroupModel.user1Model.needFaPai=needFaPai;
            if(this.userGroupModel.user1Model.needFaPai){
                MyConsole.getInstance().trace("请求系统发牌-总","custom3");
                //延迟发送 体验好点
                setTimeout(function () {
                    BaseModel.FaPaiStartTime = new Date().getTime();//egret.getTimer();
                    this.webSocketModel.requestSystemSendHand({
                        userId:this.userGroupModel.user1Model.userId
                    });
                }.bind(this),delayTimer);
            }
        }else{
            //回放模式下
            if(needFaPai||this.userGroupModel.selectNeedFaPaiUser()){
                MyConsole.getInstance().trace("回放功能>>>>>>>>>>>>>>>请求发牌");
                //是否需要请求系统发牌
                this.userGroupModel.setNeedFaPaiUser();//关闭请求出牌状态
                //延迟发送 体验好点
                setTimeout(function () {
                    if(this.playbackModel._isPlay){
                        this.webSocketModel.requestSystemSendHand({
                            userId:this.userGroupModel.user1Model.userId
                        });
                    }
                }.bind(this),this.playbackModel.speedTimer);
            }else if(this.userGroupModel.selectNeedChuUser()){
                MyConsole.getInstance().trace("回放功能>>>>>>>>>>>>>>>请求打牌");
                this.userGroupModel.setNeedChuUser();//关闭发牌状态
                //需要出牌 2.1.4
                this.playbackModel.nextPlaybackInfo({data:{interfaceId:BaseModel.PORT_DATA_CONFIG.game_playHand.interfaceId}});
            }
        }
    }
    /*统计 发牌反应时间*/
    protected sendStatisticsFaPai(time){
        BaseModel.FaPaiStartTime = 0;
        BaseModel.FaPaiEndTime = 0;
        var level = "";
        if(time <= 100) level = "children1";
        else if(time <=500) level = "children2";
        else if(time <=1000) level = "children3";
        else if(time <= 3000) level = "children4";
        else if(time <= 5000) level = "children5";
        else level = "children6";
        AH_statisticService.getInstance().faPaiActionTime(level);
    }
    /*接收---系统发牌消息*/
    protected playerSystemSendHand(info){
        if(info){
            if(info.reqState&&info.reqState==1){
                //牌发完了
                return;
            }
            var cardModel=this.userGroupModel.userIdGetUserModel(info.userId);
            if(cardModel){
                if(BaseModel.FaPaiStartTime != 0){
                    BaseModel.FaPaiEndTime = new Date().getTime();//egret.getTimer();
                    var disTime = BaseModel.FaPaiEndTime - BaseModel.FaPaiStartTime;
                    this.sendStatisticsFaPai(disTime);
                }

                var data;
                if(cardModel.userId==this.userGroupModel.user1Model.userId){
                    if(info.pai){
                        //玩家自己要显示牌
                        data={
                            type:info.pai[0][0],
                            num:info.pai[0][1],
                        }
                        //设置最新系统手牌信息
                        cardModel.setNewSystemCard([[data.type,data.num]]);
                        //插入最新系统手牌信息
                        cardModel.insertSystemStopCard([[data.type,data.num]]);
                        //測試更新牌
                        this.webSocketModel.systemSendCardOk(this.roomInfoModel.roomSn,this.userGroupModel.user1Model.position);
                    }else{
                        MyConsole.getInstance().trace("重大失误 该接口--判断出系统给当前这个玩家发牌 但没有牌具体信息",0);
                    }
                }else{
                    //其他玩家加张牌就好了
                    if(BaseModel.PLAYBACK_MODEL){//回放模式下
                        //玩家自己要显示牌
                        data={
                            type:info.pai[0][0],
                            num:info.pai[0][1],
                        };
                        //设置最新系统手牌信息
                        cardModel.setNewSystemCard([[data.type,data.num]]);
                        //插入最新系统手牌信息
                        cardModel.insertSystemStopCard([[data.type,data.num]]);
                    }else{
                        //设置系统手牌信息
                        cardModel.insertSystemStopCard([[-1,-1]]);
                    }
                }

                /*切换玩家最新状态*/
                this.userGroupModel.setPlayerStatus(info.playStatus,info.actionUserId);
                //剩余牌减少
                this.roomInfoModel.cnrrMJNum = info.mjNum;
                //更新所有玩家状态和风向
                this.dispatchEventWith("changePlayerStatus",false,{type:"systemSendHand",userId:cardModel.userId});
                //更新视图 玩家手牌边边多一张 距离稍微远一点
                //更新手牌视图
                cardModel.dispatchEvent(new egret.Event(BaseModel.GAME_CHANGE_VIEW_playerStopCard));
                //吃碰杠胡动作提示 2.1.4新增 有动作时候必须不能出牌或者 请求系统发牌
                if(this.cpghAction(info.actionInfo)){
                    //移除桌面提示的大牌
                    if(info.actionInfo.userId&&Number(info.actionInfo.userId)==this.userGroupModel.user1Model.userId)//自己
                    this.dispatchEventWith(BaseModel.GAME_CHANGE_VIEW_removeSendCardAni,false);
                }else{
                    //请求发牌判定
                    this.requestSystemSendHand(null,info.needFaPai,100);
                }
            }
        }else{
            MyConsole.getInstance().trace("重大失误 该接口--没有系统发牌信息",0);
        }
    }
    /*----------------------吃碰杠胡操作-------------------------*/
    /*选择吃碰杠胡*/
    protected cpghAction(info){
        if(info&&info.userId){
            if(!BaseModel.PLAYBACK_MODEL){
                if(Number(info.userId)==this.userGroupModel.user1Model.userId&&info.actions){
                    //更新动作信息
                    this.userGroupModel.updateUserCPGHInfo(info.actions);
                }else{//其他玩家有吃碰杠选择 1.9.1
                    //这回经过但不用做处理
                }
            }else{
                //2.1.4 回放功能加上后这得经过
                MyConsole.getInstance().trace("回放功能>>>>>>>>>>>>>>>执行动作");
                this.playbackModel.nextPlaybackInfo({data:{interfaceId:BaseModel.PORT_DATA_CONFIG.game_action.interfaceId}});
            }
        }
        if(info)return true;//有动作的话放大提示的牌应对一直出现 没动作就2秒消失
        return false;
    }
    /*操作选择ok  告诉后台*/
    protected addChooseActionOk(e:egret.Event){
        var model:CpghBtnModel=e.data,pais,toUserId,data,huType,selfUserModel=this.userGroupModel.user1Model;
        if(model.huPaiUserId&&model.huPaiUserId==selfUserModel.userId){ /*自摸后端需求*/
            toUserId=model.huPaiUserId;
            pais=[[selfUserModel.newSendCardModel.type,selfUserModel.newSendCardModel.num]];
            huType=1;/*自摸*/
        }else{/*其他点炮胡或者吃碰杠*/
            toUserId=this.roomInfoModel.lastUserId;
            pais=[[this.roomInfoModel.lastPaiModel.type,this.roomInfoModel.lastPaiModel.num]];
            huType=2;/*点炮*/
        }
        /*后端数据*/
        data={
            roomSn:this.roomInfoModel.roomSn,//房间号码
            userId:selfUserModel.userId,//玩家id
            action:model.type,//动作类型
            toUserId:toUserId,//要吃碰杠胡的那个人
            actionPai:JSON.stringify(pais),//要 吃碰杠胡的那张牌信息
            pais:model.cardJsonInfo,//自己要组个出来的牌
            huType:huType
        };
        // //播放动画  //东丰 2.2.0 舍弃 会导致多删或误删桌牌
        // this.cpgMessage(data,null,true);

        BaseModel.ActionType = Number(model.type);
        if(BaseModel.ActionType == 1 || BaseModel.ActionType ==2 || BaseModel.ActionType==3)
            BaseModel.ActionStartTime = new Date().getTime();//egret.getTimer();
        //发送消息
        this.webSocketModel.cpghAction(data);

    }
    /*统计 动作反应时间*/
    protected sendActionStatisticInfo(time){
        BaseModel.ActionStartTime =0;
        BaseModel.ActionEndTime = 0;

        var level = "";
        if(time <= 100) level = "children1";
        else if(time <=500) level = "children2";
        else if(time <=1000) level = "children3";
        else if(time <= 3000) level = "children4";
        else if(time <= 5000) level = "children5";
        else level = "children6";

        if(BaseModel.ActionType == 1) AH_statisticService.getInstance().chiActionTime(level);
        if(BaseModel.ActionType == 2) AH_statisticService.getInstance().pengActionTime(level);
        if(BaseModel.ActionType == 3) AH_statisticService.getInstance().gangActionTime(level);
    }
    /*接收--其他玩家吃碰杠胡*/
    public cpgMessage(info,interfaceId=null,_isInitiative:any=false){
        if(info&&info.userId){
            BaseModel.ActionEndTime = new Date().getTime();//egret.getTimer();
            if(BaseModel.ActionStartTime != 0){
                var disTime = BaseModel.ActionEndTime - BaseModel.ActionEndTime;
                this.sendActionStatisticInfo(disTime);
            }

            if(_isInitiative){
                //自己调用 因为等待玩家出牌消息回应 会有一段时间 如果等回应完了在出动画 会有卡顿显示
                //玩家出牌-》自己调用出牌动画 -》系统告诉玩家自己出牌了
                //其他玩家出牌-》系统告诉玩家他出牌了
                _isInitiative=1;//玩家自己调用
            }else{
                if(this.userGroupModel.user1Model.userId==Number(info.userId)){//后端推送 自己出牌接口
                    //清空这个人吃碰杠胡动作信息
                    this.userGroupModel.user1Model.actionsList=[];
                    this.userGroupModel.user1Model.actionJsonStr="";
                    //清空最新系统牌信息
                    if(Number(info.action)!=0)this.userGroupModel.user1Model.newSystemCardInfo=null;
                    _isInitiative=2;//玩家自己发牌 收到回应
                }else{
                    _isInitiative=3;//其他玩家自己发牌 收到回应
                }
            }
            var cardModel=this.userGroupModel.userIdGetUserModel(info.userId);
            if(cardModel){
                if(Number(info.userId)==Number(info.toUserId) && Number(info.action)!=0) cardModel.newSystemCardInfo = null;
                if(_isInitiative==2||_isInitiative==3){//玩家自己收到之后 和其他玩家收到之后
                    //刷新操作的人牌信息
                    if(info.paiInfos){
                        //更新出牌状态
                        if(info.playStatus)this.userGroupModel.user1Model.playStatus=info.playStatus;
                        //更新手牌信息
                        this.userGroupModel.updateAssignUserCardInfo(cardModel,info.paiInfos,cardModel.newSystemCardInfo,Number(info.action));
                    }
                    //更新all玩家状态
                    this.userGroupModel.updateUsersPlayStatus(info.playStatusInfo);
                    //更新all玩家分数
                    this.userGroupModel.updateUsersPlayScore(info.gangScoreInfo);
                    //更新风向
                    this.eventRadio(BaseModel.GAME_CHANGE_VIEW_updateClock);
                    //连续吃碰杠胡动作提示 2.1.4 有动作的情况下必然无法请求发牌 或者 出牌
                    if(!this.cpghAction(info.actionInfo)){
                         //请求发牌判定
                        //MyConsole.getInstance().trace("请求系统发牌-动作后"+info.needFaPai,"custom3");
                        this.requestSystemSendHand(null,info.needFaPai,500);
                    }
                }
                // if(_isInitiative==1||_isInitiative==3){  //东丰 2.2.0 舍弃 原因：为了解决当前玩家桌牌被吃碰后残留的问题
                    //刷新被吃碰杠人的桌牌信息
                    if(Number(info.action)!=0&&info.toUserId&&(info.userId != info.toUserId)){//非过 非操作本人牌的时候
                        //移除上家出牌人（牌被操作了）
                        this.roomInfoModel.setNewPlayHandUserInfo(null);
                        //从桌牌减少
                        var toCardModel=this.userGroupModel.userIdGetUserModel(info.toUserId);
                        if(toCardModel){
                            toCardModel.playHandRemoveOneCard();
                            //更新桌牌
                            toCardModel.dispatchEvent(new egret.Event(BaseModel.GAME_CHANGE_VIEW_playerPlayCard));
                        }
                    }
                    //播放动画
                    this.dispatchEventWith(BaseModel.GAME_CHANGE_VIEW_playerCPGHAni,false,{num_id:cardModel.num_id,action:info.action,point:cardModel.cpghAniPoint,gender:cardModel.gender,type:info.huType});
                // }
            }
        }else {
            MyConsole.getInstance().trace("重大失误 该接口--没有吃碰杠胡用户信息",0);
        }
    }
}