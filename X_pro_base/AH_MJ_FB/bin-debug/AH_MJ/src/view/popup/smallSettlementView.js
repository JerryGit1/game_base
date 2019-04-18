var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by TYQ on 2017/7/8.
 */
var AH_SmallSettlementView = (function (_super) {
    __extends(AH_SmallSettlementView, _super);
    function AH_SmallSettlementView(data, isHuang, currentUserWin, currentId) {
        if (data === void 0) { data = null; }
        var _this = _super.call(this, false) || this;
        _this.currentId = currentId;
        var title = _this.addTitle(currentUserWin ? "g_settle_winTitleBg" : "g_settle_failTitleBg", Main.stageWidth / 2, 2);
        var bg = _this.addSettleBg(null, null, currentUserWin ? "g_settle_winBg" : "g_settle_failBg"); //860,540,
        bg.y = 60;
        _this.initContentInfo(data, currentUserWin, isHuang, title.y + title.height / 3.4);
        _this.addContinueBtn();
        _this.updateTitleText(isHuang, currentUserWin);
        return _this;
    }
    AH_SmallSettlementView.prototype.addContinueBtn = function () {
        this.continueBtn = new MyButton("g_settle_continueBtn");
        this.centerSp.addChild(this.continueBtn);
        this.continueBtn.addTouchEvent();
        this.continueBtn.addEventListener("click", this.continueBtnClick, this);
        this.continueBtn.anchorOffsetX = this.continueBtn.width / 2;
        this.continueBtn.anchorOffsetY = this.continueBtn.height / 2;
        this.continueBtn.x = this.centerSp.width / 2;
        this.continueBtn.y = this.centerSp.y + 236;
    };
    AH_SmallSettlementView.prototype.continueBtnClick = function () {
        this.dispatchEvent(new egret.Event("close"));
        PopupLayer.getInstance().removePopupViewAll();
        //切换到等待界面
        BaseModel.getInstance().eventRadio("settlement_waitOk", "small");
    };
    AH_SmallSettlementView.prototype.initContentInfo = function (userInfos, currentUserWin, isHuang, initY) {
        var H = (Main.stageHeight - initY - 120) / 4;
        for (var i = 0; i < 4; i++) {
            var settleView = new SmallSettleInfoView(userInfos[i], this.currentId, currentUserWin, isHuang);
            settleView.x = 70;
            settleView.y = initY + H * i;
            this.centerSp.addChild(settleView);
            //分割线
            if (i < 3) {
                var line = new egret.Bitmap(RES.getRes("g_smallSettle_line"));
                line.y = initY + (H * i) + 60;
                line.x = 40;
                this.centerSp.addChild(line);
            }
        }
    };
    AH_SmallSettlementView.prototype.updateTitleText = function (isHuang, currentUserWin) {
        var title;
        if (!isHuang) {
            title = this.CCenterBit(currentUserWin ? "g_settle_small_win" : "g_settle_small_fail");
        }
        else {
            title = this.CCenterBit("g_settle_small_ping");
        }
        title.anchorOffsetX = title.width / 2;
        title.anchorOffsetY = title.height / 2;
        title.x = this.centerSp.width / 2;
        title.y = 8;
        this.centerSp.addChild(title);
    };
    AH_SmallSettlementView.prototype.clear = function () {
        _super.prototype.clear.call(this);
        this.continueBtn.clear();
        this.continueBtn.removeEventListener("click", this.continueBtnClick, this);
    };
    return AH_SmallSettlementView;
}(PopupBaseView));
__reflect(AH_SmallSettlementView.prototype, "AH_SmallSettlementView");
