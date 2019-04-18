var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by TYQ on 2017/7/7.
 * 小提示框
 * 修改：韩月辉 2017
 */
var AH_Hint_View = (function (_super) {
    __extends(AH_Hint_View, _super);
    //_isAddCloseBtn 是否显示关闭按钮 true false;
    // type 默认 min 可选值 max
    function AH_Hint_View(str, backFunc, _isAddCloseBtn, type) {
        if (backFunc === void 0) { backFunc = null; }
        if (_isAddCloseBtn === void 0) { _isAddCloseBtn = true; }
        if (type === void 0) { type = "min"; }
        var _this = _super.call(this) || this;
        _this.str = str;
        //=========> tyq 修改
        var bg;
        if (type == "max") {
            bg = _this.addMsgBg(Main.stageWidth * .8, Main.stageHeight * .7, "b_p_hitBg");
        }
        else {
            bg = _this.addMsgBg(Main.stageWidth * .6, Main.stageHeight * .6, "b_p_hitBg");
        }
        //tyq 修改<===========
        _this.addTitle("hint_title", _this.centerSp.width / 2, 35);
        var x = bg.width - 27;
        var y = 7;
        if (_isAddCloseBtn)
            _this.addCloseBtn(x, y, "b_p_closeBtn");
        _this.addText(bg.width, bg.height);
        if (backFunc) {
            _this.backFunc = backFunc;
            _this.addCurrentBtn(bg.width, bg.height);
        }
        _this.openAni();
        return _this;
    }
    AH_Hint_View.prototype.addText = function (w, h) {
        var tt = new egret.TextField();
        tt.textColor = 0xffffff;
        tt.textAlign = "center";
        tt.lineSpacing = 10;
        tt.width = w * .75;
        tt.height = h * .8;
        tt.multiline = true;
        tt.verticalAlign = "middle";
        tt.fontFamily = "微软雅黑";
        tt.size = 30;
        tt.text = this.str;
        tt.x = w * .1;
        tt.y = h * .05;
        this.centerSp.addChild(tt);
    };
    AH_Hint_View.prototype.addCurrentBtn = function (w, h) {
        this.confirmBtn = new MyButton("h_sureBtn");
        this.confirmBtn.x = w / 2;
        this.confirmBtn.y = h * 0.8;
        this.centerSp.addChild(this.confirmBtn);
        this.confirmBtn.addTouchEvent();
        this.confirmBtn.addEventListener("click", this.confirmBtnClick, this);
    };
    AH_Hint_View.prototype.confirmBtnClick = function () {
        this.dispatchEvent(new egret.Event("close"));
        if (this.backFunc)
            this.backFunc();
    };
    AH_Hint_View.prototype.clear = function () {
        _super.prototype.clear.call(this);
        if (this.confirmBtn) {
            this.confirmBtn.clear();
            this.confirmBtn.removeEventListener("click", this.confirmBtnClick, this);
        }
    };
    return AH_Hint_View;
}(PopupBaseView));
__reflect(AH_Hint_View.prototype, "AH_Hint_View");
