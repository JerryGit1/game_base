var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * 创建者 伟大的周鹏斌大王 on 2017/6/17.
 */
var AH_Game_headCirceView = (function (_super) {
    __extends(AH_Game_headCirceView, _super);
    function AH_Game_headCirceView() {
        var _this = _super.call(this) || this;
        _this.headSp = new egret.Sprite();
        _this.addChild(_this.headSp);
        //有头像的情况
        //头像的基准大小
        var headImgBase = _this.CCenterBit("h_headerBg");
        /*头像*/
        _this.headImg = new egret.Bitmap();
        _this.headSp.addChild(_this.headImg);
        _this.headImg.width = headImgBase.width;
        _this.headImg.height = headImgBase.height;
        _this.headImg.anchorOffsetX = _this.headImg.width / 2;
        _this.headImg.anchorOffsetY = _this.headImg.width / 2;
        //玩家头像遮罩
        var maskSp1 = new egret.Shape();
        maskSp1.graphics.beginFill(0x00ff00);
        // maskSp1.graphics.drawCircle(0,0,headImgBase.width/2);
        maskSp1.graphics.drawRoundRect(-headImgBase.width / 2, -headImgBase.height / 2, headImgBase.width, headImgBase.height, 16);
        maskSp1.graphics.endFill();
        _this.headSp.addChild(maskSp1);
        _this.headImg.mask = maskSp1;
        return _this;
    }
    /*更新头像信息  headImgUrl为空隐藏头像*/
    AH_Game_headCirceView.prototype.setHead = function (headImgUrl) {
        if (headImgUrl === void 0) { headImgUrl = null; }
        if (headImgUrl) {
            LoadLayer.getInstance().loadExternalBit(this.headImg, headImgUrl);
        }
    };
    return AH_Game_headCirceView;
}(BaseView));
__reflect(AH_Game_headCirceView.prototype, "AH_Game_headCirceView");
