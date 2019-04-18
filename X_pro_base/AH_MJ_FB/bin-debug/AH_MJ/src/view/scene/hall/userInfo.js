var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by 韩 on 2017/7/7.
 * 用户信息
 * 1.用户头像
 * 2.用户昵称
 * 3.元宝
 * 4.充值按钮
 */
var AH_H_userInfoView = (function (_super) {
    __extends(AH_H_userInfoView, _super);
    function AH_H_userInfoView(model) {
        var _this = _super.call(this) || this;
        _this.model = model;
        _this.model.addEventListener("updateMoney", _this.updateMoney, _this);
        _this.init();
        return _this;
    }
    AH_H_userInfoView.prototype.init = function () {
        this.userHead = new Game_headCirceView();
        this.userHead.setHead(this.model.openImg);
        this.userHead.touchEnabled = true;
        this.userHead.addEventListener("touchTap", function () {
            PopupLayer.getInstance().userinfo(this.model);
        }, this);
        this.addChild(this.userHead);
        this.userNikeName(this.model.openName);
        this.setUserId(this.model.userId);
        this.userSum();
        this.addBtn();
        this.updateMoney();
    };
    // 用户昵称
    AH_H_userInfoView.prototype.userNikeName = function (str) {
        this.nikeName = new egret.TextField();
        this.nikeName.x = 56;
        this.nikeName.y = -32;
        this.nikeName.textColor = 0xdbb683;
        this.nikeName.textAlign = "center";
        this.nikeName.border = false;
        this.nikeName.size = 28;
        if (str.length > 5)
            str = str.substr(0, 5) + "..";
        this.nikeName.text = str;
        this.addChild(this.nikeName);
    };
    AH_H_userInfoView.prototype.setUserId = function (str) {
        this.userId = new egret.TextField();
        this.userId.x = 56;
        this.userId.y = 12;
        this.userId.textAlign = "center";
        this.userId.border = false;
        this.userId.size = 25;
        this.userId.text = "ID:" + str;
        this.addChild(this.userId);
    };
    // 用户金额
    AH_H_userInfoView.prototype.userSum = function () {
        this.yuanBaoBg = new egret.Bitmap(RES.getRes("h_yuanbaoBar"));
        this.yuanBaoBg.x = Main.stageWidth - this.yuanBaoBg.width - 70;
        this.yuanBaoBg.y = -36;
        this.addChild(this.yuanBaoBg);
        this.yuanBao = new egret.TextField();
        this.yuanBao.size = 26;
        this.yuanBao.width = 100;
        this.yuanBao.textColor = 0xdbb683;
        this.yuanBao.x = Main.stageWidth - this.yuanBao.width * 2 - 30;
        this.yuanBao.y = -18;
        this.yuanBao.textAlign = "center";
        this.addChild(this.yuanBao);
    };
    // 加号按钮
    AH_H_userInfoView.prototype.addBtn = function () {
        this.btnAdd = new MyButton("h_plusBtn");
        this.btnAdd.x = Main.stageWidth - this.btnAdd.width - 55;
        this.btnAdd.y = -6;
        this.btnAdd.addTouchEvent();
        this.btnAdd.addEventListener("click", this.addHitView, this);
        this.addChild(this.btnAdd);
    };
    // 更新用户信息视图层
    AH_H_userInfoView.prototype.updateMoney = function () {
        if (Number(this.model.money) >= 10000) {
            this.yuanBao.text = Number(this.model.money) / 10000 + " 万张";
        }
        else {
            this.yuanBao.text = this.model.money + " 张";
        }
    };
    /*事件*/
    //点击加号事件
    AH_H_userInfoView.prototype.addHitView = function (e) {
        PopupLayer.getInstance().addHintView("代理咨询请联系群主：微信dfmjkf01，客服微信dfmjkf007", null, true, "min");
    };
    //清除事件
    AH_H_userInfoView.prototype.clear = function () {
        _super.prototype.clear.call(this);
        this.model.removeEventListener("updateMoney", this.updateMoney, this);
    };
    return AH_H_userInfoView;
}(BaseView));
__reflect(AH_H_userInfoView.prototype, "AH_H_userInfoView");
