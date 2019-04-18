var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by Administrator on 2016/12/19.
 */
var AH_PopupLayer = (function (_super) {
    __extends(AH_PopupLayer, _super);
    function AH_PopupLayer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /*浮层框提示*/
    /*-------------------浮层框--------------------*/
    AH_PopupLayer.prototype.floatAlert = function (str, time) {
        if (time === void 0) { time = 2500; }
        var sp = new egret.Sprite(), txt = new egret.TextField(), w, h;
        this.addChild(sp);
        sp.addChild(txt);
        txt.textColor = 0xffffff;
        txt.height = 40;
        txt.multiline = true;
        txt.textFlow = (new egret.HtmlTextParser()).parse(str);
        txt.size = 25;
        txt.textAlign = "center";
        w = txt.textWidth + 10;
        h = txt.textHeight + 20;
        txt.x = w / 2 - txt.width / 2;
        txt.y = h / 2 - txt.height / 2 + 5;
        sp.graphics.beginFill(0x000000, .5);
        sp.graphics.drawRoundRect(0, 0, w, h, 10, 10);
        sp.graphics.endFill();
        sp.x = Main.stageWidth / 2 - w / 2;
        sp.y = Main.stageHeight / 2 - h / 2 + 20;
        sp.alpha = 0;
        egret.Tween.get(sp).to({ y: sp.y - 20, alpha: 1 }, 100).wait(time).to({ y: sp.y - 40, alpha: 0 }, 150).call(function () {
            this.removeChild(sp);
        }, this);
    };
    /*-------------------游戏中所有的弹出框--------------------*/
    //提示框类型1
    AH_PopupLayer.prototype.addHintView = function (str, backFunc, _isAddCloseBtn, type) {
        if (backFunc === void 0) { backFunc = null; }
        if (_isAddCloseBtn === void 0) { _isAddCloseBtn = true; }
        if (type === void 0) { type = "min"; }
        var view = new Hint_View(str, backFunc, _isAddCloseBtn, type);
        this.addChild(view);
        view.addEventListener("close", this.closeLayer2_popupView, this);
    };
    // 用户协议
    AH_PopupLayer.prototype.adduserAgreementView = function () {
        var view = new H_userAgreementView();
        this.addChild(view);
        view.addEventListener("close", this.closeLayer2_popupView, this);
    };
    //个人信息
    AH_PopupLayer.prototype.userinfo = function (mode) {
        var view = new H_userInfoPopupView(mode);
        this.addChild(view);
        view.addEventListener("close", this.closeLayer2_popupView, this);
    };
    //创建房间
    AH_PopupLayer.prototype.createRoom = function () {
        var view = new H_createRoomView();
        this.addChild(view);
        view.addEventListener("close", this.closeLayer2_popupView, this);
    };
    AH_PopupLayer.prototype.joinRoom = function () {
        if (this.joinRoomView)
            this.closeJoinRoomPopupView();
        this.joinRoomView = new H_joinRoomView();
        this.addChild(this.joinRoomView);
        this.joinRoomView.addEventListener("close", this.closeLayer2_popupView, this);
    };
    /*关闭 加入房间弹窗*/
    AH_PopupLayer.prototype.closeJoinRoomPopupView = function () {
        this.remove_popupView(this.joinRoomView);
    };
    //分享弹框
    AH_PopupLayer.prototype.addShareView = function () {
        var view = new ShareView();
        this.addChild(view);
        view.addEventListener("close", this.closeLayer2_popupView, this);
    };
    //战绩
    AH_PopupLayer.prototype.achievementView = function (data) {
        var view = new H_achievementView(data);
        this.addChild(view);
        view.addEventListener("close", this.closeLayer2_popupView, this);
    };
    //消息
    /*1.2.0舍弃
    public newsView(){
        var view = new H_news();
        this.addChild(view);
        view.addEventListener("close",this.closeLayer2_popupView,this);
    }*/
    //代开房间
    AH_PopupLayer.prototype.hall_replaceCreateRoomView = function (model) {
        var view = new H_replaceCreateRoomView(model);
        this.addChild(view);
        view.addEventListener("close", this.closeLayer2_popupView, this);
    };
    //设置
    AH_PopupLayer.prototype.setView = function (type) {
        var view = new H_serView(type);
        this.addChild(view);
        view.addEventListener("close", this.closeLayer2_popupView, this);
    };
    //反馈
    AH_PopupLayer.prototype.feedbackView = function () {
        var view = new H_feedbackView();
        this.addChild(view);
        view.addEventListener("close", this.closeLayer2_popupView, this);
    };
    //小结算
    AH_PopupLayer.prototype.addSmallSettleView = function (data, isHuang, currentUserWin, currentId) {
        if (data === void 0) { data = null; }
        this.removePopupViewAll();
        var view = new SmallSettlementView(data, isHuang, currentUserWin, currentId);
        this.addChild(view);
        view.addEventListener("close", this.closeLayer2_popupView, this);
    };
    //小结算点杠人名字
    AH_PopupLayer.prototype.addTipView = function (string, width) {
        if (width === void 0) { width = null; }
        for (var i = 0; i < this.$children.length; i++) {
            if (this.$children[i].name == "H_tipView")
                this.removeChild(this.$children[i]);
        }
        var view = new H_tipView(string, width);
        this.addChild(view);
        view.addEventListener("close", this.closeLayer2_popupView, this);
        return view;
    };
    //大结算
    AH_PopupLayer.prototype.addMaxSettleView = function (data, currentId) {
        if (data === void 0) { data = null; }
        this.removePopupViewAll();
        var view = new MaxSettlementView(data, currentId);
        this.addChild(view);
        view.addEventListener("close", this.closeLayer2_popupView, this);
    };
    //帮助
    AH_PopupLayer.prototype.addHelpView = function () {
        var view = new HelpView();
        this.addChild(view);
        view.addEventListener("close", this.closeLayer2_popupView, this);
    };
    //聊天表情按钮
    AH_PopupLayer.prototype.addChatView = function (model) {
        var view = new ChatView(model);
        this.addChild(view);
        view.addEventListener("close", this.closeLayer2_popupView, this);
    };
    AH_PopupLayer.prototype.addKillRoomView = function (model, currentId) {
        if (!this.dissolveRoomView) {
            this.removePopupViewAll();
            this.dissolveRoomView = new DissolveRoomView(model, currentId);
            this.addChild(this.dissolveRoomView);
            this.dissolveRoomView.addEventListener("close", this.closeLayer2_popupView, this);
        }
        this.dissolveRoomView.updateAgree();
    };
    AH_PopupLayer.prototype.startRecord = function () {
        if (this.recordView)
            this.remove_popupView(this.recordView);
        this.recordView = new Game_recordView();
        this.addChild(this.recordView);
        this.recordView.x = Main.stageWidth / 2 - this.recordView.w / 2;
        this.recordView.y = Main.stageHeight / 2 - this.recordView.w / 2;
        this.recordView.addEventListener("close", this.closeLayer2_popupView, this);
    };
    /*关闭*/
    AH_PopupLayer.prototype.closeLayer2_popupView = function (e) {
        var view = e.target;
        this.remove_popupView(view);
    };
    /*清空弹出窗视图*/
    AH_PopupLayer.prototype.remove_popupView = function (view) {
        if (view) {
            view.clear();
            this.removeChild(view);
            view = null;
        }
        this.recordView = null;
        this.dissolveRoomView = null;
        this.joinRoomView = null;
    };
    /*-------------------清除游戏中所有的弹出窗视图--------------------*/
    AH_PopupLayer.prototype.removePopupViewAll = function () {
        var i = this.numChildren - 1;
        while (i >= 0) {
            var view = this.getChildAt(i);
            if (view["__types__"]) {
                for (var s in view["__types__"]) {
                    if (view["__types__"][s] == "PopupBaseView") {
                        this.remove_popupView(view);
                        break;
                    }
                }
            }
            i--;
        }
    };
    AH_PopupLayer.prototype.getPoint = function (sp, speed) {
        if (speed === void 0) { speed = 2; }
        document.addEventListener("keydown", function (e) {
            switch (e.keyCode) {
                case 39:
                    sp.x += speed;
                    break;
                case 37:
                    sp.x -= speed;
                    break;
                case 38:
                    sp.y -= speed;
                    break;
                case 40:
                    sp.y += speed;
                    break;
            }
            MyConsole.getInstance().trace(sp.x + "--------------()" + sp.y, 5);
        });
    };
    return AH_PopupLayer;
}(BaseView));
__reflect(AH_PopupLayer.prototype, "AH_PopupLayer");
