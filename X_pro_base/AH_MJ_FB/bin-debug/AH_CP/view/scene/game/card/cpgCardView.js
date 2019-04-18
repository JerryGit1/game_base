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
 * 吃碰杠 牌
 */
var Game_cpgCardView = (function (_super) {
    __extends(Game_cpgCardView, _super);
    function Game_cpgCardView() {
        return _super.call(this) || this;
    }
    return Game_cpgCardView;
}(AH_Game_cpgCardView));
__reflect(Game_cpgCardView.prototype, "Game_cpgCardView");
