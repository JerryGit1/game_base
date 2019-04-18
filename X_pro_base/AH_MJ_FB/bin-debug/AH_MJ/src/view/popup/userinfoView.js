var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by 韩 on 2017/7/14.
 * 用户个人信息弹框
 */
var AH_H_userInfoPopupView = (function (_super) {
    __extends(AH_H_userInfoPopupView, _super);
    function AH_H_userInfoPopupView(model) {
        var _this = _super.call(this) || this;
        _this.model = model;
        var bg = _this.addMsgBg(Main.stageWidth * .7, Main.stageHeight * .6); //"b_p_hitBg",
        // var x = bg.width-27;
        // var y = 7;
        var x = bg.width - 7;
        var y = 5;
        _this.addCloseBtn(x, y, "b_p_closeBtn");
        _this.addTitle("h_userInfo", _this.centerSp.width / 2, 35);
        _this.openAni();
        _this.userHeader = new Game_headCirceView();
        _this.userHeader.setHead(_this.model.openImg);
        _this.userHeader.scaleX = 2;
        _this.userHeader.scaleY = 2;
        _this.userHeader.x = _this.userHeader.width * 2;
        _this.userHeader.y = bg.height / 2;
        // 昵称 ID IP 背景
        var userInfoBg;
        for (var i = 0; i < 5; i++) {
            userInfoBg = new egret.Bitmap(RES.getRes("h_userInfoBg"));
            userInfoBg.x = bg.width / 2 + 60;
            userInfoBg.y = 100 + i * 60;
            _this.centerSp.addChild(userInfoBg);
            var str;
            _this.userTextTitle = new egret.TextField();
            _this.userTextTitle.textAlign = "center";
            _this.userTextTitle.stroke = 2;
            _this.userTextTitle.strokeColor = 0x000000;
            _this.userTextTitle.fontFamily = "微软雅黑";
            _this.userTextTitle.size = 30;
            _this.userTextTitle.y = 101 + i * 60;
            _this.userText = new egret.TextField();
            _this.userText.textAlign = "center";
            _this.userText.fontFamily = "微软雅黑";
            _this.userText.textColor = 0xdbb683;
            _this.userText.size = 20;
            _this.userText.y = 107 + i * 60;
            if (i == 0) {
                str = _this.model.openName;
                _this.userTextTitle.text = "昵称：";
            }
            else if (i == 1) {
                str = _this.model.userId;
                _this.userTextTitle.text = "ID：";
            }
            else if (i == 2) {
                str = _this.model.gender == 1 ? "男" : "女";
                _this.userTextTitle.text = "性別：";
            }
            else if (i == 3) {
                str = _this.model.ip;
                _this.userTextTitle.text = "IP：";
            }
            else if (i == 4) {
                str = _this.model.money;
                _this.userTextTitle.text = "房卡：";
            }
            _this.userText.text = str;
            _this.userTextTitle.x = bg.width / 2 - _this.userTextTitle.width + 50;
            _this.userText.x = bg.width / 2 + 100;
            _this.centerSp.addChild(_this.userTextTitle);
            _this.centerSp.addChild(_this.userText);
        }
        _this.centerSp.addChild(_this.userHeader);
        return _this;
    }
    return AH_H_userInfoPopupView;
}(PopupBaseView));
__reflect(AH_H_userInfoPopupView.prototype, "AH_H_userInfoPopupView");
