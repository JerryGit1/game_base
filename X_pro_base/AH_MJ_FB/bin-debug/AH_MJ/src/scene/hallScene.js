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
 * 大厅场景主类
 */
var AH_HallScene = (function (_super) {
    __extends(AH_HallScene, _super);
    function AH_HallScene(model) {
        var _this = _super.call(this, model) || this;
        /*战绩弹框*/
        _this.model.addEventListener("addRecordPopupView", _this.addRecordPopupView, _this);
        // 反馈成功弹框
        _this.model.addEventListener("alertMsg", _this.alertMsg, _this);
        _this.initView();
        return _this;
    }
    //初始化页面视图
    AH_HallScene.prototype.initView = function () {
        //背景
        this.initBg();
        //用户信息栏
        this.userInfoView = new H_userInfoView(this.model.userModel);
        this.userInfoView.x = 56;
        this.userInfoView.y = 56;
        this.addChild(this.userInfoView);
        //跑马灯
        this.noticeView = new H_noticeView();
        this.noticeView.x = 266;
        this.noticeView.y = 23;
        this.addChild(this.noticeView);
        this.noticeView.setTextPos(this.model.userModel.notice);
        //右侧按钮列表
        this.btnGroup = new H_btnGroupView(this.model);
        this.addChild(this.btnGroup);
        this.btnGroup.x = Main.stageWidth - this.btnGroup.width;
        //标题
        var title = this.CCenterBit("h_title", false);
        this.addChild(title);
        title.scaleY = title.scaleX = (this.btnGroup.width * .6 / title.width);
        title.y = Main.stageHeight - title.height * title.scaleY;
        /*创建房间按钮和加入房间按钮*/
        this.createRoomBtn = new H_createRoom();
        // this.createRoomBtn.width = Main.stageWidth/5;
        this.createRoomBtn.x = 820;
        this.createRoomBtn.y = Main.stageHeight / 2 - this.createRoomBtn.height / 2 - 10;
        this.addChild(this.createRoomBtn);
        // 加入房间
        this.joinRoomBtn = new H_joinRoom();
        var initH = Main.stageHeight - 114 * 3;
        this.joinRoomBtn.x = 820;
        this.joinRoomBtn.y = Main.stageHeight / 2 + this.joinRoomBtn.height / 2 + 10;
        this.addChild(this.joinRoomBtn);
        if (!this.model.userModel.userAgree) {
            PopupLayer.getInstance().adduserAgreementView();
        }
        //自定义分享
        WeiXinJSSDK.getInstance().hallShare();
        //播放背景音效
        SoundModel.playBackSound("h_bg_sound");
    };
    //实例化背景
    AH_HallScene.prototype.initBg = function () {
        var h_back = new egret.Bitmap(RES.getRes("h_back"));
        this.addChild(h_back);
        //tyq 添加
        //任务
        var h_role = new egret.Bitmap(RES.getRes("b_p_projectRole"));
        h_role.y = 112;
        this.addChild(h_role);
        //麻将Logo
        var h_name = new egret.Bitmap(RES.getRes("b_p_projectName"));
        h_name.x = 78;
        h_name.y = 568;
        this.addChild(h_name);
    };
    /*显示用户信息弹框*/
    AH_HallScene.prototype.addUserInfoView = function () {
    };
    /*点击元宝或者加号弹窗*/
    AH_HallScene.prototype.payTipsView = function () {
    };
    /*显示加入房间弹框*/
    AH_HallScene.prototype.addRoomView = function (e) {
    };
    /*显示创建房间弹框*/
    AH_HallScene.prototype.createRoomView = function (e) {
    };
    /*显示战绩弹框*/
    AH_HallScene.prototype.addRecordPopupView = function (e) {
        var data = e.data;
        PopupLayer.getInstance().achievementView(data);
    };
    // 显示反馈回调弹框
    AH_HallScene.prototype.alertMsg = function (e) {
        var data = e.data.content;
        PopupLayer.getInstance().addHintView(data, null, true, "min");
    };
    AH_HallScene.prototype.clear = function () {
        _super.prototype.clear.call(this);
        /*战绩弹框*/
        this.model.removeEventListener("addRecordPopupView", this.addRecordPopupView, this);
        // 反馈成功弹框
        this.model.removeEventListener("alertMsg", this.alertMsg, this);
        this.userInfoView.clear();
    };
    return AH_HallScene;
}(BaseScene));
__reflect(AH_HallScene.prototype, "AH_HallScene");
