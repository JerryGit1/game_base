/**
 * 创建者 伟大的周鹏斌大王 on 2017/6/19.
 */
class AH_ManagerModel extends BaseModel{
    protected currentScene="";/*当前场景*/

    /*数据model*/
    public urlInfoModel:UrlDataModel;/*url参数信息*/
    public gameModel:GameModel;/*游戏*/
    public hallModel:HallModel;/*大厅*/
    public userGroupModel:UserGroupModel;/*所有用户数据控制中心*/
    public constructor(){
        super();
        /*设置默认场景*/
        this.currentScene=BaseModel.SCENE_LOAD;
        /*事件侦听*/
        this.addRadioEvent(BaseModel.PORT_DATA_CONFIG.mainInfo,this.mainInterface.bind(this));//大接口数据侦听
        /*重复登录*/
        this.addRadioEvent(BaseModel.PORT_DATA_CONFIG.repetitionLogin,this.repetitionLogin.bind(this));
    }
    /*初始化配置*/
    public initConfig(stage){//stage:Main
        this.urlInfoModel=new UrlDataModel();//url信息
        this.setWebPageBackTips(stage);
        this.setUrlParam();
        this.setStageScaleMode(stage);
    }
    /*开始启动socket连接*/
    public startWebSocket(){
        this.userGroupModel=new UserGroupModel();
        this.gameModel=new GameModel(this.userGroupModel);
        this.hallModel=new HallModel(this.userGroupModel.user1Model,this.urlInfoModel);
        /*侦听服务器连接*/
        BaseModel.getInstance().addEventListener("webSocketOpen",this.webSocketOpen,this);
        /*回放结束*/
        BaseModel.getInstance().addEventListener("playbackOver",this.playbackOver,this);

        //强制刷新 大接口数据
        this.gameModel.addEventListener("getMainInfo",this.getMainInfo,this);
        this.hallModel.addEventListener("getMainInfo",this.getMainInfo,this);
        this.webSocketModel.addEventListener("getMainInfo",this.getMainInfo,this);
        //回放功能 2.1.4
        this.hallModel.addEventListener("playBackInfo",this.playbackStart,this);
        //连接服务器
        this.webSocketModel.startConnect();
    }
    /*webSocket 连接成功*/
    protected webSocketOpen(){
        /*主数据*/
        this.getMainInfo(null,true);

        /*发送心跳*/
        this.webSocketModel.heartbeat();//一开始就调用一次
        setInterval(function () {
            this.webSocketModel.heartbeat();
        }.bind(this),BaseModel.HEART_TIME*1000);
    }
    /*主动请求大接口数据*/
    protected getMainInfo(e,_isOpenIdLogin=true){//_isOpenIdLogin=false  2.2.8 修改
        MyConsole.getInstance().trace("---主动请求大接口数据");
        var openId=this.urlInfoModel.openId,userId,cId=this.urlInfoModel.cId;
        if(!_isOpenIdLogin){
            openId=null;
            userId=this.hallModel.userModel.userId;
        }
        /*获取大接口数据*/
        this.webSocketModel.getMainInfo(openId,userId,cId,_isOpenIdLogin);
    }
    /*!!!!!!接收到大接口数据 （主动，被动接口）*/
    protected mainInterface(info){
        /*设置用户信息*/
        this.userGroupModel.setSelfBaseInfo(info.currentUser);
        /*判定场景*/
        if(this.userGroupModel.getSelfStatus()==BaseModel.PLAYER_DATING){
            //关闭网络检测
            this.gameModel.netWorkModel.stop();

            if(this.urlInfoModel.shareJoining==1){ /*分享房间号码*/
                var roomSn=this.urlInfoModel.state;
                //注销分享房间信息
                this.urlInfoModel.shareJoining=2;
                //尝试加入房间
                this.hallModel.joinRoom({data:{roomSn:roomSn }});
            }else if(this.urlInfoModel.shareJoining==4){ /*分享回放号码*/
                //注销分享房间信息
                this.urlInfoModel.shareJoining=0;
                //分享回放功能
                this.hallModel.playBack({data:this.urlInfoModel.playbackInfo});
            }else{
                //玩家在大厅场景
                if(this.currentScene!=BaseModel.SCENE_HALL){
                    this.currentScene=BaseModel.SCENE_HALL;
                    //关闭所有弹窗
                    PopupLayer.getInstance().removePopupViewAll();
                    //切换大厅场景
                    this.dispatchEvent(new egret.Event("addHallScene"));
                }
            }
            // AH_statisticService.getInstance().inquiryRecord("login");
        }else{
            //玩家在游戏场景
            //注销分享房间信息 2.3.6 出现
            // 先加入第一个房间 在返回（非退出房间） 在点击另一个房间
            // 此时肯定显示还在第一个房间 但是点击推出房间后就立马加到第二个房间了 就是因为state没清理
            this.urlInfoModel.shareJoining=2;
            /*东丰 2.2.0添加
            *解决小结算、荒庄之后刷新后，玩家状态不对以及不能开局的问题
            */
            if(Number(info.roomInfo.status == 3) && this.userGroupModel.user1Model.playStatus==BaseModel.PLAYER_XJS){
                this.webSocketModel.settlementWaitOk({
                    userId:this.userGroupModel.user1Model.userId,
                    roomSn:info.roomInfo.roomSn
                });
            }else{
                this.gameModel.updateGameInfo(info);/*更新游戏信息*/
                if(this.currentScene!=BaseModel.SCENE_GAME){
                    this.currentScene=BaseModel.SCENE_GAME;
                    //初始化其他玩家数据
                    this.userGroupModel.initOtherModel();
                    //关闭所有弹窗
                    PopupLayer.getInstance().removePopupViewAll();
                    //切换游戏场景
                    this.dispatchEvent(new egret.Event("addGameScene"));
                }
            }
        }

        /*统计 唐山 2.2.2 修改位置*/
        if(!BaseModel.login_statistic){
            BaseModel.login_statistic = true;
            //登录次数
            AH_statisticService.getInstance().login();
            //日活统计
            AH_statisticService.getInstance().login_UA(this.userGroupModel.user1Model.userId);
        }
    }
    /*!!!!!!开始播放回放功能 2.1.4*/
    protected playbackStart(e){
        var data=e.data;
        //当前第一人称视角玩家ID 不存在默认第一个玩家
        var currentUserId=this.userGroupModel.user1Model.userId;
        if(BaseModel.PLAYBACK_SHARE_USERID){//回放分享链接
            currentUserId=BaseModel.PLAYBACK_SHARE_USERID;
        }
        //回放模式
        BaseModel.PLAYBACK_MODEL=true;
        /*切换当前场景*/
        this.currentScene=BaseModel.SCENE_GAME;
        //关闭所有弹窗
        PopupLayer.getInstance().removePopupViewAll();
        //初始化回放数据
        this.gameModel.initPlaybackModel(data.listData,currentUserId,data.index,data.cTime);
        //切换游戏场景
        this.dispatchEvent(new egret.Event("addGameScene"));
    }
    /*!!!!!!结束回放模式 2.1.4*/
    protected playbackOver(){
        if(!BaseModel.PLAYBACK_MODEL)return;
        BaseModel.PLAYBACK_MODEL=false;
        /*切换当前场景 千万不要自动设置 要不回不去了*/
        // this.currentScene=BaseModel.SCENE_HALL;
        /*数据销毁和恢复*/
        this.gameModel.gamePlaybackOver();
        /*刷新大接口数据*/
        this.getMainInfo(null,true);
    }
    /*重复登录*/
    protected repetitionLogin(){
        BaseModel.USER_repetitionLogin=true;
        PopupLayer.getInstance().addHintView("您的账号已经其他地方登录",null,true,"min");
    }
    /*---------------------配置信息------------------------*/
    /*获取url参数配置*/
    protected setUrlParam(){
        if(window["AH_param"]&&window["AH_param"]!="null"){//post信息登录
            egret.localStorage.setItem("AH_param",window["AH_param"]);
            var data=JSON.parse(decodeURIComponent(window["AH_param"]));
            this.urlInfoModel.setParams(data);/*设置属性*/
            var state=this.urlInfoModel.state;

        }else if(egret.localStorage.getItem("AH_param")){//缓存信息登录
            var data=JSON.parse(decodeURIComponent(egret.localStorage.getItem("AH_param")));
            if(data.state)data.state=null;//zpb 解决加入房间后离开 刷新在进去问题
            this.urlInfoModel.setParams(data);
            var state=this.urlInfoModel.state;
        }else{
            alert("非法登录");
        }
    }
    /*配置返回按钮点击提示*/
    protected setWebPageBackTips(stage:Main){
        window.history.pushState({
            title: document.title,
            url: ""
        }, document.title, "");
        setTimeout(function () {
            window.addEventListener("popstate", onPushBack.bind(this), false),
            window.addEventListener("onbeforeunload", onPushBack.bind(this), false);
            function onPushBack() {
                this.webSocketModel.closeSocket();
                return window.history.pushState({
                    title: document.title,
                    url: ""
                }, document.title, ""), void alert("如果要退出请点击关闭");
            }
        }.bind(this), 300);
        /*屏幕旋转刷新*/
        var self=this;
        window.onorientationchange=function () {
            if(BaseModel.ISSCREEEN){
                if(window.orientation!=0){//旋转了
                    stage.stage.scaleMode = egret.StageScaleMode.SHOW_ALL ;//默认比例适配
                   // self.dispatchEventWith("lockSTIps",false,true);
                }else{
                    if(stage.stage.stageWidth/ stage.stage.stageHeight>1.85){
                        stage.stage.scaleMode = egret.StageScaleMode.SHOW_ALL ;//默认比例适配
                    }else{
                        stage.stage.scaleMode = egret.StageScaleMode.FIXED_WIDTH;//完美适配
                    }
                   // self.dispatchEventWith("lockSTIps",false,false);
                }
            }
        }
    }
    /*适配配置*/
    protected setStageScaleMode(stage:Main){
        //设置旋转模式为自动
        stage.stage.orientation = egret.OrientationMode.LANDSCAPE_FLIPPED;
        var ua = navigator.userAgent;
        var isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1; //android终端
        var isiOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        var iPad=(ua.match(/iPad/i)!= null)? true : false;//ipad终端
        var Pad=(ua.match(/Pad/i)!= null)? true : false;//安卓平板终端
        if (isAndroid || isiOS) {
            /*适配*/
            //不是平板 zpb
            if(!Pad&&!iPad){
                stage.stage.scaleMode = egret.StageScaleMode.FIXED_WIDTH;//完美适配
                if(stage.stage.stageWidth/ stage.stage.stageHeight>1.85){//手机宽高比例过长 用默认适配
                    stage.stage.scaleMode = egret.StageScaleMode.SHOW_ALL ;
                }
                BaseModel.ISSCREEEN=true;//触发旋转
            }else if(iPad){
                stage.stage.orientation = egret.OrientationMode.PORTRAIT;//ipad 用默认适配+反向旋转
            }
            BaseModel.IOS=isiOS;
        }
        Main.stageWidth = stage.stage.stageWidth;
        Main.stageHeight = stage.stage.stageHeight;
        //音乐信息缓存
        SoundModel.getLocalStorage();
        MyConsole.getInstance().trace("舞台信息"+"宽："+Main.stageWidth+"高:"+Main.stageHeight);
        MyConsole.getInstance().trace("一号机版本:"+Main.AH_MJ_version);
        MyConsole.getInstance().trace("当前代号:"+Main.pro_name);
        MyConsole.getInstance().trace("当前版本:"+Main.version);
    }
}