var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by 伟大的周鹏斌大王 on 2017/7/17.
 */
var AH_CardModel = (function (_super) {
    __extends(AH_CardModel, _super);
    function AH_CardModel() {
        var _this = _super.call(this) || this;
        _this._isSystemCard = false; /*是否是刚发的系统手牌*/
        _this._isHunPai = false;
        return _this;
    }
    return AH_CardModel;
}(AH_BaseModel));
__reflect(AH_CardModel.prototype, "AH_CardModel");
