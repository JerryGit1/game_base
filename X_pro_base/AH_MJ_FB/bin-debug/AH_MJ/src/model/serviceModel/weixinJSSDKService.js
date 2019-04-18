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
var AH_WeiXinJSSDK = (function (_super) {
    __extends(AH_WeiXinJSSDK, _super);
    function AH_WeiXinJSSDK() {
        var _this = _super.call(this) || this;
        _this.weixinJSDKUrl = ""; /*授权信息获取地址*/
        _this.SDKAuth = false; /*是否授权过了*/
        _this.gameLink = ""; /*游戏登录链接*/
        /*----------------------语音接口-------------------------*/
        /*开始录音*/
        _this.startRecording = -1;
        _this.weixin = window["wx"];
        if (!_this.weixin) {
            MyConsole.getInstance().trace("没有加载微信jssdk js文件", 0);
        }
        _this.weixinJSDKUrl = AH_baseService.host + "login/open/us.share.index.html";
        _this.gameLink = AH_baseService.host + "/login/open/us.login.index.html";
        return _this;
    }
    /*------关闭当前页面------*/
    AH_WeiXinJSSDK.prototype.closeWindow = function () {
        this.sdkAuthorization(function () {
            this.weixin.closeWindow();
        }.bind(this));
    };
    /*----------------------分享接口-------------------------*/
    //游戏大厅分享
    AH_WeiXinJSSDK.prototype.hallShare = function () {
        var data = {
            title: "【XX麻将】",
            link: this.gameLink + "?cId=" + this.model.cId,
            imgUrl: AH_baseService.host + "game/X1/icon.png",
            desc: "XX麻将，原汁原味本地打法。无需下载，分享好友，直接组局！"
        };
        this.weixinShare(data);
    };
    //游戏中分享
    AH_WeiXinJSSDK.prototype.gameShare = function (roomId, totalNum, maxScore, homeName) {
        var data = {
            title: "XX麻将  房间号：" + roomId,
            link: this.gameLink + "?cId=" + this.model.cId + "&state=" + roomId,
            imgUrl: AH_baseService.host + "game/X1/icon.png",
            desc: "房主:" + homeName + " \n玩法:" + totalNum + "圈，" + maxScore + "封顶，点炮包三家"
        };
        this.weixinShare(data);
    };
    // 大结算分享
    AH_WeiXinJSSDK.prototype.settlementShare = function (roomId, userList) {
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
    AH_WeiXinJSSDK.prototype.startRecord = function () {
        this.stopRecord(null);
        if (this.startRecording == -1) {
            SoundModel.setBackSoundVolume(0);
            this.startRecording = 1;
            this.sdkAuthorization(function () {
                this.weixin.startRecord();
            }.bind(this));
        }
    };
    /*停止录音*/
    AH_WeiXinJSSDK.prototype.stopRecord = function (backFun) {
        if (backFun === void 0) { backFun = null; }
        var self = this;
        if (this.startRecording == 1) {
            this.startRecording = 2;
            SoundModel.setBackSoundVolume(1);
            this.sdkAuthorization(function () {
                self.weixin.stopRecord({
                    success: function (res) {
                        self.startRecording = -1;
                        if (backFun) {
                            self.uploadVoice(res.localId, function (localId) {
                                //传递语音消息
                                BaseModel.getInstance().eventRadio("changeChatStatus", {
                                    "type": 4,
                                    "idx": localId,
                                    "local": true //本地语音直接播放不下载
                                });
                            });
                        }
                    }
                });
            }.bind(this));
        }
    };
    /*监听录音自动停止接口*/
    AH_WeiXinJSSDK.prototype.onVoiceRecordEnd = function (backFun) {
        this.sdkAuthorization(function () {
            this.weixin.onVoiceRecordEnd({
                complete: function (res) {
                    backFun(res.localId);
                }
            });
        }.bind(this));
    };
    /*播放语音接口*/
    AH_WeiXinJSSDK.prototype.playVoice = function (id, userId) {
        this.sdkAuthorization(function () {
            MyConsole.getInstance().trace("播放录音");
            SoundModel.setBackSoundVolume(0);
            BaseModel.getInstance().eventRadio("isVoicing", { Id: userId, _isVoicing: true });
            this.weixin.playVoice({
                localId: id // 需要播放的音频的本地ID，由stopRecord接口获得
            });
            this.weixin.onVoicePlayEnd({
                success: function (res) {
                    SoundModel.setBackSoundVolume(1);
                    BaseModel.getInstance().eventRadio("isVoicing", { Id: userId, _isVoicing: false });
                }
            });
        }.bind(this));
    };
    /*上传语音接口*/
    AH_WeiXinJSSDK.prototype.uploadVoice = function (id, backFun) {
        var self = this;
        this.sdkAuthorization(function () {
            self.startRecording = 101;
            this.weixin.uploadVoice({
                localId: id,
                isShowProgressTips: 0,
                success: function (res) {
                    self.startRecording = -1;
                    backFun(res.serverId); // 返回音频的服务器端ID
                }
            });
        }.bind(this));
    };
    /*下载语音接口*/
    AH_WeiXinJSSDK.prototype.downloadVoice = function (id, userId, backFun) {
        var self = this;
        this.sdkAuthorization(function () {
            self.startRecording = 100;
            this.weixin.downloadVoice({
                serverId: id,
                isShowProgressTips: 0,
                success: function (res) {
                    self.startRecording = -1;
                    backFun(res.localId, userId); // 返回音频的服务器端ID
                }
            });
        }.bind(this));
    };
    /*-----------------------基础接口------------------------*/
    //基础分析设置
    AH_WeiXinJSSDK.prototype.weixinShare = function (shareData, _shareOk) {
        if (_shareOk === void 0) { _shareOk = null; }
        var wx = this.weixin;
        this.sdkAuthorization(setWeiXinShare);
        /*设置分享*/
        function setWeiXinShare() {
            wx.onMenuShareTimeline({
                title: shareData["title"],
                link: shareData["link"],
                imgUrl: shareData["imgUrl"],
                success: function () {
                    // 用户确认分享后执行的回调函数
                    shareOk(1);
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
            wx.onMenuShareAppMessage({
                title: shareData["title"],
                desc: shareData["desc"],
                link: shareData["link"],
                imgUrl: shareData["imgUrl"],
                success: function () {
                    // 用户确认分享后执行的回调函数
                    shareOk(2);
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
            wx.onMenuShareQQ({
                title: shareData["title"],
                desc: shareData["desc"],
                link: shareData["link"],
                imgUrl: shareData["imgUrl"],
                success: function () {
                    // 用户确认分享后执行的回调函数
                    shareOk(3);
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
            wx.onMenuShareWeibo({
                title: shareData["title"],
                desc: shareData["desc"],
                link: shareData["link"],
                imgUrl: shareData["imgUrl"],
                success: function () {
                    // 用户确认分享后执行的回调函数
                    shareOk(4);
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
            /*隐藏按钮*/
            wx.hideMenuItems({
                menuList: ["menuItem:copyUrl", "menuItem:setFont", "menuItem:share:qq", "menuItem:share:weiboApp", "menuItem:share:facebook", "menuItem:share:QZone", "menuItem:editTag", "menuItem:readMode", "menuItem:openWithQQBrowser", "menuItem:openWithSafari", "menuItem:share:email"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
            });
        }
        /*分享成功*/
        function shareOk(num) {
            //统计信息
            AH_statisticService.getInstance().share(null);
            if (_shareOk)
                _shareOk(num);
        }
    };
    /*授权jsdk*/
    AH_WeiXinJSSDK.prototype.sdkAuthorization = function (authOKBackFun) {
        var configData, self = this, wx = this.weixin;
        if (self.SDKAuth) {
            authOKBackFun();
            return;
        }
        else if (!wx)
            return;
        function getJSSDKData(backFun) {
            self.http(self.weixinJSDKUrl, { gUrl: window.location.href, mId: self.model.mId }, function (data) {
                self.SDKAuth = true;
                configData = data;
                backFun();
            }, false);
        }
        getJSSDKData(function () {
            wx.config({
                debug: false,
                appId: configData.appId,
                timestamp: configData.timestamp,
                nonceStr: configData.nonceStr,
                signature: configData.signature,
                jsApiList: ["uploadImage", "chooseImage", "hideMenuItems", "onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo", "startRecord", "stopRecord", "playVoice", "uploadVoice", "downloadVoice"
                ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
            wx.ready(function () {
                self.SDKAuth = true;
                authOKBackFun();
            });
            wx.error(function (res) {
                // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
            });
        }.bind(this));
    };
    /**向 服务器 发送数据*/
    AH_WeiXinJSSDK.prototype.selectSendInfoTips = function (data) {
        /*微信数据*/
        MyConsole.getInstance().trace("微信相关接口返回数据");
        MyConsole.getInstance().trace(data, 100001); //打印日志
    };
    return AH_WeiXinJSSDK;
}(AH_baseService));
__reflect(AH_WeiXinJSSDK.prototype, "AH_WeiXinJSSDK");
