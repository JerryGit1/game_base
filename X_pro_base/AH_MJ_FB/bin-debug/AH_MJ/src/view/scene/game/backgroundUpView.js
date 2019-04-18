var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by Tang on 2017/9/9.
 */
/**
 * 创建者 伟大的周鹏斌大王 on 2017/6/17.
 *
 * 背景场景
 */
var AH_BackgroundUpView = (function (_super) {
    __extends(AH_BackgroundUpView, _super);
    function AH_BackgroundUpView(model) {
        var _this = _super.call(this) || this;
        /*头像组*/
        _this.userViews = [];
        _this.model = model;
        _this.addUserList(); //添加玩家
        _this.addNoticeView(); //跑马灯
        _this.addBtns(); //按钮
        BaseModel.getInstance().addEventListener("isVoicing", _this.updateUserChatVoiceState, _this); //更新玩家播放语音状态
        BaseModel.getInstance().addEventListener("searchName", _this.searchName, _this); //查询用点杠户名
        //1.0 去掉
        // this.helpBtn.visible=false;
        _this.settingBtn.addTouchEvent();
        _this.settingBtn.addEventListener("click", _this.settingBtnClick, _this);
        //1.6.8 release版去掉
        /*if(this.model.getVersionType()!="release"){
         this.voiceBtn.addTouchEvent();
         this.voiceBtn.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.voiceBtnClick, this);
         }else{
         this.voiceBtn.visible=false;
         }*/
        _this.chatBtn.addTouchEvent();
        _this.chatBtn.addEventListener("click", _this.chatBtnBtnClick, _this);
        return _this;
    }
    /*跑马灯*/
    AH_BackgroundUpView.prototype.addNoticeView = function () {
        this.noticeView = new H_noticeView();
        this.noticeView.x = Main.stageWidth / 2 - this.noticeView.width / 2 - 30;
        this.noticeView.y = 15;
        this.noticeView.visible = false;
        this.addChild(this.noticeView);
    };
    /*------------------实例化视图------------------------*/
    /*显示头像*/
    AH_BackgroundUpView.prototype.addUserList = function () {
        for (var i = 1; i <= 4; i++) {
            var userView = new Game_userView(this.model.userGroupModel.numIdGetUserModel(i), i);
            userView.x = this.model.headPos[i - 1].x;
            userView.y = this.model.headPos[i - 1].y;
            this.userViews.push(userView);
            this.addChild(userView);
        }
    };
    /*---------------------更新视图---------------------*/
    //更新玩家播放语音状态
    AH_BackgroundUpView.prototype.updateUserChatVoiceState = function (e) {
        var data = e.data;
        this.model.userGroupModel.setUserIsPlayingVoice(data.Id, data._isVoicing);
    };
    /*-----------------------弹框----------------------*/
    /*点杠人弹框*/
    AH_BackgroundUpView.prototype.searchName = function (e) {
        var userId = e.data.dian_userId;
        var name = (this.model.userGroupModel.userIdGetUserModel(userId)).openName;
        var string = "<font color='#CB6F01'>" + name + "</font>  点杠";
        // PopupLayer.getInstance().addTipView(name,e.data.x,e.data.y)
        var view = PopupLayer.getInstance().addTipView(string);
        view.x = e.data.x;
        view.y = e.data.y;
    };
    //添加按钮
    AH_BackgroundUpView.prototype.addBtns = function () {
        //设置按钮
        this.settingBtn = new MyButton("g_settingBtn");
        this.settingBtn.x = Main.stageWidth * 0.95;
        this.settingBtn.y = Main.stageHeight * .1;
        this.addChild(this.settingBtn);
        //表情按钮
        this.chatBtn = new MyButton("g_chatBtn");
        this.chatBtn.x = this.settingBtn.x;
        this.chatBtn.y = Main.stageHeight * .6;
        this.addChild(this.chatBtn);
    };
    /*-----------------------弹框----------------------*/
    /*设置弹框*/
    AH_BackgroundUpView.prototype.settingBtnClick = function (e) {
        PopupLayer.getInstance().setView("in");
    };
    /*表情弹框*/
    AH_BackgroundUpView.prototype.chatBtnBtnClick = function (e) {
        PopupLayer.getInstance().addChatView(this.model["user1Model"]);
    };
    AH_BackgroundUpView.prototype.clear = function () {
        _super.prototype.clear.call(this);
        for (var i = 0; i < this.userViews.length; i++) {
            this.userViews[i].clear();
        }
    };
    return AH_BackgroundUpView;
}(BaseView));
__reflect(AH_BackgroundUpView.prototype, "AH_BackgroundUpView");
