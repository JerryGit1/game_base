var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by 韩 on 2017/7/26.
 * 用户协议弹框
 */
var AH_H_userAgreementView = (function (_super) {
    __extends(AH_H_userAgreementView, _super);
    function AH_H_userAgreementView() {
        var _this = _super.call(this) || this;
        //弹框背景相对于舞台的缩放比例
        _this.Scale = .8;
        var H = Main.stageHeight * _this.Scale;
        var bg = _this.addMsgBg(null, H); //"b_p_bg",
        var x = bg.width - 70;
        var y = 90 * _this.Scale;
        _this.addStrTitle("用户协议");
        _this.openAni();
        var content = new egret.DisplayObjectContainer();
        var contentText = new egret.TextField();
        contentText.width = bg.width * .85;
        contentText.wordWrap = true;
        contentText.lineSpacing = 15;
        contentText.size = 20;
        // contentText.stroke = 0.5;
        contentText.textColor = 0xffffff;
        // contentText.strokeColor = 0x000000;
        contentText.fontFamily = "微软雅黑";
        contentText.text = RES.getRes("userAgreement_txt");
        content.addChild(contentText);
        var myscrollView = new egret.ScrollView();
        myscrollView.horizontalScrollPolicy = "off";
        myscrollView.setContent(content);
        myscrollView.width = bg.width * .9;
        myscrollView.height = bg.height * .6;
        myscrollView.y = 100;
        myscrollView.x = 50;
        _this.centerSp.addChild(myscrollView);
        // // 拒绝按钮
        // this.refuseBtn = new MyButton("refuseBtn");
        // this.refuseBtn.x = bg.width/2 - this.refuseBtn.width/2;
        // this.refuseBtn.y = (bg.height - this.refuseBtn.height) - 20;
        // this.refuseBtn.addTouchEvent();
        // this.refuseBtn.addEventListener("click",function () {
        //     //关闭弹窗
        //     this.closeClick();
        // },this);
        // this.centerSp.addChild(this.refuseBtn);
        // 同意按钮
        _this.agreeBtn = new MyButton("agreeBtn");
        _this.agreeBtn.x = bg.width / 2;
        _this.agreeBtn.y = (bg.height - _this.agreeBtn.height) - 20;
        _this.agreeBtn.addTouchEvent();
        _this.agreeBtn.addEventListener("click", function () {
            BaseModel.getInstance().eventRadio("consentUA");
            this.closeClick();
        }, _this);
        _this.centerSp.addChild(_this.agreeBtn);
        return _this;
    }
    return AH_H_userAgreementView;
}(PopupBaseView));
__reflect(AH_H_userAgreementView.prototype, "AH_H_userAgreementView");
