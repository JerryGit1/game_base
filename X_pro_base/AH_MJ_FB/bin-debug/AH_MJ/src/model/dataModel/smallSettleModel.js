var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by TYQ on 2017/7/22.
 */
var AH_SmallSettleModel = (function (_super) {
    __extends(AH_SmallSettleModel, _super);
    function AH_SmallSettleModel(dataModel) {
        var _this = _super.call(this) || this;
        /*-------------------用户信息-------------------*/
        _this.setParams(dataModel);
        /*------------------牌的信息------------------*/
        /*设置手牌*/
        _this.initStopBoard(dataModel);
        /*设置吃碰杠牌*/
        var arr = [];
        _this.setCpgBoard(1, dataModel.chiList, arr); //吃
        _this.setCpgBoard(2, dataModel.pengList, arr); //碰
        _this.setCpgXiaoBoard(3, dataModel.gangListType1, arr); //中发白 杠
        _this.setCpgXiaoBoard(4, dataModel.gangListType2, arr); //东南西北 杠
        _this.setCpgBoard(5, dataModel.gangListType3, arr); //明杠-（碰杠）
        _this.setCpgBoard(6, dataModel.gangListType4, arr); //明杠-（点杠）
        _this.setCpgBoard(7, dataModel.gangListType5, arr); //暗杠
        _this.setCPGOrder(arr); /*排序*/
        return _this;
    }
    /*设置手牌*/
    AH_SmallSettleModel.prototype.initStopBoard = function (dataModel) {
        this.setStopBoardNoOrder(dataModel.currentMjList);
    };
    return AH_SmallSettleModel;
}(UserModel));
__reflect(AH_SmallSettleModel.prototype, "AH_SmallSettleModel");
