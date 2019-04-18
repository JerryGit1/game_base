var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by 伟大的周鹏斌大王 on 2017/7/22.
 * 微信分享服务类
 * http://res.wx.qq.com/open/js/jweixin-1.2.0.js
 */
var WeiXinJSSDK = (function (_super) {
    __extends(WeiXinJSSDK, _super);
    function WeiXinJSSDK() {
        return _super.call(this) || this;
    }
    WeiXinJSSDK.getInstance = function () {
        if (!this.service) {
            this.service = new AH_WeiXinJSSDK();
        }
        return this.service;
    };
    /*----------------------分享接口-------------------------*/
    //游戏大厅分享
    WeiXinJSSDK.prototype.hallShare = function () {
        var data = {
            title: "【东丰麻将】",
            link: this.gameLink + "?cId=" + this.model.cId,
            imgUrl: AH_baseService.host + "game/X1/icon.png",
            desc: "东丰麻将，原汁原味本地打法。无需下载，分享好友，直接组局！"
        };
        this.weixinShare(data);
    };
    //游戏中分享
    WeiXinJSSDK.prototype.gameShare = function (roomId, totalNum, maxScore, homeName) {
        var data = {
            title: "东丰麻将  房间号：" + roomId,
            link: this.gameLink + "?cId=" + this.model.cId + "&state=" + roomId,
            imgUrl: AH_baseService.host + "game/X1/icon.png",
            desc: "房主:" + homeName + " \n玩法:" + totalNum + "圈，" + maxScore + "封顶，点炮包三家"
        };
        this.weixinShare(data);
    };
    // 大结算分享
    WeiXinJSSDK.prototype.settlementShare = function (roomId, userList) {
        var data = {
            title: "大赢家-" + getName(userList[0].userName, 6) + ":" + userList[0].score + "分",
            link: this.gameLink + "?cId=" + this.model.cId + "&state=" + roomId,
            imgUrl: AH_baseService.host + "game/X1/icon.png",
            desc: getName(userList[1].userName) + "：" + userList[1].score + "分" +
                "  \n" + getName(userList[2].userName) + "：" + userList[2].score + "分" +
                "  \n" + getName(userList[3].userName) + "：" + userList[3].score + "分"
        };
        function getName(name, len) {
            if (len === void 0) { len = 4; }
            if (name.length > len) {
                name = name.substr(0, len) + ".";
            }
            return name;
        }
        this.weixinShare(data);
    };
    return WeiXinJSSDK;
}(AH_WeiXinJSSDK));
__reflect(WeiXinJSSDK.prototype, "WeiXinJSSDK");
