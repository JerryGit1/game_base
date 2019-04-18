var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by 韩 on 2017/7/13.
 * 单选样式
 * selected选中的图标√
 * x,y,w,h 坐标x,y宽高
 */
var H_selectBtn = (function (_super) {
    __extends(H_selectBtn, _super);
    function H_selectBtn(make, selected, x, y, w, h, lable) {
        return _super.call(this, make, selected, x, y, w, h, lable) || this;
    }
    return H_selectBtn;
}(AH_H_selectBtn));
__reflect(H_selectBtn.prototype, "H_selectBtn");
