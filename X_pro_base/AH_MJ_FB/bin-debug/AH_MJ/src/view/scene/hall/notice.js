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
 * 用户界面系统公告
 */
var AH_H_noticeView = (function (_super) {
    __extends(AH_H_noticeView, _super);
    function AH_H_noticeView() {
        var _this = _super.call(this) || this;
        var bg = new egret.Bitmap(RES.getRes("h_notice"));
        _this.W = bg.width;
        _this.addChild(bg);
        var mask = new egret.Shape();
        mask.x = 68;
        mask.graphics.beginFill(0x000000);
        mask.graphics.drawRect(0, 0, _this.W * .87, bg.height);
        mask.graphics.endFill();
        _this.addChild(mask);
        _this.noticeTxt = new egret.TextField();
        _this.noticeTxt.size = 24;
        _this.noticeTxt.stroke = 0.3;
        _this.noticeTxt.strokeColor = 0x000000;
        _this.noticeTxt.fontFamily = "微软雅黑";
        _this.noticeTxt.y = 16;
        _this.noticeTxt.textAlign = "center";
        _this.addChild(_this.noticeTxt);
        // 添加遮罩层
        _this.noticeTxt.mask = mask;
        return _this;
    }
    // 让公告动起来
    AH_H_noticeView.prototype.setTextPos = function (str) {
        this.noticeTxt.text = str;
        this.noticeTxt.x = this.W;
        egret.Tween.removeTweens(this.noticeTxt);
        egret.Tween.get(this.noticeTxt, { loop: true }).to({ x: -this.noticeTxt.textWidth }, 15000 + (str.length * 100));
    };
    //设置多少次数后停止公告
    AH_H_noticeView.prototype.setTextByTimes = function (str, num) {
        this.noticeTxt.text = str;
        this.noticeTxt.x = this.W;
        var times = 0;
        egret.Tween.removeTweens(this.noticeTxt);
        egret.Tween.get(this.noticeTxt, { loop: true }).to({ x: -this.noticeTxt.textWidth }, 15000 + (str.length * 100)).call(function () {
            times++;
            if (times >= num) {
                egret.Tween.removeTweens(this.noticeTxt);
                this.visible = false;
            }
        }, this);
    };
    return AH_H_noticeView;
}(BaseView));
__reflect(AH_H_noticeView.prototype, "AH_H_noticeView");
