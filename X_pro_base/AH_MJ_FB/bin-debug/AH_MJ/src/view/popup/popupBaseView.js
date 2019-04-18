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
 * 弹框类 基础类
 */
var PopupBaseView = (function (_super) {
    __extends(PopupBaseView, _super);
    function PopupBaseView(isEmptyClose, showBackMask) {
        if (isEmptyClose === void 0) { isEmptyClose = true; }
        if (showBackMask === void 0) { showBackMask = true; }
        var _this = _super.call(this) || this;
        _this.centerWidth = 0; //2.0.3 zpb
        _this.centerHeight = 0;
        if (showBackMask)
            _this.addBackMask(isEmptyClose);
        _this.centerSp = new egret.Sprite();
        _this.centerSp.touchEnabled = true;
        _this.addChild(_this.centerSp);
        return _this;
    }
    /*----------------------基础视图-------------------------*/
    /*显示遮罩*/
    PopupBaseView.prototype.addBackMask = function (isEmptyClose) {
        //遮罩
        this.maskShape = new egret.Shape();
        this.maskShape.graphics.beginFill(0x000000, .8);
        this.maskShape.graphics.drawRect(0, 0, Main.stageWidth, Main.stageHeight);
        this.maskShape.graphics.endFill();
        this.maskShape.touchEnabled = true;
        this.addChild(this.maskShape);
        if (isEmptyClose) {
            this.maskShape.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeClick, this);
        }
    };
    /**
     * 添加背景
     * 1.結算弹框背景
     * */
    PopupBaseView.prototype.addSettleBg = function (w, h, str) {
        if (str === void 0) { str = "g_settle_winBg"; }
        var bg = new egret.Bitmap(RES.getRes(str));
        bg.width = w || bg.width;
        bg.height = h || bg.height;
        bg.scale9Grid = new egret.Rectangle(142, 90, 852, 540);
        this.centerSp.addChild(bg);
        this.setCenterPoint(bg.width, bg.height);
        this.centerHeight = bg.height;
        this.centerWidth = bg.width;
        return bg;
    };
    /**
     * 添加通用背景
     * */
    PopupBaseView.prototype.addMsgBg = function (w, h, str) {
        if (str === void 0) { str = "b_p_bg"; }
        var bg = new egret.Bitmap(RES.getRes(str));
        bg.width = w || bg.width;
        bg.height = h || bg.height;
        if (str == "b_p_bg")
            bg.scale9Grid = new egret.Rectangle(106, 58, 636, 352);
        if (str == "b_p_hitBg")
            bg.scale9Grid = new egret.Rectangle(24, 60, 646, 279);
        this.centerSp.addChild(bg);
        this.setCenterPoint(bg.width, bg.height);
        this.centerHeight = bg.height;
        this.centerWidth = bg.width;
        return bg;
    };
    /*显示标题*/
    PopupBaseView.prototype.addTitle = function (str, x, y) {
        if (x === void 0) { x = null; }
        if (y === void 0) { y = null; }
        var title = new egret.Bitmap(RES.getRes(str));
        title.anchorOffsetX = title.width / 2;
        title.anchorOffsetY = title.height / 2;
        if (!y)
            y = -this.centerSp.height * .48 + this.centerSp.height / 2;
        title.y = y;
        if (!x)
            x = this.centerSp.width / 2;
        title.x = x;
        this.centerSp.addChild(title);
        return title;
    };
    // 文字类显示的标题
    PopupBaseView.prototype.addStrTitle = function (str, x, y) {
        if (x === void 0) { x = null; }
        if (y === void 0) { y = null; }
        var title = new egret.TextField();
        title.text = str;
        title.size = 30;
        title.fontFamily = "微软雅黑";
        title.stroke = 1;
        title.strokeColor = 0xAB4B05;
        title.anchorOffsetX = title.width / 2;
        title.anchorOffsetY = title.height / 2;
        if (!y)
            y = title.height * 2;
        title.y = y;
        if (!x)
            x = this.centerSp.width / 2;
        title.x = x;
        this.centerSp.addChild(title);
        return title;
    };
    // 带有卷轴的弹框
    PopupBaseView.prototype.addPopupText = function (str, w, h) {
        var tt = new egret.TextField();
        tt.textColor = 0xffffff;
        tt.lineSpacing = 10;
        tt.width = w * .6;
        tt.height = h * .6;
        tt.fontFamily = "微软雅黑";
        tt.size = 23;
        tt.text = str;
        tt.x = w * .1;
        tt.y = h * .15;
        this.centerSp.addChild(tt);
    };
    /*设置中心区域中心*/
    PopupBaseView.prototype.setCenterPoint = function (w, h) {
        this.centerSp.anchorOffsetX = w / 2;
        this.centerSp.anchorOffsetY = h / 2;
        this.centerSp.x = Main.stageWidth / 2;
        this.centerSp.y = Main.stageHeight / 2;
    };
    /*显示关闭按钮*/
    PopupBaseView.prototype.addCloseBtn = function (x, y, textureName) {
        if (textureName === void 0) { textureName = "b_p_closeBtn"; }
        this.closeBtn = new MyButton(textureName);
        this.centerSp.addChild(this.closeBtn);
        this.closeBtn.addTouchEvent();
        this.closeBtn.addEventListener("click", this.closeClick, this);
        this.closeBtn.x = x;
        this.closeBtn.y = y;
    };
    /*---------------动画-----------------*/
    PopupBaseView.prototype.openAni = function () {
        this.centerSp.scaleX = this.centerSp.scaleY = .8;
        this.centerSp.alpha = 0;
        egret.Tween.get(this.centerSp).to({ scaleX: 1.1, scaleY: 1.1, alpha: 1 }, 200).to({ scaleX: .95, scaleY: .95 }, 100).to({ scaleX: 1, scaleY: 1 }, 100);
    };
    /*---------------事件--------------------*/
    /*关闭按钮事件*/
    PopupBaseView.prototype.closeClick = function () {
        this.dispatchEvent(new egret.Event("close"));
    };
    PopupBaseView.prototype.clear = function () {
        if (this.closeBtn) {
            this.closeBtn.clear();
            this.closeBtn.removeEventListener("click", this.closeClick, this);
        }
    };
    return PopupBaseView;
}(BaseView));
__reflect(PopupBaseView.prototype, "PopupBaseView");
