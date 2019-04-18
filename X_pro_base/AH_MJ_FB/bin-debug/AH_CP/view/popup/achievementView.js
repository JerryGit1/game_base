var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by 韩 on 2017/7/10.
 * 战绩弹框
 */
var H_achievementView = (function (_super) {
    __extends(H_achievementView, _super);
    function H_achievementView(data) {
        return _super.call(this, data) || this;
    }
    return H_achievementView;
}(AH_H_achievementView));
__reflect(H_achievementView.prototype, "H_achievementView");
