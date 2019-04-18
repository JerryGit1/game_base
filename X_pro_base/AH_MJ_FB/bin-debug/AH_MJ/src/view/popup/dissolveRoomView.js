var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by TYQ on 2017/7/18.
 */
var AH_DissolveRoomView = (function (_super) {
    __extends(AH_DissolveRoomView, _super);
    function AH_DissolveRoomView(model, currentId) {
        var _this = _super.call(this) || this;
        _this.signs = [];
        //弹框背景相对于舞台的缩放比例
        _this.Scale = .6;
        _this.model = model;
        _this.currentId = currentId;
        var H = Main.stageHeight * _this.Scale;
        _this.bg = _this.addMsgBg(null, H); //"b_p_bg",
        _this.addStrTitle("解散房间");
        _this.addUsers();
        _this.addBtns();
        _this.addTip();
        _this.countdown();
        /*出牌暂停闪烁动画 停止倒计时 停止声音 hyh*/
        SoundModel.stopAllBackEffect();
        return _this;
    }
    AH_DissolveRoomView.prototype.addUsers = function () {
        //发起人
        this.addInitiator();
        //其他人：
        for (var i = 1; i <= this.model.othersAgree.length; i++) {
            var uInfo = this.model.othersAgree[i - 1];
            this.createHead(uInfo, i);
            /*同意或者拒绝提示*/
            var sign = this.createSign(i);
            this.signs.push(sign);
        }
    };
    /*创建发起人*/
    AH_DissolveRoomView.prototype.addInitiator = function () {
        var uData = {
            userId: this.model.userId,
            userImg: this.model.userImg,
            userName: this.model.userName
        };
        this.createHead(uData, 0);
        var sign = this.createSign(0);
        sign.texture = RES.getRes("g_agreeSign");
        sign.anchorOffsetX = sign.width / 2;
        sign.anchorOffsetY = sign.width / 2;
        sign.y = this.nickNameTxt.y + 12;
    };
    /*创建头像*/
    AH_DissolveRoomView.prototype.createHead = function (uInfo, index) {
        this.headImg = new Game_headCirceView();
        this.headImg.setHead(uInfo.userImg);
        this.headImg.width = 80;
        this.headImg.height = 80;
        this.headImg.x = (this.bg.width * .8) / 4 * index + (this.bg.width * .8) / 8 + this.headImg.width;
        this.headImg.y = this.bg.height * 0.35;
        this.centerSp.addChild(this.headImg);
        this.createNameText(uInfo, index, this.headImg);
    };
    /*创建昵称*/
    AH_DissolveRoomView.prototype.createNameText = function (uInfo, index, headImg) {
        this.nickNameTxt = new egret.TextField();
        this.nickNameTxt.size = 18;
        this.nickNameTxt.textColor = 0xCB6F01;
        this.nickNameTxt.multiline = true;
        this.nickNameTxt.textAlign = "center";
        this.nickNameTxt.verticalAlign = "middle";
        this.nickNameTxt.width = 76;
        this.nickNameTxt.x = (this.bg.width * .8) / 4 * index + (this.bg.width * .8) / 8 + this.nickNameTxt.width / 2;
        this.nickNameTxt.y = this.headImg.y + 60;
        this.nickNameTxt.fontFamily = "微软雅黑";
        this.nickNameTxt.text = uInfo.userName;
        this.centerSp.addChild(this.nickNameTxt);
    };
    /*创建同意或者拒绝提示*/
    AH_DissolveRoomView.prototype.createSign = function (index) {
        var sign = new egret.Bitmap();
        sign.x = this.bg.width * 0.2 + this.bg.width * 0.2 * index;
        // sign.y = this.bg.height*0.6;
        sign.y = this.nickNameTxt.y + 12;
        this.centerSp.addChild(sign);
        return sign;
    };
    AH_DissolveRoomView.prototype.addBtns = function () {
        //同意解散
        this.agreeBtn = new MyButton("g_agree");
        this.agreeBtn.changeSize(0.6, 0.6);
        this.agreeBtn.x = this.bg.width * 0.3;
        this.agreeBtn.y = this.bg.height * 0.8;
        this.centerSp.addChild(this.agreeBtn);
        //拒绝解散
        this.disAgreeBtn = new MyButton("g_disagree");
        this.disAgreeBtn.changeSize(0.6, 0.6);
        this.disAgreeBtn.x = this.bg.width * 0.7;
        this.disAgreeBtn.y = this.bg.height * 0.8;
        this.centerSp.addChild(this.disAgreeBtn);
        if (this.model._isInitiator) {
            this.setButtonEnabled();
        }
        else {
            this.agreeBtn.addTouchEvent();
            this.agreeBtn.addEventListener("click", this.agreeBtnClick, this);
            this.disAgreeBtn.addTouchEvent();
            this.disAgreeBtn.addEventListener("click", this.disAgreeBtnClick, this);
        }
    };
    /*刷新是否同意消息*/
    AH_DissolveRoomView.prototype.updateAgree = function () {
        for (var i = 0; i < this.model.othersAgree.length; i++) {
            if (this.signs[i]) {
                switch (this.model.othersAgree[i].agree) {
                    case 0:
                        break;
                    case 1:
                        this.signs[i].texture = RES.getRes("g_agreeSign");
                        break;
                    case 2:
                        this.signs[i].texture = RES.getRes("g_dissagreeSign");
                        break;
                }
                this.signs[i].anchorOffsetX = this.signs[i].width / 2;
                this.signs[i].anchorOffsetY = this.signs[i].width / 2;
            }
        }
        /*是否有过操作了*/
        if (this.model._isHandle) {
            this.setButtonEnabled();
        }
        /*其他动作*/
        if (this.model.agree == 1) {
            //所有人都同意解散房间了
            //停顿1秒
            this.setButtonEnabled();
            setTimeout(function () {
                this.closeClick();
                PopupLayer.getInstance().floatAlert("房间解散成功");
                //发起大结算
                BaseModel.getInstance().eventRadio("sponsorBigSettlement");
            }.bind(this), 1000);
        }
        else if (this.model.agree == 2) {
            //有人拒绝了
            //停顿1秒
            this.setButtonEnabled();
            setTimeout(function () {
                this.closeClick();
                PopupLayer.getInstance().floatAlert("房间解散失败");
            }.bind(this), 1000);
        }
    };
    /*同意*/
    AH_DissolveRoomView.prototype.agreeBtnClick = function () {
        this.setButtonEnabled();
        BaseModel.getInstance().eventRadio("agreeDissolveRoom", { agree: 1 });
    };
    /*拒绝*/
    AH_DissolveRoomView.prototype.disAgreeBtnClick = function () {
        this.setButtonEnabled();
        BaseModel.getInstance().eventRadio("agreeDissolveRoom", { agree: 2 });
    };
    /*设置按钮不可用*/
    AH_DissolveRoomView.prototype.setButtonEnabled = function () {
        this.agreeBtn.touchEnabled = false;
        this.agreeBtn.changTexture("g_agree1");
        this.disAgreeBtn.touchEnabled = false;
        this.disAgreeBtn.changTexture("g_dissagree1");
    };
    AH_DissolveRoomView.prototype.addTip = function () {
        var tipTxt = new egret.TextField();
        tipTxt.size = 18;
        tipTxt.textColor = 0xff0000;
        tipTxt.multiline = true;
        tipTxt.textAlign = "center";
        tipTxt.verticalAlign = "middle";
        tipTxt.width = 360;
        tipTxt.stroke = 1;
        tipTxt.strokeColor = 0x000000;
        tipTxt.width = this.bg.width;
        tipTxt.y = this.bg.height / 2 + 60;
        tipTxt.fontFamily = "微软雅黑";
        this.tipTxt = tipTxt;
        this.centerSp.addChild(tipTxt);
        this.onTimer();
    };
    AH_DissolveRoomView.prototype.countdown = function () {
        this.timer = new egret.Timer(1000, 301);
        this.timer.start();
        this.timer.addEventListener(egret.TimerEvent.TIMER, this.onTimer, this);
        this.timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.timerComFunc, this);
    };
    AH_DissolveRoomView.prototype.onTimer = function () {
        var starTime = this.model.dissolveTime;
        var nowTime = (new Date()).getTime();
        var time = Math.floor(((starTime + 300000) - nowTime) / 1000);
        time--;
        if (time >= 0)
            this.tipTxt.text = time + "s 后房间自动解散";
    };
    AH_DissolveRoomView.prototype.timerComFunc = function () {
        this.timer.stop();
    };
    AH_DissolveRoomView.prototype.clear = function () {
        _super.prototype.clear.call(this);
        this.agreeBtn.clear();
        this.timer.removeEventListener(egret.TimerEvent.TIMER, this.onTimer, this);
        this.agreeBtn.removeEventListener("click", this.agreeBtnClick, this);
        this.disAgreeBtn.clear();
        this.disAgreeBtn.removeEventListener("click", this.disAgreeBtnClick, this);
    };
    return AH_DissolveRoomView;
}(PopupBaseView));
__reflect(AH_DissolveRoomView.prototype, "AH_DissolveRoomView");
