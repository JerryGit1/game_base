var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * 创建者 伟大的周鹏斌大王 on 2017/6/17.
 */
var BaseModel = (function (_super) {
    __extends(BaseModel, _super);
    function BaseModel(_addSocket) {
        if (_addSocket === void 0) { _addSocket = true; }
        return _super.call(this, _addSocket) || this;
    }
    BaseModel.getInstance = function () {
        if (!this.model) {
            this.model = new BaseModel();
        }
        return this.model;
    };
    /*初始化设置静态变量*/
    BaseModel.init = function () {
    };
    return BaseModel;
}(AH_BaseModel));
__reflect(BaseModel.prototype, "BaseModel");
