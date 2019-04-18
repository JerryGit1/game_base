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
var AH_Game_headView = (function (_super) {
    __extends(AH_Game_headView, _super);
    function AH_Game_headView() {
        var _this = _super.call(this) || this;
        _this.W = 0;
        /*默认头像*/
        _this.headImgBg = _this.CCenterBit("h_headerBg");
        _this.addChild(_this.headImgBg);
        _this.addHead();
        return _this;
    }
    /*显示头像*/
    AH_Game_headView.prototype.addHead = function () {
        this.headSp = new egret.Sprite();
        this.addChild(this.headSp);
        /*边框*/
        var headImgHL = this.CCenterBit("headImgBar");
        headImgHL.width = this.headImgBg.width;
        headImgHL.height = this.headImgBg.height;
        headImgHL.anchorOffsetX = headImgHL.width / 2;
        headImgHL.anchorOffsetY = headImgHL.width / 2;
        this.headImgHL = headImgHL;
        /*头像*/
        this.headImg = new egret.Bitmap();
        this.headSp.addChild(this.headImg);
        this.headImg.width = headImgHL.width - 10;
        this.headImg.height = headImgHL.width - 10;
        this.headImg.anchorOffsetX = this.headImg.width / 2;
        this.headImg.anchorOffsetY = this.headImg.width / 2;
        //玩家头像遮罩
        var maskSp1 = new egret.Shape();
        maskSp1.graphics.beginFill(0x00ff00, 4);
        maskSp1.graphics.drawRoundRect(-this.headImg.width / 2, -this.headImg.height / 2, this.headImg.width, this.headImg.height, 20, 20);
        maskSp1.graphics.endFill();
        this.headSp.addChild(maskSp1);
        this.headImg.mask = maskSp1;
        /*出牌人动画*/
        var data = RES.getRes("headAni_json");
        var img = RES.getRes("headAni_png");
        var mcFactory1 = new egret.MovieClipDataFactory(data, img);
        this.mcAni = new egret.MovieClip(mcFactory1.generateMovieClipData("headAni"));
        this.mcAni.visible = false;
        this.mcAni.frameRate = 14;
        this.mcAni.x = -this.mcAni.width / 2 - 3;
        this.mcAni.y = -this.mcAni.height / 2 - 8;
        this.addChild(this.mcAni);
        //头像蒙灰
        var headImgCover = this.CCenterBit("g_headCover");
        headImgCover.width = this.headImgBg.width;
        headImgCover.height = this.headImgBg.height;
        headImgCover.anchorOffsetX = headImgCover.width / 2;
        headImgCover.anchorOffsetY = headImgCover.width / 2;
        this.HeadImgCover = headImgCover;
        this.HeadImgCover.alpha = .8;
        this.HeadImgCover.visible = false;
        this.headSp.addChild(this.HeadImgCover);
        this.headSp.addChild(this.headImgHL);
    };
    /*更新头像信息  headImgUrl为空隐藏头像*/
    AH_Game_headView.prototype.setHead = function (headImgUrl) {
        if (headImgUrl === void 0) { headImgUrl = null; }
        this.headSp.visible = false;
        if (headImgUrl) {
            this.headImgBg.visible = false;
            this.headSp.visible = true;
            LoadLayer.getInstance().loadExternalBit(this.headImg, headImgUrl);
        }
        else {
            this.headImgBg.visible = true;
            this.setHighLight(false);
        }
    };
    /*离线状态切换*/
    AH_Game_headView.prototype.setOffLine = function (_is) {
        if (_is === void 0) { _is = false; }
        if (!this.headSp)
            this.addHead();
        this.HeadImgCover.visible = _is;
    };
    /*出牌状态切换*/
    AH_Game_headView.prototype.setChuStatus = function (_is) {
        if (_is === void 0) { _is = false; }
        if (_is) {
            this.mcAni.visible = true;
            this.mcAni.play(-1);
        }
        else {
            this.mcAni.stop();
            this.mcAni.visible = false;
        }
    };
    AH_Game_headView.prototype.setHighLight = function (_is) {
        this.headImgHL.visible = _is;
    };
    return AH_Game_headView;
}(BaseView));
__reflect(AH_Game_headView.prototype, "AH_Game_headView");
