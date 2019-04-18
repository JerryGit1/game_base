/**
 * 创建者 伟大的周鹏斌大王 on 2017/6/19.
 */
class AH_HallModel extends BaseModel{
    public pageRecord:number = 1;
    public pageNews:number = 1;

    /*数据model*/
    public userModel:UserModel;/*用户信息*/
    public urlInfoModel:UrlDataModel;/*url参数信息*/
    protected roomType:number=1;/*开放模式 1房主 2代开*/
    public currentReplaceRoomModelGroup:Array<H_replaceRoomModel> = [];//当前已代开房间(未结束)
    public historyReplaceRoomModelGroup:Array<H_replaceRoomModel> = [];//已代开房间(已结束)
    public playbackRoomId=0;/*回放模式下的房间id因为回放结束 还需要弹出 具体回放界面*/
    public playbackRoomCreateTime = "";

    public constructor(userModel:UserModel,urlInfoModel){
        super(true,true);
        this.urlInfoModel=urlInfoModel;
        this.userModel=userModel;
        /*------------接收--------------*/
        // /*查询战绩信息*/
        // BaseModel.getInstance().addEventListener("getRecordInfo",this.getRecordInfo,this);
        /*查询某个房间回放记录列表*/
        BaseModel.getInstance().addEventListener("getRoomPlaybackList",this.getRoomPlaybackList,this);
        // 查询系统消息
        BaseModel.getInstance().addEventListener("getNewsInfo",this.getNewsInfo,this);
        //查询联系我们信息
        BaseModel.getInstance().addEventListener("getUsInfo",this.getUsInfo,this);
        //反馈信息
        BaseModel.getInstance().addEventListener("getFeedback",this.seedFeedback,this);
        //创建房间
        BaseModel.getInstance().addEventListener("createRoom",this.createRoom,this);
        //加入房间
        BaseModel.getInstance().addEventListener("joinRoom",this.joinRoom,this);
        //同意用户协议
        BaseModel.getInstance().addEventListener("consentUA",this.consentUA,this);
        //回放功能
        BaseModel.getInstance().addEventListener("playBack",this.playBack,this);
        //代开-强制解散房间
        BaseModel.getInstance().addEventListener("orderDisRoom",this.orderDisRoom,this);
        /*------------获取--------------*/
        // /*接收到战绩信息*/
        // this.addRadioEvent(BaseModel.PORT_DATA_CONFIG.hall_achievement,this.receiveRecordInfo.bind(this)); 2.2.5
        /*接收到回放信息*/
        this.addRadioEvent(BaseModel.PORT_DATA_CONFIG.hall_roomPlaybackList,this.roomPlaybackList.bind(this));
        // 接收到反馈消息
        this.addRadioEvent(BaseModel.PORT_DATA_CONFIG.hall_feedback,this.feedbackInfo.bind(this));
        //接收到的创建房间消息
        this.addRadioEvent(BaseModel.PORT_DATA_CONFIG.hall_createRoom,this.createOrJoinRoomOK.bind(this));
        //接收到的加入房间消息
        this.addRadioEvent(BaseModel.PORT_DATA_CONFIG.hall_joinRoom,this.createOrJoinRoomOK.bind(this));
        //接收已代开房间信息
        this.addRadioEvent(BaseModel.PORT_DATA_CONFIG.hall_currentReplaceRoom,this.createCurrentReplaceRoom.bind(this));
        //接收代开房间历史记录
        this.addRadioEvent(BaseModel.PORT_DATA_CONFIG.hall_historyReplaceRoom,this.createHistoryReplaceRoom.bind(this));
        //接收 代开房间解散房间消息
        this.addRadioEvent(BaseModel.PORT_DATA_CONFIG.hall_dissolveReplaceRoom,this.updateUserInfo.bind(this));
    }
    /*查询战绩单页信息*/
    public getRecordInfo(pageNum){
        this.webSocketModel.getResult(this.userModel.userId,pageNum);
    }
    /*查询某个房间回放记录列表 2.1.4*/
    public getRoomPlaybackList(e){
        this.webSocketModel.getRoomPlaybackList(e.data);
    }

    // 查询系统消息
    public getNewsInfo(){
        this.webSocketModel.getNews(this.userModel.userId,this.pageNews);
    }
    //查询联系我们信息
    public getUsInfo(){
        this.webSocketModel.getUs(this.userModel.userId);
    }
    //获取反馈意见返回数据
    public seedFeedback(e){
        var content = e.data.content;
        var tel = e.data.tel;
        this.webSocketModel.sendFeedbackMsg(this.userModel.userId,content,tel)
    }
    //发起统计信息
    public sendStatisticInfo(data){
        if(Number(data.roomType) == 1) AH_statisticService.getInstance().createRoomTypeOne();
        if(Number(data.roomType) == 2) AH_statisticService.getInstance().createRoomTypeTwo();
        if(Number(data.circleNum) == 2) AH_statisticService.getInstance().createRoomCircleTwo();
        if(Number(data.circleNum) == 4) AH_statisticService.getInstance().createRoomCircleFour();
        if(Number(data.circleNum) == 8) AH_statisticService.getInstance().createRoomCircleSix();
    }
    /*创建房间*/
    public createRoom(e){
        var data = e.data;
        data["userId"] = this.userModel.userId;
        this.roomType=data.roomType;
        this.webSocketModel.getCreateRoomMsg(data);
        /*统计*/
        this.sendStatisticInfo(data);
    }
    // 加入房间
    public joinRoom(e){
        var data = e.data;
        this.webSocketModel.getjoinRoomMsg(this.userModel.userId,data.roomSn);
    }
    /*接收到战绩信息*/
    protected receiveRecordInfo(data){
        if(this.pageRecord == 1){
            PopupLayer.getInstance().achievementView(data);
        }
    }
    /*接收到回放列表信息*/
    protected roomPlaybackList(data){
        if(data.num == 0){
            this.dispatchEventWith("addRoomPlaybackListPopupView",false,data);
        }else{
            var roomSn=data.roomSn;/*房间号码*/
            var createTime = data.createTime;
            this.getAchievementRecordList(roomSn,createTime,data.num,data.url);
        }
    }
    /*发起-代开-强制解散房间*/
    protected orderDisRoom(e){
        this.webSocketModel.sponsorDissolveReplaceRoom(e.data);
    }
    protected getAchievementRecordList(roomId,createTime,num,urlStr){
        var self = this;
        var infos = [];
        var isEnterPlayBack = false;

        var cTime = new Date(Number(createTime));
        var year = cTime.getFullYear();
        var month = this.addPreZero(cTime.getMonth()+1);
        var day = this.addPreZero(cTime.getDate());
        var hours = this.addPreZero(cTime.getHours());
        var minutes = this.addPreZero(cTime.getMinutes());
        var seconds = this.addPreZero(cTime.getSeconds());
        var timeStr = ""+year+month+day+hours+minutes+seconds;

        var fileStr = urlStr+timeStr+"-"+roomId;
        var fileUrl = fileStr+".txt";
        // var fileUrl = "resource/20171102121528-172341.txt";
        this.httpServiceModel.getPlayBackData(fileUrl,function (data) {
            for(var i=0;i<data.length;i++){
                var userInfos = [];
                var jsInfo = data[i].jsInfo;
                var infoUrl = fileStr+"-"+data[i].xjn+".txt";
                // var infoUrl = fileUrl+"-"+data[i].xjn+".txt";

                for(var j=0;j<jsInfo.length;j++){
                    var userInfo = {"name":jsInfo[j].openName,"score":jsInfo[j].score,"openImg":jsInfo[j].openImg};
                    userInfos.push(userInfo);
                }
                var info = {
                    "roomId":roomId,
                    "createTime":createTime,
                    "userInfos":userInfos,
                    "url":infoUrl,
                    "idx":data[i].xjn
                };
                infos.push(info);
            }
            self.dispatchEventWith("addRoomPlaybackListPopupView",false,infos);
            self = null;
        });
    }
    // 补零方法
    protected addPreZero(num){
        if(num<10){
            return '0'+num;
        }else {
            return num;
        }
    }
    // 收到反馈消息
    protected feedbackInfo(data){
        this.dispatchEventWith("alertMsg",false,data);
    }
    /*同意用户协议*/
    protected consentUA(){
        this.webSocketModel.hall_consentUA(this.userModel.userId);
    }
    // 创建房间成功之后
    protected createOrJoinRoomOK(info,interfaceId){
        var reqState = Number(info.reqState);
        switch (reqState){
            case 1:
                if(Number(interfaceId)==Number(BaseModel.PORT_DATA_CONFIG.hall_createRoom.interfaceId)){//房主开房成功
                    // //开房统计  唐山2.0.8 捨棄
                    // if(interfaceId==BaseModel.PORT_DATA_CONFIG.hall_createRoom.interfaceId){
                    //     AH_statisticService.getInstance().createRoom(this.userModel.userId);
                    // }
                    //测试数据
                    this.webSocketModel.test_mainPortNum(1);
                    if(Number(this.roomType)==2){
                        //代开模式下 直接发送准备ok 不会经过这
                        this.webSocketModel.settlementWaitOk({
                            userId:this.userModel.userId,
                            roomSn:info.roomSn
                        });
                    }else{
                        //房主模式下 1.7.1要凑齐4个人 才显示确认开局按钮
                        /*获取大接口数据*/
                        this.dispatchEvent(new egret.Event("getMainInfo"));
                    }
                }else{
                    //其他玩家直接发送准备ok
                    this.webSocketModel.settlementWaitOk({
                        userId:this.userModel.userId,
                        roomSn:info.roomSn
                    });
                }
                break;
            case 3://已经在其他房间中了
                /*获取大接口数据*/
                this.dispatchEvent(new egret.Event("getMainInfo"));
                break;
            case 2:{
                if(Number(info.roomType) == 2){
                    PopupLayer.getInstance().addHintView("您的房卡数未达到代开房间权限要求。如需要，请联系代理！",null,true,"min");
                }else{
                    PopupLayer.getInstance().addHintView("房卡不足，请联系代理！",null,true,"min");
                }
                break;
            }
            case 4:
                if(this.urlInfoModel.shareJoining==2){//加入房间状态
                    this.urlInfoModel.shareJoining=3;
                    /*获取大接口数据*/
                    // PopupLayer.getInstance().addHintView("该房间不存在！",null,true,"min",function () {// 唐山 1.0.5 舍弃
                        this.dispatchEvent(new egret.Event("getMainInfo"));
                    // }.bind(this));
                }else{
                    PopupLayer.getInstance().floatAlert("房间不存在",2000);
                }
                break;
            case 5:
                if(this.urlInfoModel.shareJoining==2){//加入房间状态
                    this.urlInfoModel.shareJoining=3;
                    /*获取大接口数据*/
                    // PopupLayer.getInstance().addHintView("该房间人员已满！",null,true,"min",function () {// 唐山 1.0.5 舍弃
                        this.dispatchEvent(new egret.Event("getMainInfo"));
                    // }.bind(this));
                }else{
                    PopupLayer.getInstance().floatAlert("房间人员已满",2000);
                }
                break;
            case 10:/*代开房间成功，直接跳转至代开界面*/
                PopupLayer.getInstance().hall_replaceCreateRoomView(this);
                break;
            case 11:
                PopupLayer.getInstance().addHintView("同时只能代开10个房间哟",null,true,"min");
                break;
        }
        if(info.money){
            this.userModel.money = info.money;
        }
    }
    //接收 代开房间解散房间 更新房主信息
    public updateUserInfo(info){
        var reqState = Number(info.reqState);
        if(reqState==1){
            this.userModel.money = info.money;
        }
    }
    /*=============发起 获取未结束代开房间信息===============*/
    public getCurrentReplaceInfo(){
        this.webSocketModel.getCurrentReplaceRoomInfo(this.userModel.userId);
    }
    protected createCurrentReplaceRoom(info){
        this.currentReplaceRoomModelGroup = [];
        for(var i in info){
            var model = new H_replaceRoomModel();
            model.setParams(info[i]);
            this.currentReplaceRoomModelGroup.push(model);
        }
        this.dispatchEvent(new egret.Event(BaseModel.GAME_CHANGE_VIEW_currentReplace));
    }
    /*=============发起 获取已结束代开房间信息====================*/
    public getHistoryReplaceInfo(pageNum){
        var data = {userId:this.userModel.userId,page:pageNum};
        this.webSocketModel.getHistoryReplaceRoomInfo(data);
    }
    protected createHistoryReplaceRoom(info){
        this.historyReplaceRoomModelGroup = [];
        for(var i in info.roomInfo){
            var model = new H_replaceRoomModel();
            model.setParams(info.roomInfo[i]);
            this.historyReplaceRoomModelGroup.push(model);
        }
        this.dispatchEventWith(BaseModel.GAME_CHANGE_VIEW_historyReplace,false,info.pages);
    }
    /*=============解散代开房间===================*/
    public dissolveReplaceRoom(roomId){
        PopupLayer.getInstance().addHintView("游戏未开局，解散房间不扣房卡，是否解散？",function () {
            //退出房间
            this.webSocketModel.quitReplaceRoom({
                roomSn:roomId
            });
        }.bind(this),true,"min");
    }
    /*==============房主踢人===================*/
    public deleteUser(userId,userName,roomId){
        PopupLayer.getInstance().addHintView("是否将玩家【"+userName+"】踢出本房间？",function () {
            //退出房间
            this.webSocketModel.deleteUser({
                roomSn:roomId,
                userId:userId
            });
        }.bind(this),true,"min");
    }
    /*=================回放功能 2.1.4===============*/
    public playBack(e){
        //加载回放数据
        var url=e.data.url;/*数据文件地址*/
        var roomSn=e.data.roomSn;/*房间号码*/
        var createTime=e.data.createTime;/*房间创建时间*/
        var idx = e.data.index;
        var tips = e.data.tips;
        var self=this;
        this.httpServiceModel.getPlayBackData(url,function (data) {
            //保存房间号码 回放结束时可以 继续弹出回放界面 分享回放模式下 不需要了
            if(!tips||tips!="share"){
                self.playbackRoomId=roomSn;
                self.playbackRoomCreateTime = createTime;
            }
            var info = {listData:data,index:idx,cTime:createTime};
            self.dispatchEventWith("playBackInfo",false,info);
            self=null;
        });
    }
}