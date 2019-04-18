/**
 * 创建者 伟大的周鹏斌大王 on 2017/6/17.
 *
 * 背景场景
 */
class AH_BackgroundView extends BaseView {
    /*背景图片*/
    protected bg = new egret.Bitmap();
    //数据
    protected model:Game_backLayerModel;
    /*圈风*/
    protected circleWindText:egret.TextField;

    /*房间号 -开局后*/
    protected roomIdText:egret.TextField;
    /*开局前*/
    protected roomIdText2:egret.TextField;
    /*--------------*/
    protected windSp:egret.Sprite;
    //风向
    protected clockView:Game_clockView;
    /*玩法*/
    protected ruleText:egret.TextField;
    /*房间号*/
    protected gameNameText:egret.TextField;
    /*剩余圈数*/
    protected surplusGameNumText:egret.TextField;
    //圈风名字 zpb
    protected surplusGameNumName:string;
    /*剩余麻将张数*/
    protected mjNumText:egret.TextField;
    //倒计时图片集合
    protected coundownBits:Array<any> = [];
    //ip冲突
    protected ipSameText:egret.TextField;
    //ip冲突背景
    protected ipSameBg:egret.Bitmap;
    //上次发送语音时间
    protected lastRecordTime:number;
    // 离开房间用户昵称
    protected leaveName:string="";
    public constructor(model,surplusGameNumName="圈") {
        super();
        this.surplusGameNumName=surplusGameNumName;
        this.model = model;
        this.initBg();//背景
        //this.addCircleWind();//圈风 1.0去掉
        this.addWind();//风向组件 房间号
        this.updateClock();//因为先更新的数据再去更新的视图，所以需要先初始化一下

        /*自定义事件侦听*/
        this.model.roomInfoModel.addEventListener(BaseModel.GAME_CHANGE_VIEW_circleWind, this.updateCircleWind, this);//刷新圈风
        this.model.roomInfoModel.addEventListener(BaseModel.GAME_CHANGE_VIEW_cnrrMJNum, this.updateCnrrMJNum, this);//刷新剩余多少张麻将
        this.model.roomInfoModel.addEventListener(BaseModel.GAME_CHANGE_VIEW_lastNum, this.updateLastNum, this);//刷新剩余圈数
        this.model.addEventListener(BaseModel.GAME_CHANGE_VIEW_clock, this.updateClock, this);//更新风向指向
        this.model.addEventListener(BaseModel.GAME_CHANGE_VIEW_countdown,this.updateCountdown,this);//出牌倒计时
        this.model.addEventListener(BaseModel.GAME_CHANGE_VIEW_twinkleAni,this.updateClockTwinkleAni,this);//出牌剩余3秒闪烁动画
        this.model.addEventListener(BaseModel.GAME_CHANGE_VIEW_ipSame,this.updateIPSame,this);//ip冲突
        BaseModel.getInstance().addEventListener(BaseModel.PORT_DATA_CONFIG.game_quitRoom,this.leaveUserName,this);
        MyConsole.getInstance().trace("游戏内部---背景层渲染完毕",1);

    }
    public  leaveUserName(data){
        var leaveName = data.data.data;
        this.leaveName = leaveName;
    }
    /*添加背景*/
    protected initBg() {
        this.bg = this.CCenterBit("g_background",false);
        this.bg.scale9Grid=new egret.Rectangle(24,27,1083,670);
        this.bg.width=Main.stageWidth;
        this.bg.height=Main.stageHeight;
        this.addChild(this.bg);
    }
    /*------------------实例化视图------------------------*/
    //圈风
    protected addCircleWind(){
        // var roomInfoBg:egret.Bitmap = this.CCenterBit("g_roomInfoBg",false);
        // roomInfoBg.x = this.helpBtn.x+this.helpBtn.width*1.2;
        // roomInfoBg.y = 25;
        // this.addChild(roomInfoBg);
        //
        // //圈风
        // this.circleWindText = new egret.TextField();
        // this.circleWindText.x =roomInfoBg.x;
        // this.circleWindText.y = roomInfoBg.y;
        // this.circleWindText.width=roomInfoBg.width;
        // this.circleWindText.height=roomInfoBg.height;
        // this.circleWindText.textAlign = "center";
        // this.circleWindText.verticalAlign = "middle";
        // this.circleWindText.textColor = 0xffffff;
        // this.circleWindText.stroke = 2;
        // this.circleWindText.strokeColor = 0x000000;
        // this.circleWindText.multiline = true;
        // this.circleWindText.fontFamily = "微软雅黑";
        // this.circleWindText.size = 25;
        // this.addChild(this.circleWindText);
        // this.updateCircleWind();
    }
    //实例化剩余多少圈
    protected addWind() {
        this.windSp=new egret.Sprite();
        this.addChild(this.windSp);
        this.windSp.x=Main.stageWidth/2;
        this.windSp.y=Main.stageHeight/2;
        //风向
        this.clockView=new Game_clockView();
        this.windSp.addChild(this.clockView);
        //玩法
        this.ruleText = new egret.TextField();
        this.ruleText.width = Main.stageWidth;
        this.ruleText.x = -Main.stageWidth/2;
        this.ruleText.y = -96;
        this.ruleText.textAlign = "center";
        this.ruleText.textColor = 0x1a4145;
        this.ruleText.size = 22;
        this.ruleText.fontFamily = "微软雅黑";
        this.ruleText.text = "";
        this.windSp.addChild(this.ruleText);
        //游戏名
        this.gameNameText = new egret.TextField();
        this.gameNameText.x =0;
        this.gameNameText.width=Main.stageWidth;
        this.gameNameText.y = this.windSp.y+this.clockView.height/2+30;
        this.gameNameText.textAlign = "center";
        this.gameNameText.textColor = 0x1a4145;
        this.gameNameText.size = 35;
        this.gameNameText.fontFamily = "微软雅黑";
        this.gameNameText.bold=true;
        this.gameNameText.stroke=2;
        this.gameNameText.strokeColor=0x588C8A;
        this.gameNameText.text = "房间号:"+this.model.roomInfoModel.roomSn;
        this.addChild(this.gameNameText);

        //剩余多少张麻将次数
        var mjNumBg = new egret.Bitmap(RES.getRes("g_board_Bg"));
        mjNumBg.x =  -182;
        mjNumBg.y = -24;
        this.windSp.addChild(mjNumBg);

        this.mjNumText =this.createTxt("center");
        this.mjNumText.width=mjNumBg.width;
        this.mjNumText.x =  mjNumBg.x;
        this.mjNumText.y = -15;
        this.mjNumText.textFlow = (new egret.HtmlTextParser).parser("");
        this.windSp.addChild(this.mjNumText);
        //单位  张
        var sName=this.createTxt();
        sName.x=this.mjNumText.x+this.mjNumText.width;
        sName.y=this.mjNumText.y;
        sName.text="张";
        this.windSp.addChild(sName);


        //房间号
        this.roomIdText = new egret.TextField();
        this.roomIdText.x=20;
        this.roomIdText.y=14;
        this.roomIdText.textColor = 0xffffff;
        this.roomIdText.multiline = true;
        this.roomIdText.fontFamily = "微软雅黑";
        this.roomIdText.size = 22;
        this.addChild(this.roomIdText);
        this.roomIdText.text="房间号:"+this.model.roomInfoModel.roomSn;
        this.roomIdText.visible=false;
        //剩余圈数
        var surplusGameNumBg = new egret.Bitmap(RES.getRes("g_board_Bg"));
        surplusGameNumBg.x = 98;
        surplusGameNumBg.y = -24;
        surplusGameNumBg.scaleX = 1.45;
        this.windSp.addChild(surplusGameNumBg);

        this.surplusGameNumText = this.createTxt("center");
        this.surplusGameNumText.x = surplusGameNumBg.x-2;
        this.surplusGameNumText.y =this.mjNumText.y;
        this.surplusGameNumText.width=surplusGameNumBg.width*surplusGameNumBg.scaleX;
        this.windSp.addChild(this.surplusGameNumText);

        //单位  局or圈
        var sName=this.createTxt();
        sName.x=this.surplusGameNumText.x+this.surplusGameNumText.width;
        sName.y=this.surplusGameNumText.y;
        sName.text=this.surplusGameNumName;
        this.windSp.addChild(sName);

        //ip冲突背景
        this.ipSameBg = this.CCenterBit("g_ipSameBg");
        this.ipSameBg.x = Main.stageWidth/2;
        this.ipSameBg.y = Main.stageHeight*.97;
        this.ipSameBg.visible = true;
        this.addChild(this.ipSameBg);

        //ip冲突
        this.ipSameText = new egret.TextField();
        this.ipSameText.x = Main.stageWidth/2;
        this.ipSameText.y = Main.stageHeight*.97;
        this.ipSameText.textColor = 0x9a9a9a;
        this.ipSameText.textAlign = "center";
        this.ipSameText.verticalAlign = "middle";
        this.ipSameText.size = 24;
        this.ipSameText.visible = true;
        this.addChild(this.ipSameText);

        //倒计时
        this.addCountDown();
        this.updateCnrrMJNum();
        this.updateLastNum();
       // this.updateIPSame();
    }

    /*初始化倒计时*/
    protected addCountDown(){
        for(var i=0;i<2;i++){
            var nBit = new egret.Bitmap(i==0?RES.getRes("g_clock_0"):RES.getRes("g_clock_8"));
            nBit.anchorOffsetX = nBit.width/2;
            nBit.anchorOffsetY = nBit.height/2;
            nBit.x = -10+nBit.width*i;
            nBit.y = -5;
            this.coundownBits.push(nBit);
            this.windSp.addChild(nBit);
        }
    }
    /*---------------------更新视图---------------------*/
    //设置风向隐藏和显示
    public setWindView(_is){
        this.mjNumText.visible=_is;
        //更新风向旋转
        this.clockView.setRotation(this.model.userGroupModel.user1Model.position);
        //更新麻将剩余多少张
        this.updateCnrrMJNum();
        this.updateLastNum();
        this.roomIdText.visible=_is;
        if(_is && this.gameNameText.visible){
            this.gameNameText.visible = false;
            var gameSign = this.CCenterBit("g_gameNameSign");
            gameSign.scaleX=gameSign.scaleY=1.2;
            gameSign.x = Main.stageWidth/2;
            gameSign.y = this.windSp.y+this.clockView.height/2+50;
            this.addChild(gameSign);
        }
    }

    //刷新圈风
    protected updateCircleWind(){
        if(this.circleWindText)
        this.circleWindText.text=this.model.roomInfoModel.circleWind+"";
    }
    //更新麻将剩余多少张
    protected updateCnrrMJNum() {
        var num=this.model.roomInfoModel.cnrrMJNum;
        /*等待或者准备阶段剩余麻将数量 0*/
        var selfPlayerStatus=this.model.userGroupModel.getSelfStatus();
        if(selfPlayerStatus==BaseModel.PLAYER_NONE||selfPlayerStatus==BaseModel.PLAYER_IN||selfPlayerStatus==BaseModel.PLAYER_PREPARED){
            num=0;
        }
        this.mjNumText.text = num+"";
    }
    //更新剩余圈数
    protected updateLastNum(){
        var lastNum = this.model.roomInfoModel.lastNum<0?0:this.model.roomInfoModel.lastNum;
        var totalNum = this.model.roomInfoModel.totalNum;
        this.surplusGameNumText.text=(totalNum-lastNum)+"/"+totalNum;
    }
    //更新风向指向
    protected updateClock(){
        this.coundownBits[0].texture = RES.getRes("g_clock_1");
        this.coundownBits[1].texture = RES.getRes("g_clock_0");
        this.clockView.updateHand(this.model.userGroupModel.user1Model.position,this.model.windDirection);
    }
    //更新倒计时
    protected updateCountdown(){
        var n = this.model.playCountdown;
        this.coundownBits[0].texture = RES.getRes("g_clock_"+0);
        this.coundownBits[1].texture = RES.getRes("g_clock_"+n);
    }
    //更新出牌闪烁
    protected updateClockTwinkleAni(){
        this.clockView.twinkleAni(this.model.windDirection==this.model.userGroupModel.user1Model.position,this.model.playCountdown);
    }
    //更新IP冲突
    public updateIPSame(data?){
        // if(!this.ipSameBg.visible) this.ipSameBg.visible = true;
        // if(!this.ipSameText.visible) this.ipSameText.visible = true;
        // hyh 修改PI冲突问题
        var Namelist = data.data.data;
        var len = data.data.data.length;
        var arr:Array<any>=[];
        for(var i=0;i<len;i++){
            arr.push(Namelist[i].openName);
        }
        var str1 = "";
        if (this.leaveName!=""){
            str1 = this.model.userGroupModel.getIpInfo()+"IP相同";
            if(len==0){
                str1 = "";
            }
        }else{
            if(this.model.userGroupModel.getIpInfo()){
                str1= this.model.userGroupModel.getIpInfo()+"IP相同";
            }
        }
        this.ipSameText.text = str1;
        this.ipSameText.anchorOffsetX = this.ipSameText.width/2;
        this.ipSameText.anchorOffsetY = this.ipSameText.height/2;

    }
    //隐藏IP冲突
    public hideIPSame(){
        this.ipSameText.visible = false;
        this.ipSameBg.visible = false;
    }

    /*创建 XX 张  XX圈标准 一个文本 1.3.6 zpb*/
    protected createTxt(align="left"){
        var txt = new egret.TextField();
        txt.textAlign = align;
        txt.textColor = 0x92d6cc;//0x1a4145;
        txt.size = 20;
        txt.fontFamily = "微软雅黑";
        return txt;
    }


    /*语音弹框*/
    /* 1.2.0 删除
     protected voiceBtnClick(e) {
        var newTime=egret.getTimer();
        if(!this.lastRecordTime||newTime-this.lastRecordTime>=5000){
            this.lastRecordTime=newTime;
            this.closeRecord(false);
            this.bg.touchEnabled=true;
            this.voiceBtn.addEventListener(egret.TouchEvent.TOUCH_END,this.closeRecord,this);
            this.bg.addEventListener(egret.TouchEvent.TOUCH_END,this.closeRecord,this);
            PopupLayer.getInstance().startRecord();
        }else{
            PopupLayer.getInstance().floatAlert("发送过于频繁 歇会再试吧~");
        }
    }*/
    /*停止语音*/
   /* 1.2.0 删除该功能
    protected closeRecord(_isSend=true){
        //销毁事件
        this.bg.touchEnabled=false;
        this.bg.removeEventListener(egret.TouchEvent.TOUCH_END,this.closeRecord,this);
        this.voiceBtn.removeEventListener(egret.TouchEvent.TOUCH_END,this.closeRecord,this);
        if(_isSend&&PopupLayer.getInstance().recordView){
            //停止录音
            var newTime=egret.getTimer();
            if(PopupLayer.getInstance().recordView.stop()){
                this.lastRecordTime=newTime;
            }else{
                this.lastRecordTime=null;
            }
        }
    }*/
    public clear(){
        super.clear();
        this.model.roomInfoModel.removeEventListener(BaseModel.GAME_CHANGE_VIEW_circleWind, this.updateCircleWind, this);//刷新圈风
        this.model.roomInfoModel.removeEventListener(BaseModel.GAME_CHANGE_VIEW_cnrrMJNum, this.updateCnrrMJNum, this);//刷新剩余多少张麻将
        this.model.roomInfoModel.removeEventListener(BaseModel.GAME_CHANGE_VIEW_lastNum, this.updateLastNum, this);//刷新剩余圈数
        this.model.removeEventListener(BaseModel.GAME_CHANGE_VIEW_clock, this.updateClock, this);//更新风向指向
        this.model.removeEventListener(BaseModel.GAME_CHANGE_VIEW_countdown,this.updateCountdown,this);//出牌倒计时
        this.model.removeEventListener(BaseModel.GAME_CHANGE_VIEW_twinkleAni,this.updateClockTwinkleAni,this);//出牌剩余3秒闪烁动画
        this.model.removeEventListener(BaseModel.GAME_CHANGE_VIEW_ipSame,this.updateIPSame,this);//ip冲突
        // BaseModel.getInstance().removeEventListener("isVoicing",this.updateUserChatVoiceState,this);//更新玩家播放语音状态  1.2.0 删除
    }
}
