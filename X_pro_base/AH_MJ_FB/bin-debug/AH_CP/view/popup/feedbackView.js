var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by 韩 on 2017/7/11.
 * 反馈弹窗
 */
var H_feedbackView = (function (_super) {
    __extends(H_feedbackView, _super);
    function H_feedbackView() {
        return _super.call(this) || this;
    }
    return H_feedbackView;
}(AH_H_feedbackView));
__reflect(H_feedbackView.prototype, "H_feedbackView");
