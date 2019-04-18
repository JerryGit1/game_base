var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by 伟大的周鹏斌大王 on 2017/7/17.
 */
var AH_Game_cardView = (function (_super) {
    __extends(AH_Game_cardView, _super);
    function AH_Game_cardView(bgType, w) {
        var _this = _super.call(this) || this;
        _this.cardScale = 1; /**/
        _this.cardPoint = new egret.Point();
        _this.bgType = "";
        _this.soundName = "";
        _this.bgType = bgType;
        _this.addBack(bgType, w);
        _this.card = new egret.Bitmap();
        _this.addChild(_this.card);
        return _this;
        // this.addHighLight();
    }
    /*设置牌显示*/
    AH_Game_cardView.prototype.setNewCard = function (type, num) {
        if (type === void 0) { type = null; }
        if (num === void 0) { num = null; }
        if (type) {
            this.visible = true;
            if (this.type != type || this.num != num) {
                this.card.texture = RES.getRes("mj_z_" + type + "_" + num);
                this.card.anchorOffsetX = this.card.width / 2;
                this.card.anchorOffsetY = this.card.height / 2;
                this.type = type;
                this.num = num;
                this.card.scaleX = this.card.scaleY = this.cardScale;
                this.card.x = this.cardPoint.x;
                this.card.y = this.cardPoint.y;
                if (this.bgType == "cpMG_1") {
                    this.card.scaleX = this.cardScale * 1.2;
                }
                else if (this.bgType == "cpMG_4") {
                    /*this.card.scaleX=-Math.abs(this.cardScale*.9);
                    this.card.scaleY=-Math.abs(this.cardScale);*/
                    var myMatrix = new egret.Matrix();
                    var radians = Math.PI * 12 / 180;
                    myMatrix.b = Math.tan(radians);
                    myMatrix.scale(-Math.abs(this.cardScale * .85), -Math.abs(this.cardScale));
                    myMatrix.translate(this.cardPoint.x, this.cardPoint.y);
                    //myMatrix.b=Math.tan(radians);
                    this.card.matrix = myMatrix;
                }
                else if (this.bgType == "cpMG_3") {
                    this.card.scaleX = -this.cardScale * 1.2;
                    this.card.scaleY = -Math.abs(this.card.scaleY);
                }
                else if (this.bgType == "cpMG_2") {
                    var myMatrix = new egret.Matrix();
                    var radians = Math.PI * -12 / 180;
                    myMatrix.b = Math.tan(radians);
                    myMatrix.scale(this.cardScale * .85, this.cardScale);
                    myMatrix.translate(this.cardPoint.x, this.cardPoint.y);
                    //myMatrix.b=Math.tan(radians);
                    this.card.matrix = myMatrix;
                }
                // 韩月辉
                this.soundName = type + "_" + num;
            }
        }
        else {
            this.visible = false;
        }
    };
    /*获取背景*/
    AH_Game_cardView.prototype.addBack = function (type, w) {
        this.bg = new egret.Bitmap();
        this.addChild(this.bg);
        this.grayBg = new egret.Bitmap();
        this.grayBg.visible = false;
        this.addChild(this.grayBg);
        this.cardScale = 1;
        switch (type) {
            //站牌
            case 1:
                this.bg.texture = RES.getRes("mj_stop_1");
                this.cardPoint.x = -3;
                this.cardPoint.y = 1;
                break;
            case 2:
                this.bg.texture = RES.getRes("mj_stop_2");
                break;
            case 3:
                this.bg.texture = RES.getRes("mj_stop_3");
                break;
            case 4:
                this.bg.texture = RES.getRes("mj_stop_2");
                break;
            //打出去的牌和吃碰杠的明牌
            case "cpMG_1":
                this.bg.texture = RES.getRes("mj_play_1");
                this.grayBg.texture = RES.getRes("mj_play_1_gray");
                this.cardScale = .52;
                this.cardPoint.x = -2;
                this.cardPoint.y = -10;
                break;
            case "cpMG_2":
                this.bg.texture = RES.getRes("mj_play_2");
                this.grayBg.texture = RES.getRes("mj_play_2_gray");
                this.cardScale = .8;
                this.cardPoint.x = 13;
                this.cardPoint.y = 6;
                break;
            case "cpMG_3":
                this.bg.texture = RES.getRes("mj_play_1");
                this.grayBg.texture = RES.getRes("mj_play_1_gray");
                this.cardScale = .52;
                this.cardPoint.x = -2;
                this.cardPoint.y = -12;
                break;
            case "cpMG_4":
                this.bg.texture = RES.getRes("mj_play_2");
                this.grayBg.texture = RES.getRes("mj_play_2_gray");
                this.cardScale = .8;
                this.cardPoint.x = 13;
                this.cardPoint.y = -4;
                break;
            //暗杠
            case "ag_1":
                this.bg.texture = RES.getRes("mj_g_1");
                this.bg.scaleX = this.bg.scaleY = .87;
                break;
            case "ag_2":
                this.bg.texture = RES.getRes("mj_g_2");
                this.bg.scaleX = .8;
                this.bg.scaleY = 1;
                break;
            case "ag_3":
                this.bg.texture = RES.getRes("mj_g_1");
                this.bg.scaleX = this.bg.scaleY = .87;
                break;
            case "ag_4":
                this.bg.texture = RES.getRes("mj_g_2");
                this.bg.scaleX = .8;
                this.bg.scaleY = -1;
                break;
        }
        this.bg.anchorOffsetX = this.bg.width / 2;
        this.bg.anchorOffsetY = this.bg.height / 2;
        this.grayBg.anchorOffsetX = this.grayBg.width / 2;
        this.grayBg.anchorOffsetY = this.grayBg.height / 2;
        /*缩放*/
        if (!w)
            w = 1;
        var xishu = w / this.bg.width;
        this.scaleX = this.scaleY = xishu;
        if (type == "cpMG_2") {
            this.bg.scaleY = -1;
            this.grayBg.scaleY = -1;
        }
        this.w = Math.floor(this.bg.width * xishu);
        this.h = Math.floor(this.bg.height * xishu);
    };
    /*设置旋转*/
    AH_Game_cardView.prototype.setPlayCardRotation = function (position) {
        if (position == 2 || position == 4) {
            this.rotation = -90;
        }
    };
    /*与当前出牌一致时，桌牌、吃碰杠牌高亮提示*/
    AH_Game_cardView.prototype.addHighLight = function () {
        // var maskShape=new egret.Shape();
        // maskShape.graphics.beginFill(0xffec8b,0.6);
        // maskShape.graphics.drawRect(-this.w/2,-this.h/2,this.w,this.h);
        // maskShape.graphics.endFill();
        // maskShape.visible = false;
        // this.maskShape = maskShape;
        // this.maskShape.x = 2;
        // this.maskShape.y = -4;
        // PopupLayer.getInstance().getPoint(maskShape);
        // this.addChild(maskShape);
    };
    AH_Game_cardView.prototype.setHighLight = function (_is) {
        this.grayBg.visible = _is;
    };
    return AH_Game_cardView;
}(BaseView));
__reflect(AH_Game_cardView.prototype, "AH_Game_cardView");
