var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * 创建者 伟大的周鹏斌大王 on 2017/6/19.
 */
var WebSocketService = (function (_super) {
    __extends(WebSocketService, _super);
    function WebSocketService() {
        var _this = _super.call(this) || this;
        egret["AH_testPort"] = _this.testPort.bind(_this);
        if (WebSocketService.connection) {
            alert("该类不允许创建第二次");
        }
        return _this;
    }
    WebSocketService.getInstance = function () {
        if (!this.connection) {
            this.connection = new WebSocketService();
        }
        return this.connection;
    };
    return WebSocketService;
}(AH_WebSocketService));
__reflect(WebSocketService.prototype, "WebSocketService");
