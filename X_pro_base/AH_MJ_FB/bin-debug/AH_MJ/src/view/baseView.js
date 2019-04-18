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
 *
 * 基础视图类 包括 scene view popup
 */
var BaseView = (function (_super) {
    __extends(BaseView, _super);
    function BaseView() {
        return _super.call(this) || this;
    }
    /*调整y坐标适配*/
    BaseView.prototype.setPointY = function (sp) {
        sp.y = sp.y / (Main.stageHeight / 640);
    };
    /*创建一个居中的bit对象*/
    BaseView.prototype.CCenterBit = function (str, _isCenter) {
        if (_isCenter === void 0) { _isCenter = true; }
        var bit = new egret.Bitmap(RES.getRes(str));
        if (_isCenter) {
            bit.anchorOffsetX = bit.width / 2;
            bit.anchorOffsetY = bit.height / 2;
        }
        return bit;
    };
    /*清理*/
    BaseView.prototype.clear = function () {
    };
    return BaseView;
}(egret.Sprite));
__reflect(BaseView.prototype, "BaseView");
