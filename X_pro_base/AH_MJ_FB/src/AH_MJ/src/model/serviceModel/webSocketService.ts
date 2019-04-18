/**
 * 创建者 伟大的周鹏斌大王 on 2017/6/19.
 */
class AH_WebSocketService extends AH_baseService{

    //ws://192.168.1.21:51000 本保
    //ws://192.168.1.16:51000 周聰
    //ws://192.168.1.26:51000 张思全
    //ws://192.168.1.137:51000 陈赛
    protected demo_url_zc:string="ws://192.168.1.16:";
    protected demo_url_sbb:string="ws://47.93.227.111:";
    protected demo_url_zsc:string="ws://192.168.1.146:";
    protected demo_url_cs:string="ws://192.168.1.166:";
    protected demo_url_lz:string="ws://192.168.1.156:";
    //远程链接
    protected alpha_url:string="ws://47.93.61.29:";
    protected release_url:string="ws://47.93.227.111:";
    public game_url:string="";
    //唯一id
    protected wsw_sole_main_id=0;/*唯一的大接口id*/
    protected wsw_sole_action_id=0;/*唯一的动作（系统出牌，玩家出牌，玩家吃碰杠胡操作）*/
    //循环发送数据
    protected loopSendInfoTimer={};
    public constructor(){
        super();

        this.demo_url_zc += BaseModel.Port_ID;
        this.demo_url_sbb += BaseModel.Port_ID;
        this.demo_url_zsc += BaseModel.Port_ID;
        this.demo_url_cs += BaseModel.Port_ID;
        this.demo_url_lz += BaseModel.Port_ID;
        this.alpha_url += BaseModel.Port_ID;
        this.release_url += BaseModel.Port_ID;
    }
    /*配置url*/
    public setGameUrl(vId,service_id,roomIp=null){
        switch(vId){
            case 1:
                AH_baseService.host="http://www.aoh5.com/";
                if(service_id){/*后端个人IP地址*/
                    this.game_url=this["demo_url_"+service_id];
                }
                this.setVersionType("demo");
                MyConsole.getInstance().trace("-----本地测试模式-----");
                break;
            case 2:
                AH_baseService.host="http://www.aoh5.com/";
                this.game_url=this.alpha_url;
                this.setVersionType("alpha");
                MyConsole.getInstance().trace(">----线上测试模式----<");
                break;
            case 3:
                AH_baseService.host="http://flfy58.cn/";
                this.game_url=this.release_url;
                this.setVersionType("release");
                MyConsole.getInstance().trace(">****线上发布模式****<");
                break;
            default:
                MyConsole.getInstance().trace(">****未知的模式****<");
                break;
        }
    }

    /*------------------------------------------测试数据-------------------------------------*/
    public testPort(interfaceId,data){
        // if(this.getVersionType()!="release"){
            this.radioServiceInfo(interfaceId,data);
        // }
    }
    /*测试数据*/
    public createRoomOk(roomId){
        // if(this.getVersionType()!="release"){
            if(egret["AH_createRoomOk"]){
                egret["AH_createRoomOk"](roomId);
            }
        // }
    }
    /* 测试大接口次数统计*/
    public test_mainPortNum(num=0){
        // if(this.getVersionType()!="release"){
            if(egret["AH_mainInfoNum"]){
                egret["AH_mainInfoNum"](num);
            }
        // }
    }
    /*发牌后刷新 剩余牌*/
    protected currentPosition=0;//当前风向测试用
    public systemSendCardOk(roomSn,position){
        // if(this.getVersionType()!="release"){
            if(egret["AH_systemSendCard"]){
                this.currentPosition=position;
                this.sendData({
                    interfaceId:BaseModel.PORT_DATA_CONFIG.getSystemCard.interfaceId,
                    roomSn:roomSn
                },false);
            }
        // }
    }
    /*设置剩余牌*/
    public setSystemSendCard(roomSn,list){
        // if(this.getVersionType()!="release"){
            this.sendData({
                interfaceId:BaseModel.PORT_DATA_CONFIG.setSystemCard.interfaceId,
                currentMjs:list,
                roomSn:roomSn
            },false);
        // }
    }
    /*显示当前玩家实时手牌信息*/
    public setPlayStopCardInfo(userId,list){
        // if(this.getVersionType()!="release"){
            var self=this;
            if(egret["AH_setPlayStopCardInfo"]){
                egret["AH_setPlayStopCardInfo"](userId,list,function (cardList,roomSn) {
                    self.sendData({
                        interfaceId:BaseModel.PORT_DATA_CONFIG.setStopCard.interfaceId,
                        userId:userId,
                        currentMjs:JSON.stringify(cardList),
                        roomSn:roomSn
                    },false);
                });
            }
        // }
    }
    /*------------------------数据接口------------------------------------*/
    /*连接socket*/
    public startConnect(){
        if(this.game_url){//正式
            this.connection(this.game_url);
        }else{//测试
            if(this.getVersionType()=="demo"){
                this.onSocketOpen();
            }
        }
    }

    /*主动获取大接口数据*/
    public getMainInfo(openId,userId=null,cId=null,_isLoading=false){
        if(!this.game_url){
            this.radioServiceInfo(BaseModel.PORT_DATA_CONFIG.mainInfo.interfaceId,TestDataModel.mainInfo3);
        }else{
            MyConsole.getInstance().trace("---------发起--------------主动获取大接口数据",888888);
            this.sendData({
                interfaceId:BaseModel.PORT_DATA_CONFIG.mainInfo.interfaceId,
                openId:openId,userId:userId,cId:cId
            },_isLoading);
        }
    }
    /*获取战绩*/
    public getResult(userId,pageRecord){
        if(this.game_url){
            this.sendData({
                interfaceId:BaseModel.PORT_DATA_CONFIG.hall_achievement.interfaceId,
                userId:userId,page:pageRecord
            },true);
        }
    }
    //获取房间回放记录列表
    public getRoomPlaybackList(data){
        if(this.game_url){
            this.sendData({
                interfaceId:BaseModel.PORT_DATA_CONFIG.hall_roomPlaybackList.interfaceId,
                roomSn:data.roomSn,
                createTime:data.createTime
            },true);
        }
    }
    /*获取系统消息*/
    public getNews(userId,pageRecord){
        if(this.game_url){
            this.sendData({
                interfaceId:BaseModel.PORT_DATA_CONFIG.hall_managerList.interfaceId,
                userId:userId,page:pageRecord
            },true);
        }
    }
    // 获取联系我们信息
    public getUs(userId){
        if(this.game_url){
            this.sendData({
                interfaceId:BaseModel.PORT_DATA_CONFIG.hall_contactUs.interfaceId,
                userId:userId
            },true);
        }
    }
    //获取反馈消息
    public sendFeedbackMsg(userId,content,tel){
        if(this.game_url){
            this.sendData({
                interfaceId:BaseModel.PORT_DATA_CONFIG.hall_feedback.interfaceId,
                userId:userId,content:content,tel:tel
            },true);
        }
    }

    //同意用户协议
    public hall_consentUA(userId){
        if(this.game_url){
            this.sendData({
                interfaceId:BaseModel.PORT_DATA_CONFIG.hall_consentUA.interfaceId,
                userId:userId
            },true);
        }
    }
    //获取创建房间信息
    public getCreateRoomMsg(data){
        data.interfaceId = BaseModel.PORT_DATA_CONFIG.hall_createRoom.interfaceId;
        if(this.game_url){
            this.sendData(data,true);
        }
    }
    //获取加入房间信息
    public getjoinRoomMsg(userId,roomSn){
        if(this.game_url){
            this.sendData({
                interfaceId:BaseModel.PORT_DATA_CONFIG.hall_joinRoom.interfaceId,
                userId:userId,roomSn:roomSn
            },true);
        }
    }
    //获取未结束代开房间
    public getCurrentReplaceRoomInfo(userId){
        if(!this.game_url){

        }else{
            this.sendData(({
                interfaceId:BaseModel.PORT_DATA_CONFIG.hall_currentReplaceRoom.interfaceId,
                userId:userId
            }),false);
        }
    }
    //获取已结束房间
    public getHistoryReplaceRoomInfo(data){
        data.interfaceId = BaseModel.PORT_DATA_CONFIG.hall_historyReplaceRoom.interfaceId;
        if(!this.game_url){

        }else{
            MyConsole.getInstance().trace("---------发起--------------获取已结束房间",888888);
            this.sendData(data,false);
        }
    }
    //解散代开房间
    public quitReplaceRoom(data){
        data.interfaceId = BaseModel.PORT_DATA_CONFIG.hall_dissolveReplaceRoom.interfaceId;
        if(!this.game_url){

        }else{
            MyConsole.getInstance().trace("---------发起--------------解散代开房间",888888);
            this.sendData(data,false);
        }
    }
    //房主踢人
    public deleteUser(data){
        data.interfaceId = BaseModel.PORT_DATA_CONFIG.hall_deleteUser.interfaceId;
        if(!this.game_url){

        }else{
            MyConsole.getInstance().trace("---------发起--------------房主踢人",888888);
            this.sendData(data,false);
        }
    }
    //发起-代开-强制解散房间
    public sponsorDissolveReplaceRoom(roomId){
        if(!this.game_url){

        }else{
            MyConsole.getInstance().trace("---------发起--------------代开-强制解散房间",888888);
            this.sendData(({
                interfaceId:BaseModel.PORT_DATA_CONFIG.hall_orderDissolveReplaceRoom.interfaceId,
                roomSn:roomId
            }),false);
        }
    }
    /*---------游戏---------*/
    //请求系统发牌
    public requestSystemSendHand(data){
        if(this.game_url){
            data.interfaceId=BaseModel.PORT_DATA_CONFIG.game_requestSystemSendHand.interfaceId;
            data.wsw_sole_action_id=this.wsw_sole_action_id;/*唯一id注入*/
            this.loopSend(data,false,7000,"请求系统发牌");
        }
    }
    //吃碰杠胡操作完毕
    public cpghAction(data){
        if(this.game_url){
            data.interfaceId=BaseModel.PORT_DATA_CONFIG.game_action.interfaceId;
            data.wsw_sole_action_id=this.wsw_sole_action_id;/*唯一id注入*/
            this.loopSend(data,false,7000,"吃碰杠胡操作完毕");
        }
    }
    //出牌
    public playHand(data){
        if(this.game_url){
            data.interfaceId=BaseModel.PORT_DATA_CONFIG.game_playHand.interfaceId;
            data.wsw_sole_action_id=this.wsw_sole_action_id;/*唯一id注入*/

            this.loopSend(data,false,7000,"出牌");
        }
    }
    //小结算 准备按钮点击
    public settlementWaitOk(data){
        data.interfaceId=BaseModel.PORT_DATA_CONFIG.game_settlementWaitOk.interfaceId;
        if(this.game_url){
            MyConsole.getInstance().trace("---------发起--------------小结算 准备按钮点击",888888);
            if(!BaseModel.PLAYBACK_MODEL)this.sendData(data,true);
            else this.playbackModelSendData(data);
        }
    }
    //获取大结算数据
    public bigSettlement(data){
        data.interfaceId=BaseModel.PORT_DATA_CONFIG.game_bigSettlement.interfaceId;
        if(this.game_url){
            MyConsole.getInstance().trace("---------发起--------------获取大结算数据",888888);
            if(!BaseModel.PLAYBACK_MODEL)this.sendData(data,true);
        }
    }
    //等待阶段 退出房间
    public quitRoom(data){
        data.interfaceId=BaseModel.PORT_DATA_CONFIG.game_quitRoom.interfaceId;
        if(this.game_url){
            MyConsole.getInstance().trace("---------发起--------------等待阶段 退出房间",888888);
            this.sendData(data,true);
        }
    }
    //发起解散房间
    public sponsorDissolveRoom(data){
        data.interfaceId=BaseModel.PORT_DATA_CONFIG.game_dissolveRoom.interfaceId;
        if(this.game_url){
            MyConsole.getInstance().trace("---------发起--------------解散房间",888888);
            this.sendData(data,true);
        }
    }
    //同意/拒绝 解散房间操作
    public dissolveRoomOperation(data){
        data.interfaceId=BaseModel.PORT_DATA_CONFIG.game_dissolveRoomAgree.interfaceId;
        if(this.game_url){
            MyConsole.getInstance().trace("---------发起--------------同意/拒绝 解散房间操作",888888);
            this.sendData(data,true);
        }

    }
    //发送表情文字语音
    public sendChatInfo(data){
        data.interfaceId = BaseModel.PORT_DATA_CONFIG.game_chatAni.interfaceId;
        if(this.game_url){
            this.sendData(data,false);
        }
    }
    //心跳
    public heartbeat(){
        // var data:any={};//2.0.5更新
        // data.interfaceId = BaseModel.PORT_DATA_CONFIG.heartbeat.interfaceId;
        if(this.game_url){
            this.sendData("",false);
        }
    }
    /*-----------------------需要循环发送的接口-----------------------------*/
    public loopSend(data,_isLoading,time=2500,title=""){
        function send(){
            MyConsole.getInstance().trace("------循环刷新--"+title,888888);
            self.sendData(data,_isLoading);
        }
        MyConsole.getInstance().trace("------是否暂停中--"+BaseModel.PLAYBACK_PAUSE,888888);
        if(BaseModel.PLAYBACK_PAUSE){
            BaseModel.PLAYBACK_PAUSE = false;
            return ;
        }
        if(!BaseModel.PLAYBACK_MODEL){
            var self=this;
            //保险起见先清理一次
            this.clearLoopSend(data.interfaceId);
            //持续发送
            this.loopSendInfoTimer[data.interfaceId]=setInterval(send,time);
            send();
        }else{
            //回放模式下数据拦截 2.1.4
            MyConsole.getInstance().trace("回放模式下数据-》拦截 2.1.4");
            this.playbackModelSendData(data);
        }

    }
    /*清理循环发送接口*/
    protected clearLoopSend(interfaceId){
        if(this.loopSendInfoTimer[interfaceId]){
            clearInterval(this.loopSendInfoTimer[interfaceId]);
            this.loopSendInfoTimer[interfaceId]=null;
        }
    }
    /*清理全部循环发送接口*/
    protected clearAllLoopSend(){
        for(var i in this.loopSendInfoTimer){
            this.clearLoopSend(i);
        }
        this.loopSendInfoTimer=[];
    }
    /*-------------------------------------------------------*/
    /*接收消息查询*/
    protected selectSendInfoTips(data){
        var interfaceId=Number(data["interfaceId"]);
        if(interfaceId){
            for(var i in BaseModel.PORT_DATA_CONFIG){
                if(Number(BaseModel.PORT_DATA_CONFIG[i].interfaceId)==interfaceId){
                    MyConsole.getInstance().trace("<---收到服务器-"+this.cSocketUrl+"-v:"+BaseModel.SERVICE_VERSION+"   ["+BaseModel.PORT_DATA_CONFIG[i].tips+"]  --->",interfaceId);
                    break;
                }
            }
            MyConsole.getInstance().trace(data,interfaceId);//打印日志
        }
    }
    /*获取到数据*/
    protected onReceiveMessageOk(info,interfaceId){
        if(!BaseModel.PLAYBACK_MODEL){//回放模式下不接收任何数据 2.1.4
            //处理数据 广播后端信息
            this.radioServiceInfo(interfaceId,info);
        }
    }
    /*广播后端信息*/
    protected linshiMainInfo:any={};
    protected mainNum=0;
    protected radioServiceInfo(interfaceId,info){
        for(var i in BaseModel.PORT_DATA_CONFIG){
            if(Number(BaseModel.PORT_DATA_CONFIG[i].interfaceId)==Number(interfaceId)){
                var _isEvent=false;
                /*唯一id处理*/
                switch(BaseModel.PORT_DATA_CONFIG[i].interfaceId){
                    case BaseModel.PORT_DATA_CONFIG.mainInfo.interfaceId://大接口
                        for(var name in info){
                            this.linshiMainInfo[name]=info[name];
                        }
                        //清理全部循环动作
                        this.clearAllLoopSend();
                        /*凑齐3种数据在推送大接口*/
                        if(this.linshiMainInfo.currentUser&&this.linshiMainInfo.currentUser.playStatus==BaseModel.PLAYER_DATING){
                            //大厅
                            _isEvent=true;
                            info=this.linshiMainInfo;
                            this.linshiMainInfo={};
                            this.wsw_sole_main_id=this.wsw_sole_action_id=0;
                            // //统计追踪  2.0.8 舍弃
                            // AH_statisticService.getInstance().mainPortNum("ah");
                            //测试数据
                            this.test_mainPortNum();
                        }else if(this.linshiMainInfo.roomInfo&&this.linshiMainInfo.currentUser&&this.linshiMainInfo.anotherUsers){
                            //游戏
                            if(!this.wsw_sole_main_id||(info.wsw_sole_main_id>=this.wsw_sole_main_id)){
                                _isEvent=true;
                                info=this.linshiMainInfo;
                                this.linshiMainInfo={};
                                if(info.wsw_sole_main_id)this.wsw_sole_main_id=info.wsw_sole_main_id;//更新id
                                if(info.wsw_sole_action_id)this.wsw_sole_action_id=info.wsw_sole_action_id;
                                this.mainNum++;
                                //MyConsole.getInstance().trace("大接口编号ID:"+this.wsw_sole_main_id+" 累计次数:"+this.mainNum,"custom1");
                                //MyConsole.getInstance().trace("  动作编号ID:"+this.wsw_sole_action_id,"custom1");
                                // //统计追踪  2.0.8 舍弃
                                // AH_statisticService.getInstance().mainPortNum("ah");
                                //测试数据
                                this.test_mainPortNum();
                            }else{
                                MyConsole.getInstance().trace("  大接口id不符:当前id="+this.wsw_sole_main_id+"  服务器："+info.wsw_sole_main_id,"custom1");
                            }
                        }
                        break;
                    case BaseModel.PORT_DATA_CONFIG.game_systemSendHandHandAni.interfaceId://系统给玩家发牌
                        //清理循环发送的数据
                        this.clearLoopSend(BaseModel.PORT_DATA_CONFIG.game_requestSystemSendHand.interfaceId);
                        if(info.wsw_sole_action_id&&this.wsw_sole_action_id<info.wsw_sole_action_id){
                            if(Number(info.wsw_sole_action_id)-Number(this.wsw_sole_action_id)!=1){
                                //ID异常处理
                                this.wswActionIDError(this.wsw_sole_action_id,info.wsw_sole_action_id);
                            }else{
                                _isEvent=true;
                                this.wsw_sole_action_id=info.wsw_sole_action_id;
                                //MyConsole.getInstance().trace("接发牌 动作ID:"+this.wsw_sole_action_id,"custom1");
                            }
                        }else{
                            //老数据不接收
                            MyConsole.getInstance().trace("老数据不接收-发牌");
                        }
                        break;
                    case BaseModel.PORT_DATA_CONFIG.game_CPGHAction.interfaceId://吃碰杠胡提示 1.9.5舍弃
                        if(info.wsw_sole_action_id&&this.wsw_sole_action_id<info.wsw_sole_action_id){
                            if(Number(info.wsw_sole_action_id)-Number(this.wsw_sole_action_id)!=1){
                                //ID异常处理
                                this.wswActionIDError(this.wsw_sole_action_id,info.wsw_sole_action_id);
                            }else{
                                _isEvent=true;
                                this.wsw_sole_action_id=info.wsw_sole_action_id;
                                //MyConsole.getInstance().trace("吃碰杠胡提示 动作编号ID:"+this.wsw_sole_action_id,"custom1");
                            }
                        }else{
                            //老数据不接收
                            MyConsole.getInstance().trace("老数据不接收-吃碰杠胡提示");
                        }
                        break;
                    case BaseModel.PORT_DATA_CONFIG.game_playHandAni.interfaceId://其他玩家出牌
                        //清理循环发送的数据
                        this.clearLoopSend(BaseModel.PORT_DATA_CONFIG.game_playHand.interfaceId);
                        if(info.wsw_sole_action_id&&this.wsw_sole_action_id<info.wsw_sole_action_id){
                            if(Number(info.wsw_sole_action_id)-Number(this.wsw_sole_action_id)!=1){
                                //ID异常处理
                                this.wswActionIDError(this.wsw_sole_action_id,info.wsw_sole_action_id);
                            }else{
                                _isEvent=true;
                                this.wsw_sole_action_id=info.wsw_sole_action_id;
                                MyConsole.getInstance().trace("接出牌 动作ID:"+this.wsw_sole_action_id,"custom1");
                            }
                        }else{
                            //老数据不接收
                            MyConsole.getInstance().trace("接出牌-老数据 动作ID:"+this.wsw_sole_action_id,"custom3");
                        }
                        break;
                    case BaseModel.PORT_DATA_CONFIG.game_CPGAni.interfaceId://其他吃碰杠胡操作
                        //清理循环发送的数据
                        this.clearLoopSend(BaseModel.PORT_DATA_CONFIG.game_action.interfaceId);
                        if(info.wsw_sole_action_id&&this.wsw_sole_action_id<info.wsw_sole_action_id){
                            if(Number(info.wsw_sole_action_id)-Number(this.wsw_sole_action_id)!=1){
                                //ID异常处理
                                this.wswActionIDError(this.wsw_sole_action_id,info.wsw_sole_action_id);
                            }else{
                                _isEvent=true;
                                this.wsw_sole_action_id=info.wsw_sole_action_id;
                                //MyConsole.getInstance().trace("吃碰杠胡操作 动作编号ID:"+this.wsw_sole_action_id,"custom1");
                            }
                        }else{
                            //老数据不接收
                            MyConsole.getInstance().trace("接动作执行完毕-老数据 动作ID:"+this.wsw_sole_action_id,"custom3");
                        }
                        break;
                    case BaseModel.PORT_DATA_CONFIG.game_actionIDError.interfaceId://动作ID报错
                        //清理全部循环动作
                        this.clearAllLoopSend();
                        _isEvent=true;
                        break;
                    case BaseModel.PORT_DATA_CONFIG.game_smallSettlement.interfaceId://小结算
                        //清理全部循环动作
                        this.clearAllLoopSend();
                        _isEvent=true;
                        break;
                    case BaseModel.PORT_DATA_CONFIG.game_bigSettlement.interfaceId://大结算
                        //清理全部循环动作
                        this.clearAllLoopSend();
                        _isEvent=true;
                        break;
                    case BaseModel.PORT_DATA_CONFIG.getSystemCard.interfaceId://zpb测试获取系统牌
                        if(egret["AH_systemSendCard"]){
                            egret["AH_systemSendCard"](info,BaseModel.SERVICE_VERSION,this.currentPosition);
                        }
                        break;
                    default:
                        _isEvent=true;
                        break;
                }
                if(_isEvent)this.eventRadio(BaseModel.SOCKET_DATA_EVENT+interfaceId,info);//数据广播出去
                return;
            }
        }
        MyConsole.getInstance().trace("未知推送信息"+interfaceId,3);//打印异常
    }
    /*动作ID异常处理*/
    protected wswActionIDError(cId,sendId){
        // //异常跟踪统计  2.0.8 舍弃
        // AH_statisticService.getInstance().wswIDError();
        if(BaseModel.PLAYBACK_MODEL){
            //回放模式下不刷新大接口
            MyConsole.getInstance().trace("回放时动作ID异常:客户端:"+cId+",服务端:"+sendId,"custom3");
        }else{
            //刷新大接口
            this.dispatchEvent(new egret.Event("getMainInfo"));
        }
    }

    /*回放模式下 传输数据处理*/
    protected playbackModelSendData(data){
        this.dispatchEventWith("nextPlaybackInfo",false,data);
    }
    /*回放模式下模拟传送数据*/
    protected playbackModelRadioServiceInfo(interfaceId,info,num){
        //处理数据 广播后端信息
        if(interfaceId&&info){
            //回放模式下 从跳过开房步骤 所以ID从2开始
            if(num==1 && info.wsw_sole_action_id)this.wsw_sole_action_id=info.wsw_sole_action_id-1;
            MyConsole.getInstance().trace("回放模式下数据-》模拟发送 2.1.4 "+this.wsw_sole_action_id);
            this.radioServiceInfo(interfaceId,info);
        }else{
            MyConsole.getInstance().trace("回放模式下数据-》模拟发送数据有误",0);
        }

    }
}