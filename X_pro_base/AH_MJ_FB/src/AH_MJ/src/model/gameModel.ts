/**
 * 创建者 伟大的周鹏斌大王 on 2017/6/17.
 */
class AH_GameModel extends BaseModel{
    /*当前场景*/
    public currentScene:number=-1;
    public backLayerModel:Game_backLayerModel;//背景
    public playingModel:Game_playingModel;//游戏中
    public roomInfoModel:Game_RoomInfoModel;//房间信息
    public userGroupModel:UserGroupModel;//所有用户数据控制中心
    public playbackModel:PlaybackModel;//2.1.4 回放功能
    public netWorkModel:AH_networkQualityModel;//网络质量 唐山2.2.2 添加
    public constructor(userGroupModel){
        super();
        this.currentScene=BaseModel.GAME_SCENE_loading;/*设置游戏场景关闭*/
        this.userGroupModel=userGroupModel;
        this.roomInfoModel=new Game_RoomInfoModel();
        this.backLayerModel=new Game_backLayerModel(this.roomInfoModel,this.userGroupModel);
        this.playingModel=new Game_playingModel(this.roomInfoModel,this.userGroupModel);
        this.netWorkModel = new AH_networkQualityModel();

        /*---------------------接收-------------------*/
        //改变玩家游戏中状态
        this.playingModel.addEventListener("changePlayerStatus",this.updatePlayerStatus,this);
        // //发起网络质量检测
        // BaseModel.getInstance().addEventListener(BaseModel.GAME_CHANGE_VIEW_checkNetWork,this.checkNetWorkState,this);
        //接收 表情文字语音
        this.addRadioEvent(BaseModel.PORT_DATA_CONFIG.game_chatAni,this.updatePlayerChatStatus.bind(this));
        //接收 解散所有玩家实时操作信息
        this.addRadioEvent(BaseModel.PORT_DATA_CONFIG.game_dissolveRoom,this.dissolveRoomAgree.bind(this));
        this.addRadioEvent(BaseModel.PORT_DATA_CONFIG.game_dissolveRoomAgree,this.dissolveRoomAgree.bind(this));
        //接收 解散房间最终结果消息
        this.addRadioEvent(BaseModel.PORT_DATA_CONFIG.game_quitRoom,this.dissolveRoomResult.bind(this));
        //接收 小结算推送
        this.addRadioEvent(BaseModel.PORT_DATA_CONFIG.game_smallSettlement,this.smallSettlement.bind(this));
        //接收大结算推送
        this.addRadioEvent(BaseModel.PORT_DATA_CONFIG.game_bigSettlement,this.bigSettlement.bind(this));
        //接受被踢提示
        this.addRadioEvent(BaseModel.PORT_DATA_CONFIG.game_beRemovedPlayer,this.removePlayerResult.bind(this));
        /*接收 系统主动解散房间通知*/
        this.addRadioEvent(BaseModel.PORT_DATA_CONFIG.game_systemDissolveRoom,this.systemDissolveRoom.bind(this));
        /*接收 房主踢人提示*/
        this.addRadioEvent(BaseModel.PORT_DATA_CONFIG.hall_deleteUser,this.hostDeleteUserInfo.bind(this));
        //动作ID出错
        this.addRadioEvent(BaseModel.PORT_DATA_CONFIG.game_actionIDError,this.updateMainInfo.bind(this));
        //====接收 准备成功
        this.addRadioEvent(BaseModel.PORT_DATA_CONFIG.game_settlementWaitOk,this.waitOk.bind(this));
        /*---------------------发起-------------------*/
        //发起 发送表情
        BaseModel.getInstance().addEventListener("changeChatStatus",this.sendPlayerChatStatus,this);
        //发起----解散房间
        BaseModel.getInstance().addEventListener("sponsorGameKillRoom",this.sponsorGameKillRoom,this);
        //点击大小结算界面确认按钮
        BaseModel.getInstance().addEventListener("settlement_waitOk",this.settlement_waitOk,this);
        //发起 同意或拒绝解散房间
        BaseModel.getInstance().addEventListener("agreeDissolveRoom",this.agreeDissovleRoom,this);
        //发起 解散房间成功 发起大结算
        BaseModel.getInstance().addEventListener("sponsorBigSettlement",this.sponsorBigSettlement,this);
        /*大结算 分享*/
        BaseModel.getInstance().addEventListener("settlementShare",this.settlementShare,this);
        /*等待开局阶段 进入游戏发起准备成功*/
        BaseModel.getInstance().addEventListener("settlementWaitOk",this.settlementWaitOk,this);
        /*开局前踢人*/
        BaseModel.getInstance().addEventListener("deleteUser",this.deleteUser,this);
    }
    /*------------大接口数据解析-----推送消息------------------*/
    /*正常模式下 更新大接口*/
    protected linshiData;
    public updateGameInfo(info=null) {
        if(!info)info=this.linshiData;//没办法 被动刷新
        var status=Number(info.roomInfo.status);
        this.judgeSceneStatus(status);//判断场景状态
        switch (this.currentScene) {
            case BaseModel.GAME_SCENE_loading:/*游戏场景还未加载*/
                //保存数据
                this.linshiData=info;
                //開局初始化
                this.newGameInit();
                //更新房间信息
                this.updateRoomInfo(info.roomInfo);
                //开始检测网络质量
                this.netWorkModel.start();
                break;
            case BaseModel.GAME_SCENE_cutScene:/*游戏场景加载完毕 场景还没渲染*/
                MyConsole.getInstance().trace("开始切换游戏内部场景");
                //保存数据
                this.linshiData=info;
                //更新房间信息
                this.updateRoomInfo(info.roomInfo);
                //播放背景音效
                SoundModel.playBackSound("game");
                //開始切换场景
                this.judgeCutScene(status);

                //zpb测试代碼
                this.webSocketModel.createRoomOk(this.roomInfoModel.roomSn);
                break;
            case BaseModel.GAME_SCENE_prepare:/*等待开局*/
                //保存数据
                this.linshiData=info;
                //是否需要切换场景
                if(!this.judgeCutScene(status)){
                    //更新房间信息
                    this.updateRoomInfo(info.roomInfo);
                    //更新玩家基础信息
                    this.backLayerModel.updatePlayerInfo(info.anotherUsers);
                    //房主 等待4人凑齐弹出 开局按钮
                    this.userGroupModel.playerTogetherInfo();
                }
                break;
            case BaseModel.GAME_SCENE_playing:/*游戏中*/
                //保存数据
                this.linshiData=info;
                //是否需要切换场景
                if(!this.judgeCutScene(status)){
                    //更新房间信息
                    this.updateRoomInfo(info.roomInfo);
                    //更新玩家基础信息
                    this.backLayerModel.updatePlayerInfo(info.anotherUsers);
                    //更新玩家牌信息
                    this.playingModel.updatePlayerInfo();
                    //解散房间信息
                    this.setDissolveRoom(info.roomInfo.dissolveRoom);
                    //测试
                    if(this.userGroupModel.user1Model.zhuang){
                        //測試更新牌
                        egret["AH_setSystemSendCard"]=this.webSocketModel.setSystemSendCard.bind(this.webSocketModel);
                        //更新测试页面房间号
                        this.webSocketModel.systemSendCardOk(this.roomInfoModel.roomSn,this.userGroupModel.user1Model.position);
                    }else{
                        egret["AH_setSystemSendCard"]=null;
                    }
                }
                break;
            case BaseModel.GAME_SCENE_waiting:/*准备中*/
                //保存数据
                this.linshiData=info;
                //是否需要切换场景
                if(!this.judgeCutScene(status)){
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
                MyConsole.getInstance().trace("游戏场景-没有此类型场景" + this.currentScene,0);
                break;
        }
    }
    /*判断场景状态是否合法*/
    public judgeSceneStatus(status){
        switch (status) {
            case BaseModel.GAME_SCENE_loading:/*游戏场景还未加载*/
                break;
            case BaseModel.GAME_SCENE_cutScene:/*游戏场景加载完毕 场景还没渲染*/
                break;
            case BaseModel.GAME_SCENE_prepare:/*等待开局*/
                MyConsole.getInstance().trace("要刷新的场景是 等待玩家凑齐开局中");
                break;
            case BaseModel.GAME_SCENE_playing:/*游戏中*/
                MyConsole.getInstance().trace("要刷新的场景是 游戏打牌过程中");
                //this.updateMainInfoModel.resetTimer(UpdateMainInfoModel.playingMaxNum);
                break;
            case BaseModel.GAME_SCENE_waiting:/*准备中*/
                MyConsole.getInstance().trace("要刷新的场景是 准备下一局开始中");
                break;
            default:
                MyConsole.getInstance().trace("要刷新的场景是-不存在" + status,0);
                break;
        }
    }
    /*开局初始化*/
    protected newGameInit(){
        this.roomInfoModel.initData();
    }
    /*等待开局阶段 进入游戏发起准备成功*/
    protected waitOk(info){
        if(info)this.userGroupModel.updateUsersPlayStatus(info);
        if(this.userGroupModel.user1Model.playStatus != BaseModel.PLAYER_XJS){
            this.updateMainInfo();
        }
    }
    /*切换场景判断*/
    protected judgeCutScene(status,info=null){
        /*切换场景*/
        if(this.currentScene!=Number(status)){
            this.currentScene=Number(status);
            this.dispatchEvent(new egret.Event(this.currentScene+""));
            return true;
        }
        return false;
    }
    /*解散房间处理*/
    protected setDissolveRoom(data){
        if(data&&data.othersAgree){
            //填充玩家信息
            this.userGroupModel.setSettlementUserInfo(data.othersAgree);
            //填充发起人信息
            var userModel=this.userGroupModel.userIdGetUserModel(data.userId);
            data["userName"]=userModel.openName;
            data["userImg"]=userModel.openImg;
            //更新解散房间信息
            this.roomInfoModel.updateKillRoomInfo(data,this.userGroupModel.user1Model.userId) ;
        }
    }
    /*--------回放model初始化 currentUserId第一人称视角的玩家ID------*/
    public initPlaybackModel(data,currentUserId,index,cTime){
        //初始回放模块
        this.playbackModel=new PlaybackModel(data,currentUserId,index,cTime);
        this.playingModel.playbackModel=this.playbackModel;
        this.playbackModel.addEventListener("xjs",this.playbackXJS,this);
        //固定场景
        this.currentScene=BaseModel.GAME_SCENE_playing;//游戏中
        //開局初始化
        this.newGameInit();
        //更新房间信息
        this.updateRoomInfo(this.playbackModel.init_roomInfo);
        //更新第一视角玩家基础信息
        this.userGroupModel.initUserModel1();//第一人称视角玩家
        this.userGroupModel.setSelfBaseInfo(this.playbackModel.init_userInfo);
        //更新其他视角玩家基础信息
        this.userGroupModel.initOtherModel();//其他玩家
        this.backLayerModel.updatePlayerInfo(this.playbackModel.init_anotherUsers);
        //播放背景音效
        SoundModel.playBackSound("game");
    }
    /*回放模式下 更新大接口*/
    public updateGamePlaybackInfo(){
        //更新玩家牌信息
        this.playingModel.updatePlayerInfo();
    }
    /*回放模式结束 处理*/
    public gamePlaybackOver(){
        if(this.playbackModel){
            this.playbackModel.clear();
            this.playbackModel = null;
            /*清理回放模式下all玩家数据*/
            this.userGroupModel.clearUserModel();
            /*恢复第一个玩家信息 有可能回放的第一人称视角玩家 不是当前这个账号玩家自己 所以要重新更正一哈玩家ID*/
            this.userGroupModel.initUserModel1();
        }
    }
    /*-----------------------------大小结算------------------*/
    /*判断是否荒庄*/
    protected checkIsHuang(info){
        var isHuang = true;
        for(var i in info.userInfos){
            if(info.userInfos[i].winInfo){
                isHuang = false;
            }
        }
        info["isHuang"] = isHuang;

    }
    /*判断当前用户小结算是否赢了*/
    protected checkSmallSettleIsWin(info){
        var currentUserWin = false;
        var selfUserId=this.userGroupModel.user1Model.userId;
        for(var i in info.userInfos){
            if(info.userInfos[i].userId == selfUserId){
                currentUserWin = info.userInfos[i].isWin;
            }
        }
        info["currentUserWin"] = currentUserWin;
        info["currentId"] = selfUserId;
    }
    /*回放模式下小结算*/
    protected playbackXJS(){
        if(BaseModel.PLAYBACK_MODEL){
            this.currentScene=BaseModel.GAME_SCENE_playing;
        }
    }
    /*小结算统计*/
    protected smallSettleStatistic(){
        //次数统计
        AH_statisticService.getInstance().smallSettleTimes();

        //统计 小结算时间
        var nowTime = new Date().getTime();//egret.getTimer();
        var disTime,level="";
        disTime = nowTime - this.roomInfoModel.xjst;
        if(disTime <= 5*60*1000) level = "children1";
        else if(disTime <= 10*60*1000) level = "children2";
        else if(disTime <= 15*60*1000) level = "children3";
        else if(disTime <= 20*60*1000) level = "children4";
        else if(disTime <= 30*60*1000) level = "children5";
        else level = "children6";
        AH_statisticService.getInstance().oneRoundOverTime(level);
    }
    /*小结算-推送*/
    protected smallSettlement(info){
        this.smallSettleStatistic();

        if(this.currentScene==BaseModel.GAME_SCENE_playing){
            this.currentScene = BaseModel.GAME_SCENE_cutScene;//解决小结算刷新后，桌面牌清除不干净的问题
            if(info&&info.userInfos) {
                var huUser;
                /*设置所有玩家状态*/
                this.updatePlayerStatus({data: {type: "settlement"}});
                this.checkIsHuang(info);
                this.checkSmallSettleIsWin(info);
                /*填充数据*/
                var data = this.userGroupModel.setSettlementUserInfo(info.userInfos);
                huUser = data[0];
                info.userInfos = data[1];
                /*更新剩余局数*/
                this.roomInfoModel.lastNum = Number(info.lastNum);
                MyConsole.getInstance().trace("剩余圈数"+this.roomInfoModel.lastNum);
                /*小结算要播放胡的动画*/ //===>tyq 重复播放了
                // if (huUser && huUser.userId) this.playingModel.cpgMessage(huUser);
                /*玩家游戏信息初始化*/
                this.userGroupModel.initUserCardInfo();
                /*最新出牌信息初始化*/
                this.roomInfoModel.initLastCardModel();
                /*等待 2秒出现弹窗*/
                var self = this;
                setTimeout(function () {
                    //移除桌面提示的大牌
                    self.playingModel.dispatchEventWith(BaseModel.GAME_CHANGE_VIEW_removeSendCardAni,false);  //东丰 2.2.0 添加 解決荒庄后，打牌提示残留问题
                    /*处理数据*/
                    PopupLayer.getInstance().addSmallSettleView(info.userInfos, info.isHuang, info.currentUserWin,info.currentId,self.roomInfoModel,self.playbackModel);
                }, 2000);
                if(info.isHuang) this.playingModel.dispatchEvent(new egret.Event(BaseModel.GAME_CHANGE_VIEW_updatePLayCardArrows));
            }
        }else{
            MyConsole.getInstance().trace("重大失误 小结算场景 不对"+this.currentScene,0);
        }

    }
    /*大结算统计*/
    protected bigSettleStatistic(info){
        //次数统计
        AH_statisticService.getInstance().maxSettleTimes();
        /*总局数统计*/
        if(info[0].xjn){
            var xjn = Number(info[0].xjn);
            var num = "";
            if(xjn<=2) num="children1";
            else if(xjn<=4) num="children2";
            else if(xjn<=6) num="children3";
            else if(xjn<=8) num="children4";
            else if(xjn<=12) num="children5";
            else num = "children6";
            AH_statisticService.getInstance().roundCount(num);
        }
        /*大结算结算需要的时间*/
        var nowTime =  new Date().getTime();//egret.getTimer();
        var disTime = nowTime-this.roomInfoModel.ct;
        var level = "";
        if(disTime <= 20*60*1000) level = "children1";
        else if(disTime <= 30*60*1000) level = "children2";
        else if(disTime <= 40*60*1000) level = "children3";
        else if(disTime <= 60*60*1000) level = "children4";
        else if(disTime <= 80*60*1000) level = "children5";
        else level = "children6";
        AH_statisticService.getInstance().allOverTime(level);
    }
    /*大结算-推送*/
    protected bigSettlement(info){
        this.bigSettleStatistic(info);
        //关闭网络检测
        this.netWorkModel.stop();

        /*处理数据 正常情况下是在等待状态大结算 如果解散房间状态下的话 大结算是在游戏中*/
        if(this.currentScene==BaseModel.GAME_SCENE_cutScene||this.currentScene==BaseModel.GAME_SCENE_playing || BaseModel.GAME_SCENE_waiting){
            if(info) {
                /*设置所有玩家状态*/
                this.updatePlayerStatus({data: {type: "settlement"}});
                /*填充数据*/
                for (var i in info) {
                    var userModel: UserModel = this.userGroupModel.userIdGetUserModel(info[i].userId);
                    info[i]["userName"] = userModel.openName;
                    info[i]["userImg"] = userModel.openImg;
                }
                /*混牌初始化*/
                this.playingModel.dispatchEvent(new egret.Event("updateHunPaiInfo"));
                /*处理数据*/
                PopupLayer.getInstance().addMaxSettleView(info,this.userGroupModel.user1Model.userId,this.roomInfoModel.roomSn);
            }else{
                MyConsole.getInstance().trace("重大失误 大结算场景 没数据",0);
            }
        }else{
            MyConsole.getInstance().trace("重大失误 大结算场景 不对"+this.currentScene,0);
        }
    }
    /*小结算大结算 完成 点击确认按钮的处理*/
    protected settlement_waitOk(e){
        var type=e.data;
        if(type=="small"){
            //小结算准备ok
            if(this.roomInfoModel.lastNum<0){//最后一圈完毕
                this.sponsorBigSettlement();
            }else{
                //发起准备成功接口
                this.settlementWaitOk();
            }
        }else{
            //大结算准备ok 发动大接口 返回大厅
            this.updateMainInfo();
        }
    }
    /*小结算完毕发起准备成功*/
    protected settlementWaitOk(){
        //发起准备成功接口
        this.webSocketModel.settlementWaitOk({
            roomSn:this.roomInfoModel.roomSn,
            userId:this.userGroupModel.user1Model.userId
        });
    }
    /*发起 大结算*/
    protected sponsorBigSettlement(){
        //发起大结算
        this.webSocketModel.bigSettlement({
            roomSn:this.roomInfoModel.roomSn
        });
    }
    /*大结算分享按钮*/
    protected settlementShare(e){
        var userList = e.data;
        WeiXinJSSDK.getInstance().settlementShare(this.roomInfoModel.roomSn,userList)
    }
    /*----------------------------数据更新----------------------*/
    //scene调用--刷新场景
    public updateSceneInfo(){
        this.dispatchEvent(new egret.Event(this.currentScene+""));
    }
    /*更新房间信息*/
    protected updateRoomInfo(info){
        /*设置基础信息*/
        this.roomInfoModel.setParams(info);
        /*设置最新出牌信息*/
        this.roomInfoModel.setNewPlayHandUserInfo(info.lastPai,info.lastUserId);
        //设置分享
        var totalNum = this.roomInfoModel.totalNum;
        var maxScore = this.roomInfoModel.maxScore;
        WeiXinJSSDK.getInstance().gameShare(this.roomInfoModel.roomSn,totalNum,maxScore,this.roomInfoModel.openName);
    }
    /*玩家出牌 和 系统发牌时更新玩家状态*/
    protected updatePlayerStatus(e){
        var info=e.data;
        var userModel:UserModel,type=info.type,userId=info.userId;
        if(type=="systemSendHand"){//系统发牌
            for(var i=1;i<=4;i++){
                userModel=this.userGroupModel.numIdGetUserModel(i);
                if(userModel.userId==Number(userId)){
                    //当前用户为出牌状态
                    userModel.playStatus=BaseModel.PLAYER_CHU;
                }else{
                    //其他人等待状态
                    userModel.playStatus=BaseModel.PLAYER_WAIT;
                }
            }
        }else if(type=="userPlayHand"){//玩家出牌
            for(var i=1;i<=4;i++){
                userModel=this.userGroupModel.numIdGetUserModel(i);
                //所有人都为等待状态
                userModel.playStatus=BaseModel.PLAYER_WAIT;
            }
        }else if(type=="settlement"){//结算状态
            for(var i=1;i<=4;i++){
                userModel=this.userGroupModel.numIdGetUserModel(i);
                //所有人都为等待状态
                userModel.playStatus=BaseModel.PLAYER_WAIT;
            }
        }
        //更新风向
        this.backLayerModel.updateClock();
    }
    // //检测网络质量，发起后端接口
    // protected checkNetWorkState(e){
    //     //走后端接口告诉后端信号质量
    //     var data = {
    //         "type":100,
    //         "idx":e.data,
    //         "roomSn":this.roomInfoModel.roomSn,
    //         "userId":this.userGroupModel.user1Model.userId
    //     };
    //     this.webSocketModel.sendChatInfo(data);
    //     this.updatePlayerChatStatus(data);
    // }
    //接收-播放玩家聊天表情文字语音
    protected updatePlayerChatStatus(data){
        if(this.currentScene!=BaseModel.GAME_SCENE_loading){
            if(data && data.userId){
                var model = this.userGroupModel.userIdGetUserModel(data.userId);
                data.point = this.backLayerModel.headPos[model.num_id-1];
                if(Number(data.type) == 100){
                    this.netWorkModel.getNetworkOk(data);//收到网络检测
                }else{
                    model.dispatchEventWith(BaseModel.GAME_CHANGE_VIEW_chatStatus,false,data);
                }
            }else{
                MyConsole.getInstance().trace("重大错误，表情数据为空",0);
            }
        }else{
            MyConsole.getInstance().trace("当前状态，无法显示表情",0);
        }

    }
    //玩家发起聊天表情文字语音
    protected sendPlayerChatStatus(e:egret.Event){
        var current = new Date().getTime();//egret.getTimer();
        if(current - this.backLayerModel.lastChatTime>=2000){
            this.backLayerModel.lastChatTime = current;
            var info = {},sendInfo={};
            info["userId"]=sendInfo["userId"] = this.userGroupModel.user1Model.userId;
            info["roomSn"]=sendInfo["roomSn"]= this.roomInfoModel.roomSn;
            info["idx"] =sendInfo["idx"]= e.data.idx;
            info["type"] =sendInfo["type"] =e.data.type;
            //本地播放
            this.updatePlayerChatStatus(info);
            //发送数据
            this.webSocketModel.sendChatInfo(sendInfo);
        }else{
            PopupLayer.getInstance().floatAlert("聊天过于频繁");
        }
    }
    /*-----------------------------解散房间--------------------*/
    /*发起解散房间 或者发起退出房间操作*/
    protected sponsorGameKillRoom(){
        if(this.currentScene == BaseModel.GAME_SCENE_prepare){//等待时
            //房主自己
            if(this.userGroupModel.user1Model.houseOwner && this.roomInfoModel.roomType==1){
                PopupLayer.getInstance().addHintView("当前解散房间，不消耗房卡!",function () {
                    //退出房间
                    this.webSocketModel.quitRoom({
                        roomSn:this.roomInfoModel.roomSn,
                        userId:this.userGroupModel.user1Model.userId
                    });
                }.bind(this),true,"min");
            }else{//其他人
                //退出房间
                this.webSocketModel.quitRoom({
                    roomSn:this.roomInfoModel.roomSn,
                    userId:this.userGroupModel.user1Model.userId
                });
            }
        }else if(this.currentScene == BaseModel.GAME_SCENE_playing||this.currentScene == BaseModel.GAME_SCENE_waiting){
            //游戏中 或者小结算/等待
            //发起解散房间
            this.webSocketModel.sponsorDissolveRoom({
                roomSn:this.roomInfoModel.roomSn,
                userId:this.userGroupModel.user1Model.userId
            });
        }else{//未知
            PopupLayer.getInstance().addHintView("当前阶段无法发起解散房间",null,true,"min");
        }
    }
    /*接收 解散房间时所有玩家实时操作信息*/
    protected dissolveRoomAgree(data){
        if(data){
            if(Number(data.reqState)==4){//房间不存在
                this.updateMainInfo();//返回大厅
            }else if(data.othersAgree){
                /*处理解散房间*/
                this.setDissolveRoom(data);
            }else{
                MyConsole.getInstance().trace("重大失误 解散房间时所有玩家实时操作信息为空-2",0);
            }
        }else{
            MyConsole.getInstance().trace("重大失误 解散房间时所有玩家实时操作信息为空-1",0);
        }
    }
    /*发起 同意或者拒绝解散房间*/
    protected agreeDissovleRoom(e){
        if(e.data){
            this.webSocketModel.dissolveRoomOperation({
                roomSn:this.roomInfoModel.roomSn,
                userId:this.userGroupModel.user1Model.userId,
                userAgree:e.data.agree
            });
        }else{
            MyConsole.getInstance().trace("发起 同意或者拒绝解散房间 没数据",0);
        }
    }
    /*接收 解散房间最终结果*/
    protected dissolveRoomResult(info){
        if(info){
            switch(info.type){
                case "exist"://玩家退出
                    this.updateMainInfo();//返回大厅
                    break;
                case "dissolve":// 房间被解散
                    //房主自己
                    if(this.userGroupModel.user1Model.houseOwner){
                        this.updateMainInfo();//返回大厅
                    }else{//其他人
                        PopupLayer.getInstance().addHintView("该房间已被房主解散!",this.updateMainInfo.bind(this),false,"min");
                    }
                    break;
                default:
                    MyConsole.getInstance().trace("重大失误 解散房间最终结果 类型不存在"+info.type,0);
                    break;
            }
        }else{
            MyConsole.getInstance().trace("重大失误 解散房间最终结果信息为空",0);
        }
    }
    protected deleteUser(e){
        var data = e.data;
        PopupLayer.getInstance().addHintView("是否将玩家【"+data.userName+"】踢出本房间？",function () {
            //退出房间
            this.webSocketModel.deleteUser({
                roomSn:this.roomInfoModel.roomSn,
                userId:data.userId
            });
        }.bind(this),true,"min");
    }
    /*接收 房主踢人提示*/
    protected hostDeleteUserInfo(info){
        if(info){
            switch (Number(info.reqState)){
                case 1: PopupLayer.getInstance().floatAlert("踢出房间操作成功",1900);PopupLayer.getInstance().removePopupViewAll();break;
                case 4: PopupLayer.getInstance().floatAlert("<font color='#ff7f50'>房间不存在</font>");break;
                case 6: PopupLayer.getInstance().floatAlert("<font color='#ff7f50'>房间正在游戏中，不允许踢人</font>");break;
                case 8: PopupLayer.getInstance().floatAlert("<font color='#ff7f50'>玩家不存在</font>");break;
            }
        }
    }
    /*接收 踢人結果提示*/
    protected removePlayerResult(info){
        if(info){
            switch(info.type){
                case "exist"://玩家被踢
                    if(Number(info.userId) == Number(this.userGroupModel.user1Model.userId)){
                        PopupLayer.getInstance().addHintView("你已被房主踢出本房间!",this.updateMainInfo.bind(this),false,"min");
                    }else{
                        var name = this.userGroupModel.userIdGetUserModel(info.userId).openName;
                        PopupLayer.getInstance().floatAlert("<font color='#ffff00'>"+name+"</font> 已被房主踢出本房间",1900);
                        this.updateMainInfo();
                    }
                    break;
                case "dissolve":// 房间被解散
                    PopupLayer.getInstance().addHintView("该房间已被房主解散!",this.updateMainInfo.bind(this),false,"min");
                    break;
                default:
                    MyConsole.getInstance().trace("重大失误 解散房间或踢出玩家最终结果 类型不存在"+info.type,0);
                    break;
            }
        }else{
            MyConsole.getInstance().trace("重大失误 解散房间或踢出玩家最终结果信息为空",0);
        }
    }
    /*系统主动解散房间通知*/
    protected systemDissolveRoom(info){
        if(info){
            switch (Number(info.reqState)){
                case 12: PopupLayer.getInstance().addHintView("检测到本房间已存在超过5小时，系统自动解散！",this.updateMainInfo.bind(this),false,"min");break;
                case 13: PopupLayer.getInstance().addHintView("检测到本房间已过40分钟未开局，系统自动解散！",this.updateMainInfo.bind(this),false,"min");break;
                default: MyConsole.getInstance().trace("重大失误 系统主动解散房间通知 状态不存在"+info.reqState,0);break;
            }
        }
    }
    /*---------------------------------------------------------*/
    /*被动请求大接口数据 强制刷新*/
    protected updateMainInfo(){
        this.dispatchEvent(new egret.Event("getMainInfo"));
    }
    /*清理事件和数据*/
    public clear(){
        super.clear();
    }
}