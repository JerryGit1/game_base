var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by 韩 on 2017/7/14.
 * 用户个人信息弹框
 */
var H_userInfoPopupView = (function (_super) {
    __extends(H_userInfoPopupView, _super);
    function H_userInfoPopupView(model) {
        return _super.call(this, model) || this;
    }
    return H_userInfoPopupView;
}(AH_H_userInfoPopupView));
__reflect(H_userInfoPopupView.prototype, "H_userInfoPopupView");
