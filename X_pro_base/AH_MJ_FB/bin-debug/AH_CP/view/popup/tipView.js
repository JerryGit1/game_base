var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * 弹出提示框
 */
var H_tipView = (function (_super) {
    __extends(H_tipView, _super);
    function H_tipView(string, width) {
        return _super.call(this, string, width) || this;
    }
    return H_tipView;
}(AH_H_tipView));
__reflect(H_tipView.prototype, "H_tipView");
