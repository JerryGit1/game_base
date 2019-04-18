var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by 韩 on 2017/7/7.
 * 大厅按钮组
 */
var H_btnGroupView = (function (_super) {
    __extends(H_btnGroupView, _super);
    function H_btnGroupView(model) {
        return _super.call(this, model) || this;
    }
    return H_btnGroupView;
}(AH_H_btnGroupView));
__reflect(H_btnGroupView.prototype, "H_btnGroupView");
