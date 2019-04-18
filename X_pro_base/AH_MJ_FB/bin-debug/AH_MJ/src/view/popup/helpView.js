var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by TYQ on 2017/7/12.
 */
var AH_HelpView = (function (_super) {
    __extends(AH_HelpView, _super);
    function AH_HelpView() {
        var _this = _super.call(this) || this;
        var bg = _this.addMsgBg(); //"b_p_hitBg"
        // var x = bg.width - 27;
        // var y = 7;
        var x = bg.width - 7;
        var y = 5;
        _this.addCloseBtn(x, y);
        _this.addTitle("h_gameMsg", _this.centerSp.width / 2, 35);
        _this.showHelpInfo("help_txt", _this.centerSp, bg.width, bg.height);
        _this.openAni();
        return _this;
    }
    AH_HelpView.prototype.showHelpInfo = function (str, sp, width, height) {
        var shape1;
        //实例化可滑动的显示数据框
        var messageSprite = new egret.Sprite();
        var text = RES.getRes(str);
        var messageTxt = new egret.TextField();
        messageSprite.addChild(messageTxt);
        messageTxt.size = 20;
        messageTxt.textColor = 0xFAFAFA;
        // messageTxt.stroke=2;
        // messageTxt.strokeColor=0xCB6F01;
        messageTxt.multiline = true;
        messageTxt.wordWrap = true;
        messageTxt.textAlign = "left";
        messageTxt.verticalAlign = "middle";
        messageTxt.width = sp.width * .7;
        messageTxt.lineSpacing = 15;
        messageTxt.text = text;
        sp.addChild(messageSprite);
        //透明遮罩，为了整体能够滑动
        shape1 = new egret.Shape();
        shape1.graphics.beginFill(0x1102cc, 0);
        shape1.graphics.drawRect(0, 0, messageTxt.width, (messageTxt.height + 3));
        shape1.graphics.endFill();
        messageSprite.addChild(shape1);
        var myscrollView = new egret.ScrollView();
        myscrollView.setContent(messageSprite);
        myscrollView.bounces = false;
        myscrollView.horizontalScrollPolicy = "off";
        sp.addChild(myscrollView);
        myscrollView.x = 60;
        myscrollView.y = 65;
        myscrollView.width = width * .9;
        myscrollView.height = height * .75;
    };
    return AH_HelpView;
}(PopupBaseView));
__reflect(AH_HelpView.prototype, "AH_HelpView");
