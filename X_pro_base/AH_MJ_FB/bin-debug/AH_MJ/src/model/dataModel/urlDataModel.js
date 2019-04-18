var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by 伟大的周鹏斌大王 on 2017/7/14.
 * url post参数信息
 */
var AH_UrlDataModel = (function (_super) {
    __extends(AH_UrlDataModel, _super);
    function AH_UrlDataModel() {
        var _this = _super.call(this) || this;
        _this._cId = 1; /*商品ID*/
        _this.shareJoining = 1; /*分享房间号 加入房间中  1还没加入 2加入中 3加入过了*/
        _this.setUrlParam();
        return _this;
    }
    Object.defineProperty(AH_UrlDataModel.prototype, "cId", {
        get: function () {
            return this._cId;
        },
        set: function (value) {
            this._cId = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AH_UrlDataModel.prototype, "gId", {
        get: function () {
            return this._gId;
        },
        set: function (value) {
            this._gId = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AH_UrlDataModel.prototype, "mId", {
        get: function () {
            return this._mId;
        },
        set: function (value) {
            this._mId = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AH_UrlDataModel.prototype, "openId", {
        get: function () {
            if (this._vId <= 2 && this.urlParam["openId"]) {
                return this.urlParam["openId"];
            }
            return this._openId;
        },
        set: function (value) {
            this._openId = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AH_UrlDataModel.prototype, "vId", {
        get: function () {
            return this._vId;
        },
        set: function (value) {
            if (value <= 2 && this.urlParam["vId"]) {
                this._vId = Number(this.urlParam["vId"]);
            }
            else {
                this._vId = Number(value);
            }
            this.webSocketModel.setGameUrl(this.vId, this.urlParam["service_id"]);
            WeiXinJSSDK.getInstance().model = this;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AH_UrlDataModel.prototype, "state", {
        get: function () {
            if (this._vId <= 2 && this.urlParam["state"]) {
                return Number(this.urlParam["state"]);
            }
            return Number(this._state);
        },
        set: function (value) {
            this._state = value;
        },
        enumerable: true,
        configurable: true
    });
    /*获取url参数配置*/
    AH_UrlDataModel.prototype.setUrlParam = function () {
        var aQuery = window.location.href.split("?"); //取得Get参数
        var urlDataInfo = new Array();
        if (aQuery.length > 1) {
            var aBuf = aQuery[1].split("&");
            for (var i = 0, iLoop = aBuf.length; i < iLoop; i++) {
                var aTmp = aBuf[i].split("=");
                urlDataInfo[aTmp[0]] = aTmp[1];
            }
        }
        this.urlParam = urlDataInfo;
    };
    return AH_UrlDataModel;
}(AH_BaseModel));
__reflect(AH_UrlDataModel.prototype, "AH_UrlDataModel");
