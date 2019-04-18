var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by TYQ on 2017/7/10.
 */
var AH_MaxSettlementView = (function (_super) {
    __extends(AH_MaxSettlementView, _super);
    function AH_MaxSettlementView(data, currentId) {
        if (data === void 0) { data = null; }
        var _this = _super.call(this, false) || this;
        _this.currentId = currentId;
        _this.addTitle("g_settle_winTitleBg", Main.stageWidth / 2, 2);
        _this.addSettleBg();
        _this.addTitle("g_settle_max_title", _this.centerSp.width / 2, 2);
        _this.initContentInfo(data);
        _this.addBtns(data);
        return _this;
    }
    //离开 or 分享按钮
    AH_MaxSettlementView.prototype.addBtns = function (data) {
        this.leaveBtn = new MyButton("g_settle_leaveBtn");
        this.centerSp.addChild(this.leaveBtn);
        this.leaveBtn.addTouchEvent();
        this.leaveBtn.addEventListener("click", this.leaveBtnClick, this);
        this.leaveBtn.x = this.centerSp.width / 2 - 120;
        this.leaveBtn.y = this.centerSp.y + 206;
        var userList = data.slice(0);
        userList = userList.sort(this.compare("score"));
        this.shareBtn = new MyButton("g_settlement_Share");
        this.centerSp.addChild(this.shareBtn);
        this.shareBtn.addTouchEvent();
        this.shareBtn.addEventListener("click", function (e) {
            e.data = userList;
            PopupLayer.getInstance().addShareView();
            BaseModel.getInstance().eventRadio("settlementShare", e.data);
        }, this);
        this.shareBtn.x = this.centerSp.width / 2 + 80;
        this.shareBtn.y = this.centerSp.y + 206;
    };
    AH_MaxSettlementView.prototype.leaveBtnClick = function () {
        this.dispatchEvent(new egret.Event("close"));
        //切换到大厅界面
        BaseModel.getInstance().eventRadio("settlement_waitOk", "max");
    };
    AH_MaxSettlementView.prototype.initContentInfo = function (userInfos) {
        var huNum = userInfos.slice(0).sort(this.compare("score"))[0]; //得分最多的玩家
        var dianNum = userInfos.slice(0).sort(this.compare("dianNum"))[0]; //点炮最多的玩家
        for (var i = 0; i < 4; i++) {
            if (userInfos[i].dianNum > 0 && userInfos[i].dianNum == dianNum.dianNum && userInfos[i].score == huNum.score) {
                var settleView = new MaxSettleInfoView(userInfos[i], this.currentId, 3); //既是最佳炮手又是大赢家
            }
            else if (userInfos[i].dianNum > 0 && userInfos[i].dianNum == dianNum.dianNum) {
                var settleView = new MaxSettleInfoView(userInfos[i], this.currentId, 2); //点炮小能手
            }
            else if (userInfos[i].huNum > 0 && userInfos[i].score == huNum.score) {
                var settleView = new MaxSettleInfoView(userInfos[i], this.currentId, 1); //大赢家
            }
            else {
                var settleView = new MaxSettleInfoView(userInfos[i], this.currentId, 0); //啥也没
            }
            settleView.x = 180 + 264 * i;
            this.centerSp.addChild(settleView);
            //分割线
            if (i < 3) {
                var line = new egret.Bitmap(RES.getRes("g_maxSettle_line"));
                line.x = 308 + 264 * i;
                this.centerSp.addChild(line);
            }
        }
    };
    AH_MaxSettlementView.prototype.compare = function (property) {
        return function (a, b) {
            var value1 = a[property];
            var value2 = b[property];
            return value2 - value1;
        };
    };
    AH_MaxSettlementView.prototype.clear = function () {
        _super.prototype.clear.call(this);
        this.leaveBtn.clear();
        this.leaveBtn.removeEventListener("click", this.leaveBtnClick, this);
    };
    return AH_MaxSettlementView;
}(PopupBaseView));
__reflect(AH_MaxSettlementView.prototype, "AH_MaxSettlementView");
