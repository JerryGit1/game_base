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
 * 分享弹框
 */
var AH_ShareView = (function (_super) {
    __extends(AH_ShareView, _super);
    function AH_ShareView() {
        var _this = _super.call(this) || this;
        var bg = _this.addMsgBg(null, null, "b_shareInfo");
        bg.touchEnabled = true;
        bg.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.closeClick, _this);
        return _this;
    }
    return AH_ShareView;
}(PopupBaseView));
__reflect(AH_ShareView.prototype, "AH_ShareView");
