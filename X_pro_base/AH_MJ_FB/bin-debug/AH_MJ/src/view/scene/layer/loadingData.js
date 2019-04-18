var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by 伟大的周鹏斌大王 on 2017/7/6.
 * 数据加载
 */
var AH_LoadingDataView = (function (_super) {
    __extends(AH_LoadingDataView, _super);
    function AH_LoadingDataView(str) {
        var _this = _super.call(this) || this;
        //遮罩
        _this.loadingBg = new egret.Sprite();
        _this.loadingBg.width = Main.stageWidth;
        _this.loadingBg.height = Main.stageHeight;
        _this.loadingBg.graphics.beginFill(0x000000, .2);
        _this.loadingBg.graphics.drawRect(0, 0, Main.stageWidth, Main.stageHeight);
        _this.loadingBg.graphics.endFill();
        // 旋转的图片
        _this.loadingPic = new egret.Bitmap(RES.getRes("h_loading"));
        _this.loadingPic.x = Main.stageWidth / 2;
        _this.loadingPic.y = Main.stageHeight / 2;
        _this.loadingPic.anchorOffsetX = _this.loadingPic.$getWidth() / 2;
        _this.loadingPic.anchorOffsetY = _this.loadingPic.$getHeight() / 2;
        // 提示的文字
        _this.loadingTxt = new egret.TextField();
        _this.loadingTxt.text = str;
        _this.loadingTxt.x = Main.stageWidth / 2 - _this.loadingTxt.$getWidth() / 3;
        _this.loadingTxt.y = _this.loadingPic.y + _this.loadingPic.height / 2 + 20;
        _this.loadingTxt.fontFamily = "微软雅黑";
        _this.loadingTxt.size = 18;
        _this.loadingBg.addChild(_this.loadingTxt);
        _this.loadingBg.addChild(_this.loadingPic);
        _this.addChild(_this.loadingBg);
        egret.Tween.get(_this.loadingPic, { loop: true }).to({ rotation: 360 }, 2000);
        _this.touchEnabled = true;
        return _this;
    }
    AH_LoadingDataView.prototype.clear = function () {
        egret.Tween.removeTweens(this.loadingPic);
    };
    return AH_LoadingDataView;
}(BaseView));
__reflect(AH_LoadingDataView.prototype, "AH_LoadingDataView");
