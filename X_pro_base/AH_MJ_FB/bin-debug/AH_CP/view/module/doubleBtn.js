var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by TYQ on 2017/7/29.
 */
var DoubleBtn = (function (_super) {
    __extends(DoubleBtn, _super);
    function DoubleBtn(bgstr, str) {
        return _super.call(this, bgstr, str) || this;
    }
    return DoubleBtn;
}(AH_DoubleBtn));
__reflect(DoubleBtn.prototype, "DoubleBtn");
