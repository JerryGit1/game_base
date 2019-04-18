var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by 韩 on 2017/7/10.
 * 消息弹框
 */
var AH_H_news = (function (_super) {
    __extends(AH_H_news, _super);
    function AH_H_news() {
        var _this = _super.call(this) || this;
        _this.myscrollView = new egret.ScrollView();
        _this.str1 = "";
        _this.bg = _this.addMsgBg(null, Main.stageHeight * .7);
        // 接收到系统消息
        BaseModel.getInstance().addRadioEvent(BaseModel.PORT_DATA_CONFIG.hall_managerList, _this.setManagerListInfo.bind(_this));
        // 接收到 联系我们消息
        BaseModel.getInstance().addRadioEvent(BaseModel.PORT_DATA_CONFIG.hall_contactUs, _this.setContactUsInfo.bind(_this));
        var bg = _this.addMsgBg(null, Main.stageHeight * .7); //"b_p_hitBg",
        // var x = bg.width-70;
        // var y = 6;
        var x = bg.width - 7;
        var y = 5;
        _this.addCloseBtn(x, y, "b_p_closeBtn");
        _this.addTitle("h_news_title");
        // 系统消息按钮
        _this.systemNewsBtn = new MyButton("h_systemNewsBtn");
        _this.systemNewsBtn.x = bg.width / 2 + _this.systemNewsBtn.width / 2;
        _this.systemNewsBtn.y = 4;
        _this.systemNewsBtn.addTouchEvent();
        _this.systemNewsBtn.addEventListener("click", function () {
            this.contactUsBtn.changTexture("h_ContactUsBtn");
            this.systemNewsBtn.changTexture("h_systemNewsBtn_selected");
            //广播获取系统消息
            BaseModel.getInstance().eventRadio("getNewsInfo");
        }, _this);
        _this.centerSp.addChild(_this.systemNewsBtn);
        //联系我们按钮
        _this.contactUsBtn = new MyButton("h_ContactUsBtn_select");
        _this.contactUsBtn.x = bg.width / 2 - _this.contactUsBtn.width / 2;
        _this.contactUsBtn.y = 4;
        _this.contactUsBtn.addTouchEvent();
        _this.contactUsBtn.addEventListener("click", function () {
            this.contactUsBtn.changTexture("h_ContactUsBtn_select");
            this.systemNewsBtn.changTexture("h_systemNewsBtn");
            //广播获取联系我们消息
            BaseModel.getInstance().eventRadio("getUsInfo");
        }, _this);
        _this.centerSp.addChild(_this.contactUsBtn);
        _this.openAni();
        _this.textSp = new egret.Sprite();
        _this.centerSp.addChild(_this.textSp);
        _this.myscrollView.setContent(_this.textSp);
        _this.myscrollView.width = bg.width - 140;
        _this.myscrollView.height = bg.height - 125;
        _this.myscrollView.horizontalScrollPolicy = "off";
        _this.myscrollView.x = 70;
        _this.myscrollView.y = 80;
        _this.centerSp.addChild(_this.myscrollView);
        //广播获取系统消息
        BaseModel.getInstance().eventRadio("getUsInfo");
        return _this;
    }
    /*接收到系统消息数据*/
    AH_H_news.prototype.setManagerListInfo = function (info) {
        //清空文本
        this.clearTxt();
        var data = info.infos;
        var y = 0;
        for (var i in data) {
            var txt = this.addTxt(data[i]);
            txt.y = y;
            y += txt.textHeight + 10;
        }
    };
    /*接收到联系我们数据*/
    AH_H_news.prototype.setContactUsInfo = function (info) {
        //清空文本
        this.clearTxt();
        this.addTxt(info.connectionInfo);
    };
    /*添加一条记录*/
    AH_H_news.prototype.addTxt = function (str) {
        var txt = new egret.TextField();
        txt.width = this.bg.width * .8;
        txt.text = str;
        txt.lineSpacing = 10;
        txt.size = 30;
        txt.textColor = 0xCB6F01;
        txt.wordWrap = true;
        txt.verticalAlign = "middle";
        // txt.strokeColor = 0x000000;
        txt.fontFamily = "微软雅黑";
        // txt.stroke = 2;
        this.textSp.addChild(txt);
        return txt;
    };
    /*清空文本*/
    AH_H_news.prototype.clearTxt = function () {
        var len = this.textSp.numChildren;
        for (var i = 0; i < len; i++) {
            this.textSp.removeChildAt(0);
        }
    };
    AH_H_news.prototype.clear = function () {
        //移除广播事件
        // 接收到系统消息
        BaseModel.getInstance().clearEvent(this.setManagerListInfo);
        // 接收到 联系我们消息
        BaseModel.getInstance().clearEvent(this.setContactUsInfo);
    };
    return AH_H_news;
}(PopupBaseView));
__reflect(AH_H_news.prototype, "AH_H_news");
