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
 * 设置弹窗
 */
var H_serView = (function (_super) {
    __extends(H_serView, _super);
    function H_serView(type) {
        return _super.call(this, type) || this;
    }
    return H_serView;
}(AH_H_serView));
__reflect(H_serView.prototype, "H_serView");
