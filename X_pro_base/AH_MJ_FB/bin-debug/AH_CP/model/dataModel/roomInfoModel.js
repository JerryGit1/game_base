var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by 伟大的周鹏斌大王 on 2017/7/19.
 */
var Game_RoomInfoModel = (function (_super) {
    __extends(Game_RoomInfoModel, _super);
    function Game_RoomInfoModel() {
        return _super.call(this) || this;
    }
    return Game_RoomInfoModel;
}(AH_Game_RoomInfoModel));
__reflect(Game_RoomInfoModel.prototype, "Game_RoomInfoModel");
