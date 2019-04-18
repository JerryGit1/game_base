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
 *
 * 背景场景
 */
var AH_BackgroundView = (function (_super) {
    __extends(AH_BackgroundView, _super);
    function AH_BackgroundView(model) {
        var _this = _super.call(this) || this;
        /*背景图片*/
        _this.bg = new egret.Bitmap();
        //倒计时图片集合
        _this.coundownBits = [];
        _this.model = model;
        _this.initBg(); //背景
        //this.addCircleWind();//圈风 1.0去掉
        _this.addWind(); //风向组件 房间号
        _this.updateClock(); //因为先更新的数据再去更新的视图，所以需要先初始化一下
        /*自定义事件侦听*/
        _this.model.roomInfoModel.addEventListener(BaseModel.GAME_CHANGE_VIEW_circleWind, _this.updateCircleWind, _this); //刷新圈风
        _this.model.roomInfoModel.addEventListener(BaseModel.GAME_CHANGE_VIEW_cnrrMJNum, _this.updateCnrrMJNum, _this); //刷新剩余多少张麻将
        _this.model.roomInfoModel.addEventListener(BaseModel.GAME_CHANGE_VIEW_lastNum, _this.updateLastNum, _this); //刷新剩余圈数
        _this.model.addEventListener(BaseModel.GAME_CHANGE_VIEW_clock, _this.updateClock, _this); //更新风向指向
        _this.model.addEventListener(BaseModel.GAME_CHANGE_VIEW_countdown, _this.updateCountdown, _this); //出牌倒计时
        _this.model.addEventListener(BaseModel.GAME_CHANGE_VIEW_twinkleAni, _this.updateClockTwinkleAni, _this); //出牌剩余3秒闪烁动画
        MyConsole.getInstance().trace("游戏内部---背景层渲染完毕", 1);
        return _this;
    }
    /*添加背景*/
    AH_BackgroundView.prototype.initBg = function () {
        this.bg = this.CCenterBit("g_background", false);
        this.bg.scale9Grid = new egret.Rectangle(24, 27, 1083, 670);
        this.bg.width = Main.stageWidth;
        this.bg.height = Main.stageHeight;
        this.addChild(this.bg);
    };
    /*------------------实例化视图------------------------*/
    //圈风
    AH_BackgroundView.prototype.addCircleWind = function () {
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
    };
    //实例化剩余多少圈
    AH_BackgroundView.prototype.addWind = function () {
        this.windSp = new egret.Sprite();
        this.addChild(this.windSp);
        this.windSp.x = Main.stageWidth / 2;
        this.windSp.y = Main.stageHeight / 2;
        //风向
        this.clockView = new Game_clockView();
        this.windSp.addChild(this.clockView);
        //玩法
        this.ruleText = new egret.TextField();
        this.ruleText.width = this.clockView.width;
        this.ruleText.x = -this.clockView.width / 2;
        this.ruleText.y = -96;
        this.ruleText.textAlign = "center";
        this.ruleText.textColor = 0x1a4145;
        this.ruleText.size = 24;
        this.ruleText.fontFamily = "微软雅黑";
        this.ruleText.text = this.model.roomInfoModel.totalNum + "圈" + " " + this.model.roomInfoModel.maxScore + "分封顶";
        this.windSp.addChild(this.ruleText);
        //游戏名
        this.gameNameText = new egret.TextField();
        this.gameNameText.width = this.clockView.width;
        this.gameNameText.x = -this.clockView.width / 2;
        this.gameNameText.y = 70;
        this.gameNameText.textAlign = "center";
        this.gameNameText.textColor = 0x1a4145;
        this.gameNameText.size = 24;
        this.gameNameText.fontFamily = "微软雅黑";
        this.gameNameText.text = "静海麻将";
        this.windSp.addChild(this.gameNameText);
        //剩余多少张麻将次数
        this.mjNumText = new egret.TextField();
        this.mjNumText.width = this.clockView.width;
        this.mjNumText.x = -this.clockView.width / 2 - 198;
        this.mjNumText.y = -16;
        this.mjNumText.textAlign = "right";
        this.mjNumText.textColor = 0x1a4145;
        this.mjNumText.size = 24;
        this.mjNumText.fontFamily = "微软雅黑";
        this.mjNumText.textFlow = (new egret.HtmlTextParser).parser("");
        this.windSp.addChild(this.mjNumText);
        //房间号
        this.roomIdText = new egret.TextField();
        this.roomIdText.y = 20;
        this.roomIdText.x = 20;
        this.roomIdText.textColor = 0xffffff;
        this.roomIdText.multiline = true;
        this.roomIdText.fontFamily = "微软雅黑";
        this.roomIdText.size = 22;
        this.addChild(this.roomIdText);
        this.roomIdText.text = "房间号:" + this.model.roomInfoModel.roomSn;
        //剩余圈数
        this.surplusGameNumText = new egret.TextField();
        this.surplusGameNumText.x = this.clockView.width / 2 + 20;
        this.surplusGameNumText.y = -16;
        this.surplusGameNumText.textAlign = "left";
        this.surplusGameNumText.textColor = 0x1a4145;
        this.surplusGameNumText.size = 24;
        this.surplusGameNumText.fontFamily = "微软雅黑";
        this.windSp.addChild(this.surplusGameNumText);
        //倒计时
        this.addCountDown();
        this.updateCnrrMJNum();
        this.updateLastNum();
    };
    /*初始化倒计时*/
    AH_BackgroundView.prototype.addCountDown = function () {
        for (var i = 0; i < 2; i++) {
            var nBit = new egret.Bitmap(i == 0 ? RES.getRes("g_clock_0") : RES.getRes("g_clock_8"));
            nBit.anchorOffsetX = nBit.width / 2;
            nBit.anchorOffsetY = nBit.height / 2;
            nBit.x = -10 + nBit.width * i;
            nBit.y = -5;
            this.coundownBits.push(nBit);
            this.windSp.addChild(nBit);
        }
    };
    /*---------------------更新视图---------------------*/
    //设置风向隐藏和显示
    AH_BackgroundView.prototype.setWindView = function (_is) {
        this.mjNumText.visible = _is;
        //更新风向旋转
        this.clockView.setRotation(this.model.userGroupModel.user1Model.position);
        //更新麻将剩余多少张
        this.updateCnrrMJNum();
        this.updateLastNum();
    };
    //刷新圈风
    AH_BackgroundView.prototype.updateCircleWind = function () {
        if (this.circleWindText)
            this.circleWindText.text = this.model.roomInfoModel.circleWind + "";
    };
    //更新麻将剩余多少张
    AH_BackgroundView.prototype.updateCnrrMJNum = function () {
        var num = this.model.roomInfoModel.cnrrMJNum;
        /*等待或者准备阶段剩余麻将数量 0*/
        var selfPlayerStatus = this.model.userGroupModel.getSelfStatus();
        if (selfPlayerStatus == BaseModel.PLAYER_NONE || selfPlayerStatus == BaseModel.PLAYER_IN || selfPlayerStatus == BaseModel.PLAYER_PREPARED) {
            num = 0;
        }
        this.mjNumText.text = num + "张";
    };
    //更新剩余圈数
    AH_BackgroundView.prototype.updateLastNum = function () {
        var lastNum = this.model.roomInfoModel.lastNum < 0 ? 0 : this.model.roomInfoModel.lastNum;
        var totalNum = this.model.roomInfoModel.totalNum;
        this.surplusGameNumText.text = (totalNum - lastNum) + "/" + totalNum + "圈";
    };
    //更新风向指向
    AH_BackgroundView.prototype.updateClock = function () {
        this.coundownBits[0].texture = RES.getRes("g_clock_1");
        this.coundownBits[1].texture = RES.getRes("g_clock_0");
        this.clockView.updateHand(this.model.userGroupModel.user1Model.position, this.model.windDirection);
    };
    //更新倒计时
    AH_BackgroundView.prototype.updateCountdown = function () {
        var n = this.model.playCountdown;
        this.coundownBits[0].texture = RES.getRes("g_clock_" + 0);
        this.coundownBits[1].texture = RES.getRes("g_clock_" + n);
    };
    //更新出牌闪烁
    AH_BackgroundView.prototype.updateClockTwinkleAni = function () {
        this.clockView.twinkleAni(this.model.windDirection == this.model.userGroupModel.user1Model.position, this.model.playCountdown);
    };
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
    AH_BackgroundView.prototype.clear = function () {
        _super.prototype.clear.call(this);
        this.model.roomInfoModel.removeEventListener(BaseModel.GAME_CHANGE_VIEW_circleWind, this.updateCircleWind, this); //刷新圈风
        this.model.roomInfoModel.removeEventListener(BaseModel.GAME_CHANGE_VIEW_cnrrMJNum, this.updateCnrrMJNum, this); //刷新剩余多少张麻将
        this.model.roomInfoModel.removeEventListener(BaseModel.GAME_CHANGE_VIEW_lastNum, this.updateLastNum, this); //刷新剩余圈数
        this.model.removeEventListener(BaseModel.GAME_CHANGE_VIEW_clock, this.updateClock, this); //更新风向指向
        this.model.removeEventListener(BaseModel.GAME_CHANGE_VIEW_countdown, this.updateCountdown, this); //出牌倒计时
        this.model.removeEventListener(BaseModel.GAME_CHANGE_VIEW_twinkleAni, this.updateClockTwinkleAni, this); //出牌剩余3秒闪烁动画
        // BaseModel.getInstance().removeEventListener("isVoicing",this.updateUserChatVoiceState,this);//更新玩家播放语音状态  1.2.0 删除
    };
    return AH_BackgroundView;
}(BaseView));
__reflect(AH_BackgroundView.prototype, "AH_BackgroundView");
