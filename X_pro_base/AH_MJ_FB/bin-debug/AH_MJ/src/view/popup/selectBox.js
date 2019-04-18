var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by 韩 on 2017/7/13.
 * 单选样式
 * selected选中的图标√
 * x,y,w,h 坐标x,y宽高
 */
var AH_H_selectBtn = (function (_super) {
    __extends(AH_H_selectBtn, _super);
    function AH_H_selectBtn(make, selected, x, y, w, h, lable) {
        var _this = _super.call(this) || this;
        _this.selected = new egret.Bitmap();
        _this.selected.texture = RES.getRes(selected);
        _this.x = x;
        _this.y = y + 6;
        _this.width = w;
        _this.height = h;
        _this.lableName = new egret.Bitmap(RES.getRes(lable));
        _this.lableName.x = 40;
        _this.lableName.y = 6;
        _this.addChild(_this.lableName);
        _this.graphics.beginFill(0xffffff, 0);
        _this.graphics.drawRect(0, 0, w, h);
        _this.graphics.endFill();
        _this.touchEnabled = true;
        _this.make = make;
        _this.addEventListener("touchTap", _this.touchTap, _this);
        _this.addChild(_this.selected);
        return _this;
    }
    /*点击*/
    AH_H_selectBtn.prototype.touchTap = function (e) {
        this.dispatchEvent(new egret.Event("selected"));
    };
    /*改变状态*/
    AH_H_selectBtn.prototype.setTexture = function (str) {
        this.selected.texture = RES.getRes(str);
    };
    return AH_H_selectBtn;
}(BaseView));
__reflect(AH_H_selectBtn.prototype, "AH_H_selectBtn");
