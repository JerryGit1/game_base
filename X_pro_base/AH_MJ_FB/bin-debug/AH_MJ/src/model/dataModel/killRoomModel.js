var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by 伟大的周鹏斌大王 on 2017/7/27.
 *
 * 解散房间信息
 */
var AH_Game_killRoomModel = (function (_super) {
    __extends(AH_Game_killRoomModel, _super);
    function AH_Game_killRoomModel() {
        var _this = _super.call(this) || this;
        _this._isInitiator = false; /*是否是发起人*/
        _this._isHandle = false; /*是否有过操作了*/
        _this.agree = 0; /*解散房间整体状况 0 还没定 1解散成功 2解散失败*/
        return _this;
    }
    Object.defineProperty(AH_Game_killRoomModel.prototype, "othersAgree", {
        get: function () {
            return this._othersAgree;
        },
        set: function (value) {
            this._othersAgree = value;
            this.agree = 1;
            for (var i in this._othersAgree) {
                if (Number(this._othersAgree[i]["agree"]) == 0) {
                    this.agree = 0;
                }
                else if (Number(this._othersAgree[i]["agree"]) == 2) {
                    this.agree = 2;
                    break;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    return AH_Game_killRoomModel;
}(AH_BaseModel));
__reflect(AH_Game_killRoomModel.prototype, "AH_Game_killRoomModel");
