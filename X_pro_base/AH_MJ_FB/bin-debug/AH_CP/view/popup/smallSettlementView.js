var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by TYQ on 2017/7/8.
 */
var SmallSettlementView = (function (_super) {
    __extends(SmallSettlementView, _super);
    function SmallSettlementView(data, isHuang, currentUserWin, currentId) {
        if (data === void 0) { data = null; }
        return _super.call(this, data, isHuang, currentUserWin, currentId) || this;
    }
    return SmallSettlementView;
}(AH_SmallSettlementView));
__reflect(SmallSettlementView.prototype, "SmallSettlementView");
