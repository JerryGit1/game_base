var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * 弹出提示框
 */
var AH_H_tipView = (function (_super) {
    __extends(AH_H_tipView, _super);
    function AH_H_tipView(string, width) {
        var _this = _super.call(this, false, false) || this;
        var tipBg = new egret.Bitmap(RES.getRes("b_p_tipBg"));
        _this.addChild(tipBg);
        _this.name = "H_tipView";
        var messageTxt = new egret.TextField();
        messageTxt.size = 12;
        messageTxt.textColor = 0xCB6F01;
        messageTxt.multiline = true;
        messageTxt.wordWrap = true;
        messageTxt.textAlign = "left";
        messageTxt.verticalAlign = "middle";
        messageTxt.lineSpacing = 2;
        messageTxt.x = 10;
        messageTxt.y = 10;
        if (string.indexOf("点杠") != -1) {
            messageTxt.textFlow = (new egret.HtmlTextParser()).parse(string);
        }
        else {
            if (width)
                messageTxt.width = width;
            messageTxt.text = string;
        }
        _this.addChild(messageTxt);
        tipBg.scale9Grid = new egret.Rectangle(34, 11, 210, 66);
        tipBg.width = messageTxt.width + 20;
        tipBg.height = messageTxt.height + 20;
        _this.anchorOffsetX = tipBg.width / 2;
        _this.anchorOffsetY = tipBg.height / 2;
        return _this;
    }
    return AH_H_tipView;
}(PopupBaseView));
__reflect(AH_H_tipView.prototype, "AH_H_tipView");
// import Timer = egret.Timer;
// /**
//  * Created by 韩 on 2017/8/4.
//  * 弹出提示框
//  */
// class H_tipView extends PopupBaseView{
//     constructor(userName,x,y){
//         super();
//         var tipBg = new egret.Bitmap(RES.getRes("g_tip"));
//         this.name="H_tipView";
//         this.anchorOffsetX = tipBg.width/2;
//         this.anchorOffsetY = tipBg.height;
//         var dianT = new egret.TextField();
//         var name = new egret.TextField();
//         name.size = dianT.size = 18;
//         name.multiline = dianT.multiline = true;
//         name.textAlign = dianT.textAlign = "left";
//         name.verticalAlign = dianT.verticalAlign = "middle";
//         name.textColor = 0xCB6F01;
//         dianT.textColor = 0xffffff;
//         dianT.text = "  点杠";
//         name.text = userName;
//         tipBg.scale9Grid = new egret.Rectangle(5,5,95,25);
//         tipBg.width = name.width+60;
//         tipBg.x = x;
//         tipBg.y = y;
//         name.y = dianT.y = tipBg.y + 9;
//         name.x = tipBg.x + 10;
//         dianT.x = name.x +name.width;
//         this.addChild(tipBg);
//         this.addChild(name);
//         this.addChild(dianT);
//     }
// }
