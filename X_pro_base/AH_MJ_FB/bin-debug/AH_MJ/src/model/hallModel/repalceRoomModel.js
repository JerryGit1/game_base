var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by Tang on 2017/8/24.
 */
var AH_H_replaceRoomModel = (function (_super) {
    __extends(AH_H_replaceRoomModel, _super);
    function AH_H_replaceRoomModel() {
        var _this = _super.call(this) || this;
        _this._playerInfo = [];
        _this.curStr = "";
        return _this;
    }
    Object.defineProperty(AH_H_replaceRoomModel.prototype, "createTime", {
        get: function () {
            return this._createTime;
        },
        set: function (value) {
            this._createTime = Number(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AH_H_replaceRoomModel.prototype, "playerInfo", {
        get: function () {
            return this._playerInfo;
        },
        set: function (value) {
            var currValue = JSON.stringify(value);
            if (this.curStr != currValue) {
                this.curStr = currValue;
                for (var i in value) {
                    var model = new UserBaseModel();
                    model.setParams(value[i]);
                    this._playerInfo.push(model);
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    return AH_H_replaceRoomModel;
}(AH_BaseModel));
__reflect(AH_H_replaceRoomModel.prototype, "AH_H_replaceRoomModel");
