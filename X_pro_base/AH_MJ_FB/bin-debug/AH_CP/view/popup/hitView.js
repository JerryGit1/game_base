var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by TYQ on 2017/7/7.
 * 小提示框
 * 修改：韩月辉 2017
 */
var Hint_View = (function (_super) {
    __extends(Hint_View, _super);
    function Hint_View(str, backFunc, _isAddCloseBtn, type) {
        if (backFunc === void 0) { backFunc = null; }
        if (_isAddCloseBtn === void 0) { _isAddCloseBtn = true; }
        if (type === void 0) { type = "min"; }
        return _super.call(this, str, backFunc, _isAddCloseBtn, type) || this;
    }
    return Hint_View;
}(AH_Hint_View));
__reflect(Hint_View.prototype, "Hint_View");
