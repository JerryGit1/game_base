var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by Duo Nuo on 2016/9/7.
 */
var AH_HttpService = (function (_super) {
    __extends(AH_HttpService, _super);
    function AH_HttpService() {
        return _super.call(this) || this;
    }
    AH_HttpService.getInstance = function () {
        if (!this.service) {
            this.service = new AH_HttpService();
        }
        return this.service;
    };
    return AH_HttpService;
}(AH_baseService));
__reflect(AH_HttpService.prototype, "AH_HttpService");
