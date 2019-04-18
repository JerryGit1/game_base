var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by 伟大的周鹏斌大王 on 2017/8/10.
 */
var AH_statisticService = (function (_super) {
    __extends(AH_statisticService, _super);
    function AH_statisticService() {
        var _this = _super.call(this) || this;
        //private host="http://www.aoh5.com/";
        //private host="http://192.168.1.21:8080/";
        _this.url = "gmserver/open/us.statistic.index.html";
        _this.p_name = Main.pro_name;
        /*统计*/
        /*登录统计*/
        _this._isAddLogin = false;
        _this.url = AH_baseService.host + "gmserver/open/us.statistic.index.html";
        return _this;
    }
    AH_statisticService.getInstance = function () {
        if (!this.service) {
            this.service = new AH_statisticService();
        }
        return this.service;
    };
    AH_statisticService.prototype.login = function (u_id) {
        if (this._isAddLogin)
            return;
        this._isAddLogin = true;
        this.http({
            p_name: this.p_name,
            o_name: "u_login",
            u_id: u_id
        });
    };
    /*分享统计*/
    AH_statisticService.prototype.share = function (u_id) {
        this.http({
            p_name: this.p_name,
            o_name: "u_share",
            u_id: u_id
        });
    };
    /*创建房间统计*/
    AH_statisticService.prototype.createRoom = function (u_id) {
        this.http({
            p_name: this.p_name,
            o_name: "u_cRoom",
            u_id: u_id
        });
    };
    /*消费房卡统计*/
    AH_statisticService.prototype.consume = function (u_id, s_count) {
        this.http({
            p_name: this.p_name,
            o_name: "u_consume",
            u_id: u_id,
            s_count: s_count
        });
    };
    /*大接口次数统计*/
    AH_statisticService.prototype.mainPortNum = function (u_id) {
        this.http({
            p_name: this.p_name,
            o_name: "port_main",
            u_id: u_id
        });
    };
    /*动作id异常跟踪*/
    AH_statisticService.prototype.wswIDError = function (u_id) {
        if (u_id === void 0) { u_id = "123"; }
        this.http({
            p_name: this.p_name,
            o_name: "log_wswiderror",
            u_id: u_id
        });
        //数据不同步了 刷新大接口
        MyConsole.getInstance().trace("数据不同步了 刷新大接口:", "custom3");
    };
    /*---------------------------http*-------------------------------------*/
    AH_statisticService.prototype.http = function (data) {
        if (this.getVersionType() == "demo")
            return;
        var urlLoader = new egret.URLLoader(), urlreq, urlVari, data;
        urlreq = new egret.URLRequest();
        urlreq.url = this.url; //地址
        urlreq.method = egret.URLRequestMethod.POST;
        urlVari = new egret.URLVariables();
        urlVari.variables = data;
        urlreq.data = urlVari; //数据
        //成功获取数据
        function onComplete() {
            urlLoader.removeEventListener(egret.Event.COMPLETE, onComplete, this);
            urlLoader.removeEventListener(egret.IOErrorEvent.IO_ERROR, onLoadError, this);
        }
        //获取数据失败
        function onLoadError(e) {
            urlLoader.removeEventListener(egret.Event.COMPLETE, onComplete, this);
            urlLoader.removeEventListener(egret.IOErrorEvent.IO_ERROR, onLoadError, this);
        }
        urlLoader.addEventListener(egret.Event.COMPLETE, onComplete, this);
        urlLoader.addEventListener(egret.IOErrorEvent.IO_ERROR, onLoadError, this);
        urlLoader.load(urlreq);
    };
    return AH_statisticService;
}(AH_baseService));
__reflect(AH_statisticService.prototype, "AH_statisticService");
