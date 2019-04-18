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
 * 游戏准备 等待玩家凑齐场景类
 */
var AH_PrepareScene = (function (_super) {
    __extends(AH_PrepareScene, _super);
    function AH_PrepareScene(model) {
        var _this = _super.call(this, model) || this;
        //有人加入房间提示
        _this.model.userGroupModel.addEventListener("newJoinRoom", _this.newJoinRoomTips, _this);
        //有人离开提示
        _this.model.userGroupModel.addEventListener("leaveRoom", _this.leaveRoom, _this);
        //4个人凑齐显示 确认开局按钮
        _this.model.userGroupModel.addEventListener("playerTogetherOk", _this.addOpeningBtn, _this);
        //4个人没凑齐
        _this.model.userGroupModel.addEventListener("playerTogetherNo", _this.removeOpeningBtn, _this);
        return _this;
    }
    /*---------视图------------*/
    AH_PrepareScene.prototype.addBtns = function () {
        //分享按钮
        this.shareBtn = new MyButton("g_shareBtn");
        this.shareBtn.x = Main.stageWidth * 0.37;
        this.shareBtn.y = Main.stageHeight * 0.8;
        this.addChild(this.shareBtn);
        //解除房间or退出房间按钮
        this.killRoomBtn = new MyButton(this.model.userGroupModel.user1Model.houseOwner ? "g_killRoomBtn" : "g_killRoomBtn1");
        this.killRoomBtn.x = Main.stageWidth * 0.63;
        this.killRoomBtn.y = Main.stageHeight * 0.8;
        this.addChild(this.killRoomBtn);
        this.shareBtn.addTouchEvent();
        this.shareBtn.addEventListener("click", this.shareClick, this);
        this.killRoomBtn.addTouchEvent();
        this.killRoomBtn.addEventListener("click", this.killRoomClick, this);
        if (this.openingBtn) {
            this.killRoomBtn.visible = this.shareBtn.visible = false;
        }
    };
    /*显示确认开局按钮*/
    AH_PrepareScene.prototype.addOpeningBtn = function () {
        if (this.killRoomBtn)
            this.killRoomBtn.visible = this.shareBtn.visible = false;
        if (!this.openingBtn) {
            this.openingBtn = new MyButton("openingBtn");
            this.openingBtn.x = Main.stageWidth / 2;
            this.openingBtn.y = Main.stageHeight + this.openingBtn.height * .7;
            this.addChild(this.openingBtn);
            this.openingBtn.addTouchEvent();
            this.openingBtn.addEventListener("click", this.opening, this);
            egret.Tween.get(this.openingBtn).to({ y: Main.stageHeight - this.openingBtn.height * .9 }, 500, egret.Ease.backOut);
        }
    };
    AH_PrepareScene.prototype.removeOpeningBtn = function () {
        if (this.openingBtn) {
            this.openingBtn.removeEventListener("click", this.opening, this);
            this.openingBtn.clear();
            this.removeChild(this.openingBtn);
            this.openingBtn = null;
        }
        if (this.killRoomBtn)
            this.killRoomBtn.visible = this.shareBtn.visible = true;
    };
    /*---------事件-------------*/
    /*分享*/
    AH_PrepareScene.prototype.shareClick = function (e) {
        PopupLayer.getInstance().addShareView();
    };
    /*解散or退出房间*/
    AH_PrepareScene.prototype.killRoomClick = function (e) {
        BaseModel.getInstance().eventRadio("sponsorGameKillRoom");
    };
    /*确认开局*/
    AH_PrepareScene.prototype.opening = function (e) {
        BaseModel.getInstance().eventRadio("settlementWaitOk");
    };
    /*加入房间提示*/
    AH_PrepareScene.prototype.newJoinRoomTips = function (e) {
        var data = e.data;
        PopupLayer.getInstance().floatAlert("玩家 <font color='#ffff00'>" + data.name + "</font> 加入房间", 1000);
    };
    /*有人离开房间提示*/
    AH_PrepareScene.prototype.leaveRoom = function (e) {
        var data = e.data;
        PopupLayer.getInstance().floatAlert("玩家 <font color='#ff0000'>" + data.name + "</font> 离开房间", 1000);
    };
    AH_PrepareScene.prototype.clear = function () {
        _super.prototype.clear.call(this);
        this.shareBtn.removeEventListener("click", this.shareClick, this);
        this.shareBtn.clear();
        this.killRoomBtn.removeEventListener("click", this.shareClick, this);
        this.killRoomBtn.clear();
        this.model.userGroupModel.removeEventListener("newJoinRoom", this.newJoinRoomTips, this);
        this.model.userGroupModel.removeEventListener("playerTogether", this.newJoinRoomTips, this);
        //4个人没凑齐
        this.model.userGroupModel.removeEventListener("playerTogetherNo", this.removeOpeningBtn, this);
        this.removeOpeningBtn();
    };
    return AH_PrepareScene;
}(AH_GameBaseScene));
__reflect(AH_PrepareScene.prototype, "AH_PrepareScene");
