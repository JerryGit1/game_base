var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by 韩 on 2017/7/11.
 * 反馈弹窗
 */
var AH_H_feedbackView = (function (_super) {
    __extends(AH_H_feedbackView, _super);
    function AH_H_feedbackView() {
        var _this = _super.call(this) || this;
        var bg = _this.addMsgBg(null, Main.stageHeight * .7); //"b_p_hitBg"
        // var x = bg.width - 70;
        // var y = 6;
        var x = bg.width - 7;
        var y = 5;
        _this.addCloseBtn(x, y, "b_p_closeBtn");
        _this.addTitle("h_set_title");
        _this.addTitle("h_feedback_title");
        _this.textBoxBg = new egret.Bitmap(RES.getRes("h_textBoxBg"));
        _this.textBoxBg.x = bg.width / 2 - _this.textBoxBg.width / 2;
        _this.textBoxBg.y = 85;
        _this.centerSp.addChild(_this.textBoxBg);
        _this.telTileBg = new egret.Bitmap(RES.getRes("h_telTileBg"));
        _this.telTileBg.x = 62;
        _this.telTileBg.y = bg.height - _this.telTileBg.height * 4;
        _this.centerSp.addChild(_this.telTileBg);
        _this.text = new egret.TextField();
        _this.text.type = egret.TextFieldType.INPUT;
        _this.text.lineSpacing = 10;
        _this.text.multiline = true;
        _this.text.wordWrap = true;
        _this.text.width = bg.width * .8;
        _this.text.height = bg.height * .4;
        _this.text.scrollV = 1;
        _this.text.fontFamily = "微软雅黑";
        _this.text.textColor = 0xEDB321;
        _this.text.size = 20;
        _this.text.x = 100;
        _this.text.y = 99;
        _this.text.text = "请输入您的意见和建议......";
        _this.text.addEventListener(egret.FocusEvent.FOCUS_IN, function () {
            if (this.text.text == "请输入您的意见和建议......") {
                this.text.text = "";
            }
            else {
                this.text.text = this.text.text;
            }
        }, _this);
        _this.centerSp.addChild(_this.text);
        _this.telbg = new egret.Bitmap(RES.getRes("h_telbg"));
        // this.telbg.anchorOffsetX = this.telbg.width/2;
        // this.telbg.anchorOffsetY = this.telbg.height/2;
        _this.telbg.x = 215;
        _this.telbg.y = _this.telTileBg.y - _this.telTileBg.height / 2;
        _this.centerSp.addChild(_this.telbg);
        _this.telText = new egret.TextField();
        _this.telText.type = egret.TextFieldType.INPUT;
        _this.telText.verticalAlign = egret.VerticalAlign.MIDDLE;
        _this.telText.restrict = "0-9";
        _this.telText.x = 223;
        _this.telText.y = _this.telbg.y + 6;
        _this.telText.width = 280;
        _this.telText.height = 45;
        _this.telText.bold = true;
        _this.telText.fontFamily = "微软雅黑";
        _this.telText.textColor = 0xEDB321;
        _this.telText.size = 20;
        _this.telText.maxChars = 13;
        _this.telText.text = "请输入您的手机号码";
        _this.telText.addEventListener(egret.FocusEvent.FOCUS_IN, function () {
            if (this.telText.text == "请输入您的手机号码") {
                this.telText.text = "";
            }
        }, _this);
        _this.centerSp.addChild(_this.telText);
        _this.submit = new MyButton("h_submit");
        _this.submit.x = bg.width - _this.submit.width / 2 - 60;
        _this.submit.y = _this.telText.y + _this.submit.height / 4;
        _this.submit.addTouchEvent();
        _this.submit.addEventListener("click", function () {
            //关闭弹窗
            this.closeClick();
            var txt = this.text.text;
            var phoneNumber = this.telText.text;
            var data = { "content": txt, "tel": phoneNumber };
            if (txt.length > 50) {
                PopupLayer.getInstance().addHintView("字数不得超过50个", null, true, "min");
                return false;
            }
            else if (txt.length == 0 || txt == "请输入您的意见和建议......") {
                PopupLayer.getInstance().addHintView("请输入文字！！", null, true, "min");
                return false;
            }
            ;
            if (!phoneNumber.match(/^1[34578]\d{9}$/)) {
                PopupLayer.getInstance().addHintView("请填写正确的手机号码！！", null, true, "min");
                return false;
            }
            BaseModel.getInstance().eventRadio("getFeedback", data);
        }, _this);
        _this.centerSp.addChild(_this.submit);
        _this.openAni();
        return _this;
    }
    return AH_H_feedbackView;
}(PopupBaseView));
__reflect(AH_H_feedbackView.prototype, "AH_H_feedbackView");
