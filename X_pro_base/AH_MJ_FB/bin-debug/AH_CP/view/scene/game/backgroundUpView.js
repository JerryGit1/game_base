var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by Tang on 2017/9/9.
 */
/**
 * 创建者 伟大的周鹏斌大王 on 2017/6/17.
 *
 * 背景场景
 */
var BackgroundUpView = (function (_super) {
    __extends(BackgroundUpView, _super);
    function BackgroundUpView(model) {
        return _super.call(this, model) || this;
    }
    return BackgroundUpView;
}(AH_BackgroundUpView));
__reflect(BackgroundUpView.prototype, "BackgroundUpView");
