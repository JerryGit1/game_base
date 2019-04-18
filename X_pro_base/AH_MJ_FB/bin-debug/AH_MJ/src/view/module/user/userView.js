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
 */
var AH_Game_userView = (function (_super) {
    __extends(AH_Game_userView, _super);
    function AH_Game_userView(model, index) {
        var _this = _super.call(this) || this;
        //玩家在线状态设置
        _this._isOut = -1;
        _this.model = model;
        _this.index = index;
        /*初始化视图*/
        _this.headView = new Game_headView();
        _this.addChild(_this.headView);
        _this.headView.scaleX = _this.headView.scaleY = .8;
        _this.headView.W = _this.headView.width * _this.headView.scaleX;
        _this.addWaitTxt();
        //玩家状态更新
        _this.model.addEventListener(BaseModel.GAME_CHANGE_VIEW_playerState, _this.updateStateInfo, _this);
        //玩家在线状态更新
        _this.model.addEventListener(BaseModel.GAME_CHANGE_VIEW_playerLineState, _this.lineState, _this);
        //更新玩家基础信息
        _this.model.addEventListener(BaseModel.GAME_CHANGE_VIEW_playerBaseInfo, _this.updateBaseInfo, _this);
        //玩家聊天语音状态更新
        // this.model.addEventListener(BaseModel.GAME_CHANGE_VIEW_chatVoiceStatus,this.updateChatVoiceStatus,this); 1.2.0删除
        /*点击事件*/
        _this.headView.touchEnabled = true;
        _this.headView.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.addUserInfoPopupView, _this);
        //底部介绍信息
        _this.infoView = new Game_user_infoView();
        _this.addChild(_this.infoView);
        _this.infoView.y = _this.headView.height / 2 - 10;
        if (_this.model.playStatus == BaseModel.PLAYER_NONE)
            _this.infoView.visible = false;
        return _this;
    }
    /*
     * playStatus的值有
     dating              用户在大厅中
     in                  刚进入房间，等待状态
     prepared            准备状态
     chu                 出牌状态（该出牌了）
     wait                等待状态（非出牌状态）
     xjs                 小结算
     none            这个位置没人（等待阶段 掉线或者退出房间）
     * **/
    AH_Game_userView.prototype.updateStateInfo = function () {
        this.waitText.visible = this.infoView.visible = false;
        this.headView.setHighLight(true); //边框
        switch (this.model.playStatus) {
            case BaseModel.PLAYER_IN:
                // this.infoView.visible=true;
                // this.userInRoomTip();//玩家进入房间提示
                // this.updateBaseInfo();
                break;
            case BaseModel.PLAYER_PREPARED:
                this.infoView.visible = true;
                this.updateBaseInfo();
                break;
            case BaseModel.PLAYER_CHU:
                this.infoView.visible = true;
                this.headView.setChuStatus(true);
                this.headView.setHighLight(false);
                break;
            case BaseModel.PLAYER_WAIT:
                this.infoView.visible = true;
                this.headView.setChuStatus(false);
                break;
            case BaseModel.PLAYER_XJS:
                this.infoView.visible = true;
                this.headView.setChuStatus(false);
                break;
            case BaseModel.PLAYER_NONE:
                this.headView.setHead(null);
                this.waitText.visible = true;
                if (this.zhuangIcon)
                    this.zhuangIcon.visible = false;
                break;
            default:
                MyConsole.getInstance().trace("玩家状态 没有这个奇葩状态" + this.model.playStatus, 0);
                break;
        }
    };
    //刷新玩家头像基础信息
    AH_Game_userView.prototype.updateBaseInfo = function () {
        if (this.model.playStatus != BaseModel.PLAYER_NONE) {
            // MyConsole.getInstance().trace("玩家"+this.model.openName+"加入",1);
            //基础数据显示
            this.infoView.updateInfo(this.model.score, this.model.openName);
            this.headView.setHead(this.model.openImg);
            //庄加标志
            this.setZhuang(this.model.zhuang);
            //房主标志
            this.setHost(this.model.houseOwner);
        }
    };
    AH_Game_userView.prototype.lineState = function () {
        if (this.model.status == BaseModel.PLAYER_OUT) {
            if (this._isOut == 1 && this.model.num_id != 1) {
                PopupLayer.getInstance().floatAlert("玩家 <font color='#ff0000'>" + this.model.openName + "</font> 掉线", 800);
            }
            if (this._isOut == 1 || this._isOut == -1) {
                this.headView.setOffLine(true);
            }
            this._isOut = 2;
        }
        else if (this.model.status == BaseModel.PLAYER_INLINE) {
            if (this._isOut == 2 && this.model.num_id != 1) {
                PopupLayer.getInstance().floatAlert("玩家 <font color='#00cc00'>" + this.model.openName + "</font> 上线", 800);
            }
            if (this._isOut == 2 || this._isOut == -1) {
                this.headView.setOffLine();
            }
            this._isOut = 1;
        }
    };
    /*玩家语音状态显示*/
    /* 1.2.0删除
    private updateChatVoiceStatus(){
        if(!this.voiceIcon){
            var voiceIcon = this.CCenterBit("g_isVoiceSign");
            voiceIcon.y = this.headView.height/2-40;
            this.voiceIcon = voiceIcon;
            this.voiceIcon.alpha = 0;
            this.addChild(this.voiceIcon);
            if(this.index == 2){
                this.voiceIcon.scaleX = -1;
                this.voiceIcon.x = this.headView.x-60;
            }else{
                this.voiceIcon.x= this.headView.x+60;
            }
        }
        egret.Tween.removeTweens(this.voiceIcon);
        this.voiceIcon.visible = this.model.chatVoiceStatus;
        if(this.voiceIcon.visible)
            egret.Tween.get(this.voiceIcon,{loop:true}).to({alpha:1},600).wait(200).to({alpha:0},600);
    }*/
    /*显示庄标志*/
    AH_Game_userView.prototype.setZhuang = function (_isAdd) {
        if (!this.zhuangIcon) {
            var zhuang = this.CCenterBit("g_zhuang");
            if (this.index == 2 || this.index == 3) {
                zhuang.x = -this.headView.W / 2 + 10; //左
                zhuang.y = -this.headView.height / 2 + 17;
            }
            else {
                zhuang.x = this.headView.W / 2 - 5; //右
                zhuang.y = -this.headView.height / 2 + 17;
            }
            this.zhuangIcon = zhuang;
            this.addChild(zhuang);
        }
        this.zhuangIcon.visible = _isAdd;
    };
    /*显示房主标志*/
    AH_Game_userView.prototype.setHost = function (_isAdd) {
        if (!this.hostIcon) {
            var hostIcon = this.CCenterBit("g_host");
            this.addChild(hostIcon);
            hostIcon.scaleX = hostIcon.scaleY = .7;
            if (this.index == 2 || this.index == 3) {
                hostIcon.x = this.headView.W / 2 - 12; //右
                hostIcon.rotation = 45;
                hostIcon.y = -this.headView.height / 2 + 18;
            }
            else {
                hostIcon.x = -this.headView.W / 2 + 15; //左
                hostIcon.rotation = -45;
                hostIcon.y = -this.headView.height / 2 + 20;
            }
            this.hostIcon = hostIcon;
        }
        this.hostIcon.visible = _isAdd;
    };
    /*等待中文本*/
    AH_Game_userView.prototype.addWaitTxt = function () {
        var waitText = new egret.TextField();
        this.addChild(waitText);
        waitText.textColor = 0xffffff;
        waitText.multiline = true;
        waitText.stroke = 1;
        waitText.strokeColor = 0x000000;
        waitText.textAlign = "center";
        waitText.verticalAlign = "middle";
        waitText.width = this.width;
        waitText.x = -this.width / 2;
        waitText.fontFamily = "微软雅黑";
        waitText.size = 17;
        waitText.y = this.headView.height / 2;
        waitText.text = "等待中...";
        this.waitText = waitText;
        this.waitText.visible = false;
    };
    /*---------------------弹窗-------------------------*/
    /*显示用户信息*/
    AH_Game_userView.prototype.addUserInfoPopupView = function () {
        if (this.model.playStatus != BaseModel.PLAYER_NONE) {
            PopupLayer.getInstance().userinfo(this.model);
        }
    };
    /*清除*/
    AH_Game_userView.prototype.clear = function () {
        _super.prototype.clear.call(this);
        //玩家状态更新
        this.model.removeEventListener(BaseModel.GAME_CHANGE_VIEW_playerState, this.updateStateInfo, this);
        //玩家在线状态更新
        this.model.removeEventListener(BaseModel.GAME_CHANGE_VIEW_playerLineState, this.lineState, this);
        //更新玩家基础信息
        this.model.removeEventListener(BaseModel.GAME_CHANGE_VIEW_playerBaseInfo, this.updateBaseInfo, this);
        //玩家聊天语音状态更新
        // this.model.removeEventListener(BaseModel.GAME_CHANGE_VIEW_chatVoiceStatus,this.updateChatVoiceStatus,this); 1.2.0删除
    };
    return AH_Game_userView;
}(BaseView));
__reflect(AH_Game_userView.prototype, "AH_Game_userView");
