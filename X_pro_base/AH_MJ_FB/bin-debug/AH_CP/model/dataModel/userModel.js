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
 * 用户牌信息
 */
var UserModel = (function (_super) {
    __extends(UserModel, _super);
    function UserModel() {
        return _super.call(this) || this;
    }
    return UserModel;
}(AH_UserModel));
__reflect(UserModel.prototype, "UserModel");
